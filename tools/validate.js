#!/usr/bin/env node
/* ============================================================
   validate.js — 数据校验（AI 生成数据后必须跑这个）
   ------------------------------------------------------------
   用法：  node tools/validate.js
   退出码：0 = 全部通过；1 = 有错误（必须修）

   检查项：
     1. JS 语法（各文件能否被解析）
     2. 剧集数据结构（id / 季 / 集 / 行 是否合法）
     3. 每句都有英文和中文
     4. picks 下标是否越界、是否重复
     5. 每个词形都能在 words.js 里查到中文（100% 覆盖）
     6. 英文里是否混入中文、中文里是否混入英文
     7. 重复句子 / 空句子
     8. 短语库格式
   ============================================================ */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const dataDir = path.join(root, "assets/js/data");

let errors = [];
let warns = [];
const err = (m) => errors.push(m);
const warn = (m) => warns.push(m);

/* ---------- 载入 ---------- */
function loadFile(file, exportName) {
  const src = fs.readFileSync(path.join(dataDir, file), "utf8");
  const ctx = { console };
  vm.createContext(ctx);
  // 把顶层 const/let 变成可导出
  const patched = src
    .replace(/^\s*(const|let)\s+([A-Za-z_$][\w$]*)\s*=/gm, "$2 =")
    .replace(/^\s*function\s+/gm, "function ");
  const result = vm.runInContext(
    patched + "\n;" + (exportName ? exportName + ";" : ""),
    ctx,
    { filename: file }
  );
  return result;
}

/* ---------- 1. 词库 ---------- */
let WORDS = {};
try {
  WORDS = loadFile("words.js", "DICT_WORDS");
  if (!WORDS || typeof WORDS !== "object") throw new Error("DICT_WORDS 不是对象");
  console.log("✓ words.js 载入：" + Object.keys(WORDS).length + " 条");
} catch (e) {
  err("words.js 载入失败：" + e.message);
}

/* ---------- 2. 短语库 ---------- */
let PHRASES = {};
try {
  PHRASES = loadFile("phrases.js", "PHRASES");
  if (!PHRASES || typeof PHRASES !== "object") throw new Error("PHRASES 不是对象");
  console.log("✓ phrases.js 载入：" + Object.keys(PHRASES).length + " 条");
  Object.keys(PHRASES).forEach((k) => {
    const p = PHRASES[k];
    if (k !== k.toLowerCase()) err("短语 key 必须小写：" + k);
    if (!p.zh) err("短语缺少 zh：" + k);
    if (!Array.isArray(p.ex)) err("短语缺少 ex 数组：" + k);
    else if (p.ex.length < 2) warn("短语例句少于 2 条：" + k + "（建议 2–4 条）");
    (p.ex || []).forEach((pair, i) => {
      if (!Array.isArray(pair) || pair.length < 2 || !pair[0] || !pair[1])
        err("短语例句格式应为 [英文, 中文]：" + k + " 第 " + (i + 1) + " 条");
    });
  });
} catch (e) {
  err("phrases.js 载入失败：" + e.message);
}

/* ---------- 3. 剧集 ----------
   剧集数据按剧放在子目录里（assets/js/data/<show>/e01.js …），
   每部剧的每个文件都调用 registerEpisode(META, 季, 集)。 */
const showDirs = fs
  .readdirSync(dataDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

if (!showDirs.length) err("assets/js/data/ 下没有剧集数据子目录（如 pb-s2/）");

const SHOWS = [];
showDirs.forEach((dir) => {
  const acc = [];
  const ctx = {
    console,
    registerEpisode(meta, seasonNo, ep) {
      if (!meta || !meta.id) return err(dir + "：registerEpisode 的 meta.id 缺失");
      let show = acc.find((s) => s.id === meta.id);
      if (!show) {
        show = Object.assign({}, meta, { seasons: [] });
        acc.push(show);
      }
      let season = show.seasons.find((s) => s.no === seasonNo);
      if (!season) {
        season = { no: seasonNo, episodes: [] };
        show.seasons.push(season);
      }
      season.episodes.push(ep);
    },
  };
  vm.createContext(ctx);
  const files = fs
    .readdirSync(path.join(dataDir, dir))
    .filter((f) => f.endsWith(".js"))
    .sort();
  files.forEach((f) => {
    try {
      vm.runInContext(fs.readFileSync(path.join(dataDir, dir, f), "utf8"), ctx, {
        filename: dir + "/" + f,
      });
    } catch (e) {
      err(dir + "/" + f + " 执行失败：" + e.message);
    }
  });
  acc.forEach((s) => SHOWS.push(s));
  console.log("✓ " + dir + "/ 载入：" + files.length + " 集 · " + acc.length + " 部剧");
});

/* 规范化（与 shows.js 保持一致） */
function normalizeLine(l) {
  if (Array.isArray(l)) {
    const out = { en: l[0] || "", zh: l[1] || "", note: l[2] || "", w: {} };
    if (l[3] && l[3].w) out.w = l[3].w;
    return out;
  }
  return { en: l.en || "", zh: l.zh || "", note: l.note || "", w: l.w || {}, tag: l.tag || "" };
}

const forms = new Set();
const wordKeys = new Set(Object.keys(WORDS || {}).map((k) => k.toLowerCase()));
let stat = { shows: 0, seasons: 0, eps: 0, lines: 0, picks: 0, notes: 0, wmaps: 0 };
const seenEn = new Map();

SHOWS.forEach((show) => {
  stat.shows++;
  if (!show.title) err("剧集缺少 title：" + show.id);
  if (!show.titleZh) warn("剧集缺少 titleZh：" + show.id);
  if (!Array.isArray(show.seasons) || !show.seasons.length) err("剧集没有季：" + show.id);

  (show.seasons || []).forEach((se) => {
    stat.seasons++;
    if (typeof se.no !== "number") err(show.id + " 季号必须是数字");
    if (!Array.isArray(se.episodes) || !se.episodes.length) err(show.id + " S" + se.no + " 没有集");

    (se.episodes || []).forEach((ep) => {
      stat.eps++;
      const tag = show.id + " S" + se.no + "E" + ep.no;
      if (typeof ep.no !== "number") err(tag + "：ep.no 必须是数字");
      if (!ep.title) warn(tag + "：缺少集标题 title");
      if (!Array.isArray(ep.lines) || !ep.lines.length) {
        err(tag + "：lines 为空");
        return;
      }

      const lines = ep.lines.map(normalizeLine);
      ep.lines = lines;

      lines.forEach((l, i) => {
        const at = tag + " 第 " + (i + 1) + " 句";
        stat.lines++;

        if (!l.en || !l.en.trim()) err(at + "：英文为空");
        if (!l.zh || !l.zh.trim()) err(at + "：中文为空");

        // 中文里混入英文单词（专名、缩写、剧内术语允许，只对普通英文词告警）
        const ZH_OK = new Set([
          "fin", "del", "camino", "panama", "chicago", "illinois", "utah", "sona",
          "otis", "manhunt", "t-bag", "bag", "ups", "autostar", "gps", "fbi", "nsa",
          "dea", "cia", "co", "doc", "bortac", "tweener", "haywire", "c-note",
        ]);
        const enInZh = (l.zh.match(/[A-Za-z][A-Za-z'-]{2,}/g) || []).filter(
          (x) => !ZH_OK.has(x.toLowerCase())
        );
        if (enInZh.length) warn(at + "：中文里混入英文 " + enInZh.join(","));

        // 英文里混入中文
        if (/[\u4e00-\u9fa5]/.test(l.en)) err(at + "：英文里混入中文");

        // 收集词形
        const re = /[A-Za-z]+(?:['’][A-Za-z]+)*/g;
        let m;
        while ((m = re.exec(l.en))) forms.add(m[0].toLowerCase().replace(/’/g, "'"));

        if (l.note) stat.notes++;
        if (l.w && Object.keys(l.w).length) {
          stat.wmaps++;
          Object.keys(l.w).forEach((k) => {
            if (!l.w[k]) err(at + "：逐词精译「" + k + "」的释义为空");
          });
        }

        // 重复句（只对 4 词以上的实质句子告警，How? / Barely. 这类短句重复是正常的）
        const key = l.en.toLowerCase().trim();
        if (key.split(/\s+/).length > 3) {
          if (seenEn.has(key)) warn(at + "：与本剧 " + seenEn.get(key) + " 重复");
          else seenEn.set(key, at);
        }
      });

      // picks
      if (!Array.isArray(ep.picks)) ep.picks = [];
      const seenPick = new Set();
      ep.picks.forEach((p) => {
        if (typeof p !== "number" || p < 0 || p >= lines.length)
          err(tag + "：picks 下标越界 " + p + "（共 " + lines.length + " 句）");
        if (seenPick.has(p)) err(tag + "：picks 下标重复 " + p);
        seenPick.add(p);
      });
      if (ep.picks.length === 0) warn(tag + "：没有精选句（精选精讲模式会是空的）");
      if (ep.picks.length > 50) warn(tag + "：精选句过多（" + ep.picks.length + " 条），建议 20–35 条");
      if (ep.picks.length < 15) warn(tag + "：精选句偏少（" + ep.picks.length + " 条），建议 20–35 条");
      stat.picks += ep.picks.length;
    });
  });
});

/* ---------- 4. 词形覆盖 ---------- */
const missing = [...forms].filter((f) => !wordKeys.has(f)).sort();
if (missing.length) {
  err("words.js 缺少 " + missing.length + " 个词形（每个单词都必须有中文）：\n    " + missing.join(" "));
}

/* ---------- 汇总 ---------- */
console.log("\n──────── 统计 ────────");
console.log(
  "剧集 " + stat.shows + " 部 · 季 " + stat.seasons + " · 集 " + stat.eps +
  " · 台词 " + stat.lines + " 句"
);
console.log(
  "精选句 " + stat.picks + " · 有讲解 " + stat.notes + " · 有逐词精译 " + stat.wmaps
);
console.log("不同词形 " + forms.size + " · 词库 " + wordKeys.size + " 条 · 覆盖率 " +
  (forms.size ? Math.round(((forms.size - missing.length) / forms.size) * 100) : 100) + "%");

if (warns.length) {
  console.log("\n──────── 警告 (" + warns.length + ") ────────");
  warns.slice(0, 40).forEach((w) => console.log("  ! " + w));
  if (warns.length > 40) console.log("  ... 还有 " + (warns.length - 40) + " 条");
}

if (errors.length) {
  console.log("\n──────── 错误 (" + errors.length + ") ────────");
  errors.forEach((e) => console.log("  ✗ " + e));
  console.log("\n校验失败：请修复以上错误。");
  process.exit(1);
}

console.log("\n✓ 校验通过");

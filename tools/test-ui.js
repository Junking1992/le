const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const htmlRaw = fs.readFileSync(path.join(root, "index.html"), "utf8");
const scripts = [];
const html = htmlRaw.replace(/<script src="([^"]+)"><\/script>/g, (m, src) => {
  scripts.push(src);
  return "";
});
const { JSDOM } = require("jsdom");
const dom = new JSDOM(html, {
  url: "http://127.0.0.1:8933/",
  runScripts: "dangerously",
  beforeParse(w) {
    w.scrollTo = () => {};
    w.speechSynthesis = undefined;
    w.Element.prototype.scrollIntoView = () => {};
  },
});
const w = dom.window;
const errs = [];
const check = (c, m) => {
  if (!c) { errs.push("x " + m); console.log("x " + m); }
  else console.log("ok " + m);
};
w.addEventListener("error", (e) => console.log("PAGE ERROR:", e.message));

scripts.forEach((src) => {
  const s = w.document.createElement("script");
  s.textContent = fs.readFileSync(path.join(root, src), "utf8");
  w.document.body.appendChild(s);
});

const doc = w.document;
const go = (h) => { w.location.hash = h; w.dispatchEvent(new w.HashChangeEvent("hashchange")); };
const click = (el) => el.dispatchEvent(new w.MouseEvent("click", { bubbles: true, cancelable: true }));

try {
  /* 短语库页 */
  go("#/phrases");
  const cards = doc.querySelectorAll(".phrase-card, .pc, .phrase-item");
  check(cards.length > 100, "短语库渲染 " + cards.length + " 条");

  /* 生词本页（空态） */
  go("#/vocab");
  check(doc.body.textContent.length > 100, "生词本页可渲染");

  /* 使用说明页 */
  go("#/help");
  check(/说明|使用|快捷键/.test(doc.body.textContent), "使用说明页可渲染");

  /* 搜索 */
  go("#/search?q=" + encodeURIComponent("Michael"));
  const hits = doc.querySelectorAll(".result");
  check(hits.length > 0, "搜索结果 " + hits.length + " 条");

  /* 逐集抽查：每集首句都有中文，且能点开 */
  let okAll = true;
  for (let e = 1; e <= 22; e++) {
    go("#/watch/pb/2/" + e);
    const first = doc.querySelector(".line");
    if (!first) { okAll = false; console.log("  E" + e + " 无行"); continue; }
    const zh = first.querySelector(".zh");
    if (!zh) { okAll = false; console.log("  E" + e + " 无中文节点"); continue; }
    if (zh.hidden !== true) { okAll = false; console.log("  E" + e + " 中文未默认隐藏"); continue; }
    click(first.querySelector(".zh-btn"));
    if (zh.hidden !== false) { okAll = false; console.log("  E" + e + " 点不开中文"); continue; }
    if (!zh.textContent.trim() || zh.textContent.includes("待翻译")) {
      okAll = false; console.log("  E" + e + " 中文为空: " + zh.textContent.slice(0, 20));
    }
  }
  check(okAll, "22 集首句中文都可点开且有内容");

  /* 每集精选模式都有内容 */
  let pickOk = true;
  for (let e = 1; e <= 22; e++) {
    go("#/watch/pb/2/" + e);
    const tab = doc.querySelector(".mode-tab[data-mode='pick']");
    if (!tab) { pickOk = false; continue; }
    click(tab);
    const n = doc.querySelectorAll(".line").length;
    if (n < 15) { pickOk = false; console.log("  E" + e + " 精选只有 " + n + " 句"); }
  }
  check(pickOk, "22 集精选模式都有 15+ 句");

  /* 越狱 S3（Sona 篇）：逐集首句中文 + 精选 + 点词 */
  let s3ok = true;
  for (let e = 1; e <= 2; e++) {
    go("#/watch/pb/3/" + e);
    const first = doc.querySelector(".line");
    if (!first) { s3ok = false; console.log("  S3E" + e + " 无行"); continue; }
    const zh = first.querySelector(".zh");
    click(first.querySelector(".zh-btn"));
    if (!zh || zh.hidden !== false) { s3ok = false; console.log("  S3E" + e + " 点不开中文"); continue; }
    if (!zh.textContent.trim() || zh.textContent.includes("待翻译")) {
      s3ok = false; console.log("  S3E" + e + " 中文为空: " + zh.textContent.slice(0, 20));
    }
    const tab = doc.querySelector(".mode-tab[data-mode='pick']");
    if (!tab) { s3ok = false; continue; }
    click(tab);
    const np = doc.querySelectorAll(".line").length;
    if (np < 15) { s3ok = false; console.log("  S3E" + e + " 精选只有 " + np + " 句"); }
  }
  check(s3ok, "S3 两集首句中文可点开、精选 15+ 句");

  go("#/watch/pb/3/2");
  let miss3 = 0, tried3 = 0;
  for (const el of [...doc.querySelectorAll(".line .w")].slice(0, 300)) {
    tried3++;
    click(el);
    const pop = doc.getElementById("pop");
    if (pop.hidden || pop.textContent.includes("词典未收录")) miss3++;
  }
  check(miss3 === 0, "S3E02 抽查 " + tried3 + " 个词，未收录 " + miss3);

  /* 点词：随机取若干行里的词，确认都能查到 */
  go("#/watch/pb/2/14");
  let miss = 0, tried = 0;
  const words = [...doc.querySelectorAll(".line .w")].slice(0, 400);
  for (const el of words) {
    tried++;
    click(el);
    const pop = doc.getElementById("pop");
    if (pop.hidden || pop.textContent.includes("词典未收录")) miss++;
  }
  check(miss === 0, "抽查 " + tried + " 个词，未收录 " + miss);

  console.log("\n" + (errs.length ? errs.join("\n") : "ALL PASS"));
} catch (e) {
  console.log("TEST ERROR:", e.message, "\n", e.stack);
}

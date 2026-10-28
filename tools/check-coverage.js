const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const ctx = { console };
vm.createContext(ctx);
const wordsSrc = fs.readFileSync(path.join(root, "assets/js/data/words.js"), "utf8");
const DW = vm.runInContext(
  wordsSrc.replace(/^\s*const\s+DICT_WORDS\s*=/m, "DICT_WORDS =") + "\n;DICT_WORDS;",
  ctx
);

const keys = new Set(Object.keys(DW).map((k) => k.toLowerCase()));

// 读取所有剧集数据（assets/js/data/<show>/eNN.js），收集出现的词形
const dataDir = path.join(root, "assets/js/data");
const dirs = fs
  .readdirSync(dataDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const forms = new Map(); // form -> count
let lines = 0;

dirs.forEach((dir) => {
  const files = fs
    .readdirSync(path.join(dataDir, dir))
    .filter((f) => f.endsWith(".js"))
    .sort();
  files.forEach((f) => {
    const src = fs.readFileSync(path.join(dataDir, dir, f), "utf8");
    const acc = [];
    const c = {
      console,
      registerEpisode(meta, seasonNo, ep) {
        acc.push(ep);
      },
    };
    vm.createContext(c);
    vm.runInContext(src, c, { filename: dir + "/" + f });
    acc.forEach((ep) => {
      (ep.lines || []).forEach((l) => {
        const en = Array.isArray(l) ? l[0] : l.en;
        if (!en) return;
        lines++;
        const re = /[A-Za-z]+(?:['’][A-Za-z]+)*/g;
        let t;
        while ((t = re.exec(en))) {
          const w = t[0].toLowerCase().replace(/’/g, "'");
          forms.set(w, (forms.get(w) || 0) + 1);
        }
      });
    });
  });
});

const missing = [...forms.keys()].filter((w) => !keys.has(w)).sort();

console.log("词库词条:", keys.size);
console.log("台词句数:", lines);
console.log("台词不同词形:", forms.size);
console.log("未覆盖:", missing.length);
if (missing.length) {
  console.log("\n缺失列表（按出现次数降序）：");
  console.log(
    missing
      .sort((a, b) => forms.get(b) - forms.get(a))
      .slice(0, 400)
      .map((w) => w + "(" + forms.get(w) + ")")
      .join(" ")
  );
  fs.writeFileSync(
    path.join(__dirname, "_missing_forms.txt"),
    missing.sort((a, b) => forms.get(b) - forms.get(a)).join("\n"),
    "utf8"
  );
  console.log("\n完整列表已写入 tools/_missing_forms.txt");
  process.exit(1);
} else {
  console.log("\n✓ 单词覆盖 100%");
}

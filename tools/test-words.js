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
scripts.forEach((src) => {
  const s = w.document.createElement("script");
  s.textContent = fs.readFileSync(path.join(root, src), "utf8");
  w.document.body.appendChild(s);
});

const D = w.eval("DICT_WORDS");
const P = w.eval("PHRASES");
let bad = 0;
const keys = ["aardvark", "zealous", "schlocked", "numbnuts", "patrol's", "cam's", "burrows", "mahone's"];
keys.forEach((k) => {
  const v = D[k];
  if (!v) { console.log("MISSING", k); bad++; }
  else console.log("ok", k, "=>", v);
});

// 每集都抽查 5 个词，确认全部能在词库里查到
let checked = 0;
w.SHOWS.forEach((s) => s.seasons.forEach((se) => se.episodes.forEach((e) => {
  e.lines.forEach((l, i) => {
    if (i % 97 !== 0) return;
    const re = /[A-Za-z]+(?:['’][A-Za-z]+)*/g;
    let m;
    while ((m = re.exec(l.en))) {
      const k = m[0].toLowerCase().replace(/’/g, "'");
      checked++;
      if (!D[k]) { console.log("MISSING", k, "in", s.id, e.no, i); bad++; }
    }
  });
})));
console.log("checked", checked, "words, missing", bad);
console.log("phrases", Object.keys(P).length);
process.exit(bad ? 1 : 0);

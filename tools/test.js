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
  check(doc.querySelectorAll(".show-card").length === 1, "首页剧集卡片");
  go("#/show/pb/2");
  check(doc.querySelectorAll(".ep-card").length === 22, "S2 有 22 集");

  go("#/watch/pb/2/1");
  const n = doc.querySelectorAll(".line").length;
  check(n === 576, "E01 渲染 576 句，实际 " + n);
  const pickEl = doc.querySelector(".mode-tab[data-mode='pick'] b");
  check(pickEl && +pickEl.textContent === 22, "精选 22 条");

  check(doc.querySelector(".line .zh").hidden === true, "中文默认隐藏");
  click(doc.querySelector(".line .zh-btn"));
  check(doc.querySelector(".line .zh").hidden === false, "点击显示中文");

  const wEl = doc.querySelectorAll(".line .w")[3];
  click(wEl);
  const pop = doc.getElementById("pop");
  check(!pop.hidden, "点词弹层");
  check(!pop.textContent.includes("词典未收录"), "首个词有译文");

  check(doc.querySelector(".note-box") !== null, "有讲解框");

  click(doc.querySelector(".mode-tab[data-mode='pick']"));
  check(doc.querySelectorAll(".line").length === 22, "精选模式 22 句");
  click(doc.querySelector(".mode-tab[data-mode='all']"));
  check(doc.querySelectorAll(".line").length === 576, "切回全部");

  go("#/watch/pb/2/2");
  check(doc.querySelectorAll(".line").length === 515, "E02 515 句");
  check(doc.querySelectorAll(".zh-pending").length === 0, "全季已翻译，无待翻译占位");

  let eps = 0, lines = 0, zh = 0, picks = 0, notes = 0;
  w.SHOWS.forEach((s) => s.seasons.forEach((se) => se.episodes.forEach((e) => {
    eps++; picks += (e.picks || []).length;
    e.lines.forEach((l) => { lines++; if (l.zh) zh++; if (l.note) notes++; });
  })));
  check(eps === 24, "S2+S3 共 24 集，实际 " + eps);
  console.log("  data: " + lines + " lines / " + zh + " translated (" +
    (zh / lines * 100).toFixed(1) + "%) / " + notes + " notes / " + picks + " picks");

  /* ---- 越狱 S3（Sona 篇） ---- */
  go("#/show/pb/3");
  check(doc.querySelectorAll(".ep-card").length === 2, "S3 有 2 集");

  go("#/watch/pb/3/1");
  const n3 = doc.querySelectorAll(".line").length;
  check(n3 === 403, "S3E01 渲染 403 句，实际 " + n3);
  const pick3 = doc.querySelector(".mode-tab[data-mode='pick'] b");
  check(pick3 && +pick3.textContent === 34, "S3E01 精选 34 条");
  check(doc.querySelectorAll(".zh-pending").length === 0, "S3E01 无待翻译占位");
  check(doc.querySelector(".line .zh").hidden === true, "S3E01 中文默认隐藏");
  click(doc.querySelector(".line .zh-btn"));
  check(doc.querySelector(".line .zh").hidden === false, "S3E01 点击显示中文");
  check(doc.querySelector(".note-box") !== null, "S3E01 有讲解框");
  const w3 = doc.querySelectorAll(".line .w")[3];
  click(w3);
  check(!doc.getElementById("pop").hidden, "S3E01 点词弹层");
  check(!doc.getElementById("pop").textContent.includes("词典未收录"), "S3E01 点词有译文");

  go("#/watch/pb/3/2");
  const n32 = doc.querySelectorAll(".line").length;
  check(n32 === 574, "S3E02 渲染 574 句，实际 " + n32);
  check(doc.querySelectorAll(".zh-pending").length === 0, "S3E02 无待翻译占位");

  console.log("\n" + (errs.length ? errs.join("\n") : "ALL PASS"));
} catch (e) {
  console.log("TEST ERROR:", e.message, "\n", e.stack);
}

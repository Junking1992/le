/* ============================================================
   shows.js — 剧集注册表 + 数据规范化
   ------------------------------------------------------------
   剧集数据文件调用 registerEpisode(剧集信息, 季号, 集对象) 注册。
   同一个剧集 id 会自动合并，所以「一集一个文件」「一季一个文件」
   「整部剧一个文件」都可以。
   ============================================================ */

window.SHOWS = [];

/* 把各种简写形态的台词统一成对象 */
function normalizeLine(l) {
  if (Array.isArray(l)) {
    const [en, zh, note, extra] = l;
    const out = { en: en || "", zh: zh || "", note: note || "", w: {} };
    if (extra && extra.w) out.w = extra.w;
    return out;
  }
  return {
    en: l.en || "",
    zh: l.zh || "",
    note: l.note || "",
    w: l.w || {},
    tag: l.tag || "",
  };
}

function normalizeEpisode(ep) {
  ep.lines = (ep.lines || []).map(normalizeLine);
  // picks 支持数字下标或 true 标记
  if (!Array.isArray(ep.picks)) ep.picks = [];
  ep.picks = ep.picks.filter((i) => typeof i === "number" && i >= 0 && i < ep.lines.length);
  // 如果 lines 里用 tag:"pick" 标记，也并入 picks
  ep.lines.forEach((l, i) => {
    if (l.tag === "pick" && ep.picks.indexOf(i) < 0) ep.picks.push(i);
  });
  ep.picks.sort((a, b) => a - b);
  return ep;
}

function normalizeShow(show) {
  show.seasons = show.seasons || [];
  show.seasons.forEach((s) => {
    s.episodes = (s.episodes || []).map(normalizeEpisode);
    s.episodes.sort((a, b) => (a.no || 0) - (b.no || 0));
  });
  show.seasons.sort((a, b) => (a.no || 0) - (b.no || 0));
  return show;
}

window.registerShow = function (show) {
  normalizeShow(show);
  const i = window.SHOWS.findIndex((s) => s.id === show.id);
  if (i >= 0) window.SHOWS[i] = show;
  else window.SHOWS.push(show);
};

window.registerEpisode = function (meta, seasonNo, ep) {
  if (!meta || !meta.id) throw new Error("registerEpisode: meta.id 必填");
  if (!ep || typeof ep.no !== "number") throw new Error("registerEpisode: ep.no 必填");

  let show = window.SHOWS.find((s) => s.id === meta.id);
  if (!show) {
    show = Object.assign({ seasons: [] }, meta, { seasons: [] });
    window.SHOWS.push(show);
  } else {
    Object.keys(meta).forEach((k) => {
      if (k !== "seasons" && meta[k] != null && meta[k] !== "") show[k] = meta[k];
    });
  }

  let season = show.seasons.find((s) => s.no === seasonNo);
  if (!season) {
    season = { no: seasonNo, title: "", episodes: [] };
    show.seasons.push(season);
  }

  normalizeEpisode(ep);
  const i = season.episodes.findIndex((e) => e.no === ep.no);
  if (i >= 0) season.episodes[i] = ep;
  else season.episodes.push(ep);

  show.seasons.sort((a, b) => (a.no || 0) - (b.no || 0));
  season.episodes.sort((a, b) => (a.no || 0) - (b.no || 0));
  return show;
};

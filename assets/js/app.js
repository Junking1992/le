/* ============================================================
   app.js — ScreenLingo 应用逻辑
   ------------------------------------------------------------
   页面：#/ 剧集库 · #/show/:id 季与集 · #/watch/:id/:s/:e 学习
        #/phrases 短语库 · #/vocab 生词本 · #/help 使用说明
   ============================================================ */
(function () {
  "use strict";

  /* ============================================================
     0. 存储
     ============================================================ */
  const KEY = {
    settings: "sl.v2.settings",
    progress: "sl.v2.progress",
    vocab: "sl.v2.vocab",
    last: "sl.v2.last",
  };

  const read = (k, d) => {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : d;
    } catch (e) {
      return d;
    }
  };
  const write = (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {
      toast("存储失败：浏览器空间已满");
    }
  };

  const settings = Object.assign(
    { theme: "dark", zhAuto: false, showPhrases: true, rate: 0.92, mode: "all" },
    read(KEY.settings, {})
  );

  let progress = read(KEY.progress, {});
  let vocab = read(KEY.vocab, {});

  const saveSettings = () => write(KEY.settings, settings);
  const saveProgress = () => write(KEY.progress, progress);
  const saveVocab = () => write(KEY.vocab, vocab);

  /* ============================================================
     1. 工具
     ============================================================ */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  const esc = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const norm = (w) => String(w || "").toLowerCase().replace(/[\u2018\u2019]/g, "'").trim();

  let toastTimer = null;
  function toast(msg) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 1900);
  }

  /* ============================================================
     2. 词库
     ============================================================ */
  const WORD_INDEX = {};
  Object.keys(DICT_WORDS).forEach((k) => {
    WORD_INDEX[norm(k)] = DICT_WORDS[k];
  });

  // 短语索引：首词 -> [{key, words}]
  const PHRASE_INDEX = {};
  const PHRASE_KEYS = new Set();
  function addPhraseKey(key) {
    const words = norm(key).split(/\s+/).filter(Boolean);
    if (words.length < 2) return;
    if (PHRASE_KEYS.has(key)) return;
    PHRASE_KEYS.add(key);
    (PHRASE_INDEX[words[0]] = PHRASE_INDEX[words[0]] || []).push({ key, words });
  }
  Object.keys(PHRASES).forEach(addPhraseKey);
  Object.keys(DICT_WORDS).forEach((k) => {
    if (/\s/.test(k.trim())) addPhraseKey(k);
  });
  Object.keys(PHRASE_INDEX).forEach((k) =>
    PHRASE_INDEX[k].sort((a, b) => b.words.length - a.words.length)
  );

  /* 词形还原 */
  const IRREG = {
    am: "be", is: "be", are: "be", was: "be", were: "be", been: "be", being: "be",
    has: "have", had: "have",
    does: "do", did: "do", done: "do",
    went: "go", gone: "go", goes: "go",
    came: "come", said: "say", says: "say",
    saw: "see", seen: "see", sees: "see",
    took: "take", taken: "take", takes: "take",
    made: "make", makes: "make",
    got: "get", gotten: "get", gets: "get",
    knew: "know", known: "know", knows: "know",
    thought: "think", thinks: "think",
    told: "tell", tells: "tell",
    felt: "feel", feels: "feel",
    left: "leave", leaves: "leave",
    kept: "keep", keeps: "keep",
    held: "hold", holds: "hold",
    found: "find", finds: "find",
    gave: "give", given: "give", gives: "give",
    fell: "fall", fallen: "fall", falls: "fall",
    wrote: "write", written: "write", writes: "write",
    spent: "spend", spends: "spend",
    meant: "mean", means: "mean",
    paid: "pay", pays: "pay",
    lost: "lose", loses: "lose",
    met: "meet", meets: "meet",
    ran: "run", runs: "run",
    sat: "sit", sits: "sit",
    stood: "stand", stands: "stand",
    brought: "bring", brings: "bring",
    bought: "buy", buys: "buy",
    caught: "catch", catches: "catch",
    fought: "fight", fights: "fight",
    hid: "hide", hidden: "hide", hides: "hide",
    hit: "hit", hits: "hit",
    hurt: "hurt", hurts: "hurt",
    put: "put", puts: "put",
    read: "read", reads: "read",
    sent: "send", sends: "send",
    sold: "sell", sells: "sell",
    spoke: "speak", spoken: "speak", speaks: "speak",
    stole: "steal", stolen: "steal", steals: "steal",
    woke: "wake", woken: "wake", wakes: "wake",
    wore: "wear", worn: "wear", wears: "wear",
    won: "win", wins: "win",
    broke: "break", broken: "break", breaks: "break",
    chose: "choose", chosen: "choose", chooses: "choose",
    drove: "drive", driven: "drive", drives: "drive",
    ate: "eat", eaten: "eat", eats: "eat",
    drank: "drink", drunk: "drink", drinks: "drink",
    began: "begin", begun: "begin", begins: "begin",
    built: "build", builds: "build",
    dealt: "deal", deals: "deal",
    dug: "dig", digs: "dig",
    drew: "draw", drawn: "draw", draws: "draw",
    fed: "feed", feeds: "feed",
    flew: "fly", flown: "fly", flies: "fly",
    forgot: "forget", forgotten: "forget", forgets: "forget",
    froze: "freeze", frozen: "freeze", freezes: "freeze",
    grew: "grow", grown: "grow", grows: "grow",
    heard: "hear", hears: "hear",
    led: "lead", leads: "lead",
    lay: "lie", lain: "lie", lies: "lie",
    lit: "light", lights: "light",
    rode: "ride", ridden: "ride", rides: "ride",
    rose: "rise", risen: "rise", rises: "rise",
    shook: "shake", shaken: "shake", shakes: "shake",
    shot: "shoot", shoots: "shoot",
    shut: "shut", shuts: "shut",
    sang: "sing", sung: "sing", sings: "sing",
    sank: "sink", sunk: "sink", sinks: "sink",
    slept: "sleep", sleeps: "sleep",
    slid: "slide", slides: "slide",
    split: "split", splits: "split",
    spread: "spread", spreads: "spread",
    stuck: "stick", sticks: "stick",
    struck: "strike", strikes: "strike",
    swore: "swear", sworn: "swear", swears: "swear",
    swept: "sweep", sweeps: "sweep",
    swam: "swim", swum: "swim", swims: "swim",
    threw: "throw", thrown: "throw", throws: "throw",
    understood: "understand", understands: "understand",
    bore: "bear", borne: "bear", born: "bear", bears: "bear",
    beat: "beat", beaten: "beat", beats: "beat",
    bent: "bend", bends: "bend",
    bit: "bite", bitten: "bite", bites: "bite",
    blew: "blow", blown: "blow", blows: "blow",
    bound: "bind", binds: "bind",
    cast: "cast", casts: "cast",
    clung: "cling", clings: "cling",
    crept: "creep", creeps: "creep",
    cut: "cut", cuts: "cut",
    fled: "flee", flees: "flee",
    forgave: "forgive", forgiven: "forgive", forgives: "forgive",
    ground: "grind", grinds: "grind",
    hung: "hang", hangs: "hang",
    knelt: "kneel", kneels: "kneel",
    laid: "lay", lays: "lay",
    leapt: "leap", leaps: "leap",
    lent: "lend", lends: "lend",
    sought: "seek", seeks: "seek",
    shed: "shed", sheds: "shed",
    shone: "shine", shines: "shine",
    sped: "speed", speeds: "speed",
    spun: "spin", spins: "spin",
    spat: "spit", spits: "spit",
    tore: "tear", torn: "tear", tears: "tear",
    wove: "weave", woven: "weave",
    wept: "weep", weeps: "weep",
    wound: "wind", winds: "wind",
    // 复数 / 特殊
    men: "man", women: "woman", children: "child", feet: "foot", teeth: "tooth",
    lives: "life", wives: "wife", knives: "knife", halves: "half",
    feds: "fed", cops: "cop", guards: "guard", papers: "paper", files: "file",
    hands: "hand", hours: "hour", years: "year", minutes: "minute", miles: "mile",
    rules: "rule", beds: "bed", shovels: "shovel", prints: "print", records: "record",
    roadblocks: "roadblock", roads: "road", supplies: "supply", dollars: "dollar",
    favors: "favor", names: "name", questions: "question", riddles: "riddle",
    traps: "trap", plans: "plan", lines: "line", marks: "mark",
    steps: "step", things: "thing", times: "time", answers: "answer", calls: "call",
  };

  function candidates(w) {
    const out = [w];
    const add = (x) => {
      if (x && x.length > 1 && out.indexOf(x) < 0) out.push(x);
    };
    if (IRREG[w]) add(IRREG[w]);
    add(w.replace(/'s$/, ""));
    add(w.replace(/n't$/, ""));
    add(w.replace(/'(re|ll|ve|d|m)$/, ""));
    add(w.replace(/ies$/, "y"));
    add(w.replace(/es$/, ""));
    add(w.replace(/s$/, ""));
    add(w.replace(/ied$/, "y"));
    add(w.replace(/ed$/, ""));
    add(w.replace(/ed$/, "e"));
    add(w.replace(/ing$/, ""));
    add(w.replace(/ing$/, "e"));
    add(w.replace(/(.)\1(ed|ing|er|est)$/, "$1$2"));
    add(w.replace(/er$/, ""));
    add(w.replace(/est$/, ""));
    add(w.replace(/ly$/, ""));
    for (const c of out.slice()) if (IRREG[c]) add(IRREG[c]);
    return out;
  }

  function parseEntry(entry) {
    const parts = String(entry).split("|");
    return { zh: parts[0] || "", pos: parts[1] || "", phon: parts[2] || "" };
  }

  /* 查词：先查本句的逐词精译，再查全局词库 */
  function lookup(raw, line) {
    const w = norm(raw);
    const cands = candidates(w);

    // 1) 本句覆盖（可能是短语，如 "last night"）
    if (line && line.w) {
      for (const k of Object.keys(line.w)) {
        if (norm(k) === w) {
          return { word: raw, base: w, zh: line.w[k], pos: "", phon: "", local: true };
        }
      }
    }
    // 2) 全局词库（含词形还原）
    for (const c of cands) {
      if (WORD_INDEX[c]) {
        const d = parseEntry(WORD_INDEX[c]);
        return { word: raw, base: c, zh: d.zh, pos: d.pos, phon: d.phon, entry: WORD_INDEX[c] };
      }
    }
    return { word: raw, base: w, zh: "", pos: "", phon: "", entry: null };
  }

  /* ============================================================
     3. 剧集数据
     ============================================================ */
  const shows = () => window.SHOWS || [];
  const getShow = (id) => shows().find((s) => s.id === id);
  const getSeason = (show, no) => (show.seasons || []).find((s) => s.no === +no);
  const getEp = (show, sNo, eNo) => {
    const s = getSeason(show, sNo);
    return s ? (s.episodes || []).find((e) => e.no === +eNo) : null;
  };
  const epKey = (showId, sNo, eNo) => showId + "|" + sNo + "|" + eNo;

  function epProgress(showId, sNo, ep) {
    const p = progress[epKey(showId, sNo, ep.no)];
    const total = (ep.lines || []).length || 1;
    const done = p && p.learned ? p.learned.length : 0;
    return { done, total, pct: Math.round((done / total) * 100), p: p || {} };
  }

  function showProgress(show) {
    let total = 0,
      done = 0;
    (show.seasons || []).forEach((s) =>
      (s.episodes || []).forEach((e) => {
        const r = epProgress(show.id, s.no, e);
        total += r.total;
        done += r.done;
      })
    );
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  function allEpisodes() {
    const out = [];
    shows().forEach((s) =>
      (s.seasons || []).forEach((se) =>
        (se.episodes || []).forEach((e) => out.push({ show: s, season: se.no, ep: e }))
      )
    );
    return out;
  }

  /* ============================================================
     4. 切词 + 短语标记
     ============================================================ */
  const tokenCache = new Map();

  function tokenize(text) {
    const cacheKey = text + (settings.showPhrases ? "|p" : "|n");
    if (tokenCache.has(cacheKey)) return tokenCache.get(cacheKey);

    const words = [];
    const re = /[A-Za-z]+(?:['\u2019][A-Za-z]+)*/g;
    let m;
    while ((m = re.exec(text))) {
      words.push({ raw: m[0], norm: norm(m[0]), start: m.index, end: m.index + m[0].length });
    }

    const wordHtml = (w) =>
      '<span class="w" data-w="' + esc(w.norm) + '">' + esc(w.raw) + "</span>";

    let html = "";
    let cursor = 0;
    let i = 0;
    while (i < words.length) {
      let matched = null;
      if (settings.showPhrases) {
        const list = PHRASE_INDEX[words[i].norm];
        if (list) {
          for (const cand of list) {
            let ok = true;
            for (let k = 0; k < cand.words.length; k++) {
              const w = words[i + k];
              if (!w || w.norm !== cand.words[k]) {
                ok = false;
                break;
              }
              if (k > 0) {
                const gap = text.slice(words[i + k - 1].end, w.start);
                if (!/^[ \t]+$/.test(gap)) {
                  ok = false;
                  break;
                }
              }
            }
            if (ok) {
              matched = cand;
              break;
            }
          }
        }
      }

      const startPos = words[i].start;
      if (startPos > cursor) html += esc(text.slice(cursor, startPos));

      if (matched) {
        let inner = "";
        for (let k = 0; k < matched.words.length; k++) {
          const w = words[i + k];
          if (k > 0) inner += esc(text.slice(words[i + k - 1].end, w.start));
          inner += wordHtml(w);
        }
        html += '<span class="ph" data-ph="' + esc(matched.key) + '">' + inner + "</span>";
        cursor = words[i + matched.words.length - 1].end;
        i += matched.words.length;
      } else {
        html += wordHtml(words[i]);
        cursor = words[i].end;
        i += 1;
      }
    }
    if (cursor < text.length) html += esc(text.slice(cursor));

    tokenCache.set(cacheKey, html);
    return html;
  }

  function highlight(text, base) {
    const re = /[A-Za-z]+(?:['\u2019][A-Za-z]+)*/g;
    let out = "";
    let last = 0;
    let m;
    while ((m = re.exec(text))) {
      out += esc(text.slice(last, m.index));
      const hit = candidates(norm(m[0])).indexOf(base) >= 0;
      out += hit
        ? '<span style="color:var(--accent);font-weight:600">' + esc(m[0]) + "</span>"
        : esc(m[0]);
      last = m.index + m[0].length;
    }
    out += esc(text.slice(last));
    return out;
  }

  /* ============================================================
     5. 语音
     ============================================================ */
  let voices = [];
  function loadVoices() {
    voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  }
  if (window.speechSynthesis) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  function speak(text, rate) {
    if (!window.speechSynthesis) {
      toast("当前浏览器不支持朗读");
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text).replace(/\s+/g, " ").trim());
    u.lang = "en-US";
    u.rate = rate || settings.rate;
    const v =
      voices.find((x) => /en[-_](US|GB)/i.test(x.lang) && /natural|samantha|aria|google/i.test(x.name)) ||
      voices.find((x) => /^en/i.test(x.lang));
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  }

  /* ============================================================
     6. 首页
     ============================================================ */
  function viewHome() {
    const list = shows();
    const all = allEpisodes();
    const learnedLines = Object.keys(progress).reduce(
      (n, k) => n + ((progress[k].learned || []).length || 0),
      0
    );
    const totalLines = all.reduce((n, x) => n + (x.ep.lines || []).length, 0);
    const totalPicks = all.reduce((n, x) => n + (x.ep.picks || []).length, 0);

    const last = read(KEY.last, null);
    let resume = "";
    if (last && getShow(last.id)) {
      const sh = getShow(last.id);
      const ep = getEp(sh, last.s, last.e);
      if (ep)
        resume =
          '<a class="btn primary" href="#/watch/' + sh.id + "/" + last.s + "/" + last.e + '">' +
          '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>继续 S' +
          last.s + "E" + last.e + "</a>";
    }

    return (
      '<section class="hero"><div class="wrap"><div class="hero-inner">' +
      '<div><span class="kicker">Learn English with TV</span>' +
      "<h1>一句一句，<em>听懂</em>美剧</h1>" +
      '<p class="lead">全部台词逐句对照，每个单词都能点开看中文；另有「精选精讲」模式，只讲难点重点句。' +
      "</p>" +
      '<div class="hero-actions">' + resume +
      '<a class="btn" href="#/phrases">短语库 · ' + Object.keys(PHRASES).length + " 条</a>" +
      '<a class="btn ghost" href="#/help">使用说明</a></div>' +
      '<div class="stats">' +
      '<div class="stat"><b>' + list.length + "</b><span>剧集</span></div>" +
      '<div class="stat"><b>' + all.length + "</b><span>已收录集数</span></div>" +
      '<div class="stat"><b>' + totalPicks + "</b><span>精选精讲句</span></div>" +
      '<div class="stat"><b>' + learnedLines + "</b><span>已学 / " + totalLines + "</span></div>" +
      "</div></div>" +
      '<div class="hero-art"><div class="hero-card">' +
      '<div class="hc-kicker">Now learning</div>' +
      "<h3>Prison Break</h3><p>Season 2 · 越狱 第二季</p>" +
      '<div class="hc-line">&ldquo;We got out together, we stay together.&rdquo;' +
      "<small>我们一起出来的，就得一起待着。</small></div>" +
      "</div></div>" +
      "</div></div></section>" +

      '<div class="wrap"><section class="section"><div class="section-head">' +
      '<h2>剧集库</h2><span class="hint">点开剧集 → 选季 → 选集</span></div>' +
      '<div class="show-grid">' + list.map(showCard).join("") + "</div></section></div>"
    );
  }

  function showCard(show) {
    const pr = showProgress(show);
    const eps = (show.seasons || []).reduce((n, s) => n + (s.episodes || []).length, 0);
    const picks = (show.seasons || []).reduce(
      (n, s) => n + (s.episodes || []).reduce((m, e) => m + (e.picks || []).length, 0),
      0
    );
    const glow = show.glow || "rgba(232,178,92,.14)";
    return (
      '<a class="show-card" href="#/show/' + show.id + '" style="--glow:' + glow + '">' +
      '<div class="poster" style="--poster:' + (show.poster || "") + '">' +
      "<b>" + esc(show.posterText || show.title) + "</b><small>" + esc(show.year || "") + "</small></div>" +
      '<div class="show-meta"><h3>' + esc(show.title) + "</h3>" +
      '<div class="cn">' + esc(show.titleZh || "") + (show.year ? " · " + show.year : "") + "</div>" +
      "<p>" + esc(show.tagline || show.desc || "") + "</p>" +
      '<div class="foot"><span class="chip">' + eps + " 集</span>" +
      (picks ? '<span class="chip teal">' + picks + " 精讲</span>" : "") +
      '<span class="chip accent">' + pr.pct + "%</span></div>" +
      '<div class="progressbar"><i style="width:' + pr.pct + '%"></i></div>' +
      "</div></a>"
    );
  }

  /* ============================================================
     7. 剧集页
     ============================================================ */
  function viewShow(id, sNo) {
    const show = getShow(id);
    if (!show) return notFound("没有找到这部剧");
    const seasonNo = +sNo || (show.seasons[0] && show.seasons[0].no) || 1;
    const season = getSeason(show, seasonNo) || { no: seasonNo, episodes: [] };
    const pr = showProgress(show);
    const firstEp = (season.episodes || [])[0];
    const startNo = firstEp ? firstEp.no : 1;

    return (
      '<div class="wrap"><section class="show-hero">' +
      '<div class="poster" style="--poster:' + (show.poster || "") + '"><b>' +
      esc(show.posterText || show.title) + "</b><small>" + esc(show.year || "") + "</small></div>" +
      "<div><h1>" + esc(show.title) + "</h1>" +
      '<div class="sub"><span>' + esc(show.titleZh || "") + "</span>" +
      (show.year ? '<span class="chip">' + show.year + "</span>" : "") +
      (show.genre ? '<span class="chip">' + esc(show.genre) + "</span>" : "") +
      (show.network ? '<span class="chip">' + esc(show.network) + "</span>" : "") +
      '<span class="chip accent">进度 ' + pr.pct + "%</span></div>" +
      '<p class="desc">' + esc(show.desc || show.tagline || "") + "</p>" +
      '<div class="actions"><a class="btn primary" href="#/watch/' + show.id + "/" + seasonNo + "/" + startNo + '">' +
      '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>从 S' + seasonNo + "E" + startNo + " 开始</a>" +
      '<a class="btn" href="#/phrases">短语库</a></div>' +
      "</div></section>" +

      '<div class="season-bar">' +
      (show.seasons || [])
        .map(
          (s) =>
            '<button class="season-tab' + (s.no === seasonNo ? " active" : "") +
            '" data-season="' + s.no + '">第 ' + s.no + " 季" +
            (s.title ? " · " + esc(s.title) : "") + "</button>"
        )
        .join("") +
      "</div>" +
      '<div class="ep-grid">' +
      (season.episodes || []).map((ep) => epCard(show, season.no, ep)).join("") +
      "</div>" +
      (season.episodes.length === 0
        ? '<div class="empty"><b>这一季还没有字幕</b>按 README 的说明准备数据文件。</div>'
        : "") +
      "</div>"
    );
  }

  function epCard(show, sNo, ep) {
    const r = epProgress(show.id, sNo, ep);
    const done = r.pct === 100;
    const picks = (ep.picks || []).length;
    return (
      '<a class="ep-card' + (done ? " done" : "") + '" href="#/watch/' + show.id + "/" + sNo + "/" + ep.no + '">' +
      '<div class="ep-no">' + ep.no + "</div>" +
      '<div class="ep-info"><b>S' + sNo + "E" + ep.no + " · " + esc(ep.title || "") + "</b>" +
      "<small>" + esc(ep.titleZh || "") + " · " + r.total + " 句" +
      (picks ? " · " + picks + " 精讲" : "") + "</small></div>" +
      '<div class="ring" style="--p:' + r.pct + '"><span>' + r.pct + "%</span></div>" +
      "</a>"
    );
  }

  /* ============================================================
     8. 学习页
     ============================================================ */
  const state = {
    focus: false,
    active: 0,
    filter: "all",
    mode: "all",
    showId: null,
    sNo: null,
    eNo: null,
    ep: null,
    show: null,
  };

  function viewWatch(showId, sNo, eNo) {
    const show = getShow(showId);
    if (!show) return notFound("没有找到这部剧");
    const ep = getEp(show, sNo, eNo);
    if (!ep) return notFound("这一集还没有字幕");

    state.show = show;
    state.showId = showId;
    state.sNo = +sNo;
    state.eNo = +eNo;
    state.ep = ep;
    state.focus = false;
    const savedCursor = (progress[epKey(showId, sNo, eNo)] || {})[
      settings.mode === "pick" ? "cursorPick" : "cursorAll"
    ];
    state.active = typeof savedCursor === "number" ? savedCursor : 0;
    state.filter = "all";
    state.mode = settings.mode || "all";

    write(KEY.last, { id: showId, s: +sNo, e: +eNo });

    const r = epProgress(showId, sNo, ep);
    const eps = (getSeason(show, sNo) || { episodes: [] }).episodes || [];
    const idx = eps.findIndex((x) => x.no === +eNo);
    const prev = eps[idx - 1];
    const next = eps[idx + 1];
    const picks = ep.picks || [];

    return (
      '<div class="watch-head"><div class="wrap">' +
      '<div class="row1">' +
      '<a class="back-link" href="#/show/' + show.id + "/" + sNo + '">← ' +
      esc(show.titleZh || show.title) + "</a>" +
      '<span class="watch-title">S' + sNo + "E" + eNo + " · " + esc(ep.title || "") +
      "<small>" + esc(ep.titleZh || "") + "</small></span>" +
      '<span class="spacer"></span>' +
      (prev ? '<a class="btn sm ghost" href="#/watch/' + show.id + "/" + sNo + "/" + prev.no + '">← 上一集</a>' : "") +
      (next ? '<a class="btn sm ghost" href="#/watch/' + show.id + "/" + sNo + "/" + next.no + '">下一集 →</a>' : "") +
      '<button class="btn sm" id="focus-btn">' + (state.focus ? "列表模式" : "逐句模式") + '</button>' +
      "</div>" +

      '<div class="watch-tools">' +
      '<div class="mode-bar">' +
      '<button class="mode-tab' + (state.mode === "all" ? " active" : "") + '" data-mode="all">' +
      '<span class="mt-label">全部台词</span><b>' + ep.lines.length + "</b></button>" +
      '<button class="mode-tab' + (state.mode === "pick" ? " active" : "") + '" data-mode="pick"' +
      (picks.length ? "" : " disabled") + ">" +
      '<span class="mt-label">精选精讲</span><b>' + picks.length + "</b></button>" +
      "</div>" +
      '<div class="tool-sep"></div>' +
      toolGroup("zh", [["off", "中文隐藏"], ["on", "中文常显"]], settings.zhAuto ? "on" : "off") +
      '<div class="tool-sep"></div>' +
      toolGroup("filter", [["all", "全部"], ["todo", "未学"], ["done", "已学"]], state.filter || "all") +
      '<div class="tool-sep"></div>' +
      '<div class="speed"><span>语速</span><input type="range" id="rate" min="0.5" max="1.4" step="0.02" value="' +
      settings.rate + '"><span id="rate-val">' + settings.rate.toFixed(2) + "</span></div>" +
      '<div class="head-keys">' +
      '<span class="hk"><kbd>J</kbd><kbd>K</kbd>上下句</span>' +
      '<span class="hk"><kbd>空格</kbd>中文</span>' +
      '<span class="hk"><kbd>S</kbd>朗读</span>' +
      '<span class="hk"><kbd>M</kbd>已掌握</span>' +
      '<span class="hk"><kbd>F</kbd>逐句</span>' +
      '<span class="hk"><kbd>P</kbd>精讲</span>' +
      "</div>" +
      "</div></div></div>" +

      '<div class="wrap"><div class="watch-layout"><div id="stage">' +
      '<div class="lines" id="lines"></div>' +
      "</div>" +
      '<aside class="side">' + sidePanel(show, sNo, ep, r) + "</aside>" +
      "</div></div>"
    );
  }

  function toolGroup(id, opts, active) {
    return (
      '<div class="tool-group" data-group="' + id + '">' +
      opts
        .map(
          ([v, label]) =>
            '<button data-val="' + v + '" class="' + (v === active ? "on" : "") + '">' + label + "</button>"
        )
        .join("") +
      "</div>"
    );
  }

  function lineHtml(l, i, pickNo) {
    const p = progress[epKey(state.showId, state.sNo, state.eNo)] || {};
    const learned = (p.learned || []).indexOf(i) >= 0;
    const hideZh = !settings.zhAuto;
    return (
      '<article class="line' + (learned ? " learned" : "") + (pickNo ? " pick" : "") +
      '" data-i="' + i + '" id="ln-' + i + '">' +
      '<div class="ln-no">' + (pickNo ? pickNo : i + 1) + "</div>" +
      '<div class="ln-body">' +
      '<div class="en">' + tokenize(l.en) + "</div>" +
      (l.zh
        ? '<div class="zh-wrap">' +
          (hideZh
            ? '<button class="zh-btn" data-act="zh">中文已隐藏 · 点击查看</button>' +
              '<p class="zh" hidden>' + esc(l.zh) + "</p>"
            : '<p class="zh">' + esc(l.zh) + "</p>") +
          "</div>"
        : '<div class="zh-wrap"><span class="zh-pending">中文待翻译</span></div>') +
      (l.note
        ? '<div class="note-box' + (hideZh ? " hidden-note" : "") + '">' +
          '<span class="note-k">讲解</span>' + esc(l.note) + "</div>"
        : "") +
      "</div>" +
      '<div class="ln-tools">' +
      '<button data-act="speak" title="朗读这句"><svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 8a5 5 0 0 1 0 8"/></svg></button>' +
      '<button data-act="star" class="' + (learned ? "on" : "") + '" title="标记已掌握"><svg viewBox="0 0 24 24"><path d="m5 13 4 4L19 7"/></svg></button>' +
      "</div></article>"
    );
  }

  /* 当前模式要显示的句子下标 */
  function visibleIndexes() {
    const ep = state.ep;
    if (!ep) return [];
    if (state.mode === "pick" && (ep.picks || []).length) return ep.picks.slice();
    return ep.lines.map((_, i) => i);
  }

  /* requestAnimationFrame 的兜底（老浏览器 / 测试环境可能没有） */
  const nextFrame = (fn) =>
    typeof requestAnimationFrame === "function" ? requestAnimationFrame(fn) : setTimeout(fn, 0);

  /* 把某一句滚到可视区，避开顶部 sticky 的 watch-head。
     注意：.line 上有 content-visibility:auto，屏幕外的行高度是估算的，
     直接用坐标算会偏。这里：
       1. 滚动瞬间临时关掉 content-visibility，让所有行按真实高度布局
       2. 用 scrollIntoView（认 scroll-margin-top）
       3. 滚完恢复，保住长列表性能 */
  function scrollLineIntoView(el, smooth) {
    if (!el) return;
    const head = $(".watch-head");
    const off = (head ? Math.round(head.getBoundingClientRect().height) : 0) + 64 + 18;
    el.style.scrollMarginTop = off + "px";

    const box = $("#lines");
    const restore = () => {
      if (box) box.classList.remove("no-cv");
    };
    if (box && smooth === false) box.classList.add("no-cv");
    // 强制一次同步布局，让真实高度生效
    void el.offsetHeight;

    if (typeof el.scrollIntoView === "function") {
      el.scrollIntoView({
        block: "start",
        behavior: smooth === false ? "auto" : "smooth",
      });
    }

    if (smooth === false) {
      // 等浏览器应用完滚动位置再恢复
      nextFrame(() => nextFrame(restore));
    }
  }

  /* scroll: true 时把当前句滚到视野内。
     只有“重新打开这一集”和“从逐句模式切回列表”才需要，
     点击卡片激活时不要滚，否则页面会跳。 */
  function renderLines(scroll) {
    const box = $("#lines");
    if (!box || !state.ep) return;
    const idxs = visibleIndexes();
    const pickSet = {};
    if (state.mode === "pick") idxs.forEach((n, k) => (pickSet[n] = k + 1));
    box.innerHTML = idxs.map((i) => lineHtml(state.ep.lines[i], i, pickSet[i])).join("");
    applyFilter();
    // 高亮“上次停留”的那一句；不在当前列表里就退回第一条
    if (idxs.indexOf(state.active) < 0) state.active = idxs[0] || 0;
    const cur = $("#ln-" + state.active) || $(".line");
    $$(".line").forEach((l) => l.classList.remove("active"));
    if (cur) {
      cur.classList.add("active");
      if (scroll) {
        // 等一帧：表头（含快捷键行）此时才完成布局，高度才准
        nextFrame(() => {
          syncHeadOffset();
          nextFrame(() => scrollLineIntoView(cur, false));
        });
      }
    }
  }

  function sidePanel(show, sNo, ep, r) {
    const phrases = phrasesInEpisode(ep);
    return (
      '<div class="panel"><div class="panel-body"><div class="ep-progress">' +
      '<div class="ring" style="--p:' + r.pct + '"><span>' + r.pct + "%</span></div>" +
      "<div><b>" + r.done + " / " + r.total + " 句</b><small>标记为已掌握</small></div></div></div></div>" +

      '<div class="panel panel-grow"><div class="panel-head">本集短语 <span>' + phrases.length + " 条</span></div>" +
      '<div class="panel-body"><div class="phrase-mini">' +
      (phrases.length
        ? phrases
            .map(
              (k) =>
                '<button data-phrase="' + esc(k) + '"><b>' + esc(k) + "</b><span>" +
                esc(phraseZh(k)) + "</span></button>"
            )
            .join("")
        : '<span class="muted" style="font-size:12px">这一集没有命中短语库</span>') +
      "</div></div></div>"
    );
  }

  function phraseZh(k) {
    if (PHRASES[k]) return PHRASES[k].zh;
    if (WORD_INDEX[norm(k)]) return parseEntry(WORD_INDEX[norm(k)]).zh;
    return "";
  }

  function phrasesInEpisode(ep) {
    const found = new Set();
    (ep.lines || []).forEach((l) => {
      const n = " " + norm(l.en).replace(/[^a-z' ]+/g, " ").replace(/\s+/g, " ") + " ";
      Object.keys(PHRASE_INDEX).forEach((first) => {
        PHRASE_INDEX[first].forEach((cand) => {
          if (found.has(cand.key)) return;
          if (n.indexOf(" " + cand.words.join(" ") + " ") >= 0) found.add(cand.key);
        });
      });
    });
    return Array.from(found).sort();
  }

  /* ---------- 逐句模式 ---------- */
  function renderFocus() {
    const stage = $("#stage");
    if (!stage) return;
    const ep = state.ep;
    const i = state.active;
    const l = ep.lines[i] || { en: "", zh: "" };
    const key = epKey(state.showId, state.sNo, state.eNo);
    const learned = ((progress[key] || {}).learned || []).indexOf(i) >= 0;
    const idxs = visibleIndexes();
    const pos = idxs.indexOf(i);

    stage.innerHTML =
      '<div class="focus">' +
      '<div class="f-index">S' + state.sNo + "E" + state.eNo + " · " + (pos + 1) + " / " + idxs.length + "</div>" +
      '<div class="f-en">' + tokenize(l.en) + "</div>" +
      (l.zh ? '<div class="f-zh hidden" id="f-zh">点击「显示中文」或按空格</div>' : "") +
      (l.note ? '<div class="f-note" hidden id="f-note"><span class="note-k">讲解</span>' + esc(l.note) + "</div>" : "") +
      '<div class="f-actions">' +
      '<button class="btn" data-f="prev">← 上一句</button>' +
      '<button class="btn" data-f="speak">🔊 朗读</button>' +
      '<button class="btn" data-f="zh">显示中文</button>' +
      '<button class="btn' + (learned ? " on" : "") + '" data-f="star">标记已掌握</button>' +
      '<button class="btn primary" data-f="next">下一句 →</button>' +
      "</div>" +
      '<div class="f-progress">' + Math.round(((pos + 1) / idxs.length) * 100) + "% · 按 F 或点「列表模式」退出</div>" +
      "</div>";
  }

  function focusStep(d) {
    const idxs = visibleIndexes();
    const pos = idxs.indexOf(state.active);
    const nextPos = Math.min(idxs.length - 1, Math.max(0, pos + d));
    state.active = idxs[nextPos];
    saveCursor();
    renderFocus();
    if (d > 0) speak(state.ep.lines[state.active].en);
  }

  function focusToggleZh() {
    const zh = $("#f-zh");
    if (!zh) return;
    zh.classList.remove("hidden");
    zh.textContent = state.ep.lines[state.active].zh;
    const note = $("#f-note");
    if (note) note.hidden = false;
  }

  /* ============================================================
     9. 点词 / 短语浮层
     ============================================================ */
  const pop = () => $("#pop");

  function hidePop() {
    const el = pop();
    if (!el) return;
    el.hidden = true;
    el.innerHTML = "";
    $$(".w.lookup").forEach((n) => n.classList.remove("lookup"));
  }

  function placePop(rect) {
    const el = pop();
    el.hidden = false;
    const w = el.offsetWidth || 340;
    const h = el.offsetHeight || 220;
    let left = rect.left + rect.width / 2 - w / 2;
    left = Math.max(10, Math.min(window.innerWidth - w - 10, left));
    let top = rect.bottom + 8;
    if (top + h > window.innerHeight - 10) top = Math.max(10, rect.top - h - 8);
    el.style.left = left + "px";
    el.style.top = top + "px";
  }

  function lineAt(anchorEl) {
    const lineEl = anchorEl && anchorEl.closest ? anchorEl.closest(".line") : null;
    if (!lineEl || !state.ep) return null;
    return state.ep.lines[+lineEl.dataset.i] || null;
  }

  function showWordPop(raw, anchorEl) {
    const line = lineAt(anchorEl);
    const res = lookup(raw, line);
    res.display = anchorEl && anchorEl.textContent ? anchorEl.textContent : raw;
    renderWordPop(res, anchorEl, line);
  }

  function renderWordPop(res, anchorEl, line) {
    const inVocab = !!vocab[res.base];
    const display = res.display || res.word;
    let body;

    if (res.zh) {
      body =
        '<div class="p-top"><div><div class="p-word">' + esc(display) + "</div>" +
        '<div class="p-phon">' + (res.phon ? "/" + esc(res.phon) + "/" : "") +
        (res.local ? " · 本句译法" : res.base !== norm(display) ? " · 原形 " + esc(res.base) : "") +
        "</div></div></div>" +
        '<p class="p-zh">' + (res.pos ? '<span class="p-pos">' + esc(res.pos) + "</span>" : "") + esc(res.zh) + "</p>";
    } else {
      body =
        '<div class="p-top"><div><div class="p-word">' + esc(display) + "</div>" +
        '<div class="p-phon">词典未收录</div></div></div>' +
        '<p class="p-empty">这个词还没翻译。请按 README 的「逐词精译」补上。</p>' +
        '<div class="p-links"><a href="https://dictionary.cambridge.org/dictionary/english-chinese-simplified/' +
        encodeURIComponent(res.base) + '" target="_blank" rel="noopener">剑桥词典</a>' +
        '<a href="https://www.youdao.com/result?word=' + encodeURIComponent(res.base) +
        '&lang=en" target="_blank" rel="noopener">有道</a></div>';
    }

    const phEl = anchorEl && anchorEl.closest ? anchorEl.closest(".ph") : null;
    const phKey = res._phKey || (phEl && phEl.dataset.ph);
    res._phKey = phKey;

    const html =
      '<button class="p-close" data-close>×</button>' + body +
      (phKey && PHRASES[phKey]
        ? '<div class="p-ex" style="border-left-color:var(--accent-2)">' +
          '<p style="font-size:12px;color:var(--accent-2)">短语 ' + esc(phKey) + " · " +
          esc(PHRASES[phKey].zh) + "</p>" +
          (PHRASES[phKey].ex || [])
            .slice(0, 2)
            .map(([en, zh]) => '<small style="display:block;margin-top:4px">' + esc(en) + "<br>" + esc(zh) + "</small>")
            .join("") +
          "</div>"
        : "") +
      (line
        ? '<div class="p-ex"><p>' + highlight(line.en, res.base) + "</p><small>" + esc(line.zh) + "</small></div>"
        : "") +
      '<div class="p-actions">' +
      '<button class="btn" data-speak="' + esc(display) + '">🔊 发音</button>' +
      (inVocab
        ? '<button class="btn" data-unvocab="' + esc(res.base) + '">已加入生词本 ✓</button>'
        : '<button class="btn primary" data-addvocab="' + esc(res.base) + '">＋ 加入生词本</button>') +
      (phKey ? '<button class="btn" data-open-phrase="' + esc(phKey) + '">短语详情</button>' : "") +
      "</div>";

    const el = pop();
    el.innerHTML = html;
    el.hidden = false;
    el._ctx = { res, line, anchorEl };

    $$(".w.lookup").forEach((n) => n.classList.remove("lookup"));
    if (anchorEl && anchorEl.classList) anchorEl.classList.add("lookup");

    if (anchorEl && anchorEl.getBoundingClientRect) placePop(anchorEl.getBoundingClientRect());
  }

  function showPhrasePop(key, anchorEl) {
    let p = PHRASES[key];
    if (!p && WORD_INDEX[norm(key)]) {
      const d = parseEntry(WORD_INDEX[norm(key)]);
      p = { zh: d.zh, pos: d.pos || "phrase", note: "", ex: [] };
    }
    if (!p) {
      toast("短语库里还没有 “" + key + "”");
      return;
    }
    const el = pop();
    el.innerHTML =
      '<button class="p-close" data-close>×</button>' +
      '<div class="p-top"><div><div class="p-word">' + esc(key) + "</div>" +
      '<div class="p-phon">' + esc(p.pos || "phrase") + "</div></div></div>" +
      '<p class="p-zh">' + esc(p.zh) + "</p>" +
      (p.note ? '<div class="p-ex"><small style="color:var(--text-2)">' + esc(p.note) + "</small></div>" : "") +
      ((p.ex || [])
        .map(([en, zh]) => '<div class="p-ex"><p>' + esc(en) + "</p><small>" + esc(zh) + "</small></div>")
        .join("") ||
        '<p class="p-empty">这个短语还没有例句，可以在 phrases.js 里补上。</p>') +
      '<div class="p-actions"><button class="btn" data-speak="' + esc(key) + '">🔊 朗读</button>' +
      '<a class="btn" href="#/phrases?q=' + encodeURIComponent(key) + '">短语库</a></div>';
    el.hidden = false;
    el._ctx = { phrase: key };
    el.style.width = "min(380px, calc(100vw - 24px))";
    if (anchorEl && anchorEl.getBoundingClientRect) {
      placePop(anchorEl.getBoundingClientRect());
    } else {
      el.style.left = Math.max(10, (window.innerWidth - 380) / 2) + "px";
      el.style.top = "110px";
    }
  }

  /* ============================================================
     10. 生词本
     ============================================================ */
  function addVocab(word, line) {
    const res = lookup(word, line);
    vocab[res.base] = {
      w: res.word,
      base: res.base,
      zh: res.zh || "（待补充）",
      pos: res.pos,
      phon: res.phon,
      show: state.show ? state.show.title : "",
      showId: state.showId || "",
      s: state.sNo || 0,
      e: state.eNo || 0,
      line: line ? line.en : "",
      lineZh: line ? line.zh : "",
      added: Date.now(),
      level: 0,
    };
    saveVocab();
    toast("已加入生词本：" + res.word);
  }

  function removeVocab(base) {
    delete vocab[base];
    saveVocab();
    toast("已从生词本移除");
  }

  /* ============================================================
     11. 生词本页
     ============================================================ */
  function viewVocab() {
    const list = Object.values(vocab).sort((a, b) => (b.added || 0) - (a.added || 0));
    return (
      '<div class="wrap"><section class="section">' +
      '<div class="section-head"><h2>生词本</h2>' +
      '<span class="hint">共 ' + list.length + " 个词 · 点「开始复习」用闪卡过一遍</span></div>" +
      '<div class="vocab-head">' +
      '<button class="btn primary" id="flash-btn"' + (list.length ? "" : " disabled") + ">开始复习（闪卡）</button>" +
      '<button class="btn" id="export-vocab">导出 JSON</button>' +
      '<label class="btn" style="cursor:pointer">导入 JSON<input type="file" id="import-vocab" accept=".json" hidden></label>' +
      '<button class="btn ghost" id="clear-vocab">清空</button>' +
      "</div>" +
      (list.length
        ? '<div class="vocab-grid">' + list.map(vocabCard).join("") + "</div>"
        : '<div class="empty"><b>生词本还是空的</b>去学习页点任意单词 → 「加入生词本」。</div>') +
      "</section></div>"
    );
  }

  function vocabCard(v) {
    return (
      '<div class="vocab-card" data-v="' + esc(v.base) + '">' +
      '<button class="vc-del" data-del="' + esc(v.base) + '" title="移除">×</button>' +
      "<b>" + esc(v.w || v.base) + "</b>" +
      (v.phon ? ' <span style="font-family:var(--mono);font-size:11px;color:var(--muted)">/' + esc(v.phon) + "/</span>" : "") +
      '<div class="vc-zh">' + (v.pos ? '<span class="p-pos">' + esc(v.pos) + "</span>" : "") + esc(v.zh) + "</div>" +
      (v.line
        ? '<div class="vc-src"><em>' + esc(v.line) + "</em><br>" + esc(v.lineZh || "") + "</div>"
        : "") +
      '<div class="vc-level">' +
      [0, 1, 2, 3].map((i) => "<i" + (i < (v.level || 0) ? ' class="on"' : "") + "></i>").join("") +
      "</div></div>"
    );
  }

  /* ============================================================
     12. 短语库
     ============================================================ */
  function viewPhrases(q) {
    const qq = (q || "").toLowerCase();
    const keys = Object.keys(PHRASES).filter((k) => {
      if (!qq) return true;
      const p = PHRASES[k];
      return (
        k.toLowerCase().indexOf(qq) >= 0 ||
        (p.zh || "").indexOf(q) >= 0 ||
        (p.ex || []).some((e) => e[0].toLowerCase().indexOf(qq) >= 0)
      );
    });
    return (
      '<div class="wrap"><section class="section">' +
      '<div class="section-head"><h2>短语库</h2><span class="hint">' + keys.length +
      " 条 · 每条配不同语境的例句，点 🔊 可朗读</span></div>" +
      '<div class="vocab-head"><input id="phrase-filter" placeholder="搜索短语 / 中文 / 例句…" value="' +
      esc(q || "") + '"></div>' +
      '<div class="phrase-list">' +
      (keys.length
        ? keys
            .sort()
            .map((k) => {
              const p = PHRASES[k];
              return (
                '<div class="phrase-card"><h3>' + esc(k) + "</h3>" +
                '<div class="pc-zh">' + esc(p.zh) + "</div>" +
                (p.note ? '<div class="pc-src">' + esc(p.note) + "</div>" : "") +
                '<div class="examples">' +
                (p.ex || [])
                  .map(
                    ([en, zh]) =>
                      '<div class="example"><p>' + esc(en) + "</p><small>" + esc(zh) + "</small>" +
                      '<button class="spk" data-speak="' + esc(en) + '">🔊</button></div>'
                  )
                  .join("") +
                "</div></div>"
              );
            })
            .join("")
        : '<div class="empty"><b>没有匹配的短语</b>换个关键词试试。</div>') +
      "</div></section></div>"
    );
  }

  /* ============================================================
     13. 搜索
     ============================================================ */
  function viewSearch(q) {
    const query = norm(q);
    const lineHits = [];
    const wordHits = [];

    if (query.length >= 1) {
      allEpisodes().forEach(({ show, season, ep }) => {
        (ep.lines || []).forEach((l) => {
          if (norm(l.en).indexOf(query) >= 0 || (l.zh || "").indexOf(q) >= 0) {
            lineHits.push({ show, season, ep, l });
          }
        });
      });
      Object.keys(WORD_INDEX).forEach((k) => {
        if (k.indexOf(query) === 0 || k === query) wordHits.push(k);
      });
    }

    return (
      '<div class="wrap"><section class="section">' +
      '<div class="section-head"><h2>搜索 “' + esc(q) + "”</h2><span class=\"hint\">" +
      lineHits.length + " 条台词 · " + wordHits.length + " 个词条</span></div>" +
      (wordHits.length
        ? '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px">' +
          wordHits
            .slice(0, 24)
            .map((k) => {
              const d = parseEntry(WORD_INDEX[k]);
              return '<button class="chip" data-speak="' + esc(k) + '" style="cursor:pointer">' + esc(k) +
                " · " + esc(d.zh.split("；")[0]) + "</button>";
            })
            .join("") +
          "</div>"
        : "") +
      (lineHits.length
        ? lineHits
            .slice(0, 200)
            .map(
              (h) =>
                '<a class="result" href="#/watch/' + h.show.id + "/" + h.season + "/" + h.ep.no + '">' +
                '<div class="r-en">' + mark(h.l.en, q) + "</div>" +
                '<div class="r-zh">' + esc(h.l.zh || "") + "</div>" +
                '<div class="r-meta">' + esc(h.show.titleZh || h.show.title) + " S" + h.season + "E" + h.ep.no +
                " · " + esc(h.ep.title || "") + "</div></a>"
            )
            .join("")
        : '<div class="empty"><b>没有找到</b>试试别的关键词。</div>') +
      "</section></div>"
    );
  }

  function mark(text, q) {
    const safe = esc(text);
    if (!q) return safe;
    try {
      return safe.replace(new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi"), "<mark>$1</mark>");
    } catch (e) {
      return safe;
    }
  }

  /* ============================================================
     14. 帮助
     ============================================================ */
  function viewHelp() {
    return (
      '<div class="wrap"><div class="doc">' +
      "<h1>怎么用</h1>" +
      '<div class="callout">核心循环：<b>听 → 猜 → 点 → 记 → 复述</b>。一句一句来，别一次看整集。</div>' +

      "<h2>一、两种模式</h2>" +
      "<p>学习页顶部有两个标签：</p><ul>" +
      "<li><b>全部台词</b>：这一集的每一句都在，逐句英中对照，适合完整过一遍剧情。</li>" +
      "<li><b>精选精讲</b>：只保留当集的难点、重点句（每集 20–35 句），并给出语法/语气讲解，" +
      "适合复习和精读。这些句子是数据里人工挑的，不是自动筛的。</li>" +
      "</ul>" +
      "<p>快捷键 <kbd>P</kbd> 可在两种模式间切换，切到精讲时编号会变成 1、2、3…。</p>" +

      "<h2>二、学习页的按钮</h2>" +
      "<table><tr><th>操作</th><th>作用</th></tr>" +
      "<tr><td>点单词</td><td>看这个单词<b>在本句中的</b>中文释义；若本句有专门译法，会标「本句译法」</td></tr>" +
      "<tr><td>点虚线短语</td><td>打开短语卡：释义 + 多个不同语境的例句</td></tr>" +
      "<tr><td>「中文隐藏 / 常显」</td><td>切换整集的中文显示策略（讲解默认跟着中文一起出现）</td></tr>" +
      "<tr><td>✓ 按钮</td><td>把这一句标记为「已掌握」，进度累计到剧集卡片</td></tr>" +
      "<tr><td>🔊 按钮</td><td>朗读整句（浏览器语音，可调语速）</td></tr>" +
      "<tr><td>逐句模式 / 列表模式</td><td>大字号一句一句过，适合精听和跟读；再点一下回到列表</td></tr>" +
      "<tr><td>点台词空白处</td><td>把那一句设为「当前句」（高亮），再开逐句模式就从这里开始；位置会被记住</td></tr>" +
      "</table>" +

      "<h2>三、快捷键</h2>" +
      "<table><tr><th>键</th><th>作用</th></tr>" +
      "<tr><td><kbd>J</kbd> / <kbd>↓</kbd></td><td>下一句（切当前句）</td></tr>" +
      "<tr><td><kbd>K</kbd> / <kbd>↑</kbd></td><td>上一句（切当前句）</td></tr>" +
      "<tr><td><kbd>空格</kbd></td><td>显示当前句中文 / 下一句</td></tr>" +
      "<tr><td><kbd>S</kbd></td><td>朗读当前句</td></tr>" +
      "<tr><td><kbd>M</kbd></td><td>标记当前句已掌握</td></tr>" +
      "<tr><td><kbd>F</kbd></td><td>切换逐句模式 / 列表模式</td></tr>" +
      "<tr><td><kbd>P</kbd></td><td>切换「全部台词 / 精选精讲」</td></tr>" +
      "<tr><td><kbd>/</kbd></td><td>跳到搜索框</td></tr>" +
      "<tr><td><kbd>Esc</kbd></td><td>关闭弹层</td></tr></table>" +

      "<h2>四、高效学习建议</h2><ul>" +
      "<li><b>先听再看</b>：每集先用逐句模式盲听一遍，再看字幕。</li>" +
      "<li><b>两遍法</b>：第一遍用「全部台词」过剧情，第二遍用「精选精讲」抠语法。</li>" +
      "<li><b>短语优先</b>：单词记不住没关系，短语和整句更容易迁移。右侧「本集短语」就是当集清单。</li>" +
      "<li><b>只标记真会的句子</b>：✓ 是给自己看的，别为了进度乱点。</li>" +
      "<li><b>每天过一遍生词本</b>：闪卡模式，想不起来就回原句。</li>" +
      "</ul>" +

      "<h2>五、加新剧集 / 新集数</h2>" +
      "<p>本项目的字幕与翻译由 AI 按 <code>README.md</code> 的规范准备好后放进来，页面不提供在线导入。</p>" +
      "<p>看 <code>README.md</code> 的「数据规范」一节，里面写清了：</p><ul>" +
      "<li>怎么下载英文字幕（SRT 来源与注意事项）；</li>" +
      "<li>怎么逐句翻译、怎么保证<b>每个单词</b>都有中文；</li>" +
      "<li>数据文件的确切格式与校验命令。</li>" +
      "</ul>" +
      "</div></div>"
    );
  }

  function notFound(msg) {
    return (
      '<div class="wrap"><div class="empty" style="margin-top:60px"><b>' + esc(msg || "页面不存在") +
      '</b><a class="btn" href="#/" style="margin-top:16px">回到首页</a></div></div>'
    );
  }

  /* ============================================================
     15. 路由
     ============================================================ */
  function parseHash() {
    const h = location.hash.replace(/^#/, "") || "/";
    const [path, qs] = h.split("?");
    const parts = path.split("/").filter(Boolean);
    return { parts, params: new URLSearchParams(qs || "") };
  }

  function render() {
    const { parts, params } = parseHash();
    const app = $("#app");
    let html = "";
    let nav = "home";

    hidePop();

    if (parts.length === 0) html = viewHome();
    else if (parts[0] === "show") html = viewShow(parts[1], parts[2]);
    else if (parts[0] === "watch") html = viewWatch(parts[1], parts[2], parts[3]);
    else if (parts[0] === "vocab") {
      html = viewVocab();
      nav = "vocab";
    } else if (parts[0] === "phrases") {
      html = viewPhrases(params.get("q") || "");
      nav = "phrases";
    } else if (parts[0] === "help") {
      html = viewHelp();
      nav = "help";
    } else if (parts[0] === "search") html = viewSearch(params.get("q") || "");
    else html = notFound();

    app.innerHTML = html;
    window.scrollTo(0, 0);

    $$("#nav a").forEach((a) => a.classList.toggle("active", a.dataset.nav === nav));
    if (parts[0] === "watch") afterWatchRender();
    if (parts[0] === "vocab") afterVocabRender();
  }

  /* ============================================================
     16. 事件
     ============================================================ */
  document.addEventListener("click", function (e) {
    const t = e.target;

    if (t.closest("#theme-btn")) {
      settings.theme = settings.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = settings.theme;
      saveSettings();
      return;
    }

    const seasonTab = t.closest(".season-tab");
    if (seasonTab) {
      const { parts } = parseHash();
      location.hash = "#/show/" + parts[1] + "/" + seasonTab.dataset.season;
      return;
    }

    /* 模式切换 */
    const modeTab = t.closest(".mode-tab");
    if (modeTab && !modeTab.disabled) {
      const m = modeTab.dataset.mode;
      if (m !== state.mode) {
        state.mode = m;
        settings.mode = m;
        saveSettings();
        $$(".mode-tab").forEach((b) => b.classList.toggle("active", b === modeTab));
        // 切到另一个模式时，把当前句切到那个模式各自记住的位置
        const p = progress[epKey(state.showId, state.sNo, state.eNo)] || {};
        const saved = p[m === "pick" ? "cursorPick" : "cursorAll"];
        if (typeof saved === "number") state.active = saved;
        if (state.focus) {
          const idxs = visibleIndexes();
          if (idxs.indexOf(state.active) < 0) state.active = idxs[0] || 0;
          renderFocus();
        } else {
          // 切换到另一模式时，重新渲染并自动滚动到激活的卡片
          renderLines(true);
        }
      }
      return;
    }

    const tg = t.closest(".tool-group button");
    if (tg) {
      const group = tg.closest(".tool-group").dataset.group;
      const val = tg.dataset.val;
      $$(".tool-group[data-group='" + group + "'] button").forEach((b) => b.classList.toggle("on", b === tg));
      if (group === "zh") {
        settings.zhAuto = val === "on";
        saveSettings();
        applyZhMode();
      } else if (group === "filter") {
        state.filter = val;
        applyFilter();
      }
      return;
    }

    if (t.closest("#focus-btn")) {
      state.focus = !state.focus;
      if (state.focus) {
        const first = $(".line.active") || $(".line");
        state.active = first ? +first.dataset.i : 0;
        renderFocus();
        $("#focus-btn").textContent = "列表模式";
      } else {
        render();
      }
      return;
    }

    /* 浮层内按钮 */
    if (t.closest("#pop")) {
      if (t.closest("[data-close]")) return hidePop();
      const sp = t.closest("[data-speak]");
      if (sp) return speak(sp.dataset.speak);
      const uv = t.closest("[data-unvocab]");
      if (uv) {
        removeVocab(uv.dataset.unvocab);
        return hidePop();
      }
      const av = t.closest("[data-addvocab]");
      if (av) {
        const ctx = pop()._ctx || {};
        const anchor = ctx.anchorEl;
        const rect = anchor && anchor.getBoundingClientRect ? anchor.getBoundingClientRect() : null;
        addVocab(av.dataset.addvocab, ctx.line);
        const res = ctx.res || lookup(av.dataset.addvocab, ctx.line);
        renderWordPop(res, anchor && anchor.isConnected ? anchor : null, ctx.line);
        if (rect && !(anchor && anchor.isConnected)) placePop(rect);
        return;
      }
      const op = t.closest("[data-open-phrase]");
      if (op) {
        const target = $('.ph[data-ph="' + op.dataset.openPhrase + '"]');
        return showPhrasePop(op.dataset.openPhrase, target);
      }
      return;
    }

    /* 台词内操作 */
    const act = t.closest("[data-act]");
    if (act && t.closest(".line")) {
      const line = act.closest(".line");
      const i = +line.dataset.i;
      const a = act.dataset.act;
      // 点卡片内的任何操作（查看中文 / 朗读 / 标记）都把这一句设为当前句，
      // 让「激活效果」跟着点击出现，而不是只有点卡片空白处才高亮。
      setActiveLine(line, false);
      if (a === "zh") {
        const zh = $(".zh", line);
        const note = $(".note-box", line);
        if (zh) {
          const willShow = zh.hidden;
          zh.hidden = !willShow;
          // 按钮文字跟着状态走，点开还能点回去
          act.textContent = willShow ? "收起中文" : "中文已隐藏 · 点击查看";
        }
        if (note) note.classList.toggle("hidden-note", !zh || zh.hidden);
      } else if (a === "speak") speak(state.ep.lines[i].en);
      else if (a === "star") toggleLearned(i);
      return;
    }

    /* 点台词正文空白处：把这一句设为当前句，并记住位置。
       这里不滚动——用户已经看着这条了，滚了反而会跳。 */
    const lineEl = t.closest(".line");
    if (lineEl && !t.closest(".ln-tools") && !t.closest(".en .w") && !t.closest(".ph")) {
      setActiveLine(lineEl, false);
      return;
    }

    const w = t.closest(".en .w, .f-en .w");
    if (w) {
      e.preventDefault();
      const wLine = w.closest(".line");
      if (wLine) setActiveLine(wLine, false);
      showWordPop(w.textContent || w.dataset.w, w);
      return;
    }

    const ph = t.closest(".ph");
    if (ph) {
      e.preventDefault();
      const phLine = ph.closest(".line");
      if (phLine) setActiveLine(phLine, false);
      showPhrasePop(ph.dataset.ph, ph);
      return;
    }

    const f = t.closest("[data-f]");
    if (f) {
      const k = f.dataset.f;
      if (k === "prev") focusStep(-1);
      else if (k === "next") focusStep(1);
      else if (k === "speak") speak(state.ep.lines[state.active].en);
      else if (k === "zh") focusToggleZh();
      else if (k === "star") {
        const nowLearned = toggleLearned(state.active);
        // 点「已掌握」标记后自动跳到下一句；取消标记则留在当前句
        if (nowLearned) {
          focusStep(1);
        } else {
          // 就地更新按钮状态，避免整块重绘抖动
          f.classList.remove("on");
        }
      }
      return;
    }

    const del = t.closest("[data-del]");
    if (del) {
      e.preventDefault();
      removeVocab(del.dataset.del);
      const card = del.closest(".vocab-card");
      if (card) card.remove();
      return;
    }

    const pm = t.closest("[data-phrase]");
    if (pm) return showPhrasePop(pm.dataset.phrase, pm);

    const sp2 = t.closest("[data-speak]");
    if (sp2) return speak(sp2.dataset.speak);

    if (pop() && !pop().hidden) hidePop();
  });

  document.addEventListener("dblclick", function (e) {
    const ph = e.target.closest(".ph");
    if (ph) {
      e.preventDefault();
      showPhrasePop(ph.dataset.ph, ph);
      return;
    }
    /* 列表模式双击句子卡片：切换「已掌握」标记
       （工具按钮、词、短语等交互元素除外，避免误触） */
    const line = e.target.closest?.(".line");
    if (line && state && !state.focus &&
        !e.target.closest(".ln-tools") && !e.target.closest(".en .w") && !e.target.closest(".ph")) {
      e.preventDefault();
      toggleLearned(+line.dataset.i);
    }
  });

  document.addEventListener("input", function (e) {
    const t = e.target;
    if (t.id === "rate") {
      settings.rate = +t.value;
      const v = $("#rate-val");
      if (v) v.textContent = settings.rate.toFixed(2);
      saveSettings();
    } else if (t.id === "phrase-filter") {
      const q = t.value.trim().toLowerCase();
      $$(".phrase-card").forEach((card) => {
        card.style.display = !q || card.textContent.toLowerCase().indexOf(q) >= 0 ? "" : "none";
      });
    }
  });

  document.addEventListener("keydown", function (e) {
    const tag = (e.target.tagName || "").toLowerCase();
    const typing = tag === "input" || tag === "textarea" || e.target.isContentEditable;

    if (e.key === "/" && !typing) {
      e.preventDefault();
      const s = $("#search-input");
      if (s) s.focus();
      return;
    }
    if (e.key === "Escape") return hidePop();
    if (typing) return;
    if (!state.ep || parseHash().parts[0] !== "watch") return;

    const k = e.key.toLowerCase();
    /* J = 上一句，K = 下一句；方向键保持直觉（↓ 下、↑ 上） */
    if (k === "j" || e.key === "ArrowUp") {
      e.preventDefault();
      if (state.focus) focusStep(-1);
      else moveActive(-1);
    } else if (k === "k" || e.key === "ArrowDown") {
      e.preventDefault();
      if (state.focus) focusStep(1);
      else moveActive(1);
    } else if (e.key === " ") {
      e.preventDefault();
      if (state.focus) {
        const zh = $("#f-zh");
        if (zh && zh.classList.contains("hidden")) focusToggleZh();
        else focusStep(1);
      } else {
        const line = $(".line.active") || $(".line");
        if (!line) return;
        const zh = $(".zh", line);
        if (zh && zh.hidden) {
          zh.hidden = false;
          const b = $(".zh-btn", line);
          if (b) b.textContent = "收起中文";
          const note = $(".note-box", line);
          if (note) note.classList.remove("hidden-note");
        } else moveActive(1);
      }
    } else if (k === "s") {
      const i = state.focus ? state.active : +($(".line.active") || { dataset: { i: 0 } }).dataset.i;
      speak(state.ep.lines[i].en);
    } else if (k === "m") {
      const i = state.focus ? state.active : +($(".line.active") || { dataset: { i: 0 } }).dataset.i;
      toggleLearned(i);
      if (state.focus) renderFocus();
    } else if (k === "f") {
      const b = $("#focus-btn");
      if (b) b.click();
    } else if (k === "p") {
      const tab = $(".mode-tab[data-mode='" + (state.mode === "all" ? "pick" : "all") + "']");
      if (tab && !tab.disabled) tab.click();
    }
  });

  /* 记住“这一集上次停在哪一句”。
     全部台词 / 精选精讲 各记各的，避免互相覆盖：
     两个模式显示的句子集合不同，当前句应当各自单独记住。 */
  function saveCursor() {
    if (!state.ep) return;
    const key = epKey(state.showId, state.sNo, state.eNo);
    const p = progress[key] || (progress[key] = {});
    p[state.mode === "pick" ? "cursorPick" : "cursorAll"] = state.active;
    saveProgress();
  }

  function setActiveLine(line, scroll) {
    if (!line) return;
    $$(".line").forEach((l) => l.classList.remove("active"));
    line.classList.add("active");
    state.active = +line.dataset.i;
    saveCursor();
    if (scroll !== false) scrollLineIntoView(line);
  }

  function moveActive(d) {
    const lines = $$(".line").filter((l) => l.style.display !== "none");
    if (!lines.length) return;
    let cur = lines.findIndex((l) => l.classList.contains("active"));
    if (cur < 0) cur = -1;
    const next = Math.min(lines.length - 1, Math.max(0, cur + d));
    setActiveLine(lines[next]);
  }

  document.addEventListener("submit", function (e) {
    if (e.target.id === "search-form") {
      e.preventDefault();
      const q = $("#search-input").value.trim();
      if (q) location.hash = "#/search?q=" + encodeURIComponent(q);
    }
  });

  document.documentElement.dataset.theme = settings.theme;

  window.addEventListener("resize", syncHeadOffset);

  /* ============================================================
     17. 学习页初始化
     ============================================================ */
  function afterWatchRender() {
    // 重新打开这一集：要滚到上次那一句
    renderLines(true);
    state.focus = false;
    syncHeadOffset();
  }

  /* 表头是 sticky 的，高度会随内容变化（快捷键换行、字号等）。
     把真实高度写进 --head-h，侧栏 sticky top 和滚动避让都用它。 */
  let headRO = null;
  function syncHeadOffset() {
    const head = $(".watch-head");
    if (!head) {
      document.documentElement.style.removeProperty("--head-h");
      if (headRO) { headRO.disconnect(); headRO = null; }
      return;
    }
    const h = Math.round(head.getBoundingClientRect().height) || 0;
    document.documentElement.style.setProperty("--head-h", h + "px");
    // 表头内容变化（如快捷键换行）时高度会变，持续跟踪
    if (typeof ResizeObserver !== "undefined" && !headRO) {
      headRO = new ResizeObserver(() => {
        const nh = Math.round(head.getBoundingClientRect().height) || 0;
        if (nh) document.documentElement.style.setProperty("--head-h", nh + "px");
      });
      headRO.observe(head);
    }
  }

  function applyZhMode() {
    $$(".line").forEach((line) => {
      const l = state.ep.lines[+line.dataset.i];
      const wrap = $(".zh-wrap", line);
      const note = $(".note-box", line);
      if (!wrap || !l) return;
      wrap.innerHTML = settings.zhAuto
        ? '<p class="zh">' + esc(l.zh) + "</p>"
        : '<button class="zh-btn" data-act="zh">中文已隐藏 · 点击查看</button>' +
          '<p class="zh" hidden>' + esc(l.zh) + "</p>";
      if (note) note.classList.toggle("hidden-note", !settings.zhAuto);
    });
  }

  function applyFilter() {
    if (!state.ep) return;
    const learned = (progress[epKey(state.showId, state.sNo, state.eNo)] || {}).learned || [];
    $$(".line").forEach((line) => {
      const isLearned = learned.indexOf(+line.dataset.i) >= 0;
      line.style.display =
        state.filter === "all" ||
        (state.filter === "todo" && !isLearned) ||
        (state.filter === "done" && isLearned)
          ? ""
          : "none";
    });
  }

  function toggleLearned(i) {
    const key = epKey(state.showId, state.sNo, state.eNo);
    const p = progress[key] || { learned: [] };
    p.learned = p.learned || [];
    const at = p.learned.indexOf(i);
    if (at >= 0) {
      p.learned.splice(at, 1);
      toast("已取消标记");
    } else {
      p.learned.push(i);
      toast("已掌握 " + (i + 1) + " / " + state.ep.lines.length);
    }
    progress[key] = p;
    saveProgress();

    const line = $("#ln-" + i);
    if (line) {
      const on = p.learned.indexOf(i) >= 0;
      line.classList.toggle("learned", on);
      const b = $("[data-act='star']", line);
      if (b) b.classList.toggle("on", on);
    }
    const r = epProgress(state.showId, state.sNo, state.ep);
    const ring = $(".side .ring");
    if (ring) {
      ring.style.setProperty("--p", r.pct);
      const span = ring.querySelector("span");
      if (span) span.textContent = r.pct + "%";
    }
    // 同步进度面板里的「X / Y 句」计数
    const countB = $(".side .ep-progress b");
    if (countB) countB.textContent = r.done + " / " + r.total + " 句";
    applyFilter();
    return p.learned.indexOf(i) >= 0;
  }

  /* ============================================================
     18. 生词本页
     ============================================================ */
  function afterVocabRender() {
    const btn = $("#flash-btn");
    if (btn)
      btn.onclick = () => {
        const list = Object.values(vocab);
        if (list.length) startFlash(list);
      };

    const exp = $("#export-vocab");
    if (exp)
      exp.onclick = () => {
        const blob = new Blob([JSON.stringify(vocab, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "screenlingo-vocab.json";
        a.click();
        URL.revokeObjectURL(a.href);
      };

    const imp = $("#import-vocab");
    if (imp)
      imp.onchange = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        const fr = new FileReader();
        fr.onload = () => {
          try {
            const data = JSON.parse(fr.result);
            Object.keys(data).forEach((k) => (vocab[k] = data[k]));
            saveVocab();
            toast("已导入 " + Object.keys(data).length + " 个词");
            render();
          } catch (err) {
            toast("文件格式不对");
          }
        };
        fr.readAsText(f);
      };

    const clr = $("#clear-vocab");
    if (clr)
      clr.onclick = () => {
        if (!confirm("确定清空生词本？此操作不可撤销。")) return;
        vocab = {};
        saveVocab();
        render();
      };
  }

  function startFlash(list) {
    let i = 0;
    const root = $("#modal-root");
    root.innerHTML =
      '<div class="modal-mask" id="flash-mask"><div class="modal">' +
      '<button class="close" data-x>×</button>' +
      "<h2>生词复习</h2>" +
      '<div class="modal-sub" id="flash-sub"></div>' +
      '<div class="flash-card" id="flash-card"><div class="fc-word" id="fc-word"></div>' +
      '<div class="fc-phon" id="fc-phon"></div><div class="fc-zh" id="fc-zh" hidden></div>' +
      '<div class="fc-hint" id="fc-hint">点击卡片翻面</div></div>' +
      '<div class="flash-actions"><button class="btn" id="flash-again">再看看</button>' +
      '<button class="btn primary" id="flash-known">记住了</button></div>' +
      "</div></div>";

    const paint = () => {
      const v = list[i];
      $("#fc-word").textContent = v.w || v.base;
      $("#fc-phon").textContent = v.phon ? "/" + v.phon + "/" : "";
      const zh = $("#fc-zh");
      zh.textContent = (v.pos ? "(" + v.pos + ") " : "") + v.zh;
      zh.hidden = true;
      $("#fc-hint").textContent = "点击卡片翻面";
      $("#flash-sub").textContent = i + 1 + " / " + list.length;
    };
    const flip = () => {
      $("#fc-zh").hidden = false;
      const v = list[i];
      $("#fc-hint").textContent = v.line ? v.line + (v.lineZh ? " ｜ " + v.lineZh : "") : "";
    };
    const next = (known) => {
      const v = list[i];
      if (v && v.base && vocab[v.base]) {
        vocab[v.base].level = Math.min(3, (vocab[v.base].level || 0) + (known ? 1 : 0));
        saveVocab();
      }
      i = (i + 1) % list.length;
      paint();
    };

    $("#flash-card").onclick = flip;
    $("#flash-known").onclick = () => next(true);
    $("#flash-again").onclick = () => next(false);
    $("[data-x]").onclick = () => (root.innerHTML = "");
    $("#flash-mask").onclick = (e) => {
      if (e.target.id === "flash-mask") root.innerHTML = "";
    };
    paint();
  }

  /* ============================================================
     19. 启动
     ============================================================ */
  window.addEventListener("hashchange", render);
  window.addEventListener("resize", hidePop);
  window.addEventListener("scroll", () => {
    const p = pop();
    if (p && !p.hidden) hidePop();
  }, { passive: true });

  render();
})();

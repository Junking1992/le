#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
apply-translations.py — 把 translations/ 下的译文合并进 assets/js/data/ 的剧集文件

用法：
    python tools/apply-translations.py --show pb --season 2

流程：
    translations/pb-s2/e01.json  （AI 产出：{"zh": [...], "notes": {...}, "picks": [...]}）
        ↓  按句子下标对齐
    assets/js/data/pb-s2/e01.js  （页面读取的数据文件）

说明：
    - zh 数组按句子顺序一一对应；缺的留空（页面会显示“待翻译”）。
    - notes 是 {句子下标: "讲解"}。
    - picks 是精选句下标。
    - 每次运行都整体重写数据文件，所以可以反复增量补充。
"""

import argparse
import json
import os
import re
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

TITLES = {
    1: ("Manhunt", "追捕"), 2: ("Otis", "奥蒂斯"), 3: ("Scan", "扫描"),
    4: ("First Down", "首攻"), 5: ("Map 1213", "1213号地图"), 6: ("Subdivision", "小区"),
    7: ("Buried", "埋藏"), 8: ("Dead Fall", "坠落"), 9: ("Unearthed", "出土"),
    10: ("Rendezvous", "会合"), 11: ("Bolshoi Booze", "博尔绍伊之酒"), 12: ("Disconnect", "断线"),
    13: ("The Killing Box", "杀人盒"), 14: ("John Doe", "无名氏"), 15: ("The Message", "消息"),
    16: ("Chicago", "芝加哥"), 17: ("Bad Blood", "坏血"), 18: ("Wash", "洗刷"),
    19: ("Sweet Caroline", "亲爱的卡罗琳"), 20: ("Panama", "巴拿马"),
    21: ("Fin Del Camino", "卡米诺尽头"), 22: ("Sona", "索纳"),
}

META_OBJ = {
    "id": "pb", "title": "Prison Break", "titleZh": "越狱", "year": "2005",
    "genre": "犯罪 / 剧情", "network": "FOX",
    "tagline": "八个人逃出了狐狸河监狱，但真正的牢笼才刚刚开始。",
    "desc": "迈克尔·斯科菲尔德为救被判死刑的哥哥林肯，带着精心设计的纹身入狱，策划了一场惊天越狱。第二季里，八名逃犯在全美追捕下各自逃亡。",
    "posterText": "PRISON BREAK",
    "poster": "linear-gradient(150deg,#3a1d1d,#14161d)",
    "glow": "rgba(232,178,92,.16)",
}


def js_str(s):
    return json.dumps(s, ensure_ascii=False)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--show", default="pb")
    ap.add_argument("--season", type=int, default=2)
    ap.add_argument("--src", default="", help="clean/*.json 目录（提供英文）")
    ap.add_argument("--tr", default="", help="translations 目录")
    ap.add_argument("--out", default="", help="输出目录")
    args = ap.parse_args()

    src = args.src or ("clean/" + args.show)
    tr = args.tr or ("translations/%s-s%d" % (args.show, args.season))
    out = args.out or ("assets/js/data/%s-s%d" % (args.show, args.season))
    const = (args.show + "_S%d_META" % args.season).upper()

    if not os.path.isdir(src):
        sys.exit("找不到英文源目录：" + src)
    os.makedirs(out, exist_ok=True)

    total = translated = noted = picked = 0
    rows = []

    for fn in sorted(os.listdir(src)):
        if not fn.endswith(".json"):
            continue
        m = re.search(r"E(\d+)", fn, re.I)
        if not m:
            continue
        no = int(m.group(1))
        en_list = json.load(open(os.path.join(src, fn), encoding="utf-8"))
        title, title_zh = TITLES.get(no, ("Episode %d" % no, ""))

        tr_path = os.path.join(tr, "e%02d.json" % no)
        zh_list, notes, picks, wmaps = [], {}, [], {}
        if os.path.exists(tr_path):
            t = json.load(open(tr_path, encoding="utf-8"))
            zh_list = t.get("zh") or []
            notes = t.get("notes") or {}
            picks = t.get("picks") or []
            # 可选的逐词精译：{"句子下标": {"单词": "本句译法"}}
            wmaps = t.get("w") or {}

        lines = []
        filled = 0
        for i, item in enumerate(en_list):
            en = item["en"].strip()
            zh = zh_list[i].strip() if i < len(zh_list) and zh_list[i] else ""
            if zh:
                filled += 1
            note = notes.get(str(i), "")
            w = wmaps.get(str(i)) or {}
            lines.append({"en": en, "zh": zh, "note": note, "w": w})

        picks = [p for p in picks if 0 <= p < len(lines)]

        total += len(lines)
        translated += filled
        noted += sum(1 for l in lines if l["note"])
        picked += len(picks)

        body = []
        body.append("/* ============================================================\n")
        body.append("   %s S%02dE%02d · %s（%s）\n" % (args.show, args.season, no, title, title_zh))
        body.append("   ------------------------------------------------------------\n")
        body.append("   由 tools/apply-translations.py 生成，请勿手改。\n")
        body.append("   改译文：编辑 translations/%s-s%d/e%02d.json 后重新运行脚本。\n" % (args.show, args.season, no))
        body.append("   ============================================================ */\n\n")
        body.append("(function () {\n")
        body.append("  var META = %s;\n\n" % json.dumps(META_OBJ, ensure_ascii=False))
        body.append("  registerEpisode(META, %d, {\n" % args.season)
        body.append("    no: %d,\n" % no)
        body.append("    title: %s,\n" % js_str(title))
        body.append("    titleZh: %s,\n" % js_str(title_zh))
        body.append("    lines: [\n")
        for it in lines:
            s = "      { en: %s, zh: %s" % (js_str(it["en"]), js_str(it["zh"]))
            if it["note"]:
                s += ", note: %s" % js_str(it["note"])
            if it["w"]:
                s += ", w: %s" % json.dumps(it["w"], ensure_ascii=False)
            s += " },\n"
            body.append(s)
        body.append("    ],\n")
        body.append("    picks: [%s]\n" % ", ".join(str(p) for p in picks))
        body.append("  });\n")
        body.append("})();\n")

        with open(os.path.join(out, "e%02d.js" % no), "w", encoding="utf-8") as f:
            f.write("".join(body))

        pct = filled / max(1, len(lines)) * 100
        rows.append((no, title, len(lines), filled, pct, len(picks)))
        print("  E%02d %-20s %3d 句 · 译 %3d (%5.1f%%) · 讲解 %3d · 精选 %2d"
              % (no, title, len(lines), filled, pct,
                 sum(1 for l in lines if l["note"]), len(picks)))

    print("\n" + "=" * 62)
    print("合计 %d 句 · 已译 %d (%.1f%%) · 讲解 %d · 精选 %d"
          % (total, translated, translated / max(1, total) * 100, noted, picked))
    print("输出：" + os.path.abspath(out))


if __name__ == "__main__":
    main()

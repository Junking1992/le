#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""check-ep.py — 单集校验（清洗数据 / 译文 / 词形覆盖）

用法：
    python tools/check-ep.py 3 4     # 校验 S3 的 E04

检查：
    1. 译文句数与英文句数一致，无空译
    2. notes 的 key 在范围内，picks 升序无重复且在范围内
    3. 英文里没混入中文
    4. 每个词形都能在 words.js 里查到
"""
import json
import os
import re
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def main():
    if len(sys.argv) < 3:
        sys.exit("用法：python tools/check-ep.py <season> <ep> [ep...]")
    season = int(sys.argv[1])
    eps = [int(x) for x in sys.argv[2:]]

    words_src = open(os.path.join(root, "assets/js/data/words.js"), encoding="utf-8").read()
    keys = set(re.findall(r'^\s*"([^"]+)"\s*:', words_src, re.M))

    allok = True
    for ep in eps:
        en_path = os.path.join(root, "clean/pb/S%02dE%02d.json" % (season, ep))
        tr_path = os.path.join(root, "translations/pb-s%d/e%02d.json" % (season, ep))
        en = json.load(open(en_path, encoding="utf-8"))
        if not os.path.exists(tr_path):
            print("E%02d 缺少译文文件" % ep)
            allok = False
            continue
        t = json.load(open(tr_path, encoding="utf-8"))
        zh, notes, picks = t.get("zh") or [], t.get("notes") or {}, t.get("picks") or []
        errs = []

        if len(zh) != len(en):
            errs.append("句数不符 en %d zh %d" % (len(en), len(zh)))
        empty = [i for i, z in enumerate(zh) if not str(z).strip()]
        if empty:
            errs.append("空译 %d 处：%s" % (len(empty), empty[:8]))
        bad_note = [k for k in notes if not (k.isdigit() and 0 <= int(k) < len(en))]
        if bad_note:
            errs.append("notes 越界：%s" % bad_note[:8])
        if picks != sorted(set(picks)):
            errs.append("picks 未升序或重复")
        if not all(0 <= p < len(en) for p in picks):
            errs.append("picks 越界")
        # 英文混入中文
        cjk = [i for i, x in enumerate(en) if re.search(r"[\u4e00-\u9fff]", x["en"])]
        if cjk:
            errs.append("英文含中文：%s" % cjk[:5])
        # 词形覆盖
        miss = {}
        for x in en:
            for tok in re.findall(r"[A-Za-z]+(?:'[A-Za-z]+)*", x["en"]):
                k = tok.lower()
                if k not in keys:
                    miss[k] = miss.get(k, 0) + 1
        if miss:
            errs.append("缺词形 %d 个：%s" % (len(miss), sorted(miss, key=lambda v: -miss[v])[:15]))

        if errs:
            allok = False
            print("E%02d ✗ %s" % (ep, "；".join(errs)))
        else:
            print("E%02d ✓ %d 句 · 译 %d · 讲解 %d · 精选 %d · 词形全覆盖"
                  % (ep, len(en), len(zh), len(notes), len(picks)))
    return 0 if allok else 1


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""list-missing.py — 列出某季若干集里 words.js 缺少的词形（按频次降序）

用法：
    python tools/list-missing.py 3 4 5 6

输出可直接用于产出 tools/wdict/wN.js。
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
        sys.exit("用法：python tools/list-missing.py <season> <ep> [ep...]")
    season = int(sys.argv[1])
    eps = [int(x) for x in sys.argv[2:]]

    src = open(os.path.join(root, "assets/js/data/words.js"), encoding="utf-8").read()
    keys = set(re.findall(r'^\s*"([^"]+)"\s*:', src, re.M))

    miss = {}
    for ep in eps:
        p = os.path.join(root, "clean/pb/S%02dE%02d.json" % (season, ep))
        for x in json.load(open(p, encoding="utf-8")):
            for tok in re.findall(r"[A-Za-z]+(?:'[A-Za-z]+)*", x["en"]):
                k = tok.lower()
                if k not in keys:
                    miss[k] = miss.get(k, 0) + 1

    print("缺 %d 个词形" % len(miss))
    for k in sorted(miss, key=lambda v: (-miss[v], v)):
        print("%s %d" % (k, miss[k]))


if __name__ == "__main__":
    main()

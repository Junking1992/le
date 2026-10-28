#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""_show.py - 打印某一集带编号的英文台词，方便逐句翻译

用法:
    python tools/_show.py S02E11
    python tools/_show.py S02E11 0 200
    python tools/_show.py 11
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

arg = sys.argv[1] if len(sys.argv) > 1 else "1"
m = re.search(r"(\d+)", arg)
ep = int(m.group(1)) if m else 1
start = int(sys.argv[2]) if len(sys.argv) > 2 else 0
end = int(sys.argv[3]) if len(sys.argv) > 3 else None

path = os.path.join(root, "clean", "pb", "S02E%02d.json" % ep)
d = json.load(open(path, encoding="utf-8"))
if end is None or end > len(d):
    end = len(d)
print("S02E%02d  total %d sentences" % (ep, len(d)))
for i in range(start, end):
    print("%d|%s" % (i, d[i]["en"]))

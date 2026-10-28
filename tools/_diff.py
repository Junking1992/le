#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""_diff.py - 检查某一集英文与中文条数是否对齐

用法:
    python tools/_diff.py e11
    python tools/_diff.py 11
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

clean_path = os.path.join(root, "clean", "pb", "S02E%02d.json" % ep)
tr_path = os.path.join(root, "translations", "pb-s2", "e%02d.json" % ep)

en = json.load(open(clean_path, encoding="utf-8"))
if not os.path.exists(tr_path):
    print("en %d zh 0  (missing translations/pb-s2/e%02d.json)" % (len(en), ep))
    sys.exit(1)

d = json.load(open(tr_path, encoding="utf-8"))
zh = d.get("zh") or []
print("en %d zh %d" % (len(en), len(zh)))

if len(en) != len(zh):
    n = min(len(en), len(zh))
    for i in range(n, len(en)):
        print("  missing %d: %s" % (i, en[i]["en"][:70]))
    for i in range(n, len(zh)):
        print("  extra   %d: %s" % (i, str(zh[i])[:40]))
    sys.exit(1)

empty = [i for i, s in enumerate(zh) if not str(s).strip()]
if empty:
    print("empty %d: %s" % (len(empty), empty[:20]))
    sys.exit(1)

print("OK - notes %d - picks %d" % (len(d.get("notes") or {}), len(d.get("picks") or [])))

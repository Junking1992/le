#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""check-all.py — 一次性检查所有译文文件与英文句数是否对齐

用法：
    python tools/check-all.py
"""
import glob
import json
import os
import re
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

rows = []
for cf in sorted(glob.glob(os.path.join(root, "clean", "pb", "S02E*.json"))):
    name = os.path.splitext(os.path.basename(cf))[0]
    n = len(json.load(open(cf, encoding="utf-8")))
    m = re.search(r"E(\d+)", name)
    ep = int(m.group(1)) if m else 0
    tf = os.path.join(root, "translations", "pb-s2", "e%02d.json" % ep)
    if not os.path.exists(tf):
        rows.append((ep, n, None, None, None, "缺文件"))
        continue
    try:
        d = json.load(open(tf, encoding="utf-8"))
    except Exception as e:
        rows.append((ep, n, None, None, None, "JSON 错误：" + str(e)[:40]))
        continue
    zh = d.get("zh") or []
    notes = d.get("notes") or {}
    picks = d.get("picks") or []
    bad = sum(1 for x in zh if not str(x).strip())
    status = "OK" if len(zh) == n and bad == 0 else "对不齐"
    rows.append((ep, n, len(zh), bad, len(notes), len(picks), status))

print("%-5s %5s %5s %5s %5s %5s  %s" % ("集", "英文", "中文", "空译", "讲解", "精选", "状态"))
print("-" * 60)
for r in rows:
    if len(r) == 6:
        ep, n, zh, bad, notes, status = r
        print("%-5s %5d %5s %5s %5s %5s  %s" % ("E%02d" % ep, n, zh if zh is not None else "-",
                                               bad if bad is not None else "-",
                                               notes if notes is not None else "-", "-", status))
    else:
        ep, n, zh, bad, notes, picks, status = r
        print("%-5s %5d %5s %5s %5s %5s  %s" % ("E%02d" % ep, n, zh, bad, notes, picks, status))

total = sum(r[1] for r in rows)
done = sum(r[2] for r in rows if len(r) == 7 and r[2])
print("-" * 60)
print("合计 %d 句 · 已译 %d 句（%.1f%%）" % (total, done, done * 100.0 / max(1, total)))

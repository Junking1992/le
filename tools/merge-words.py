#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""merge-words.py — 把 tools/wdict/w*.js 的新词条合并进 assets/js/data/words.js

做法：解析现有词条 + 新词条 → 按字母重新生成整个文件（保证语法正确）。
用法：
    python tools/merge-words.py
"""
import glob
import os
import re
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
wpath = os.path.join(root, "assets", "js", "data", "words.js")

HEADER = """/* ============================================================
   words.js — 全局单词库（英 → 中）
   ------------------------------------------------------------
   格式：  "词条": "中文释义|词性|音标"
   - 释义多义项用中文分号「；」分隔，第一项是最常用义
   - 词性、音标可省略：  "词条": "中文释义"
   - key 一律小写；缩略形式（can't / I'm / that's）单独收录
   - 覆盖原则：剧集台词里出现的每一个词形都必须在这里查到
     用 tools/check-coverage.js 校验，必须 100%
   ------------------------------------------------------------
   注意：这里的释义是「通用义」。如果某个词在某句里是特殊含义，
   在该句的 words 字段里覆盖（见 README「逐词精译」）。
   ============================================================ */

const DICT_WORDS = {
"""


def parse_pairs(text):
    """从 JS 对象字面量里抓 "key": "value" 对"""
    out = []
    for m in re.finditer(r'"([^"\\]+)"\s*:\s*"((?:[^"\\]|\\.)*)"', text):
        out.append((m.group(1), m.group(2)))
    return out


def main():
    src = open(wpath, encoding="utf-8").read()
    entries = {}
    for k, v in parse_pairs(src):
        kl = k.lower()
        if kl not in entries:
            entries[kl] = v
    print("原有词条", len(entries))

    added = 0
    for p in sorted(glob.glob(os.path.join(root, "tools", "wdict", "w*.js"))):
        n = 0
        for k, v in parse_pairs(open(p, encoding="utf-8").read()):
            kl = k.lower()
            if kl in entries:
                continue
            entries[kl] = v
            n += 1
        added += n
        print("  %s 新增 %d" % (os.path.basename(p), n))
    print("合计新增", added, "→ 总计", len(entries))

    groups = {}
    for k in entries:
        c = k[0].upper() if k[0].isalpha() else "#"
        groups.setdefault(c, []).append(k)

    parts = [HEADER]
    for letter in sorted(groups.keys()):
        parts.append("\n  /* ========== %s ========== */\n" % letter)
        rows = []
        for k in sorted(groups[letter]):
            v = entries[k].replace("\\", "\\\\").replace('"', '\\"')
            rows.append('  "%s": "%s",' % (k, v))
        parts.append("\n".join(rows) + "\n")
    parts.append("};\n")

    open(wpath, "w", encoding="utf-8", newline="\n").write("".join(parts))
    print("已写入", wpath)


if __name__ == "__main__":
    main()

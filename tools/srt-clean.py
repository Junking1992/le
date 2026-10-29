#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
srt-clean.py — 把 SRT 清洗、合并成「一句话一条」

用法：
    python tools/srt-clean.py subtitles/pb/S02E01.srt
    python tools/srt-clean.py subtitles/pb --out clean/pb

做什么：
    1. 去掉序号、时间轴、HTML/ASS 标签
    2. 合并被字幕切碎的句子（同一句常占 2–4 条 cue）
    3. 删掉纯音效标记 [MUSIC]、(sighs)、♪…♪
    4. 合并同一时间点的重复行
    5. 输出 JSON：每集 [{"en": "..."}]，并打印统计

判断「同一句」的规则：
    - 前一条不以 . ! ? " ' ) 结尾
    - 且两条之间间隔 < 1.5 秒
    - 且后一条开头是小写字母，或前一条以逗号/连字符结尾
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

# OCR 词形替换表（l/I 混淆等），与 srt-clean.py 同目录
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
try:
    from ocr_words import OCR_WORDS
except Exception:
    OCR_WORDS = {}

TAG_RE = re.compile(r"<[^>]+>|\{\\[^}]*\}")
SOUND_RE = re.compile(r"[\[\(（【][^\]\)）】]{0,30}[\]\)）】]|♪[^♪]{0,60}♪")

# 整行丢弃：字幕站水印、片尾广告词（S03 片源带这些，S02 没有）
DROP_LINE_RE = re.compile(
    r"^(?:subtitles?\s*:|www\.|https?://|captioning sponsored by|"
    r"closed captioning|fox broadcasting company)",
    re.I,
)
# 片尾广告剩余片段的特征词，命中即丢
AD_LINE_RE = re.compile(
    r"\b(?:volkswagen|maple leaf|refrigerated entrees|grocers deli|"
    r"20th century fox television|revolution in food)\b",
    re.I,
)
TIME_RE = re.compile(
    r"(\d{1,2}):(\d{2}):(\d{2})[,.](\d{1,3})\s*-->\s*(\d{1,2}):(\d{2}):(\d{2})[,.](\d{1,3})"
)
END_PUNCT = re.compile(r"[.!?…\"'”’\)\]】]$")
# 双人对话分隔：行首的 "- " 或 " - "
DIALOG_SPLIT = re.compile(r"(?:^|\s)-\s*(?=[A-Z\"'“])")

# OCR 修复表（字幕站把 I 认成 l/1，把 ll 认成 ii 等）
OCR_FIX = [
    # 大写 I 被认成小写 l 的词：一律还原成小写，句首大写由后面的步骤补
    (r"\bIike\b", "like"),
    (r"\bIiked\b", "liked"),
    (r"\bIikes\b", "likes"),
    (r"\bIiking\b", "liking"),
    (r"\bIittle\b", "little"),
    (r"\bIive\b", "live"),
    (r"\bIiving\b", "living"),
    (r"\bIife\b", "life"),
    (r"\bIist\b", "list"),
    (r"\bIisten\b", "listen"),
    (r"\bIine\b", "line"),
    (r"\bIines\b", "lines"),
    (r"\bIast\b", "last"),
    (r"\bIater\b", "later"),
    (r"\bIet\b", "let"),
    (r"\bIeft\b", "left"),
    (r"\bIeave\b", "leave"),
    (r"\bIook\b", "look"),
    (r"\bIooking\b", "looking"),
    (r"\bIooks\b", "looks"),
    (r"\bIot\b", "lot"),
    (r"\bIots\b", "lots"),
    (r"\bIove\b", "love"),
    (r"\bIoved\b", "loved"),
    (r"\bIoves\b", "loves"),
    (r"\bIong\b", "long"),
    (r"\bIonger\b", "longer"),
    (r"\bIuck\b", "luck"),
    (r"\bIucky\b", "lucky"),
    (r"\bIose\b", "lose"),
    (r"\bIost\b", "lost"),
    (r"\bIaw\b", "law"),
    (r"\bIawyer\b", "lawyer"),
    (r"\bIand\b", "land"),
    (r"\bIight\b", "light"),
    (r"\bIead\b", "lead"),
    (r"\bIeader\b", "leader"),
    (r"\bIeave\b", "leave"),
    (r"\bIeft\b", "left"),
    (r"\bIevel\b", "level"),
    (r"\bIesson\b", "lesson"),
    (r"\bIess\b", "less"),
    (r"\bIetter\b", "letter"),
    (r"\bIetters\b", "letters"),
    (r"\bIady\b", "lady"),
    (r"\bIadies\b", "ladies"),
    (r"\bIarge\b", "large"),
    (r"\bIate\b", "late"),
    (r"\bIately\b", "lately"),
    (r"\bIaugh\b", "laugh"),
    (r"\bIeak\b", "leak"),
    (r"\bIean\b", "lean"),
    (r"\bIeap\b", "leap"),
    (r"\bIearn\b", "learn"),
    (r"\bIecture\b", "lecture"),
    (r"\bIeg\b", "leg"),
    (r"\bIegs\b", "legs"),
    (r"\bIegend\b", "legend"),
    (r"\bIend\b", "lend"),
    (r"\bIiar\b", "liar"),
    (r"\bIie\b", "lie"),
    (r"\bIied\b", "lied"),
    (r"\bIies\b", "lies"),
    (r"\bIifer\b", "lifer"),
    (r"\bIifetime\b", "lifetime"),
    (r"\bIift\b", "lift"),
    (r"\bIike\b", "like"),
    (r"\bIimited\b", "limited"),
    (r"\bIineup\b", "lineup"),
    (r"\bIiquor\b", "liquor"),
    (r"\bIisted\b", "listed"),
    (r"\bIisten\b", "listen"),
    (r"\bIiving\b", "living"),
    (r"\bIoad\b", "load"),
    (r"\bIoan\b", "loan"),
    (r"\bIob\b", "lob"),
    (r"\bIocal\b", "local"),
    (r"\bIocals\b", "locals"),
    (r"\bIocation\b", "location"),
    (r"\bIock\b", "lock"),
    (r"\bIocked\b", "locked"),
    (r"\bIockers\b", "lockers"),
    (r"\bIocks\b", "locks"),
    (r"\bIockup\b", "lockup"),
    (r"\bIodge\b", "lodge"),
    (r"\bIog\b", "log"),
    (r"\bIogged\b", "logged"),
    (r"\bIoop\b", "loop"),
    (r"\bIoose\b", "loose"),
    (r"\bIord\b", "lord"),
    (r"\bIotion\b", "lotion"),
    (r"\bIoud\b", "loud"),
    (r"\bIovely\b", "lovely"),
    (r"\bIow\b", "low"),
    (r"\bIower\b", "lower"),
    (r"\bIoyal\b", "loyal"),
    (r"\bIuckily\b", "luckily"),
    (r"\bIuggage\b", "luggage"),
    (r"\bIunch\b", "lunch"),
    (r"\bIungs\b", "lungs"),
    (r"\bIure\b", "lure"),
    (r"\bIuxury\b", "luxury"),
    (r"\bIying\b", "lying"),
    (r"\bIIIinois\b", "Illinois"),
    (r"\bIII\b", "III"),
    (r"\bAII\b", "all"),
    (r"\bAii\b", "all"),
    (r"\bI'II\b", "I'll"),
    (r"\bI'ii\b", "I'll"),
    (r"\bi'ii\b", "I'll"),
    (r"\bI'rn\b", "I'm"),
    (r"\bI'm\b", "I'm"),
    (r"\bI've\b", "I've"),
    (r"\bI'd\b", "I'd"),
    (r"\bI'll\b", "I'll"),
    (r"\bYou'II\b", "You'll"),
    (r"\byou'ii\b", "you'll"),
    (r"\bWe'II\b", "We'll"),
    (r"\bwe'ii\b", "we'll"),
    (r"\bThey'II\b", "They'll"),
    (r"\bthey'ii\b", "they'll"),
    (r"\bHe'II\b", "He'll"),
    (r"\bhe'ii\b", "he'll"),
    (r"\bShe'II\b", "She'll"),
    (r"\bIt'II\b", "It'll"),
    (r"\bit'ii\b", "it'll"),
    (r"\bThat'II\b", "That'll"),
    (r"\bWe'II\b", "We'll"),
    (r"\bwe'ii\b", "we'll"),
    (r"\bwe'ii\b", "we'll"),
    (r"\biike\b", "like"),
    (r"\biii\b", "ill"),
    (r"\bteii\b", "tell"),
    (r"\bwiii\b", "will"),
    (r"\bwiii\b", "will"),
    (r"\bstiii\b", "still"),
    (r"\bfeii\b", "fell"),
    (r"\bweii\b", "well"),
    (r"\bHeii\b", "Hell"),
    (r"\bhei\b", "hell"),
    (r"\bdon' t\b", "don't"),
    (r"\bcan' t\b", "can't"),
    (r"\bwon' t\b", "won't"),
    (r"\bdidn' t\b", "didn't"),
    (r"\bdoesn' t\b", "doesn't"),
    (r"\bisn' t\b", "isn't"),
    (r"\baren' t\b", "aren't"),
    (r"\bwasn' t\b", "wasn't"),
    (r"\bweren' t\b", "weren't"),
    (r"\bcouldn' t\b", "couldn't"),
    (r"\bwouldn' t\b", "wouldn't"),
    (r"\bshouldn' t\b", "shouldn't"),
    (r"\bhaven' t\b", "haven't"),
    (r"\bhasn' t\b", "hasn't"),
    (r"\bhadn' t\b", "hadn't"),
    (r"\bI' m\b", "I'm"),
    (r"\bI' ve\b", "I've"),
    (r"\bI' ll\b", "I'll"),
    (r"\bI' d\b", "I'd"),
    # S03 字幕站整词错切：l 被认成 I，且与相邻词粘连
    (r"\bthey\s+[Il]t\s+here\s+us\b", "they left us here"),
    (r"\bassisyou\b", "assist you"),
    # S03 相邻词粘连
    (r"\bknowsyou're\b", "knows you're"),
    (r"\baftertomorrow\b", "after tomorrow"),
    (r"\byouokay\b", "you okay"),
    (r"\bthishirst\b", "this thirst"),
    (r"\bmeout\b", "me out"),
    # S03 源字幕把两个人的话塞进同一条 cue，按句号断开
    (r"go hungry and thirsty All right\.", "go hungry and thirsty. All right."),
    (r"^All right\. and damn near", "All right. And damn near"),
    # S03 字母错认（n→h、T→Th 等）
    (r"\bhow\s+ne's\s+found\b", "how he's found"),
    (r"^Th's\s+got\b", "That's got"),
    (r"\bDid you brother\b", "Did your brother"),
    # S03 源字幕 layout 应为 lay out
    (r"prepared to layout\b", "prepared to lay out"),
    # S03 源字幕西语重音字节已损坏（显示为 U+FFFD），按上下文补回
    (r"norte\ufffdo", "norteño"),
    (r"Se\ufffdor", "Señor"),
    (r"se\ufffdor", "señor"),
    (r"\ufffdSi\?", "¿Sí?"),
    (r"\ufffdEntendido\?", "¿Entendido?"),
]


def to_sec(h, m, s, ms):
    return int(h) * 3600 + int(m) * 60 + int(s) + int(ms.ljust(3, "0")) / 1000.0


def split_dialog(body):
    """一条字幕里常有两个人的对话，用 " - " 分隔。拆成多段。"""
    parts = DIALOG_SPLIT.split(body)
    out = []
    for p in parts:
        p = p.strip().strip("-— ").strip()
        if p and re.search(r"[A-Za-z]", p):
            out.append(p)
    return out or [body]


def parse_srt(raw):
    """返回 [(start, end, text), ...]，一条字幕内若有双人对话会拆成多条"""
    raw = raw.replace("\r\n", "\n").replace("\r", "\n").replace("\ufeff", "")
    cues = []
    for block in re.split(r"\n{2,}", raw):
        lines = [l.strip() for l in block.split("\n")]
        lines = [l for l in lines if l]
        if not lines:
            continue
        ti = -1
        for i, l in enumerate(lines[:3]):
            if "-->" in l:
                ti = i
                break
        if ti < 0:
            continue
        m = TIME_RE.search(lines[ti])
        if not m:
            continue
        start = to_sec(*m.groups()[:4])
        end = to_sec(*m.groups()[4:])
        body = " ".join(lines[ti + 1:])
        body = TAG_RE.sub("", body)
        body = body.replace("\\N", " ").replace("\\n", " ")
        body = SOUND_RE.sub(" ", body)
        body = re.sub(r"\s+", " ", body).strip()
        if not re.search(r"[A-Za-z]", body):
            continue
        # 站点水印 / 片尾广告：整条丢弃
        if DROP_LINE_RE.match(body) or AD_LINE_RE.search(body):
            continue
        # 双人对话拆分：拆开后每段单独成 cue（时间点相同，不会互相合并）
        pieces = split_dialog(body)
        for k, p in enumerate(pieces):
            cues.append((start, end, p, k))
    return cues


def fix_ocr_words(text):
    """按词替换 OCR 错误（区分大小写，整词匹配）"""
    def repl(m):
        w = m.group(0)
        low = w.lower()
        if w in OCR_WORDS:
            return OCR_WORDS[w]
        if low in OCR_WORDS:
            r = OCR_WORDS[low]
            # 保持原词首字母大小写
            if w[0].isupper() and r[0].islower():
                return r[0].upper() + r[1:]
            return r
        return w

    return re.sub(r"[A-Za-z]+(?:'[A-Za-z]+)*", repl, text)


def merge_cues(cues, max_gap=1.5):
    """把被切碎的句子合并回整句（同一说话人的连续片段）"""
    if not cues:
        return []
    out = []
    cur_s, cur_e, cur_t, cur_k = cues[0]
    for s, e, t, k in cues[1:]:
        gap = s - cur_e
        prev_tail = cur_t.rstrip()
        starts_lower = bool(re.match(r"[a-z]", t))
        prev_open = not END_PUNCT.search(prev_tail)
        prev_comma = bool(re.search(r"[,;:—-]$", prev_tail))
        same_cue = k > 0 and cur_k == k - 1 and abs(s - cur_s) < 0.01

        join = False
        if not same_cue and gap <= max_gap and prev_open:
            if prev_comma:
                join = True
            elif starts_lower:
                join = True
            elif len(prev_tail.split()) <= 3 and gap < 0.8:
                join = True

        if join:
            cur_t = prev_tail + " " + t
            cur_e = e
            cur_k = k
        else:
            out.append((cur_s, cur_e, cur_t))
            cur_s, cur_e, cur_t, cur_k = s, e, t, k
    out.append((cur_s, cur_e, cur_t))

    # 清理：合并后可能出现的连续标点
    cleaned = []
    for s, e, t in out:
        t = re.sub(r"\s+", " ", t).strip()
        t = re.sub(r"\s+([,.!?;:])", r"\1", t)
        t = re.sub(r"([,.!?;:])([A-Za-z])", r"\1 \2", t)
        # OCR 常见错误修正（字幕站的 1/l/I 混淆、缩写断词）
        for pat, rep in OCR_FIX:
            t = re.sub(pat, rep, t)
        t = re.sub(r"\bBORTA C's\b", "BORTAC's", t)
        t = re.sub(r"\bsteadman\b", "Steadman", t)
        # 缩写被空格拆开：we' ll → we'll
        t = re.sub(r"\b(\w+)'\s+(ll|re|ve|d|m|s|t)\b", r"\1'\2", t)
        # 撇号前后都被空格隔开：I ' m → I'm、don 't → don't
        t = re.sub(r"\b(\w+)\s+'\s*(ll|re|ve|d|m|s|t)\b", r"\1'\2", t)
        # L. J. 统一成 "L. J." 写法（先规范空格，再修撇号）
        t = re.sub(r"\bL\.\s*J\.\s*(?!')", "L. J. ", t)
        t = re.sub(r"\bL\.\s*J\.(?=')", "L. J.", t)
        t = re.sub(r"\bL\.\s*J\b(?!\.)", "L. J.", t)
        # L. J. ' s → L. J.'s
        t = re.sub(r"\.\s+'\s*s\b", ".'s", t)
        # 大写字母 + I + 小写：CIean → Clean、PIus → Plus（l 被认成 I）
        t = re.sub(r"\b([CPFEAK])I(?=[a-z])", r"\1l", t)
        # I 被认成大写 I 的词首：Iay → lay、Iab → lab、Iiability → liability
        t = re.sub(r"\bIay\b", "lay", t)
        t = re.sub(r"\bIiability\b", "liability", t)
        t = re.sub(r"\bIab\b", "lab", t)
        t = re.sub(r"\bT errence\b", "Terrence", t)
        t = re.sub(r"\bHes\b", "He's", t)
        t = re.sub(r"\bshes\b", "she's", t)
        t = re.sub(r"\blxtapa\b", "Ixtapa", t)
        t = re.sub(r"\blNS\b", "INS", t)
        t = re.sub(r"\blns\b", "INS", t)
        t = re.sub(r"\bKu KIux\b", "Ku Klux", t)
        # 单独成词的 l / j（小写 L）多半是 I
        t = re.sub(r"(?<=[ ,\"'(])l(?=[ ,.!?\"')]|$)", "I", t)
        t = re.sub(r"(?<=[ ,\"'(])j(?=[ ,.!?\"')]|$)", "I", t)
        # 句首小写 → 大写
        if t and t[0].islower():
            t = t[0].upper() + t[1:]
        # 问号写成 > 的 OCR 错误
        t = re.sub(r"\?\s*>$", "?", t)
        t = re.sub(r"\bman>$", "man?", t)
        # 按词修正 OCR 错字（l/I 混淆等）
        t = fix_ocr_words(t)
        # 合并后残留的片尾广告 / 水印碎片
        if DROP_LINE_RE.match(t) or AD_LINE_RE.search(t):
            continue
        # 广告截断后的残句（如 "Ro"），无实义且极短
        if re.fullmatch(r"(?:Ro|Simply Fresh)", t):
            continue
        if len(t.split()) < 1:
            continue
        cleaned.append({"en": t, "start": round(s, 2), "end": round(e, 2)})
    return cleaned


def process_file(path):
    with open(path, "r", encoding="utf-8-sig", errors="replace") as f:
        raw = f.read()
    cues = parse_srt(raw)
    merged = merge_cues(cues)
    return cues, merged


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("source", help="SRT 文件或目录")
    ap.add_argument("--out", default="", help="输出 JSON 目录（不给就只打印统计）")
    ap.add_argument("--show", action="store_true", help="打印前 20 句")
    args = ap.parse_args()

    files = []
    if os.path.isdir(args.source):
        files = sorted(
            os.path.join(args.source, f)
            for f in os.listdir(args.source)
            if f.lower().endswith(".srt")
        )
    else:
        files = [args.source]

    if args.out:
        os.makedirs(args.out, exist_ok=True)

    total_cues = 0
    total_sent = 0
    total_words = 0

    for path in files:
        name = os.path.splitext(os.path.basename(path))[0]
        cues, merged = process_file(path)
        words = sum(len(m["en"].split()) for m in merged)
        total_cues += len(cues)
        total_sent += len(merged)
        total_words += words
        print(
            "%-10s %4d cue → %3d 句 · %4d 词 · 压缩比 %.1f×"
            % (name, len(cues), len(merged), words, len(cues) / max(1, len(merged)))
        )

        if args.out:
            out_path = os.path.join(args.out, name + ".json")
            with open(out_path, "w", encoding="utf-8") as f:
                json.dump(merged, f, ensure_ascii=False, indent=1)

        if args.show:
            print("  前 20 句：")
            for m in merged[:20]:
                print("    " + m["en"])

    print(
        "\n合计：%d cue → %d 句 · %d 词"
        % (total_cues, total_sent, total_words)
    )
    if args.out:
        print("已写出 JSON 到：" + os.path.abspath(args.out))


if __name__ == "__main__":
    main()

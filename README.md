# ScreenLingo · 美剧台词学英语

用**真实英文字幕**学英语的本地网页应用。双击 `index.html` 就能用，不用服务器、不用装环境。

**内置：《越狱》Prison Break · 第二季 · 全 22 集 · 12,655 句真实字幕**（从 tvsubtitles.net 下载的英文字幕，逐句清洗合并后得到）。
**另含第三季 Sona 篇 · 前 10 集 · 5,522 句**（已全部译完）。

---

## 一、当前进度

| 项目 | 数量 |
| --- | --- |
| 剧集 | 1 部（越狱）· **2 季 · 32 集** |
| 台词总数 | **18,177 句**（不是精选，是整集全部字幕） |
| 平均每集 | 568 句 |
| 已翻译 | **18,177 句 · 100%** |
| 讲解 | **1,327 条** |
| 精选句 | **1,033 句** |
| 词库 | **6,796 条 · 覆盖率 100%** |

### 第二季（全 22 集）

| 集 | 标题 | 句数 | 译文 | 讲解 | 精选 |
| --- | --- | --- | --- | --- | --- |
| E01 | Manhunt 追捕 | 576 | ✅ 100% | 41 | 22 |
| E02 | Otis 奥蒂斯 | 515 | ✅ 100% | 40 | 21 |
| E03 | Scan 扫描 | 600 | ✅ 100% | 37 | 22 |
| E04 | First Down 首攻 | 612 | ✅ 100% | 41 | 25 |
| E05 | Map 1213 1213号地图 | 623 | ✅ 100% | 36 | 26 |
| E06 | Subdivision 小区 | 579 | ✅ 100% | 28 | 25 |
| E07 | Buried 埋藏 | 570 | ✅ 100% | 40 | 39 |
| E08 | Dead Fall 坠落 | 615 | ✅ 100% | 46 | 46 |
| E09 | Unearthed 出土 | 591 | ✅ 100% | 40 | 40 |
| E10 | Rendezvous 会合 | 458 | ✅ 100% | 35 | 35 |
| E11 | Bolshoi Booze 博尔绍伊之酒 | 539 | ✅ 100% | 40 | 32 |
| E12 | Disconnect 断线 | 562 | ✅ 100% | 42 | 34 |
| E13 | The Killing Box 杀人盒 | 560 | ✅ 100% | 43 | 33 |
| E14 | John Doe 无名氏 | 690 | ✅ 100% | 43 | 32 |
| E15 | The Message 消息 | 608 | ✅ 100% | 41 | 32 |
| E16 | Chicago 芝加哥 | 577 | ✅ 100% | 40 | 32 |
| E17 | Bad Blood 坏血 | 531 | ✅ 100% | 42 | 33 |
| E18 | Wash 洗刷 | 671 | ✅ 100% | 41 | 32 |
| E19 | Sweet Caroline 亲爱的卡罗琳 | 575 | ✅ 100% | 45 | 34 |
| E20 | Panama 巴拿马 | 623 | ✅ 100% | 44 | 30 |
| E21 | Fin Del Camino 卡米诺尽头 | 445 | ✅ 100% | 40 | 31 |
| E22 | Sona 索纳 | 535 | ✅ 100% | 43 | 32 |

### 第三季（Sona 篇，目前 10 集）

| 集 | 标题 | 句数 | 译文 | 讲解 | 精选 |
| --- | --- | --- | --- | --- | --- |
| E01 | Orientación 入监指引 | 403 | ✅ 100% | 43 | 34 |
| E02 | Fire/Water 火与水 | 574 | ✅ 100% | 56 | 43 |
| E03 | Call Waiting 来电等待 | 587 | ✅ 100% | 45 | 36 |
| E04 | Good Fences 好篱笆 | 577 | ✅ 100% | 41 | 34 |
| E05 | Interference 干扰 | 562 | ✅ 100% | 40 | 32 |
| E06 | Photo Finish 照片终局 | 657 | ✅ 100% | 45 | 33 |
| E07 | Vamonos 走吧 | 480 | ✅ 100% | 42 | 32 |
| E08 | Bang and Burn 明抢暗算 | 583 | ✅ 100% | 40 | 32 |
| E09 | Boxed In 困局 | 558 | ✅ 100% | 44 | 35 |
| E10 | Dirt Nap 长眠 | 541 | ✅ 100% | 43 | 34 |

> 运行 `python tools/apply-translations.py` 会打印每集的实时进度；
> `python tools/check-all.py` 检查第二季 22 集，`python tools/check-all.py --season 3` 检查第三季。
> 单集验收：`python tools/check-ep.py 3 4`；查缺词形：`python tools/list-missing.py 3 4 5`。

---

## 二、功能

| 功能 | 说明 |
| --- | --- |
| **两种模式** | **全部台词**：整集每一句。**精选精讲**：只留当集难点重点句（每集 20–25 句）并配讲解。快捷键 `P` 切换 |
| **剧集库** | 首页剧集卡片 → 选季 → 选集，带进度环 |
| **逐句对照** | 中文默认隐藏，点一下显示；讲解跟着中文一起出现 |
| **点词翻译** | 每个单词都能点，显示中文释义、音标、词性、原形；本句有专门译法时标「本句译法」 |
| **短语标注** | 常用短语青色虚线，点击弹出短语卡 + 2–4 条不同语境例句 |
| **生词本** | 一键加入，记录原句出处；闪卡复习、导出/导入 JSON |
| **短语库** | 196 条常用短语，可搜索、可朗读 |
| **逐句模式** | 大字号一句一句过，自动朗读，适合精听跟读 |
| **学习进度** | 逐句 ✓，汇总到集 → 季 → 剧 |
| **朗读** | 浏览器 TTS，语速 0.5×–1.4× |
| **全局搜索** | 中英台词 + 单词，直达对应集 |

### 快捷键（学习页）

| 键 | 作用 |
| --- | --- |
| `J` / `↓` | 下一句 |
| `K` / `↑` | 上一句 |
| `空格` | 显示当前句中文 / 下一句 |
| `S` | 朗读当前句 |
| `M` | 标记已掌握 |
| `F` | 逐句模式 |
| `P` | 切换「全部台词 / 精选精讲」 |
| `/` | 搜索 |
| `Esc` | 关闭弹层 |

---

## 三、目录结构

```
le/
├── index.html                      双击打开
├── README.md                       本文档
├── assets/
│   ├── css/style.css
│   └── js/
│       ├── app.js                  应用逻辑
│       ├── shows.js                剧集注册表
│       └── data/
│           ├── words.js            ★ 单词库（6,796 条，英→中）
│           ├── phrases.js          ★ 短语库（196 条 + 例句）
│           └── pb-s2/
│               ├── e01.js … e22.js ★ 每集一个数据文件（12,655 句）
│           └── pb-s3/
│               ├── e01.js … e10.js ★ 第三季每集一个数据文件（5,522 句）
├── subtitles/pb/                   ★ 下载的原始 SRT（32 个）
├── clean/pb/                       ★ 清洗合并后的英文 JSON（32 个）
├── translations/pb-s2/             ★ AI 产出的译文（e01.json …）
├── translations/pb-s3/             ★ 第三季译文（e01.json …）
└── tools/
    ├── fetch-subs.ps1              ★ 下载整季字幕
    ├── srt-clean.py                ★ SRT 清洗 + 合并句子 + OCR 纠错
    ├── translate-spec.md           ★ 翻译规范（AI 必须照这个做）
    ├── apply-translations.py       ★ 译文合并进数据文件
    ├── merge-words.py              ★ 把 wdict/w*.js 合并进 words.js
    ├── validate.js                 ★ 数据校验（必须通过）
    ├── check-coverage.js           单词覆盖率检查（100%）
    ├── check-all.py                译文逐句对齐检查（--season 选季）
    ├── check-ep.py                 单集验收（句数/空译/词形）
    ├── list-missing.py             列出某几集缺失的词形
    ├── test.js                     jsdom 端到端冒烟测试
    ├── test-ui.js                  路由/短语库/搜索/逐集检查
    ├── test-words.js               词库抽查
    ├── ocr_words.py                OCR 错字修正表
    └── wdict/w1..w10.js            补词形的分块产出（合并后可删）
```

---

## 四、给 AI 的完整操作规范

> **目标**：把一整季美剧的字幕变成「每句有中文、每个词有中文、有精选讲解」的学习数据。

### 4.1 下载英文字幕

已经做好了一个可用的下载器：`tools/fetch-subs.ps1`（走 tvsubtitles.net）。

```powershell
# 下载整季（Prison Break 的剧集 id 是 2）
powershell -NoProfile -ExecutionPolicy Bypass -File tools\fetch-subs.ps1 -Show 2 -Season 2 -Out subtitles\pb

# 只下一集
powershell -NoProfile -ExecutionPolicy Bypass -File tools\fetch-subs.ps1 -Show 2 -Season 2 -Out subtitles\pb -Ep 1
```

要点：

- `-Show` 是 tvsubtitles 的内部 id。查法：打开 `https://www.tvsubtitles.net/tvshows.html`，
  搜索剧名，链接形如 `tvshow-2-5.html`，其中 `2` 就是 id。
- 脚本会自动解压 zip、统一编码、按 `S02E01.srt` 命名。
- **语言识别靠国旗图标**（`flags/en.gif`），因为站点界面是多语言的，
  英文标题可能显示成 English / Anglais / Englisch，不能按文字匹配。
- 如果某集没有英文版，脚本会提示；换源或跳过。

手动下载也可以，只要最终得到 `subtitles/pb/S02E01.srt` 这种结构。

**版权**：只用你有权获取的字幕。本项目的数据是「字幕文本 + 自行翻译」，
用于语言学习，不要二次分发原始字幕文件。

### 4.2 清洗与合并句子

原始 SRT 一集有 400–650 条 cue，很多是**一句话被切成 2–4 条**，还夹杂音效标记和 OCR 错字。

```bash
python tools/srt-clean.py subtitles/pb --out clean/pb
```

这个脚本做六件事：

1. 去掉序号、时间轴、`<i>` 等标签、`{\an8}` 样式码
2. **合并被切碎的句子**：前一条不以 `. ! ?` 结尾 + 间隔 < 1.5 秒 + 后一条小写开头 → 合并
3. **拆开双人对话**：一条字幕里 `- Hello. - Hi.` 这种，按 `- ` 拆成两句
4. 删掉纯音效标记 `[MUSIC]`、`(sighs)`、`♪…♪`
5. **修正 OCR 错字**：`tools/ocr_words.py` 里维护了替换表
   （字幕站把 `I` 认成 `l`，产生 `iike`→`like`、`aii`→`all`、`we'ii`→`we'll` 等）
6. **修断词**：`I ' m`→`I'm`、`don 't`→`don't`、`L. J. ' s`→`L. J.'s`，
   以及 `CIean`→`Clean`、`PIus`→`Plus` 这类大小写混淆

结果：`clean/pb/S02E01.json` → `[{"en": "...", "start": 1.5, "end": 3.0}, ...]`

实际效果（E01）：645 cue → 576 句，读起来是完整句子而不是字幕碎片。

### 4.3 翻译句子

打开 `clean/pb/S02E01.json`，逐句翻译，产出 `translations/pb-s2/e01.json`：

```json
{
  "ep": 1,
  "zh": [
    "前情提要：《越狱》",
    "我没杀那个人，迈克尔。",
    "……"
  ],
  "notes": { "5": "讲解文字" },
  "picks": [5, 8, 28]
}
```

- `zh` 是**数组**，按句子下标一一对应，长度必须等于该集句数。
- `notes` 是 `{下标: "讲解"}`，可只写精选句。
- `picks` 是精选句下标数组。

> 完整可执行的规范见 **`tools/translate-spec.md`**（含逐句翻译规则、人物语言区分、
> 讲解与精选的量化要求、自检命令）。新的一集直接照那份做即可。

**翻译要求**：

| 要求 | 说明 |
| --- | --- |
| 口语化 | 用中文口语，不要翻译腔。`You're out of your mind.` → 「你疯了吗？」 |
| 贴人物 | T-Bag 油滑、Lincoln 直、Michael 冷静、Abruzzi 阴沉、Mahone 冷硬 |
| 保留语气 | 反问、讽刺、命令、示弱都要译出来 |
| 不添加原文没有的信息 | 不要为了通顺编造情节 |
| 专名保留 | 人名地名用中文常用译名（Michael 迈克尔、Lincoln 林肯、Fox River 狐狸河） |

### 4.4 翻译每一个单词（硬性要求）

> **台词里出现的每一个单词，点击后都必须有中文。**
> `node tools/check-coverage.js` 必须输出「覆盖率 100%」。

分两层：

#### 第 1 层：全局词库 `assets/js/data/words.js`

```js
const DICT_WORDS = {
  "prison": "监狱；牢狱|n.|ˈprɪzn",
  //         中文释义  |词性|音标
};
```

规则：

1. **key 一律小写**；缩略形式单独收录（`can't`、`i'm`、`that's`、`gonna`）
2. 多义项用中文分号「；」分隔，**第一项最常用**
3. 词性简写：`n.` `v.` `adj.` `adv.` `prep.` `conj.` `pron.` `modal` `art.` `num.` `int.`
4. **每个词形都要单独收录**：`walk / walks / walked / walking`、`man / men`、`go / went / gone`
5. 释义要短（2–6 字）

程序里有词形还原兜底（`-s/-es/-ed/-ing/-ly` 和不规则动词表），
但**不要依赖它**，校验工具只认字面 key。

#### 第 2 层：本句精译（可选）

同一个词在不同句子里意思不同时，在该句加 `w`：

```js
{ en: "That's a fine line to hang a life on.", zh: "...", w: { line: "线", fine: "细的" } }
```

界面会标「本句译法」。

#### 真实规模参考

《越狱》S2+S3 共：**117,367 词次 · 6,750 个不同词形**，词库现有 **6,796 条**，覆盖率 100%。

补词形的做法：`node tools/check-coverage.js` 会把缺失词形按频次写进
`tools/_missing_forms.txt`；把清单切块交给 AI 批量产出
`tools/wdict/w1.js … w10.js`（格式 `"词": "释义|词性|音标",`），
再跑 `python tools/merge-words.py` 自动合并并按字母重排整个 `words.js`。
也可以先用 `python tools/list-missing.py 3 4 5` 直接列出某几集缺的词形。

### 4.5 挑精选句

每集挑 **20–35 句**（真实字幕一集 600 句，精选要压到 5% 左右才叫“精选”）：

1. **有语法价值**：虚拟语气、倒装、比较级、动名词、从句嵌套
2. **地道表达**：口语固定搭配、俚语、省略句
3. **剧情关键句**：转折、揭示、有记忆点的台词
4. **易误解句**：字面义和实际义不同

`picks` 必须升序、无重复、在句子范围内；`tools/validate.js` 会检查。

### 4.6 写讲解

写进 `notes`，每条 15–60 字，一句话讲清一个点：

| 类型 | 例子 |
| --- | --- |
| 习语 | `not have a pot to piss in = 一文不名（粗俗习语）` |
| 语法 | `祈使句 + and + 结果 = 如果……就会……` |
| 双关 | `Otis Wright 既是人名，也指“奥蒂斯电梯”` |
| 文化 | `semper fi = 拉丁语“永远忠诚”，海军陆战队格言` |
| 语气 | `重复对方的话并加 No，是承认事实但拒绝和解` |

不要写「这句话的意思是……」这种废话开头，直接说点。

### 4.7 合并进数据文件

```bash
python tools/apply-translations.py --show pb --season 2
```

它会：

- 读 `clean/pb/*.json`（英文）+ `translations/pb-s2/*.json`（译文）
- 按下标对齐，生成 `assets/js/data/pb-s2/e01.js … e22.js`
- 打印每集进度、讲解数、精选数
- **可以反复运行**，每次整体重写，增量补充不会丢已有内容

生成的文件用 IIFE 包裹（`(function(){ ... })();`），避免 22 个文件重复声明同名常量。

### 4.8 校验

```bash
node tools/validate.js        # 结构 + 格式 + 词形覆盖，必须「校验通过」
node tools/check-coverage.js  # 单词覆盖率，目标 100%
python tools/check-all.py     # 22 集英文/中文逐句对齐
node tools/test.js            # jsdom 冒烟测试（渲染、点词、模式切换）
node tools/test-ui.js         # 路由、短语库、搜索、22 集逐集检查
node tools/test-words.js      # 词库抽查（每 97 句抽一次，确认无未收录）
```

`validate.js` 检查：JS 能否解析、每句有无英文、`picks` 越界、**每个词形是否有中文**、
英文里是否混入中文、短语库格式。

### 4.9 完整流程

```bash
# 1. 下载整季英文字幕
powershell -NoProfile -ExecutionPolicy Bypass -File tools\fetch-subs.ps1 -Show 2 -Season 2 -Out subtitles\pb

# 2. 清洗 + 合并句子
python tools/srt-clean.py subtitles/pb --out clean/pb

# 3. 逐集翻译 → translations/pb-s2/e01.json … e22.json
#    （AI 按 tools/translate-spec.md 完成）

# 4. 补 words.js 里缺的词形（check-coverage 会列出缺哪些）

# 5. 合并 + 校验
python tools/apply-translations.py --show pb --season 2
node tools/validate.js
node tools/check-coverage.js
python tools/check-all.py

# 6. 浏览器打开 index.html 检查（或跑 test.js / test-ui.js）
```

> 换季时把 `--season` 改成对应季号即可。`clean/pb/` 下多季共存时，
> `apply-translations.py` 按文件名里的 `SxxExx` 过滤，只处理当前季，
> 不会把别的季误当成本季的数据。
> 第三季目前：`--season 3`，`python tools/check-all.py --season 3`。

---

## 五、添加新剧集 / 新一季

1. 查剧集 id：
   `https://www.tvsubtitles.net/tvshows.html` 搜剧名，链接 `tvshow-<id>-<season>.html`
2. 下载字幕：
   `tools\fetch-subs.ps1 -Show <id> -Season <n> -Out subtitles\<show>`
3. 清洗：`python tools/srt-clean.py subtitles\<show> --out clean\<show>`
4. 在 `tools/apply-translations.py` 顶部的 `TITLES` 和 `META_OBJ` 里加这部剧的配置
   （或者复制一份脚本改）
5. 翻译到 `translations/<show>-s<n>/`
6. 生成数据：`python tools/apply-translations.py --show <show> --season <n>`
7. `index.html` 里加对应的 `<script>` 标签

**脚本顺序必须是**：

```
words.js → phrases.js → shows.js → 剧集数据 → app.js
```

---

## 六、扩充词库 / 短语库

见 4.4 / 4.5。加完跑 `node tools/check-coverage.js`。

短语格式：

```js
"break out": {
  zh: "爆发；（从监狱等）逃出",
  pos: "phr. v.",
  note: "break out of + 地点 = 从……逃出",
  ex: [
    ["Three men broke out of the county jail last night.", "昨晚有三个人从县监狱逃了出来。"],
    ["A fight broke out in the yard during lunch.", "午饭时操场上爆发了一场打斗。"]
  ]
}
```

- key 小写，必须是**连续词**（中间只能有空格）
- 例句 2–4 条，**语境必须不同**，不要同一句式换单词

---

## 七、数据存在哪里

浏览器 `localStorage`，键名以 `sl.v2.` 开头：

| 键 | 内容 |
| --- | --- |
| `sl.v2.progress` | 每集哪些句子标记了「已掌握」 |
| `sl.v2.vocab` | 生词本 |
| `sl.v2.settings` | 主题、语速、中文策略、上次用的模式 |
| `sl.v2.last` | 上次学到哪一集 |

换浏览器/清缓存会丢，建议定期用生词本页「导出 JSON」备份。

---

## 八、常见问题

**Q：为什么一集有 500 多句？**
因为这是**整集全部字幕**。一集 40 分钟美剧大约 400–650 条字幕 cue，
合并后 450–700 句，3000–4500 词。之前那种一集 19 句是精选改写，不是真字幕。

**Q：为什么有的集显示「中文待翻译」？**
那一集还没翻译（当前全 22 集都已 100% 译完，正常不会出现）。
新加剧集时 `apply-translations.py` 会打印每集进度。

**Q：点单词显示「词典未收录」？**
`words.js` 缺这个词形。跑 `node tools/check-coverage.js` 会按频次列出缺哪些。

**Q：精选精讲是空的？**
该集 `picks` 为空。按 4.5 挑几句补上。

**Q：朗读没声音？**
Chrome/Edge 需要系统装英文语音包。Windows：设置 → 时间和语言 → 语音 →
添加 English (United States)。

**Q：能离线用吗？**
可以。只有重新下载字幕/重新校验需要联网和 Node/Python。

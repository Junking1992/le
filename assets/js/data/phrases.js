/* ============================================================
   phrases.js — 短语库（短语 + 释义 + 用法提示 + 多语境例句）
   ------------------------------------------------------------
   格式：
   "短语": {
     zh:   "中文释义（必填）",
     pos:  "词性标注（可省）",
     note: "用法提示 / 易混点（可省）",
     ex:   [ ["英文例句", "中文翻译"], ... ]   // 建议 2–4 条，语境要不同
   }

   规则：
   1. key 用小写；台词里出现时会自动加青色虚线下划线。
   2. ex 的例句必须是「不同场景」，不要同一个句式换单词。
   3. 短语匹配是「连续词 + 中间只有空格」，所以不要收录
      中间可能插入别的词的搭配（如 get sb out，写成 get out）。
   ============================================================ */

/* 短语库：每个短语配 2–4 个真实语境例句 */
const PHRASES = {
  "break out": {
    zh: "爆发；（从监狱等）逃出",
    pos: "phr. v.",
    note: "break out of + 地点 = 从……逃出；break out in + 症状 = 突然起（疹子等）。",
    ex: [
      ["Three men broke out of the county jail last night.", "昨晚有三个人从县监狱逃了出来。"],
      ["A fight broke out in the yard during lunch.", "午饭时操场上爆发了一场打斗。"],
      ["She broke out in a cold sweat when she heard the news.", "听到那消息，她突然出了一身冷汗。"]
    ]
  },
  "get out": {
    zh: "出去；离开；设法脱身",
    pos: "phr. v.",
    note: "口语里常用来表示“滚出去”或“（消息）泄露”。",
    ex: [
      ["Get out of the car. Now.", "下车。马上。"],
      ["We have to get out before the guards change shift.", "我们得在狱警换班前离开。"],
      ["Somehow the story got out to the press.", "不知怎么的，这事泄露给了媒体。"]
    ]
  },
  "get out of": {
    zh: "摆脱；逃避（责任、义务）",
    pos: "phr. v.",
    note: "get out of doing sth = 逃避做某事。",
    ex: [
      ["You can't get out of it that easily.", "你没那么容易脱身。"],
      ["He tried to get out of paying the fine.", "他试图逃避交罚款。"],
      ["I want out of this hole, and I'm not getting out of it alone.", "我想离开这个鬼地方，而且不会一个人走。"]
    ]
  },
  "look out": {
    zh: "当心；留神",
    pos: "phr. v.",
    note: "常单独使用，喊出来提醒别人注意危险。",
    ex: [
      ["Look out! The ladder's coming down.", "小心！梯子要倒了。"],
      ["You have to look out for yourself in here.", "在这里你得自己当心。"],
      ["Look out for the truck at the north gate.", "留意北门那辆卡车。"]
    ]
  },
  "hold on": {
    zh: "稍等；坚持住；抓紧",
    pos: "phr. v.",
    note: "打电话时说 hold on = 请稍等；爬墙时 hold on = 抓牢。",
    ex: [
      ["Hold on, I'm not ready yet.", "等等，我还没准备好。"],
      ["Hold on to the pipe and don't look down.", "抓紧管子，别往下看。"],
      ["Just hold on a little longer — help is coming.", "再坚持一会儿，救援就来了。"]
    ]
  },
  "hang on": {
    zh: "稍等；坚持；紧紧抓住",
    pos: "phr. v.",
    note: "比 hold on 更口语，也常表示“撑住”。",
    ex: [
      ["Hang on, I'll get the door.", "等一下，我去开门。"],
      ["Hang on tight, this part is rough.", "抓稳了，这段路很颠。"],
      ["We just have to hang on until morning.", "我们只要撑到早上就行。"]
    ]
  },
  "show up": {
    zh: "出现；露面；到场",
    pos: "phr. v.",
    note: "常带一点“该来却没来”的抱怨语气。",
    ex: [
      ["He never showed up for the meeting.", "他根本没来开会。"],
      ["If the driver doesn't show, we walk.", "如果司机不出现，我们就走着去。"],
      ["She showed up two hours late with no explanation.", "她迟到两小时，一句解释都没有。"]
    ]
  },
  "end up": {
    zh: "最终落得；最后变成（在……）",
    pos: "phr. v.",
    note: "end up + 地点/doing/形容词，表示意料之外的结局。",
    ex: [
      ["They ended up in a motel outside Chicago.", "他们最后落脚在芝加哥郊外的一家汽车旅馆。"],
      ["If we wait, we end up back in that cell.", "如果我们等下去，最后还是会回到那间牢房。"],
      ["I ended up doing all the paperwork myself.", "结果所有文书都是我一个人做的。"]
    ]
  },
  "figure out": {
    zh: "弄清楚；想明白；算出",
    pos: "phr. v.",
    note: "口语极高频，等于 work out / understand。",
    ex: [
      ["We'll figure it out. We always do.", "我们会想出办法的，我们一向如此。"],
      ["I can't figure out how he got in.", "我搞不懂他是怎么进来的。"],
      ["Give me ten minutes to figure out the schedule.", "给我十分钟把时间表理清楚。"]
    ]
  },
  "find out": {
    zh: "发现；查明；得知",
    pos: "phr. v.",
    note: "强调“通过调查或偶然得知”。",
    ex: [
      ["If they find out, we're dead.", "要是他们发现了，我们就死定了。"],
      ["I found out he'd been lying for months.", "我发现他已经骗了好几个月。"],
      ["Somebody's going to find out sooner or later.", "迟早有人会查出来的。"]
    ]
  },
  "make sure": {
    zh: "确保；弄清楚",
    pos: "phr.",
    note: "后面常接 that 从句，或 make sure of sth。",
    ex: [
      ["Make sure the door's locked before you leave.", "走之前确保门锁好了。"],
      ["Make sure nobody's watching.", "确保没人在看。"],
      ["I'll make sure he gets the message.", "我会确保他收到消息。"]
    ]
  },
  "make it": {
    zh: "成功；赶到；办到",
    pos: "phr.",
    note: "也可用于“活下来”，如 He's not going to make it.",
    ex: [
      ["We're not going to make it by dawn.", "我们赶不及在黎明前到了。"],
      ["You made it. I didn't think you would.", "你办到了，我本以为你不行。"],
      ["The doctor says he might not make it through the night.", "医生说他可能撑不过今晚。"]
    ]
  },
  "take care of": {
    zh: "照顾；处理；负责搞定",
    pos: "phr. v.",
    note: "威胁语境下 take care of sb = 收拾某人。",
    ex: [
      ["I'll take care of the guard. You handle the lock.", "狱警我来搞定，你负责锁。"],
      ["Who's taking care of your brother?", "谁在照顾你弟弟？"],
      ["Don't worry, I'll take care of it.", "别担心，这事我来处理。"]
    ]
  },
  "used to": {
    zh: "过去常常；过去是",
    pos: "phr.",
    note: "used to do = 过去常做；be used to doing = 习惯于。",
    ex: [
      ["You're not the man I used to know.", "你已经不是我认识的那个人了。"],
      ["I used to think the walls were the worst part.", "我以前以为墙是最难熬的部分。"],
      ["He's used to working nights.", "他习惯上夜班。"]
    ]
  },
  "be supposed to": {
    zh: "应该；按理说",
    pos: "phr.",
    note: "常用来暗示“实际上并没有做到”。",
    ex: [
      ["You're supposed to be in your cell.", "你本该待在牢房里。"],
      ["This was supposed to be simple.", "这事本来应该很简单的。"],
      ["Nobody's supposed to know about the tunnel.", "按说没人该知道地道的事。"]
    ]
  },
  "have to": {
    zh: "必须；不得不",
    pos: "phr.",
    note: "否定 have to = 不必；mustn't = 禁止，注意区分。",
    ex: [
      ["I did what I had to.", "我做了我必须做的事。"],
      ["We have to move before they count heads.", "我们得在他们点名之前行动。"],
      ["You don't have to explain. I get it.", "你不用解释，我明白。"]
    ]
  },
  "no matter": {
    zh: "无论；不管",
    pos: "phr.",
    note: "no matter what/who/how/when = 无论什么/谁/怎样/何时。",
    ex: [
      ["No matter what happens, we stick together.", "不管发生什么，我们都在一起。"],
      ["No matter how many times I ask, he says nothing.", "不管我问多少次，他都不说话。"],
      ["I'll find you, no matter where they take you.", "不管他们把你带到哪儿，我都会找到你。"]
    ]
  },
  "instead of": {
    zh: "代替；而不是",
    pos: "phr. prep.",
    note: "后接名词或动名词，不能接 to do。",
    ex: [
      ["Stop waiting for permission instead of making a plan.", "别等着别人批准，去制定计划。"],
      ["He watched instead of helping.", "他就在旁边看着，也不帮忙。"],
      ["Let's take the tunnel instead of the front gate.", "我们走地道，不走正门。"]
    ]
  },
  "as long as": {
    zh: "只要",
    pos: "phr. conj.",
    note: "引导条件状语从句，从句用一般现在时表将来。",
    ex: [
      ["As long as we're together, we've got a chance.", "只要我们在一起，就有机会。"],
      ["You can stay as long as you keep quiet.", "只要你保持安静，就可以留下。"],
      ["As long as nobody talks, we're fine.", "只要没人开口，我们就没事。"]
    ]
  },
  "so far": {
    zh: "到目前为止",
    pos: "phr.",
    note: "常与现在完成时连用。",
    ex: [
      ["So far, so good.", "到目前为止，一切顺利。"],
      ["Nobody's noticed the hole so far.", "到目前为止还没人发现那个洞。"],
      ["That's the best plan we've had so far.", "这是我们目前为止最好的计划。"]
    ]
  },
  "at least": {
    zh: "至少",
    pos: "phr.",
    note: "也可表示“退一步说”，用于安慰。",
    ex: [
      ["At least we know where he is.", "至少我们知道他在哪儿。"],
      ["Give me at least two hours.", "至少给我两个小时。"],
      ["It's not much, but at least it's honest work.", "钱不多，但至少是正经活儿。"]
    ]
  },
  "right away": {
    zh: "立刻；马上",
    pos: "phr.",
    note: "比 immediately 更口语，也可说 right now。",
    ex: [
      ["Get the doctor here right away.", "马上叫医生来。"],
      ["I knew right away something was wrong.", "我立刻就知道出事了。"],
      ["We move right away, before the shift change.", "我们马上行动，赶在换班之前。"]
    ]
  },
  "by the way": {
    zh: "顺便说一下",
    pos: "phr.",
    note: "用于转换话题或补充信息。",
    ex: [
      ["By the way, your brother called.", "顺便说一下，你弟弟打过电话。"],
      ["By the way, the truck's already at the gate.", "顺便说一句，卡车已经到门口了。"],
      ["By the way, don't mention this to anyone.", "顺便说一句，这事别跟任何人提。"]
    ]
  },
  "in case": {
    zh: "以防万一；万一",
    pos: "phr.",
    note: "in case + 从句（不用 will）；in case of + 名词。",
    ex: [
      ["Take the map in case the radio dies.", "带上地图，以防对讲机没电。"],
      ["I brought two sets of keys, just in case.", "我带了两套钥匙，以防万一。"],
      ["In case you forgot, we're still in prison.", "提醒你一下，我们还在监狱里。"]
    ]
  },
  "as soon as": {
    zh: "一……就……",
    pos: "phr. conj.",
    note: "引导时间状语从句，主句用将来时，从句用现在时。",
    ex: [
      ["Call me as soon as you land.", "你一落地就给我打电话。"],
      ["As soon as the lights go out, we start digging.", "灯一灭我们就开始挖。"],
      ["I'll be there as soon as I can.", "我会尽快赶到。"]
    ]
  },
  "even though": {
    zh: "即使；虽然",
    pos: "phr. conj.",
    note: "引导让步状语从句，比 although 语气更强。",
    ex: [
      ["Even though he lied, I still trust him.", "尽管他撒了谎，我还是相信他。"],
      ["Even though we're out, we're not free.", "就算我们出来了，也不算自由。"],
      ["She kept digging even though her hands were bleeding.", "尽管手在流血，她还在挖。"]
    ]
  },
  "what if": {
    zh: "如果……怎么办；要是……呢",
    pos: "phr.",
    note: "用于提出假设或试探性建议。",
    ex: [
      ["What if the door's already locked?", "要是门已经锁上了怎么办？"],
      ["What if we don't have to run at all?", "要是我们根本不用逃呢？"],
      ["What if I told you I could get us out?", "要是我说我能带我们出去呢？"]
    ]
  },
  "no way": {
    zh: "不可能；没门",
    pos: "phr.",
    note: "口语强烈否定，也可表示惊叹“不会吧！”。",
    ex: [
      ["No way am I going back in there.", "我绝不回那里面去。"],
      ["No way. That's suicide.", "不行，那是送死。"],
      ["No way! You actually did it.", "不会吧！你真做到了。"]
    ]
  },
  "never mind": {
    zh: "没关系；算了；别在意",
    pos: "phr.",
    note: "也用于“更不用说”：never mind the cost。",
    ex: [
      ["Never mind. Forget I said anything.", "算了，当我没说。"],
      ["Never mind the guard — he's asleep.", "别管那狱警，他睡着了。"],
      ["It's a long story. Never mind.", "说来话长，别问了。"]
    ]
  },
  "for good": {
    zh: "永远地；一劳永逸地",
    pos: "phr.",
    note: "等于 forever，常与 leave / quit 连用。",
    ex: [
      ["This time we're leaving for good.", "这次我们走了就不回来了。"],
      ["He quit for good after the accident.", "事故之后他彻底不干了。"],
      ["I'm done with that place for good.", "我跟那地方彻底了断了。"]
    ]
  },
  "all of a sudden": {
    zh: "突然",
    pos: "phr.",
    note: "等于 suddenly，多用于口语叙述。",
    ex: [
      ["All of a sudden the lights went out.", "突然灯全灭了。"],
      ["All of a sudden he stopped talking.", "他突然不说话了。"],
      ["Then, all of a sudden, we heard the siren.", "然后，突然间，我们听到了警笛。"]
    ]
  },
  "sooner or later": {
    zh: "迟早",
    pos: "phr.",
    note: "表示“早晚会发生”。",
    ex: [
      ["Sooner or later they'll count the beds.", "他们迟早会数床位的。"],
      ["Sooner or later you have to tell her the truth.", "你迟早得告诉她真相。"],
      ["He'll come back. Sooner or later.", "他会回来的，迟早的事。"]
    ]
  },
  "take it easy": {
    zh: "放轻松；别紧张；保重",
    pos: "phr.",
    note: "也可用于道别，等于“慢走”。",
    ex: [
      ["Take it easy, all right? Nobody's chasing you.", "放松点行吗？没人在追你。"],
      ["Take it easy on the stairs — they're wet.", "下楼梯小心点，是湿的。"],
      ["Take it easy, man. See you around.", "保重，老兄，回头见。"]
    ]
  },
  "take your time": {
    zh: "慢慢来；别急",
    pos: "phr.",
    note: "常用于安抚对方，不必赶时间。",
    ex: [
      ["Take your time. We've got all night.", "慢慢来，我们有一整晚。"],
      ["Take your time with the lock — one turn too fast and it jams.", "锁慢慢来，转太快就卡住了。"],
      ["— I need a minute. — Take your time.", "——我需要缓一下。——慢慢来。"]
    ]
  },
  "keep in mind": {
    zh: "记住；考虑到",
    pos: "phr.",
    note: "后面接 that 从句，或 keep sth in mind。",
    ex: [
      ["Keep in mind that the cameras reset every hour.", "记住摄像头每小时重置一次。"],
      ["Keep that in mind when you talk to him.", "跟他说话时记住这一点。"],
      ["Keep in mind we only get one shot.", "记住我们只有一次机会。"]
    ]
  },
  "keep an eye on": {
    zh: "留意；照看；盯着",
    pos: "phr.",
    note: "keep an eye on sb/sth = 盯着某人/某物。",
    ex: [
      ["Keep an eye on the corridor.", "盯着走廊。"],
      ["Can you keep an eye on my brother for me?", "能帮我照看一下我弟弟吗？"],
      ["Somebody's been keeping an eye on us.", "有人在盯着我们。"]
    ]
  },
  "make sense": {
    zh: "有道理；讲得通",
    pos: "phr.",
    note: "否定 make no sense = 完全说不通。",
    ex: [
      ["That doesn't make sense.", "这说不通。"],
      ["For once, your plan makes sense.", "难得，你的计划居然有道理。"],
      ["It makes sense if you think about the timing.", "想想时间点就说得通了。"]
    ]
  },
  "get rid of": {
    zh: "摆脱；除掉；扔掉",
    pos: "phr. v.",
    note: "语气比 remove 更强，常指“清理掉麻烦”。",
    ex: [
      ["We need to get rid of the evidence.", "我们得把证据处理掉。"],
      ["How do we get rid of the guard?", "我们怎么把狱警支开？"],
      ["I finally got rid of that car.", "我终于把那辆车处理掉了。"]
    ]
  },
  "get used to": {
    zh: "习惯于",
    pos: "phr.",
    note: "to 是介词，后接名词或动名词。",
    ex: [
      ["You get used to the noise after a while.", "过一阵子你就习惯这噪音了。"],
      ["I never got used to the smell.", "我一直没习惯那股味道。"],
      ["Get used to it. This is your life now.", "习惯吧，这就是你现在的日子。"]
    ]
  },
  "come on": {
    zh: "来吧；加油；别这样",
    pos: "phr.",
    note: "万能口语，表示催促、鼓励或不满。",
    ex: [
      ["Come on, we're going to be late.", "快点，我们要迟到了。"],
      ["Come on, you can do this.", "加油，你能行的。"],
      ["Oh, come on. You can't be serious.", "拜托，你不是认真的吧。"]
    ]
  },
  "go ahead": {
    zh: "继续；请便；你先来",
    pos: "phr.",
    note: "允许对方做某事时最常用的说法。",
    ex: [
      ["— Can I ask you something? — Go ahead.", "——能问你个事吗？——问吧。"],
      ["Go ahead, I'm listening.", "说吧，我听着。"],
      ["You go ahead. I'll catch up.", "你先走，我随后跟上。"]
    ]
  },
  "turn out": {
    zh: "结果是；证明是；出席",
    pos: "phr. v.",
    note: "turn out to be / turn out that...，表示出乎意料的结果。",
    ex: [
      ["It turned out he was working for them all along.", "结果他一直替他们干活。"],
      ["The plan turned out better than we thought.", "计划的结果比我们想的要好。"],
      ["Nobody turned out for the meeting.", "没人来开会。"]
    ]
  },
  "run out of": {
    zh: "用完；耗尽",
    pos: "phr. v.",
    note: "主语是“人/机构”，宾语是被用完的东西。",
    ex: [
      ["We're running out of time.", "我们时间不多了。"],
      ["They ran out of bullets after the second wave.", "第二波之后他们子弹就打光了。"],
      ["I ran out of excuses.", "我编不出借口了。"]
    ]
  },
  "deal with": {
    zh: "处理；应付；对付",
    pos: "phr. v.",
    note: "deal with sb = 跟某人打交道 / 收拾某人。",
    ex: [
      ["I'll deal with him.", "我来对付他。"],
      ["We've got bigger problems to deal with.", "我们有更大的问题要处理。"],
      ["How do you deal with the noise?", "你怎么应付这种噪音？"]
    ]
  },
  "depend on": {
    zh: "依赖；取决于",
    pos: "phr. v.",
    note: "It depends on... = 这要看……",
    ex: [
      ["It depends on the weather.", "这要看天气。"],
      ["We're depending on that truck.", "我们就指望那辆卡车了。"],
      ["You can depend on me.", "你可以指望我。"]
    ]
  },
  "look forward to": {
    zh: "期待；盼望",
    pos: "phr. v.",
    note: "to 是介词，后接名词或动名词。",
    ex: [
      ["I'm looking forward to a hot shower.", "我盼着洗个热水澡。"],
      ["We look forward to hearing from you.", "期待您的回复。"],
      ["He wasn't looking forward to the meeting.", "他并不期待那次会面。"]
    ]
  },
  "give up": {
    zh: "放弃；认输",
    pos: "phr. v.",
    note: "give up on sb = 对某人放弃希望。",
    ex: [
      ["Don't give up now. We're almost there.", "别现在放弃，我们就快到了。"],
      ["He gave up smoking ten years ago.", "他十年前戒了烟。"],
      ["I'm not giving up on him.", "我不会放弃他。"]
    ]
  },
  "put up with": {
    zh: "忍受；容忍",
    pos: "phr. v.",
    note: "口语中比 tolerate 更常用。",
    ex: [
      ["I can't put up with this anymore.", "我再也受不了这个了。"],
      ["How do you put up with him?", "你怎么受得了他？"],
      ["We put up with the cold for three nights.", "我们在寒冷里熬了三个晚上。"]
    ]
  },
  "keep up": {
    zh: "跟上；保持；继续",
    pos: "phr. v.",
    note: "keep up with sb = 跟上某人。",
    ex: [
      ["Keep up. We don't have time to wait.", "跟上，我们没时间等。"],
      ["I can't keep up with you.", "我跟不上你。"],
      ["Keep up the good work.", "继续保持。"]
    ]
  },
  "get through": {
    zh: "熬过；通过；接通电话",
    pos: "phr. v.",
    note: "get through to sb = 联系上某人 / 让某人听进去。",
    ex: [
      ["We just have to get through the night.", "我们只要熬过今晚。"],
      ["I couldn't get through — the line was dead.", "我打不通，线路断了。"],
      ["Nothing gets through to him anymore.", "现在什么都打动不了他。"]
    ]
  },
  "take over": {
    zh: "接管；接手",
    pos: "phr. v.",
    note: "也可指“占据（空间/时间）”。",
    ex: [
      ["You take over the watch at two.", "两点你来接班。"],
      ["The company was taken over last spring.", "公司去年春天被收购了。"],
      ["Fear took over and he ran.", "恐惧占了上风，他跑了。"]
    ]
  },
  "hold up": {
    zh: "举起；支撑；耽搁；抢劫",
    pos: "phr. v.",
    note: "多义短语，看语境判断。",
    ex: [
      ["Hold up your hands where I can see them.", "把手举起来让我看见。"],
      ["What's holding things up?", "是什么耽误了进度？"],
      ["They held up a liquor store on Fifth.", "他们抢了第五街的一家酒铺。"]
    ]
  },
  "cut off": {
    zh: "切断；中断；使隔绝",
    pos: "phr. v.",
    note: "常用被动：be cut off from the outside world。",
    ex: [
      ["They cut the power at midnight.", "他们午夜切断了电源。"],
      ["We're cut off from the main road.", "我们和主路断了联系。"],
      ["Don't cut me off — I'm not finished.", "别打断我，我还没说完。"]
    ]
  },
  "pick up": {
    zh: "接人；拿起；学会；加快",
    pos: "phr. v.",
    note: "多义：pick up the phone 接电话；pick up a language 学会一门语言。",
    ex: [
      ["I'll pick you up at the corner.", "我在街角接你。"],
      ["Pick up the phone. It's him.", "接电话，是他。"],
      ["She picked up Spanish in six months.", "她六个月就学会了西班牙语。"]
    ]
  },
  "point out": {
    zh: "指出；提醒",
    pos: "phr. v.",
    note: "point out that... / point sth out to sb。",
    ex: [
      ["Let me point out one small problem.", "让我指出一个小问题。"],
      ["He pointed out that the gate was unlocked.", "他指出大门没锁。"],
      ["I'm just pointing out the obvious.", "我只是把明摆着的事说出来。"]
    ]
  },
  "sort out": {
    zh: "整理；解决；弄清楚",
    pos: "phr. v.",
    note: "英式口语常用，等于 figure out / fix。",
    ex: [
      ["We'll sort it out in the morning.", "我们早上再解决。"],
      ["Somebody has to sort out this mess.", "总得有人来收拾这个烂摊子。"],
      ["I need to sort out my papers before the hearing.", "听证会前我得把文件整理好。"]
    ]
  },
  "check out": {
    zh: "查看；核实；结账离开",
    pos: "phr. v.",
    note: "口语 check it out = 你看这个。",
    ex: [
      ["Check out the second floor — it's empty.", "去看看二楼，是空的。"],
      ["We checked out of the motel at six.", "我们六点退了房。"],
      ["Check it out. He left the door open.", "你看，他把门留开了。"]
    ]
  },
  "come up with": {
    zh: "想出；提出（主意、办法）",
    pos: "phr. v.",
    note: "宾语通常是 idea / plan / excuse。",
    ex: [
      ["Who came up with this plan?", "这计划是谁想出来的？"],
      ["I need to come up with a better excuse.", "我得想个更好的借口。"],
      ["He came up with the money overnight.", "他一夜之间就弄到了钱。"]
    ]
  },
  "go through": {
    zh: "经历；仔细检查；穿过",
    pos: "phr. v.",
    note: "go through sth = 翻查某物 / 经历某事。",
    ex: [
      ["She's been through a lot this year.", "她今年经历了很多。"],
      ["They went through every file in the office.", "他们翻了办公室里的每个文件。"],
      ["Let's go through the plan one more time.", "我们把计划再过一遍。"]
    ]
  },
  "put off": {
    zh: "推迟；拖延；使反感",
    pos: "phr. v.",
    note: "put sb off = 让某人失去兴趣。",
    ex: [
      ["Don't put it off any longer.", "别再拖了。"],
      ["The meeting was put off until Friday.", "会议推迟到周五。"],
      ["The smell put me off my food.", "那味道让我没了胃口。"]
    ]
  },
  "turn down": {
    zh: "拒绝；调小（音量）",
    pos: "phr. v.",
    note: "拒绝提议用 turn down，比 refuse 口语。",
    ex: [
      ["He turned down the deal.", "他拒绝了这个交易。"],
      ["Turn it down — the guards can hear.", "小点声，狱警能听见。"],
      ["She turned down a job in New York.", "她拒绝了纽约的一份工作。"]
    ]
  },
  "back up": {
    zh: "支持；备份；后退",
    pos: "phr. v.",
    note: "back sb up = 给某人撑腰。",
    ex: [
      ["I need you to back me up in there.", "我需要你在里面支持我。"],
      ["Back up. Slowly. Don't touch anything.", "后退，慢一点，什么都别碰。"],
      ["Back up the files before you wipe the drive.", "清盘之前先备份文件。"]
    ]
  },
  "catch up": {
    zh: "追上；赶上；叙旧",
    pos: "phr. v.",
    note: "catch up with sb = 追上某人 / 终于找上某人（麻烦）。",
    ex: [
      ["Go ahead, I'll catch up.", "你先走，我会赶上。"],
      ["We need to catch up on sleep.", "我们得补补觉。"],
      ["The past always catches up with you.", "过去总会找上你。"]
    ]
  },
  "give in": {
    zh: "屈服；让步",
    pos: "phr. v.",
    note: "give in to sth = 向……妥协。",
    ex: [
      ["Don't give in to him.", "别向他让步。"],
      ["He finally gave in and signed.", "他最后屈服，签了字。"],
      ["I'm not giving in this time.", "这次我不会让步。"]
    ]
  },
  "let go": {
    zh: "放手；放开；放下（过去）",
    pos: "phr. v.",
    note: "let go of sth = 松手 / 放下。",
    ex: [
      ["Let go of the rope!", "松开绳子！"],
      ["You have to let go of what happened.", "你得放下过去发生的事。"],
      ["He wouldn't let go of the past.", "他不肯放下过去。"]
    ]
  },
  "move on": {
    zh: "继续前进；放下过去；换下一个",
    pos: "phr. v.",
    note: "常用于劝人别纠缠旧事。",
    ex: [
      ["It's over. Time to move on.", "结束了，该往前看了。"],
      ["We move on at first light.", "我们天亮就出发。"],
      ["Can we move on to the next point?", "我们能进入下一点吗？"]
    ]
  },
  "stand by": {
    zh: "支持；待命；袖手旁观",
    pos: "phr. v.",
    note: "stand by sb = 支持某人；stand by = 待命。",
    ex: [
      ["I'll stand by you no matter what.", "不管怎样我都支持你。"],
      ["Stand by. We're not clear yet.", "待命，还没确认安全。"],
      ["He just stood by and watched.", "他就在旁边看着。"]
    ]
  },
  "in charge of": {
    zh: "负责；掌管",
    pos: "phr.",
    note: "be in charge of sth；反义 take charge。",
    ex: [
      ["Who's in charge here?", "这里谁负责？"],
      ["She's in charge of the whole floor.", "整层都归她管。"],
      ["I'm in charge of the schedule.", "时间表由我负责。"]
    ]
  },
  "be about to": {
    zh: "正要；即将",
    pos: "phr.",
    note: "表示非常近的将来，常与 when 连用。",
    ex: [
      ["I was about to call you.", "我正要给你打电话。"],
      ["We're about to find out.", "我们马上就会知道。"],
      ["The shift change is about to happen.", "就要换班了。"]
    ]
  },
  "be worth": {
    zh: "值得",
    pos: "phr.",
    note: "be worth doing（主动形式表被动）。",
    ex: [
      ["It's worth a try.", "值得一试。"],
      ["Is it worth the risk?", "值得冒这个险吗？"],
      ["That place is worth a look.", "那地方值得一看。"]
    ]
  },
  "had better": {
    zh: "最好（含警告意味）",
    pos: "phr.",
    note: "had better do，不说 had better to do。",
    ex: [
      ["You'd better not be lying to me.", "你最好别骗我。"],
      ["We'd better move.", "我们最好行动了。"],
      ["You'd better tell him before someone else does.", "你最好赶在别人之前告诉他。"]
    ]
  },
  "would rather": {
    zh: "宁愿",
    pos: "phr.",
    note: "would rather do A than do B。",
    ex: [
      ["I'd rather die than go back.", "我宁愿死也不回去。"],
      ["Would you rather wait here?", "你宁愿在这儿等吗？"],
      ["I'd rather you didn't tell anyone.", "我宁愿你别告诉任何人。"]
    ]
  },
  "make a difference": {
    zh: "有影响；起作用；改变局面",
    pos: "phr.",
    note: "常用来鼓励：It makes a difference.",
    ex: [
      ["One word from you could make a difference.", "你一句话就可能改变局面。"],
      ["It doesn't make any difference now.", "现在做什么都没用了。"],
      ["Small things make a difference.", "小事也会有影响。"]
    ]
  },
  "take a chance": {
    zh: "冒险一试；碰碰运气",
    pos: "phr.",
    note: "take a chance on sth = 赌一把。",
    ex: [
      ["Sometimes you have to take a chance.", "有时候你得赌一把。"],
      ["I took a chance and it paid off.", "我赌了一把，赌赢了。"],
      ["Are you willing to take that chance?", "你愿意冒这个险吗？"]
    ]
  },
  "get away": {
    zh: "逃走；离开；脱身",
    pos: "phr. v.",
    note: "get away with sth = 做了坏事却逃脱惩罚。",
    ex: [
      ["They got away in a white van.", "他们坐一辆白色面包车跑了。"],
      ["I need to get away for a few days.", "我需要离开几天。"],
      ["He can't get away with this.", "他不能就这么逍遥法外。"]
    ]
  },
  "get back": {
    zh: "回来；取回；报复",
    pos: "phr. v.",
    note: "get back at sb = 报复某人。",
    ex: [
      ["I'll get back to you tonight.", "我今晚回复你。"],
      ["We have to get back before the count.", "我们得在点名之前回去。"],
      ["He's just trying to get back at me.", "他不过是想报复我。"]
    ]
  },
  "work out": {
    zh: "解决；锻炼；结果顺利",
    pos: "phr. v.",
    note: "Things work out = 事情会有办法的。",
    ex: [
      ["It'll work out. It always does.", "会有办法的，一向如此。"],
      ["We worked out a deal with the driver.", "我们跟司机谈成了一笔交易。"],
      ["He works out every morning.", "他每天早上锻炼。"]
    ]
  },
  "watch out": {
    zh: "小心；提防",
    pos: "phr. v.",
    note: "watch out for sth = 提防某物。",
    ex: [
      ["Watch out — the floor's wet.", "小心，地板是湿的。"],
      ["Watch out for the dogs.", "当心那些狗。"],
      ["You'd better watch out.", "你最好小心点。"]
    ]
  },
  "put together": {
    zh: "组装；拼凑；组织",
    pos: "phr. v.",
    note: "也可形容人：well put together = 打扮得体。",
    ex: [
      ["We put the plan together in one night.", "我们一晚上就把计划拼出来了。"],
      ["Help me put this thing together.", "帮我把它组装起来。"],
      ["He's putting together a team.", "他正在组一个团队。"]
    ]
  },
  "show off": {
    zh: "炫耀；卖弄",
    pos: "phr. v.",
    note: "略带贬义。",
    ex: [
      ["Stop showing off.", "别炫耀了。"],
      ["He was showing off for the new girl.", "他在新来的女孩面前显摆。"],
      ["She showed off the ring to everyone.", "她向所有人炫耀那枚戒指。"]
    ]
  },
  "run into": {
    zh: "偶然遇到；撞上；陷入",
    pos: "phr. v.",
    note: "run into trouble = 遇到麻烦。",
    ex: [
      ["I ran into your brother downtown.", "我在市中心碰到你弟弟了。"],
      ["We ran into some trouble at the border.", "我们在边境遇到点麻烦。"],
      ["Careful — you'll run right into a guard.", "小心，你会直接撞上狱警。"]
    ]
  },
  "look into": {
    zh: "调查；研究",
    pos: "phr. v.",
    note: "比 investigate 口语。",
    ex: [
      ["I'll look into it.", "我会去查一下。"],
      ["They're looking into the missing file.", "他们在查那份失踪的文件。"],
      ["We should look into the schedule.", "我们应该研究一下时间表。"]
    ]
  },
  "keep away": {
    zh: "远离；避开",
    pos: "phr. v.",
    note: "keep away from sb/sth。",
    ex: [
      ["Keep away from the windows.", "离窗户远点。"],
      ["He told me to keep away from you.", "他让我离你远点。"],
      ["Keep the kids away from the water.", "别让孩子靠近水。"]
    ]
  },
  "in front of": {
    zh: "在……前面",
    pos: "phr. prep.",
    note: "空间或抽象意义上“当着……的面”。",
    ex: [
      ["Don't do that in front of the guards.", "别在狱警面前这么做。"],
      ["He parked right in front of the gate.", "他就把车停在门口。"],
      ["I can't say it in front of her.", "我当着她面说不出口。"]
    ]
  },
  "on purpose": {
    zh: "故意地",
    pos: "phr.",
    note: "反义 by accident = 偶然地。",
    ex: [
      ["You did that on purpose.", "你是故意的。"],
      ["I didn't do it on purpose.", "我不是故意的。"],
      ["He left the door open on purpose.", "他故意把门留开。"]
    ]
  },
  "at first": {
    zh: "起初；一开始",
    pos: "phr.",
    note: "常与 but later 对比使用。",
    ex: [
      ["At first nobody believed him.", "起初没人相信他。"],
      ["At first it looked like a mistake.", "一开始这看起来像个错误。"],
      ["At first I thought you were joking.", "我一开始以为你在开玩笑。"]
    ]
  },
  "in fact": {
    zh: "事实上；其实",
    pos: "phr.",
    note: "用于补充或修正前文。",
    ex: [
      ["In fact, we've been ready for a week.", "事实上，我们一周前就准备好了。"],
      ["He's not a guard. In fact, he's a cop.", "他不是狱警，事实上，他是警察。"],
      ["In fact, nobody knows the whole plan.", "事实上，没人知道完整计划。"]
    ]
  },
  "thanks to": {
    zh: "多亏；由于",
    pos: "phr.",
    note: "可褒可贬。",
    ex: [
      ["Thanks to you, we lost a day.", "多亏了你，我们耽误了一天。"],
      ["Thanks to her, nobody got hurt.", "多亏了她，没人受伤。"],
      ["We got out thanks to a truck driver.", "多亏一个卡车司机我们才逃出来。"]
    ]
  },
  "because of": {
    zh: "因为；由于",
    pos: "phr. prep.",
    note: "后接名词/代词/动名词，不能接从句。",
    ex: [
      ["We're late because of the rain.", "因为下雨我们迟到了。"],
      ["Because of you, he's in there.", "因为你，他进了那里。"],
      ["The count was moved because of the storm.", "因为暴风雨，点名时间改了。"]
    ]
  },
  "according to": {
    zh: "根据；按照",
    pos: "phr. prep.",
    note: "后接名词，不接表示“我”的观点（不说 according to me）。",
    ex: [
      ["According to the file, he's dead.", "根据档案，他已经死了。"],
      ["According to the schedule, we have two hours.", "按时间表我们有两个小时。"],
      ["According to him, nothing happened.", "按他的说法，什么都没发生。"]
    ]
  },

  /* ---------- 《越狱》台词里出现的口语短语 ---------- */
  "one more thing": {
    zh: "还有一件事（临出门/临结束时补一句）",
    pos: "phr.",
    note: "口语里最常用的“补充说明”开场，几乎总在句首。",
    ex: [
      ["One more thing — don't call me at the house.", "还有一件事，别往家里打电话。"],
      ["It's always one more thing with you.", "跟你在一块儿永远有“还有一件事”。"],
      ["One more thing, and then we're free.", "再来一件，然后我们就自由了。"]
    ]
  },
  "either way": {
    zh: "不管哪种情况；反正",
    pos: "phr.",
    note: "用于二选一之后收束结论，等于 in both cases。",
    ex: [
      ["Either way, we're digging tonight.", "不管怎样，今晚就挖。"],
      ["Either way, it's a lie.", "不管哪种，都是谎话。"],
      ["Either way, you lose.", "反正你都会输。"]
    ]
  },
  "still alive": {
    zh: "还活着；仍然在世",
    pos: "phr.",
    note: "still 强调“到现在还”，常带一点意外或庆幸。",
    ex: [
      ["And we're still alive.", "可我们还活着。"],
      ["Is he still alive?", "他还活着吗？"],
      ["As long as he's still alive, we have a chance.", "只要他还活着，我们就有机会。"]
    ]
  },
  "look around": {
    zh: "环顾四周；四处看看",
    pos: "phr. v.",
    note: "look around for sth = 到处找某物。",
    ex: [
      ["Look around. You're breathing.", "看看四周，你还在呼吸。"],
      ["We're not here to look around.", "我们不是来观光的。"],
      ["Look around for a back door.", "找找有没有后门。"]
    ]
  },
  "the hard way": {
    zh: "用硬办法；吃一堑才学会",
    pos: "phr.",
    note: "常与 learn / do it 连用：learn the hard way = 吃了苦头才明白。",
    ex: [
      ["We can do this the hard way or the easy way.", "可以硬来，也可以好好来。"],
      ["Then we do it the hard way.", "那就硬来。"],
      ["I learned that the hard way.", "这一点我是吃了苦头才明白的。"]
    ]
  },
  "same thing": {
    zh: "一回事；一样的",
    pos: "phr.",
    note: "用于指出两件事本质相同，常带反驳语气。",
    ex: [
      ["That's the same thing and you know it.", "这是一回事，你心里清楚。"],
      ["Surviving and staying alive — same thing.", "活下来和活着，是一回事。"],
      ["It's not the same thing.", "这不一样。"]
    ]
  },
  "difference between": {
    zh: "……之间的区别",
    pos: "phr.",
    note: "tell the difference between A and B = 分辨 A 和 B。",
    ex: [
      ["There's a difference between being watched and being trapped.", "被盯着和被关住是两回事。"],
      ["There's a difference between necessary and stupid.", "必须和愚蠢是两回事。"],
      ["Can you tell the difference between the two?", "你能分辨这两者的区别吗？"]
    ]
  },
  "nothing about": {
    zh: "……一点也不……；关于……什么都没",
    pos: "phr.",
    note: "Nothing about this is normal = 这事一点都不正常。",
    ex: [
      ["Nothing about this is normal.", "这事一点都不正常。"],
      ["There's nothing about him I trust.", "他身上没有一处让我信得过。"],
      ["Nothing about that night makes sense.", "那天晚上的事没一样说得通。"]
    ]
  },
  "don't move": {
    zh: "别动",
    pos: "phr.",
    note: "命令句，危险场景高频。",
    ex: [
      ["Don't move. Don't make a sound.", "别动，别出声。"],
      ["Hold your breath. Don't move.", "屏住呼吸，别动。"],
      ["Don't move until I say so.", "我不发话你就别动。"]
    ]
  },
  "out of your mind": {
    zh: "疯了；脑子进水了",
    pos: "phr.",
    note: "也可说 out of my mind（我疯了）。",
    ex: [
      ["Are you out of your mind?", "你疯了吗？"],
      ["I must have been out of my mind.", "我当时一定是脑子坏了。"],
      ["You're out of your mind if you think that'll work.", "你要是觉得那能成，你就是疯了。"]
    ]
  },
  "might as well": {
    zh: "倒不如；还不如",
    pos: "phr.",
    note: "表示“既然没别的办法，那就……”，语气无奈。",
    ex: [
      ["We might as well wear a sign.", "还不如直接挂个牌子。"],
      ["Might as well get it over with.", "不如早点把这事了结。"],
      ["Then we might as well try.", "那我们不如试试。"]
    ]
  },
  "first thing": {
    zh: "第一件事；一大早",
    pos: "phr.",
    note: "first thing (in the morning) = 一早第一件事。",
    ex: [
      ["First thing we do is get new clothes.", "第一件事是弄新衣服。"],
      ["I'll call him first thing tomorrow.", "我明天一早就给他打电话。"],
      ["That's the first thing they check.", "那是他们第一个查的地方。"]
    ]
  },
  "come back from": {
    zh: "从……回来；从……中挽回",
    pos: "phr. v.",
    note: "cross a line you can't come back from = 越过了回不去的线。",
    ex: [
      ["I've crossed a few lines I can't come back from.", "我越过了几条回不去的线。"],
      ["He just came back from Chicago.", "他刚从芝加哥回来。"],
      ["You can't come back from that.", "那事没法挽回。"]
    ]
  },
  "give me a hand": {
    zh: "帮我一把",
    pos: "phr.",
    note: "也可以说 give me a hand with sth。",
    ex: [
      ["Give me a hand. On three.", "搭把手，数到三。"],
      ["Can you give me a hand with this?", "能帮我弄一下这个吗？"],
      ["Give me a hand, will you?", "帮我一下行吗？"]
    ]
  },
  "hold your breath": {
    zh: "屏住呼吸；别喘气",
    pos: "phr.",
    note: "引申义：don't hold your breath = 别抱太大希望。",
    ex: [
      ["Hold your breath. Don't move.", "屏住呼吸，别动。"],
      ["I wouldn't hold my breath.", "我可不会抱太大希望。"],
      ["We held our breath until the car passed.", "我们屏住呼吸，直到那辆车开过去。"]
    ]
  },
  "in the middle of nowhere": {
    zh: "荒郊野外；前不着村后不着店",
    pos: "phr.",
    note: "强调地方偏远、四周什么都没有。",
    ex: [
      ["Five million dollars, buried in the middle of nowhere.", "五百万美元，埋在荒郊野外。"],
      ["We broke down in the middle of nowhere.", "我们在荒郊野岭抛锚了。"],
      ["Why would he hide it in the middle of nowhere?", "他为什么要把东西藏在那种鬼地方？"]
    ]
  },
  "one step ahead": {
    zh: "领先一步；棋高一着",
    pos: "phr.",
    note: "对应地：one step behind = 落后一步。",
    ex: [
      ["Whoever's been one step ahead of us since day one.", "那个从第一天起就比我们快一步的人。"],
      ["He's always one step ahead.", "他总是快人一步。"],
      ["We have to stay one step ahead of them.", "我们得一直比他们快一步。"]
    ]
  },
  "two steps behind": {
    zh: "落后两步；紧追在后",
    pos: "phr.",
    note: "常形容被追得很紧。",
    ex: [
      ["The Feds are two steps behind us.", "联邦探员就差我们两步。"],
      ["Two steps? Try one.", "两步？一步吧。"],
      ["I've been two steps behind him all year.", "这一年我一直比他慢两拍。"]
    ]
  },
  "make a call": {
    zh: "打个电话；做决定",
    pos: "phr.",
    note: "两种含义都常用：打电话 / 拍板。",
    ex: [
      ["I need to make a call.", "我需要打个电话。"],
      ["Somebody has to make a call here.", "总得有人拍板。"],
      ["Make the call. Two minutes.", "打吧，两分钟。"]
    ]
  },
  "hang up": {
    zh: "挂断电话",
    pos: "phr. v.",
    note: "反义 pick up（接电话）。",
    ex: [
      ["If it goes bad, you hang up and you walk away.", "要是情况不对，你就挂掉，然后走开。"],
      ["Don't hang up on me.", "别挂我电话。"],
      ["He hung up before I could answer.", "我还没来得及回答他就挂了。"]
    ]
  },
  "walk away": {
    zh: "走开；一走了之",
    pos: "phr. v.",
    note: "walk away from sth = 放弃某事。",
    ex: [
      ["You hang up and you walk away.", "你挂掉电话就走开。"],
      ["You don't just walk away from this.", "这事你不能一走了之。"],
      ["He walked away from a fortune.", "他放弃了一大笔钱。"]
    ]
  },
  "at this rate": {
    zh: "照这速度；这样下去",
    pos: "phr.",
    note: "常带悲观预期。",
    ex: [
      ["Neither are we, at this rate.", "照这速度，我们也跑不了。"],
      ["At this rate we'll never finish.", "这样下去我们永远做不完。"],
      ["At this rate, you'll be dead by morning.", "照这样，你活不到早上。"]
    ]
  },
  "make it count": {
    zh: "让它有价值；别浪费（这次机会）",
    pos: "phr.",
    note: "常用于机会只有一次的场景。",
    ex: [
      ["One call. Make it count.", "只能打一次，别说废话。"],
      ["You get one shot — make it count.", "你只有一次机会，别浪费。"],
      ["Make it count, because we don't get another.", "好好把握，我们没有下一次。"]
    ]
  },
  "up front": {
    zh: "先付；提前；（形容人）直率",
    pos: "phr.",
    note: "pay half up front = 先付一半。",
    ex: [
      ["He wants half up front.", "他要先付一半。"],
      ["I'll be up front with you.", "我跟你说实话。"],
      ["They asked for the money up front.", "他们要求先付款。"]
    ]
  },
  "at first light": {
    zh: "天一亮；拂晓时分",
    pos: "phr.",
    note: "军事/逃亡题材高频时间表达。",
    ex: [
      ["We move on at first light.", "我们天亮就出发。"],
      ["Be ready at first light.", "天一亮就准备好。"],
      ["They'll come at first light.", "他们会在天亮时来。"]
    ]
  },
  "on three": {
    zh: "数到三（就动手）",
    pos: "phr.",
    note: "抬重物、同时行动时的口令。",
    ex: [
      ["Give me a hand. On three.", "搭把手，数到三。"],
      ["On three, we run.", "数到三我们就跑。"],
      ["One, two, three — now!", "一、二、三——现在！"]
    ]
  },
  "so do i": {
    zh: "我也是（回应肯定句）",
    pos: "phr.",
    note: "对应否定句用 neither do I。",
    ex: [
      ["— I'm tired of this. — So am I.", "——我受够了。——我也是。"],
      ["— So do I. That's why we finish it.", "——我也是。所以我们才要了结它。"],
      ["— I hate this. — So do I.", "——我讨厌这样。——我也讨厌。"]
    ]
  },
  "no choice": {
    zh: "没得选；别无选择",
    pos: "phr.",
    note: "have no choice but to do = 只能做某事。",
    ex: [
      ["He has no choice.", "他没得选。"],
      ["We have no choice but to wait.", "我们只能等。"],
      ["Everybody has a choice. That's the problem.", "每个人都有得选，问题就在这儿。"]
    ]
  },
  "keep quiet": {
    zh: "保持安静；别声张",
    pos: "phr.",
    note: "也可指“把某事保密”。",
    ex: [
      ["As long as you keep quiet, you can stay.", "只要你不出声，就可以留下。"],
      ["Keep quiet about the tunnel.", "地道的事别声张。"],
      ["Everybody keep quiet.", "大家都别说话。"]
    ]
  },
  "for sure": {
    zh: "肯定；确定",
    pos: "phr.",
    note: "口语中常单独使用表示“当然”。",
    ex: [
      ["Leave him and he dies for sure.", "留着他肯定死。"],
      ["I don't know for sure.", "我不确定。"],
      ["That's for sure.", "这倒是真的。"]
    ]
  },
  "let me": {
    zh: "让我（做某事）",
    pos: "phr.",
    note: "口语高频开头，也表示“我来吧”。",
    ex: [
      ["Let me see her.", "让我见见她。"],
      ["Let me handle it.", "这事我来处理。"],
      ["Let me get this straight.", "我把话捋清楚。"]
    ]
  },
  "i'm the one": {
    zh: "我才是那个……的人",
    pos: "phr.",
    note: "强调责任归属：I'm the one who paid. = 付账的是我。",
    ex: [
      ["I'm the one who paid.", "付账的是我。"],
      ["I'm the one who took it.", "拿走它的人是我。"],
      ["I'm the one who should apologize.", "该道歉的人是我。"]
    ]
  },
  "what people say": {
    zh: "人们会说的话；人们嘴上说的",
    pos: "phr.",
    note: "常用来评论某句话背后的真实含义。",
    ex: [
      ["That's what people say when they don't trust you.", "这是不信任别人时才会说的话。"],
      ["That's what people say when they're protecting you.", "这是想保护别人时说的话。"],
      ["I don't care what people say.", "我不在乎别人怎么说。"]
    ]
  },
  "still believe": {
    zh: "仍然相信",
    pos: "phr.",
    note: "still 强调“到现在还没改变”。",
    ex: [
      ["Someone who might still believe I'm innocent.", "一个也许还相信我清白的人。"],
      ["I still believe you.", "我还是相信你。"],
      ["Do you still believe that?", "你现在还信那套吗？"]
    ]
  },
  "get caught": {
    zh: "被抓；被逮住",
    pos: "phr. v.",
    note: "get + 过去分词表示“被……”。",
    ex: [
      ["They just get caught later.", "只是早晚被抓。"],
      ["If we get caught, it's over.", "要是被抓，就完了。"],
      ["He got caught stealing.", "他偷东西被抓了。"]
    ]
  },
  "make our own rules": {
    zh: "自己定规矩",
    pos: "phr.",
    note: "make the rules = 定规矩；play by the rules = 守规矩。",
    ex: [
      ["Then we make our own rules.", "那我们就自己定规矩。"],
      ["You don't make rules in a place like this.", "这种地方不是定规矩的。"],
      ["They make the rules; we follow them.", "他们定规矩，我们遵守。"]
    ]
  },
  "a question of": {
    zh: "是……的问题；只是……的问题",
    pos: "phr.",
    note: "It's just a question of time = 只是时间问题。",
    ex: [
      ["It's just a question of hours.", "这只是几个小时的问题。"],
      ["It's a question of money, not loyalty.", "这是钱的问题，不是忠诚的问题。"],
      ["It's only a question of time.", "这只是时间问题。"]
    ]
  },
  "a way out": {
    zh: "出路；脱身的办法",
    pos: "phr.",
    note: "way out of sth = 从……脱身的办法。",
    ex: [
      ["Or it's a way out.", "或者是条出路。"],
      ["There's no easy way out of this.", "这事没有容易的出口。"],
      ["We need a way out that doesn't get anybody killed.", "我们需要一个不会死人就能脱身的办法。"]
    ]
  },
  "look a lot alike": {
    zh: "看起来很像",
    pos: "phr.",
    note: "alike 是表语形容词，不能放在名词前。",
    ex: [
      ["Those two look a lot alike.", "这两样看起来很像。"],
      ["You two look a lot alike.", "你们俩长得很像。"],
      ["The two plans look a lot alike on paper.", "这两个方案写在纸上看着差不多。"]
    ]
  },
  "this far": {
    zh: "这么远；到这一步",
    pos: "phr.",
    note: "go this far = 做到这个地步；so far = 到目前为止。",
    ex: [
      ["Carefully got us this far.", "小心让我们走到现在。"],
      ["We've come this far; we're not turning back.", "都到这一步了，我们不回头。"],
      ["I can't go this far and quit.", "我不能走到这一步再放弃。"]
    ]
  },
  "do it anyway": {
    zh: "还是照做；无论如何都做",
    pos: "phr.",
    note: "anyway 表示“尽管如此”，常放句末。",
    ex: [
      ["So do I. Do it anyway.", "我也讨厌。还是得做。"],
      ["I know it's stupid, but I'll do it anyway.", "我知道这很傻，但我还是要做。"],
      ["Nobody's watching, but do it anyway.", "没人在看，但你还是照做。"]
    ]
  },
  "closer than you think": {
    zh: "比你想的更近",
    pos: "phr.",
    note: "比较级 + than you think 是极常用的“反预期”结构。",
    ex: [
      ["The man you're looking for is closer than you think.", "你要找的人，比你想象的更近。"],
      ["The answer is closer than you think.", "答案比你想象的更近。"],
      ["Danger is always closer than you think.", "危险总比你想的更近。"]
    ]
  },
  "addressed to": {
    zh: "写给……的；寄给……的",
    pos: "phr.",
    note: "be addressed to sb = 收件人是某人。",
    ex: [
      ["There's a message. It's addressed to you.", "有条消息，是给你的。"],
      ["The letter was addressed to my father.", "那封信是寄给我父亲的。"],
      ["Who's this addressed to?", "这是寄给谁的？"]
    ]
  },
  "make a mistake": {
    zh: "犯错",
    pos: "phr.",
    note: "by mistake = 无意中；mistake A for B = 把 A 当成 B。",
    ex: [
      ["Then we don't make one.", "那我们就不犯错。"],
      ["Everybody makes a mistake eventually.", "每个人迟早都会犯错。"],
      ["I made a mistake. I'm sorry.", "我犯了个错，对不起。"]
    ]
  },
  "one of us": {
    zh: "我们中的一个",
    pos: "phr.",
    note: "In case one of us doesn't make it = 万一我们有一个到不了。",
    ex: [
      ["In case one of us doesn't make it.", "以防我们有一个到不了。"],
      ["One of us has to stay.", "我们得留一个人。"],
      ["One of us is lying.", "我们当中有人在撒谎。"]
    ]
  },
  "to my face": {
    zh: "当着我的面",
    pos: "phr.",
    note: "say it to my face = 有话当面说。",
    ex: [
      ["Then say it to my face when we get there.", "那等我们到了，当着我的面说。"],
      ["Say it to my face.", "当着我的面说。"],
      ["Nobody says anything to my face.", "没人敢当我的面说。"]
    ]
  },
  "beat someone to it": {
    zh: "抢先一步；捷足先登",
    pos: "phr.",
    note: "beat sb to sth = 抢在某人前面得到/做到。",
    ex: [
      ["Somebody beat us to it.", "有人抢先了。"],
      ["You beat me to it.", "你比我先一步。"],
      ["They beat us to the money.", "他们抢先拿到了钱。"]
    ]
  },
  "in years": {
    zh: "好多年（没……了）",
    pos: "phr.",
    note: "常与否定或“最……”连用，表示很久以来。",
    ex: [
      ["I haven't been back here in years.", "我好多年没回来了。"],
      ["That's the best news I've had in years.", "这是我多年来听到的最好的消息。"],
      ["I haven't slept in years.", "我好多年没睡过好觉了。"]
    ]
  },
  "the worst idea": {
    zh: "最糟的主意",
    pos: "phr.",
    note: "口语常用夸张表达：the worst idea you've had all week。",
    ex: [
      ["That's the worst idea you've had all week.", "这是你这周最糟的主意。"],
      ["That's the worst idea I've ever heard.", "这是我听过最糟的主意。"],
      ["Going back there is the worst idea.", "回那儿去是最糟的主意。"]
    ]
  },
  "watching and being trapped": {
    zh: "被盯着 vs 被关住",
    pos: "phr.",
    note: "being + 过去分词构成动名词被动式，适合对比两个概念。",
    ex: [
      ["There's a difference between being watched and being trapped.", "被盯着和被关住是两回事。"],
      ["Being watched is not the same as being caught.", "被盯着不等于被抓。"],
      ["I hate being watched.", "我讨厌被人盯着。"]
    ]
  },
  "leaves marks": {
    zh: "留下痕迹",
    pos: "phr.",
    note: "leave a mark / leave marks = 留下印记、留下影响。",
    ex: [
      ["People lie, but paperwork leaves marks.", "人会撒谎，文件会留痕。"],
      ["That kind of thing leaves marks.", "那种事会留下痕迹。"],
      ["Every lie leaves a mark somewhere.", "每个谎都会在某处留下痕迹。"]
    ]
  },
  "you know": {
    zh: "你知道的；你懂的",
    pos: "phr.",
    note: "口语填充词，常插在句中停顿处，用来争取思考时间或寻求对方认同。",
    ex: [
      ["You know, I never really trusted that guy.", "你知道的，我一直不太信任那家伙。"],
      ["It's not that far, you know, maybe ten minutes on foot.", "其实不远，你知道的，走路大概十分钟。"],
      ["You know, I think we took the wrong turn back there.", "你知道吧，我觉得我们刚才那个路口拐错了。"]
    ]
  },
  "all right": {
    zh: "好吧；没问题；还好",
    pos: "phr.",
    note: "可表示同意或妥协，也可问候或表示“安然无恙”，意思全看语调。",
    ex: [
      ["All right, let's get this over with.", "好吧，咱们把这事了结了吧。"],
      ["Are you all right? You look pale.", "你没事吧？脸色好白。"],
      ["All right, I'll cover your shift tonight.", "行吧，今晚我替你顶班。"]
    ]
  },
  "right now": {
    zh: "现在；马上",
    pos: "phr.",
    note: "比 now 更急，常放句尾加强语气，也可表示“此刻正在”。",
    ex: [
      ["I need an answer right now.", "我现在就要一个答复。"],
      ["She's in a meeting right now, can I take a message?", "她正在开会，要我传话吗？"],
      ["You need to get down here right now.", "你得马上下来。"]
    ]
  },
  "a little": {
    zh: "一点；有点儿",
    pos: "phr.",
    note: "修饰不可数名词或形容词；a little bit 更口语，程度也更轻。",
    ex: [
      ["I'm a little tired, but I can keep going.", "我有点累，但还能继续。"],
      ["Add a little salt and taste it again.", "加一点盐再尝一下。"],
      ["Could you speak a little slower, please?", "你能说慢一点吗？"]
    ]
  },
  "a lot": {
    zh: "很多；非常",
    pos: "phr.",
    note: "可作宾语或状语；a lot of + 名词，口语里常代替 many / much。",
    ex: [
      ["That means a lot to me, really.", "那对我真的很重要。"],
      ["We've been through a lot together.", "我们一起经历过很多。"],
      ["She travels a lot for work.", "她因为工作经常出差。"]
    ]
  },
  "of course": {
    zh: "当然；当然可以",
    pos: "phr.",
    note: "回答请求时表示爽快答应；否定形式 of course not 表示“当然不”。",
    ex: [
      ["Of course you can stay here tonight.", "你今晚当然可以住这儿。"],
      ["He passed the exam, of course.", "他当然通过了考试。"],
      ["Of course not, I would never do that.", "当然不会，我绝不会那么做。"]
    ]
  },
  "look at": {
    zh: "看；看待；注意",
    pos: "phr. v.",
    note: "look at sth 强调“看”这个动作；也可引申为“审视、考虑”。",
    ex: [
      ["Look at the size of that thing.", "你看那东西多大。"],
      ["Look at me when I'm talking to you.", "我跟你说话的时候看着我。"],
      ["We should look at the numbers before we decide.", "决定之前我们该看看数据。"]
    ]
  },
  "take care": {
    zh: "保重；当心",
    pos: "phr.",
    note: "道别时说 take care 等于“保重”；后面加 of 才是“照顾”。",
    ex: [
      ["Take care, and call me when you land.", "保重，落地给我打电话。"],
      ["Take care on the stairs, they're wet.", "小心楼梯，是湿的。"],
      ["Thanks for everything. You take care now.", "谢谢你所做的一切。你多保重。"]
    ]
  },
  "that's right": {
    zh: "没错；就是这样",
    pos: "phr.",
    note: "肯定对方的说法，比 yes 更有确认意味，也可表示“想起来了”。",
    ex: [
      ["That's right, the key is under the mat.", "没错，钥匙在门垫下面。"],
      ["You're his brother? That's right, I remember now.", "你是他哥哥？对，我想起来了。"],
      ["That's right, don't let him push you around.", "这就对了，别让他欺负你。"]
    ]
  },
  "how about": {
    zh: "……怎么样；那……呢",
    pos: "phr.",
    note: "后接名词或动名词提建议；How about you? 是反问对方的常用语。",
    ex: [
      ["How about we grab a bite after this?", "这事完了我们去吃点东西怎么样？"],
      ["I'm broke until Friday. How about you, are you okay for cash?", "我周五前都没钱了。你呢，手头还宽裕吗？"],
      ["How about meeting at the station at six?", "六点在车站碰面怎么样？"]
    ]
  },
  "good luck": {
    zh: "祝你好运",
    pos: "phr.",
    note: "可单独使用；good luck with + 事情，good luck to + 人。",
    ex: [
      ["Good luck with the hearing tomorrow.", "明天的听证会祝你好运。"],
      ["Good luck, you're going to need it.", "祝你好运，你会需要的。"],
      ["She wished me good luck and walked away.", "她祝我好运就走开了。"]
    ]
  },
  "go down": {
    zh: "下去；下降；发生",
    pos: "phr. v.",
    note: "口语里 what went down 指“出了什么事”；go down well 指受欢迎。",
    ex: [
      ["Go down to the basement and check the fuse.", "下去到地下室看看保险丝。"],
      ["Prices went down again last month.", "上个月价格又降了。"],
      ["Something went down at the warehouse last night.", "昨晚仓库那边出了点事。"]
    ]
  },
  "shut up": {
    zh: "闭嘴",
    pos: "phr. v.",
    note: "很不客气，对陌生人慎用；朋友之间也可表示“别逗了”的惊叹。",
    ex: [
      ["Shut up and listen for once.", "闭嘴，你就听一次。"],
      ["Shut up! You're kidding me, right?", "别逗了！你在开玩笑吧？"],
      ["He told the guy to shut up and sit down.", "他让那家伙闭嘴坐下。"]
    ]
  },
  "at all": {
    zh: "根本；一点也（不）",
    pos: "phr.",
    note: "多用于否定句和疑问句句尾加强语气，如 not at all。",
    ex: [
      ["I don't trust him at all.", "我根本不信任他。"],
      ["Did you sleep at all last night?", "你昨晚到底睡了没有？"],
      ["It's not a problem at all, really.", "这根本不是问题，真的。"]
    ]
  },
  "calm down": {
    zh: "冷静下来",
    pos: "phr. v.",
    note: "对激动的人说；也可说 calm sb down = 让某人平静下来。",
    ex: [
      ["Calm down, I'm not going anywhere.", "冷静点，我不会走的。"],
      ["It took an hour to calm her down.", "花了一个小时才让她平静下来。"],
      ["Calm down and tell me what happened.", "冷静下来，告诉我发生了什么。"]
    ]
  },
  "on the run": {
    zh: "在逃；逃亡中",
    pos: "phr.",
    note: "指逃犯或躲债的人四处躲藏，常与 be 连用，后接 for + 时间。",
    ex: [
      ["The guy's been on the run for three weeks.", "那家伙已经逃亡三周了。"],
      ["They caught him while he was on the run in Texas.", "他在德州逃亡时被抓了。"],
      ["Being on the run wears you down.", "逃亡的日子会把人拖垮。"]
    ]
  },
  "go on": {
    zh: "继续；发生",
    pos: "phr. v.",
    note: "Go on. 可催促对方“说下去”；what's going on 才是“怎么回事”。",
    ex: [
      ["Go on, tell me the rest of it.", "继续说，把剩下的都告诉我。"],
      ["The meeting went on for three hours.", "会议开了三个小时。"],
      ["If this goes on, we're all going to get caught.", "再这样下去，我们都得被抓。"]
    ]
  },
  "all the time": {
    zh: "一直；总是",
    pos: "phr.",
    note: "表示频率很高，位置多在句末；也可指“整个时间段里”。",
    ex: [
      ["She checks her phone all the time.", "她总是看手机。"],
      ["Why do you have to lie all the time?", "你为什么非得一直撒谎？"],
      ["It rained all the time we were there.", "我们在那儿的时候一直在下雨。"]
    ]
  },
  "in the middle of": {
    zh: "在……中间；正忙着",
    pos: "phr. prep.",
    note: "in the middle of doing sth = 正做到一半，常用来解释自己走不开。",
    ex: [
      ["I'm in the middle of something, can I call you back?", "我正忙着呢，回头给你打行吗？"],
      ["The table sat in the middle of the room.", "桌子摆在房间正中间。"],
      ["We were in the middle of dinner when the power went out.", "我们正吃着晚饭，突然停电了。"]
    ]
  },
  "not yet": {
    zh: "还没有；还没",
    pos: "phr.",
    note: "回答“做了吗”时用，暗示以后会做；与 still not 的语气不同。",
    ex: [
      ["Not yet, but I'm working on it.", "还没有，不过我正在办。"],
      ["The doctor said she's not yet strong enough to travel.", "医生说她身体还不够好，不能出行。"],
      ["It's not yet clear who tipped them off.", "目前还不清楚是谁给他们通风报信的。"]
    ]
  },
  "set up": {
    zh: "设立；布置；陷害",
    pos: "phr. v.",
    note: "set up a meeting = 安排会议；口语 be set up = 被人设局陷害。",
    ex: [
      ["We set up a meeting for Thursday morning.", "我们安排周四上午开个会。"],
      ["Can you set up the camera by the window?", "你能把摄像机架在窗边吗？"],
      ["He swears somebody set him up.", "他发誓是有人陷害他。"]
    ]
  },
  "at the end": {
    zh: "在结尾；最后",
    pos: "phr.",
    note: "at the end of + 名词；表示“最终”要用 in the end，别混。",
    ex: [
      ["There's a surprise at the end of the movie.", "电影结尾有个惊喜。"],
      ["At the end, nobody wanted to leave.", "到最后，谁都不想走。"],
      ["Sign your name at the end of the page.", "在这页末尾签上你的名字。"]
    ]
  },
  "any more": {
    zh: "再；不再",
    pos: "phr.",
    note: "否定句里 not ... any more = 不再；肯定句要问“还有吗”也用 any more。",
    ex: [
      ["I don't want to talk about it any more.", "我不想再谈这个了。"],
      ["Do you have any more of those batteries?", "那种电池你还有吗？"],
      ["She doesn't work here any more.", "她已经不在这儿工作了。"]
    ]
  },
  "that's it": {
    zh: "就这样；够了",
    pos: "phr.",
    note: "表示“完事了”或“受够了”；语气重时接近“到此为止”。",
    ex: [
      ["That's it, I'm done arguing with you tonight.", "行了，今晚我不跟你吵了。"],
      ["Just sign your name here and date it. That's it.", "在这儿签个名写上日期。就这样。"],
      ["That's it? You're not going to explain?", "就这样？你不打算解释？"]
    ]
  },
  "stay out": {
    zh: "待在外面；别插手",
    pos: "phr. v.",
    note: "stay out of sth = 别掺和某事，常用警告语气。",
    ex: [
      ["Stay out of this, it's none of your business.", "别插手，这不关你的事。"],
      ["The kids stayed out until dark.", "孩子们在外面待到天黑。"],
      ["Stay out of the kitchen while I'm cooking.", "我做饭的时候别进厨房。"]
    ]
  },
  "for a while": {
    zh: "一会儿；一段时间",
    pos: "phr.",
    note: "表示不确定但不太长的一段时间，常与 stay / wait / live 连用。",
    ex: [
      ["Let's sit here for a while.", "我们在这儿坐一会儿吧。"],
      ["I lived in Chicago for a while after college.", "大学毕业后我在芝加哥住过一阵子。"],
      ["Nobody's heard from him for a while.", "有一阵子没人有他的消息了。"]
    ]
  },
  "get up": {
    zh: "起床；站起来",
    pos: "phr. v.",
    note: "get up 是“起床”，wake up 只是“醒来”，两个别混用。",
    ex: [
      ["I get up at five every morning.", "我每天早上五点起床。"],
      ["Get up, we're leaving in ten minutes.", "起来，我们十分钟后出发。"],
      ["He got up and walked to the window.", "他站起来走到窗边。"]
    ]
  },
  "come back": {
    zh: "回来；恢复",
    pos: "phr. v.",
    note: "come back to + 地点或话题；记忆“回想起来”也用 come back。",
    ex: [
      ["Come back here, we're not finished.", "回来，我们还没说完。"],
      ["It all came back to me when I saw her face.", "看到她的脸，我一下子都想起来了。"],
      ["Do you know when he's coming back?", "你知道他什么时候回来吗？"]
    ]
  },
  "down the road": {
    zh: "沿路；将来",
    pos: "phr.",
    note: "口语里常指“将来某天”，相当于 in the future，不只是字面“沿路”。",
    ex: [
      ["The gas station is about a mile down the road.", "加油站沿路大概一英里。"],
      ["Maybe we'll work together again down the road.", "也许将来我们还会合作。"],
      ["There's a diner just down the road from here.", "离这儿沿路不远有家小餐馆。"]
    ]
  },
  "come in": {
    zh: "进来；进来吧",
    pos: "phr. v.",
    note: "敲门后让对方进来用 Come in.；消息、报告“传来”也用 come in。",
    ex: [
      ["Come in, the door's open and it's freezing out.", "进来吧，门没锁，外面冷死了。"],
      ["Reports are coming in from all over the county.", "全县各地的消息不断传来。"],
      ["She came in late and sat in the back.", "她来晚了，坐在后排。"]
    ]
  },
  "in touch": {
    zh: "保持联系",
    pos: "phr.",
    note: "keep in touch = 保持联系；get in touch with sb = 联系某人。",
    ex: [
      ["Let's keep in touch after you move.", "你搬走以后我们保持联系。"],
      ["I'll get in touch with you next week.", "我下周跟你联系。"],
      ["Are you still in touch with your old partner?", "你还和你老搭档有联系吗？"]
    ]
  },
  "what for": {
    zh: "为什么；干什么用",
    pos: "phr.",
    note: "口语追问目的，比 why 更直接，常带一点怀疑或不耐烦。",
    ex: [
      ["He wants to see the file. What for?", "他想看那份文件。干什么用？"],
      ["What for? Nobody told me about any meeting.", "为什么？没人跟我说过有什么会。"],
      ["They asked for your address. What for, exactly?", "他们要你的地址。到底干什么用？"]
    ]
  },
  "on the line": {
    zh: "在电话里；有风险",
    pos: "phr.",
    note: "电话用语：sb is on the line = 某人正在线上；也可指“赌上一切”。",
    ex: [
      ["Your wife's on the line, she sounds upset.", "你妻子在线上，听上去很急。"],
      ["Everything we built is on the line here.", "我们建起来的一切都押在这儿了。"],
      ["Hold on, I have another call on the line.", "等等，我另一条线有电话。"]
    ]
  },
  "go out": {
    zh: "出去；熄灭",
    pos: "phr. v.",
    note: "go out with sb = 和某人交往；灯“熄灭”也用 go out。",
    ex: [
      ["Do you want to go out tonight?", "今晚想出去吗？"],
      ["The lights went out across the whole block.", "整个街区的灯都灭了。"],
      ["They've been going out for two years.", "他们交往两年了。"]
    ]
  },
  "feel like": {
    zh: "觉得；想要",
    pos: "phr. v.",
    note: "feel like doing sth = 想做某事；feel like + 名词 = 感觉像。",
    ex: [
      ["I feel like a cup of coffee.", "我想喝杯咖啡。"],
      ["Do you feel like going for a walk?", "你想去散散步吗？"],
      ["It feels like somebody's watching us.", "感觉有人在盯着我们。"]
    ]
  },
  "make a deal": {
    zh: "达成交易；做个交易",
    pos: "phr. v.",
    note: "口语 make a deal = 谈成交易，也指“各让一步、就这么说定”。",
    ex: [
      ["Let's make a deal: you talk, I listen.", "咱们做个交易：你说，我听。"],
      ["They made a deal with the DA to cut his sentence.", "他们和检察官达成交易，给他减了刑。"],
      ["We can make a deal if the price is right.", "价格合适的话我们可以成交。"]
    ]
  },
  "pull over": {
    zh: "靠边停车",
    pos: "phr. v.",
    note: "警察叫司机停车常用；pull sb over = 把某人拦下车。",
    ex: [
      ["Pull over right here, I'll walk the rest.", "就在这儿靠边停，剩下的路我走。"],
      ["A cop pulled us over for a broken taillight.", "一个警察因为尾灯坏了把我们拦下。"],
      ["Pull over to the shoulder and kill the engine.", "靠边停到路肩，熄火。"]
    ]
  },
  "turn around": {
    zh: "转身；好转",
    pos: "phr. v.",
    note: "可指“转身”，也可指生意“扭亏为盈”，看宾语判断。",
    ex: [
      ["Turn around and put your hands on the car.", "转过身，手放在车上。"],
      ["The company turned around in less than a year.", "公司不到一年就扭亏为盈了。"],
      ["I turned around and he was gone.", "我一转身，他就不见了。"]
    ]
  },
  "on the way": {
    zh: "在路上；顺路",
    pos: "phr.",
    note: "on the way to + 地点；也可指孩子“即将出生”。",
    ex: [
      ["I'll pick up some food on the way home.", "我回家路上买点吃的。"],
      ["We're on the way, traffic is terrible.", "我们在路上了，堵得厉害。"],
      ["She has a baby on the way.", "她快生孩子了。"]
    ]
  },
  "all the way": {
    zh: "一路；完全",
    pos: "phr.",
    note: "指全程或彻底，常与 go / drive / support 连用。",
    ex: [
      ["We drove all the way from Texas in one night.", "我们一夜之间从德州一路开过来。"],
      ["I'm with you all the way on this.", "这事我完全支持你。"],
      ["He walked all the way back to the motel.", "他一路走回了汽车旅馆。"]
    ]
  },
  "take a look": {
    zh: "看一看",
    pos: "phr. v.",
    note: "比 look 客气，常接 at；take a look around = 四处看看。",
    ex: [
      ["Take a look at this photo and tell me who it is.", "看看这张照片，告诉我这是谁。"],
      ["Mind if I take a look around?", "介意我四处看看吗？"],
      ["The mechanic took a look and shook his head.", "修理工看了一眼，摇了摇头。"]
    ]
  },
  "on foot": {
    zh: "步行",
    pos: "phr.",
    note: "表示交通方式，常与 go / travel / be 连用，前面不加 by。",
    ex: [
      ["The station is close, we can go on foot.", "车站很近，我们可以走过去。"],
      ["He crossed the border on foot at night.", "他夜里步行越过了边境。"],
      ["They've got men on foot searching the woods.", "他们派了人步行搜索树林。"]
    ]
  },
  "to be honest": {
    zh: "说实话",
    pos: "phr.",
    note: "句首插入语，用于坦白不太中听的话，比 frankly 更口语。",
    ex: [
      ["To be honest, I never liked him.", "说实话，我从没喜欢过他。"],
      ["To be honest, I don't think we can win this.", "说实话，我觉得我们赢不了。"],
      ["It's not much, to be honest.", "说实话，这不算什么。"]
    ]
  },
  "sit down": {
    zh: "坐下",
    pos: "phr. v.",
    note: "sit down 强调“坐下去”的动作；be sitting 才是“正坐着”。",
    ex: [
      ["Sit down, we need to talk about last night.", "坐下，我们得谈谈昨晚的事。"],
      ["He sat down on the curb and lit a cigarette.", "他在路沿坐下，点了根烟。"],
      ["Please sit down, the doctor will be right with you.", "请坐，医生马上就来。"]
    ]
  },
  "come out": {
    zh: "出来；出版；暴露",
    pos: "phr. v.",
    note: "消息、真相“传出”也用 come out；come out with sth = 说出某事。",
    ex: [
      ["Come out where I can see you.", "出来，让我看见你。"],
      ["The truth came out during the trial.", "真相在庭审中暴露了出来。"],
      ["His new book comes out next month.", "他的新书下个月出版。"]
    ]
  },
  "take off": {
    zh: "起飞；脱下；离开",
    pos: "phr. v.",
    note: "飞机起飞、脱衣服、突然走人都是 take off；也可指产品“走红”。",
    ex: [
      ["The plane takes off at six forty.", "飞机六点四十起飞。"],
      ["Take off your jacket and stay a while.", "脱了外套，坐一会儿。"],
      ["He took off before anyone could ask questions.", "还没等人发问他就走了。"]
    ]
  },
  "so that": {
    zh: "以便；因此",
    pos: "phr.",
    note: "引导目的状语从句，从句里常配 can / could / would。",
    ex: [
      ["Speak louder so that everyone can hear you.", "大声点，好让大家都能听见。"],
      ["I left early so that I'd miss the traffic.", "我早点走，好避开堵车。"],
      ["He moved the chair so that he could see the door.", "他把椅子挪了挪，好看见门口。"]
    ]
  },
  "in the dark": {
    zh: "在暗处；不知情",
    pos: "phr.",
    note: "keep sb in the dark = 瞒着某人；字面义是“在黑暗里”。",
    ex: [
      ["They kept me in the dark about the whole plan.", "整个计划他们都瞒着我。"],
      ["We sat in the dark waiting for the power to come back.", "我们坐在黑暗里等来电。"],
      ["Don't leave me in the dark on this.", "这事别瞒着我。"]
    ]
  },
  "you have my word": {
    zh: "我向你保证",
    pos: "phr.",
    note: "比 I promise 更郑重，常用于严肃承诺或谈判场合。",
    ex: [
      ["You have my word, nobody else will hear about this.", "我向你保证，不会有别人知道这事。"],
      ["You have my word as a doctor.", "以我医生的身份向你保证。"],
      ["She'll be safe. You have my word.", "她会安全的。我向你保证。"]
    ]
  },
  "ahead of": {
    zh: "在……前面；早于",
    pos: "phr. prep.",
    note: "ahead of schedule = 提前；ahead of sb = 领先某人。",
    ex: [
      ["We're three days ahead of schedule.", "我们比计划提前了三天。"],
      ["There's a truck ahead of us doing forty.", "我们前面有辆卡车开四十码。"],
      ["She's always one step ahead of the police.", "她总比警察快一步。"]
    ]
  },
  "up to you": {
    zh: "由你决定",
    pos: "phr.",
    note: "It's up to you. 表示“你说了算”；也可说 up to sb to do sth。",
    ex: [
      ["Where we eat is up to you.", "在哪儿吃由你定。"],
      ["It's up to you to decide when to tell her.", "什么时候告诉她要由你决定。"],
      ["Stay or go, it's up to you.", "留下还是走，随你。"]
    ]
  },
  "what's going on": {
    zh: "怎么回事",
    pos: "phr.",
    note: "询问现场发生了什么，语气可关切也可质问。",
    ex: [
      ["What's going on here? Why is the door open?", "这儿怎么回事？门怎么开着？"],
      ["You've been quiet all day. What's going on?", "你一整天都不说话。怎么了？"],
      ["I heard shouting, so I came to see what's going on.", "我听见喊声，就过来看看怎么回事。"]
    ]
  },
  "get in": {
    zh: "进入；上车",
    pos: "phr. v.",
    note: "上小汽车用 get in，上大车用 get on；get in 也可指“当选”。",
    ex: [
      ["Get in, we don't have much time.", "上车，我们时间不多。"],
      ["Somebody got in through the back window.", "有人从后窗进来了。"],
      ["She got in the car and slammed the door.", "她上了车，砰地关上门。"]
    ]
  },
  "go back": {
    zh: "回去；回溯",
    pos: "phr. v.",
    note: "go back to + 地点或话题；交情“追溯到”某年也用 go back。",
    ex: [
      ["I'm not going back there, not ever.", "我不会回那儿去了，绝不。"],
      ["Let's go back to what you said about the money.", "我们回到你说的钱的问题上。"],
      ["Their friendship goes back thirty years.", "他们的交情可以追溯到三十年前。"]
    ]
  },
  "get down": {
    zh: "趴下；下来",
    pos: "phr. v.",
    note: "get down 常是“趴下、蹲下”的紧急命令；get down to 才是“着手做”。",
    ex: [
      ["Get down! They're shooting at the windows.", "趴下！他们在朝窗户开枪。"],
      ["Get down from there before you break your neck.", "从那儿下来，别摔断脖子。"],
      ["We got down on the floor and waited.", "我们趴在地上等着。"]
    ]
  }
};

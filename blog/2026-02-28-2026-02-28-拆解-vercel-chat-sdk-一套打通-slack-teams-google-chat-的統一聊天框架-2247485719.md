---
slug: "2026-02-28-拆解-vercel-chat-sdk-一套打通-slack-teams-google-chat-的統一聊天框架-2247485719"
title: "拆解 Vercel Chat SDK：一套打通 Slack、Teams、Google Chat 的統一聊天框架"
authors: [w0x7ce]
tags: [微信公眾號]
date: 2026-02-28
description: "从微信公众号导入的文章《拆解 Vercel Chat SDK：一套打通 Slack、Teams、Google Chat 的統一聊天框架》，保留原始排版图并提供本地 OCR 转写。"
---

# 拆解 Vercel Chat SDK：一套打通 Slack、Teams、Google Chat 的統一聊天框架

> 发布于 2026-02-28 23:09:39（微信公众号导出记录）。
>
> 本文来自公众号后台的“导出文章内容”功能。博客正文由导出长图进行本地 OCR 转写，并保留原始排版图用于逐段核对。
>
> 原文链接：[查看原文](http://mp.weixin.qq.com/s?__biz=MzIwMjMyNzIzNw==&mid=2247485719&idx=1&sn=26362f67b525f9b41cbc4e76bf359dba&chksm=96e11cbda19695ab3884ef50daee79690078034894b03cc3caa1e692a7dbf6cd2171dc6b6c05#rd)
>
> OCR 转写有效文字约 6294 字；代码、流程图和版式以文末原始排版图为准。

## 正文（本地 OCR 转写）

Chat的統一聊天框架
oriqinel v8x7ce EI V1ajero2826年2月28日 23:09 中国台湾
最近在研究企案级聊天機器人的聚標方案時,偶然翻到了Vercel關源的ChatSDK花了不
少時間把原始碼完整了一遍,發现這個项目在多平台抽象、訊息格式辨一、分散式状慧管理等
方面做了非常多精巧的投計。這篇文盘就来做一個完整的技衔拆解。
chut (nas
u,se C sgs d pa d
Am 物
&lt; Cale +
Goet
RR

Lipee Feph
Iod alcc
D
D 4rs
D UUEs
Pat
ucBE

做遇企業聊天機器人的人都知道,最顾疼的不是寓案连,而是座付各平台之圈千差别的
API。 Slack 用 Block Kit, Teams 用 Adaptive Cards, Google Chat 用 Card v2

## 一光是格式轉摸就约折聘人的。更不用说Webhook融證、訊息去重、分散式额道些基提设

施。
Chat SDK想解决的就是运图周题。它不是一细糖單的 APIwrapper,而是一整套訊息格
式、默感管理到事件路由的完整抽象唇。
先看一下整错的模组解係:

## 一個Webhook開始

理解這他框架最好的方式,是跟著一Webhook請求走完它的全部生命通期。
假設有人在Slack程@你的機器人税了句我查一下上通的報告。Slack的何服器會把
这修讯息作為一個 HTTPPOST打到你的Webhookendpoint。接下来的事赁大概是道楼
的:
lia 98

EIViajarp
公众品
这理有微個鍵設計值得单揭说
分散式镇做去量。Webhook 平台普遍會在收到208回時做重試(Slack三秒就重
發),尤其在 serverless 冷敏動的場景下非常容易碰到。Chat SDK 的做法是對每個
threadId 加一把38秒TTL的分散式额,宰不到鳞就直接丢蔓,商單粗暴但非常有效。
事件路由的侵先级,已訂開的線程走cnSubscribedMessage,未訂阅的 @mention 走onN
eention,其能的按正则pattern匹配。这個分屠湿朝跟囊账務场景非常贴合—你大多
数時候就是需要區分「這條訊息是不是在一因我正在跟进的對括理:和“這是一個全新的麟
mdast:一切格式轉换的中福
多平台支援最核心的挑是訊息格式统一。ChatSDK的答案是mdast—Markdown
Abstract Syntax Tree.
这不是自己稳明的输子。mdast 是unified 生服(remark/ rehype 那一套)的標
AST格式,有完善的解析器、序列化器和遍愿工具。ChatSDK把它常作所有平台之周的通
用辐言

eld gt
每 Adapter 都有一個FormatConverter,负青自己平台的格式和 mdast 之間的向轉
换。比如 Slack 的*bold和棵Markdown 的*bold**不一样,~strike~對廉
的是-strike-,结的語法cur|text&gt;也和\[text\](url\]完全不同。
種設計的好處是新增平台的成本非需低—你只需要寡一個FormatCcnverler就行,不用勤
核心SDK的任何一行程式碼。
SDK同時提供了一组AST前贴横建函式,方便你在程式碼程直接建机訊息结横:
1nport &#123; root, paragraph, text, strong. link ) fron "chat";
const ast = root(\[
paragraph(\[
text("造是一懒"\]。
(\[(B)x\]6u1
text("扭息,附带"),
link("`https://example.con',[text("速"`\]\]\]
11
amait thread.post (&#123; ast );
不管這訊息显终送到Slack、Teams 是Google Chat,各自的 FormatConverter
都管把它蒋成正確的平台格式。
ThreadID:跨平台的统一定址
每個聊天平台标一個對話程的方式都不一樣。SLack 用channel+timestamp,
Teams 用 conversation ID + service URL,Google Chat 用 space name +
thread name.
Chat SDK設計了一套統一的 Thread ID 格式,用冒號分隔:
&#123;adapter&#125;:&#123;channel 棵&#125;: &#123;thread 根潢&#125;

threfh*
weadNe

### 17847291.1246%

Teams 和 Google Chat 的原始标族符理有科缘和特殊字元,所以做了 base64编碼。这套
方案旗你可以在Redis、资料重或任何外部系统理用一個字串精確定位到任何平台上的任何一
個话線程。ChannelID 的衍生规则也很商單—预設取前两段(adapter&#58;channel),有
特殊需求的 Adapter 可以 override。
自研JSXRuntime:不依赖React的卡片系統
这是我登得整图專案最有意思的投計之一。
Chat SDK 宽作了一套完整的JSX runtime,不依赖React,就為了旗你可以用 JSX 語法
高跨平台的卡片和表單:
//tsconfig 霍配 JsxInportSource:*chat” 就行
inport &#123; Chat, Card, Text, Button, Actions &#125; fron “chat";
bot.onNewMention(async \[thread, message\] =&gt;
await thread-post(
&lt;.工.=o1T2 pej
&lt;Text style=*bold&gt;来白 &#123;message.author.displayNane&#125;&lt;/Texts
&lt;Text&gt;&#123;message.text)&lt;/Text&gt;
cActionss
&lt;Button 1d=*accept style=primary&gt;接变&lt;/Button&gt;
c/Actionsx
&lt;/Card&gt;
));
这段JSX在不同平台上官被翻湿成完全不同的乘西:
Csrd → Tst-
CadJei8t,
违科卡片资持送辑
carcAAx
eCad0
gitCasdo
tardiEntedt)
Sleck SRsck.K1
tars Adegtie Card
Disoord ttxx)
badyi \[Ieti
.defisjesc
actkns\]
實作上,JSX 元素用5ynbal.for(“chat.jsx.elenent")做型别判,整园虑理是Lazy
的—建模JSX栏的時候不奢做任何平台相的精换,只有在thradpost》的時候才根據
當前Adapter走到愿的换逗辑
这比起用JSON物件手寫BlockKit 或AdaptiveCard的隔發噬验好了不止一個樓次。
而且因為不依赖React,打包體精也不會膨胀。
状管理:訂開到分散式
StateAdapter是整個框架程存在盛量低但最不可或缺的一。它负责三件事:打阅追、分
敬式颖、和通用快取。
StateAdapter 个面
分数式编
打用管理
Kery-Walue 快取
acquire.ocx - relesel.sck
subscribe - unsubscrbe -
get - set - delite
SSutscrbed

noryStateAdapter
RedbStateAdapter
Map + Set
Lu图本原子操作
生座環境
Redis 實作理值得注意的是锐的設封。acquircLock 用的是5ETkcy tokcn NX Px ttl,
而releaseLock 和extendLock都用 Lua 都本做原子性的 check-and-operate。
Token是膳機字毕,防止A进程释放B进程持有的额。遭些都是分散式系統握的标华做法,
但在一但聊天SDK理看到這種谨度造是有贴意外。
訂阅機制也很明。常你的 Handler 呼叫thread.subscribe》之後,这图線程後编的所
有訊息都鲁走onSubscribecMessage通道,而不是重新匹配 mention 或pattern,这天
然地支援了多输對话:遗回场景—第一次@ment1on熊發訂阅,之後的到括就不荒要每次都
@ 7。
每個Adapter的『脾氣」
看完统一抽象愿之後,再看各個Adapter的具體實作,就舍發现每個平台都有一堆需要特殊
虑理的遗角案例。
Slack Adapter 大概是功能最全的。支援mult1-workspace OAuth(加密存取 token,
AES-256-GCM)、AsyncLocalLStorage 管理 per-request 的 token context、Block
Kit 卡片、Modal 表量、App Hone、斜線命令、reaction 监。Webhook 验證走的是
HMAC-SHA256 over vo:(tinestamp&#125;:(body) 再 t1m1ng-safe conpare,
LoudAdapter来暴露processActivity4)方法給 serverless 境用。讯息雁史要定
Microsoft Graph API,塞要 tenant ID。有趁的是 Teans 不支援主勤加 reaction,
只能取—所以addReaction在 Teams Adapter 霍基本上是图noop。
Google Chat Adapter 显特别的是它的Pub/Sub 整合。Google Chat 预設只在
@mention 時髮 Webhook,如果你想收到一個space 理的所有訊息,得用 Workspace
Events API 建立訂阅、走 Pub/Sub 推送。Adapter 霍做了自勐的訂鹿建立和到期剧新
(25小時快取TTL)。
Care v2 式

Sot frans
CnsphAP
Senerlen 8
rork
Clsa
Slack
EerlsA
Mthook 位
Muli-vor)
8 卡片
Medsk 表量
0uh + 3 Taee
全识座监据
Streaming&#58;AI時代的必備能力
Chat SDK對串流输出做了一很宽用的抽象。你可以直接往thread.post()理丢一個As
yncIterable&lt;string&gt;(比如 AI SDK的textstream),框架會自動處理後面的事情:
bot.onNewMention(async (thread, message) =&gt; &#123;
const result = streanText&#123;&#123;
model: openai(*gpt-4"),
prompt: message.text,
: (&#123;
//框架目動盛理串流+平台题示
awalt thread.post(result,textStream);
(&#123;
背後的避辑是:如果當前Adapter 有原生的strean()方法(Slack有),就走原生實
作:没有的話,就用“先post一條、然後不断edit的方式模。edit的周隔预設
500ms,可以配置,太低了容易撞rateLimit。
Asynclterable
(AI SDK textStream)

Adapter支援
原生串流?

adapter.stream()
post()+定時 edit()
平台原生串流
500ms間隔模摄

使用者看到
逐字出現的回覆
工程基硬設施
最後聊聊工程唇面的束西。
整個monorepo 用pnpm workspace+Turborepo 管理,所有套件都是纯 ESM(“typ
e":“module”),用 tsup 打包。Turborepo 的 task 依赖投定很清晰&#58;build依赖上
游的 build,test 依 build,typecheck 依精上游的 build。
Turborepo Task Pipeline
tst
Package 依辨
cepencsOn
cache: false
build
tsup 打包
outputs: dist.**
typecheck
dev
nt: trve
EtViajer
测框架用的是Vitest,mock-adapter.ts理提供了完整的mock 工具—createMockAd
apter&#123;&#125;建一固所有方法都是vi.fn()的假Adapter,crcatcMockstate()建一個真
正能用的記憶髓版StateAdapter(带可用的和訂功能),crcateTcstMcssage()快速
建立测試訊息。这單元测試离起来非常舒服。
還有一套Recording&amp;Replay 機制:生奎環境开RECORDING_ENABLED=true後,所
有webhook 互動會被記錄下来,打上 git SHA 標箍。之後可以匯出成 JSoN fixture,
在本地跑replay测試,不需要打真實的平台API。
版本管理走的是Changesets—每個 PR 带一個changeset 檔案描述改了什磨、bump多
少,合进 main 之後自勤生成 Version Packages PR,merge 就自勤發 npm,
個值得學智的設計决策
回整個專案,有機個技術選型和設計模式我觉得特别值得参考。
用mdast而不是自定羲IR.借用了unified生態成熟的解析器和工具键,避免了重新發
明格式標华的坑。GFM(GitHub FLavored Markdown)的支援也是现成的。
Lazy Resolution。Thread 物件可以只存adapter 的名字(字串),真正需要用的時候
才徙 Chat singleton锂查找實例。這 Thread 可以被序列化到 workflow引擎理,
跨进程退原。
AsyncLocalStorage 做 request context。Slack 的 multi-workspace 模式需要
在每個請求霍带上不同workspace的token。不用全域数汗染,也不用一一往下傳参
数,用 AsyncLocalStorage 在request 级注入 context,serverless 環境下也完
全没間题。
即去重。没有用什磨idempotencykey 或者外部柠列,就是一把分散式。第一因請求拿
到就虚理,重試的請求拿不到就丢案。在webhook这個场景下钧用了。
Builder API + JSX 雙模式
PostableMessage 多
Thread ID 跨平台定址
白研 JSX Runtime

## 一抽象

mdast 作為格式中福
串流一行程式碼摘定
分散式镇去重
新平台只需算Adapter
生產可靠性
可摘展性
Redis状愿持久化
StateAdapter 可替换
LUn本原子操作
FormatConverter 解属格式
寫在最後
ChatSDK不是一個特别“酷:的專案。它没有什度黑科技,也没有用什度新潮的架模模式。
但它把企業聊天機器人这個看起来不太性感的同题解得非常乾净。
乎每一個設計决策都能看出是真實的生產琅境理磨出来的&#58;webhook重試要去重、多
workspace 的 token 要加密、Google Chat 不推全量訊息所以要走 Pub/Sub、Teams
不你加reaction 所以要做fallback、serverless 冷動薄致的去重 TTL要可配
置。
如果你正在做類似的跨平台聊天整合,或者想了解如何在TypeScript裡設計一套乾净的
adapterpattern,运個事案的原始碼非常值得一遍。
`https://github.com/vercel/chat`

## 原始排版图

![拆解 Vercel Chat SDK：一套打通 Slack、Teams、Google Chat 的統一聊天框架：微信公众号导出原始排版图](/img/wechat/2026-02-28-拆解-vercel-chat-sdk-一套打通-slack-teams-google-chat-的統一聊天框架-2247485719/article.webp)

---
slug: "2025-12-25-google-開源-a2ui-代理驅動介面-agent-driven-interfaces-的新標準-2247485238"
title: "Google 開源 A2UI：代理驅動介面（Agent-Driven Interfaces）的新標準"
authors: [w0x7ce]
tags: [微信公眾號]
date: 2025-12-25
description: "从微信公众号导入的文章《Google 開源 A2UI：代理驅動介面（Agent-Driven Interfaces）的新標準》，保留原始排版图并提供本地 OCR 转写。"
---

# Google 開源 A2UI：代理驅動介面（Agent-Driven Interfaces）的新標準

> 发布于 2025-12-25 21:21:16（微信公众号导出记录）。
>
> 本文来自公众号后台的“导出文章内容”功能。博客正文由导出长图进行本地 OCR 转写，并保留原始排版图用于逐段核对。
>
> 原文链接：[查看原文](http://mp.weixin.qq.com/s?__biz=MzIwMjMyNzIzNw==&mid=2247485238&idx=1&sn=91feaa406da85bf3691ed9e05991a41d&chksm=96e1129ca1969b8a6a964ab96e6550cdd0863e1085288acdb651e919c0c4e9fea04a9c062dcd#rd)
>
> OCR 转写有效文字约 5812 字；代码、流程图和版式以文末原始排版图为准。

## 正文（本地 OCR 转写）

Google用源A2UI:代理動介面(Agent-Driven
Interfaces)的新標弹
originalwθx7ce EI V1ajero2825年12月25日 21:21 日本

生成式 AI在生成文字、医像和程式码方面的表现已蛭相蓄出色。而現在,Google靓為是时
候 AI 用龄生成上下文相鼠的介面(Contextually Relevant Interfaces)了。
GoogleA2UI图除近期正式公开了A2UI專案,旨在與爾發者社群就这種早期段的格式和
置作进行協作。A2UI的設計初表是為了解決来自代理(Agents)的互通性、跨平台、生成式
或基於模板的UI回癌所面整的特定挑载。
透遇A2UI,代理可以生成显適合常前封错情境的介面,將其送到前端匯用程式。Google
圈除表示,他们已在内部多個座品中概建亚使用A2UI,现在希望透通源興社群互勤,以完善
规箱、增加更多传输方式,亚摘展更多的客户端渣染器(Renderers)和整合支援。
A2UI是一低源专案,包含一種針封“可更新、由代理生成的UI进行侵化的格式,以及一
组初始染器。它允許代理生成或填充變富的使用者介面,使其能在不同的主糖愿用程式中额
示,亚由各UI 框架(如Lit、Angular 或FLutter,未来將支援更多)进行渣染。渣
染器支援一组通用元件和/或客户端宣告的自定羲元件,亚將這些元件组合成布局。
值得注意的是,客户端捷有泣染權,董可以將其無缝整合到其品牌的UX中。無输是调器代
理(Orchestrator agents)遗是遗端A2A子代理,都可以生成 UI怖局,这些怖局将作
為訊息安全地傅透,而不是作為可熟行的程式码。
以下是AZUI温染卡片的范例,展示了該技術可以實现的各箱UI组合。
0887
o
ferna
Qiree Bovd
29

## 811.8

Deig1 Suls Prs

### 21.4 72 63

核心問题:代理需要學會講UI語言
想像一因旨在助使用者预訂餐廖座位的AI代理。如果是文字的互動,遇程可能相靠笨排
且元侵:

- 使用者:(打字)“汀一银2人的桌子。“

- 代理:“好的,哪一天?”

- 使用者:(打字)“明天。

- 代理:“什鹰時间?“

- 使用者:(打字)“大概晚上7點。“

- 代理:“那時我們没有空位,遇有其他時間吗?“

- 代理:“我行在5:00、5:30、6:00、B:38、9:00、9:38和10:69有空位,这些时

問對您合適竭?”
这種體验既缓慢又低效。更好的融是代理快速生成、或使用一個包含日期远標器、時同造挥
器和提交按钮的單表单。透過A2UI,大型語言模型(LLM)可以小工具目中组合出定装
的UI,為常下的確切任提供图形化、美截且易於使用的介面。
例如,關者可以使用A2UI来组合预訂UI,取代上述基龄文字的来回聊天。下圆展示了餐
愿预訂A2UI表示的一種渲染效果。由於A2UI的設計赋予了前端主械愿用程式對楼式的大
控制權,因此视登呈现上遭有許多其他可能性。
Book a Table at Han Dynasty

Fstyfbe
//m 5 e90
口

技術挑:跨越信任界的渲染
業界正进入多代理網格(Multi-agent mesh)的時代。来自Google 的代理正在舆来自
Cisco、IBM、SAP 和 Salesforce 等不同組缴的代理進行对話,以作解决任務。
也是为何 Google 影合多方创建了代理對代理(Agent-to-Agent,A2A)定益将其捐
赠给Linux基金曾的原因:旨在使代理即使在不共享記憶、工具或上下文的情况下也能进行
作。
然向,这福去中心化架橘整生了一信使用者介面整题。
如果代理存在於鹰用程式内部,它可以直接操作视图(例如DOM)。但在多代理世界中,敦
行工作的代理通常是遗握的一它們在後台通行、位於不同的何服器上,基至隔於不同的组。它
们不能直接解碰使用者的UI:它們必须透退發送訊息来满通。
谈歷史上看,渣染来自运端、不受信任来源的 UI 通常意味著發送HTML或JavaScript 亚
鹤其沙盒化(Sandboxing)在ifranc中。這種方法不懂笨重,祝景上往往不速育(以匹
配愿用程式的原生楼式),亚且引入了图鳞安全遗界的福雜性,
Google围除意端到,開發者需受一種方式来傅输UI,使其像敏據一样安全,但像程式碍一楼
具有表現力.
解决方案:将UI规視為訊息序列
A2UI提供了一種棵继格式,可以作為结机化输出即時生成,或者用作模板亚填充数值。生成此
回愿的代理可能是遗A2A代理,或者是使用者正在互助的调器,JSON负载(PayLoad)
可以适退A2A、AGUI以及潜在的其他傅输方式获送到客户端。
客户端癌用程式随後使用其自己的原生UI元件进行染。這意味著客户端保留對槎式和安全
性的完全控制椭,有助於確保代理的输出始终感景像是唐用程式的原生内容。
在以下能例中,使用者上傅了一弧照片,一個遗端代理使用Gemini模型来理解它,亚為圆额
客户的特定需求装作了一個定装表单:

01:38
Envision Your Dream
Landscape

而在另一個例子中,代理决定回塞一回包含互動式医表的自定元件,以及一图包含Google
地图的自定养元件:
RIZZCharts

08 :

核心設計哲學:安全、可更新且解耦
A2UI的設計圍鳞著機固键原别:

- 安全至上(Securityfirst):敦行由LLM生成的任意程式碼存在重大的安全凤隙。

A2UI探用宣告式资料格式,而非可敦行的程式碼。客户端匯用程式维護一個受信任、预先
批准的 UI元件目錄(例如Card、Button、TextFieLd),代理只能求渲染該目
中的元件,这有效降低了UI注人和其他漏润的风傲。

- LLM友善且可增量更新(LLH-friendly and increnentally updateable)&#58;UI

被表示為带有ID参照的扁平元件列表,這键岭LLM增量生成,允許渐进式流染和馨鹰式
的使用者锂验,代理可以根據到話进展中的新使用者请求,有效地划UI进行增量更改。

- 框架無酮且可撼(Framework-agnostic and portable)&#58;A2UI 筹 UI结横买

UI實作分開。代理發送的是元件樹及其期账資料模型的描述。客户端應用程式负青将這些
抽象描述映射到其原生小工具-渝是Web Components、Flutter 小工具、React 元
件、SwiftUI視图還是其他框架。来自代理的同一個A2UIJSON负载可以在標建於不同
框架之上的多他不同客户端上清染。
TheEnd-to-End DataFlow
Ciar:
Seret
e

## 1. 35E Cineeition D9U7R 3toan

9uraoeipdee
hedta d(dtaollt.

## 1.tngrkodeing

Ciaet-GicaRasdeig
eplictsigral prrverts afashc
atormded

## 5.Ur t

## 6. serdictlar’(/a N

cantructsa'eriktla'pyload.
.ts
perne A2
Et.
vrajero
導實代理式UI(AgenticUI)生態系統
代理式UI的领域正在迅遗發展,各種工具唇出不窟。Google匿账韶为A2UI 不是现有框架
的替代品,而是一理享門的定,旨在解决互通性、跨平台、生成式或基於模板的回惠运一特定
同题。
為了鼠助润發者選环正班的工具,Google整理了以下生慧系统地置:

## 1.横建主機應用程式UI

如果您正在椭建一個全接愿用程式(即使用者互動的「主提;UI),除了標建實原介面外,還可
能利用框架(如 AG UI、Vercel AI SDK、GenUI SDK for Flutter,後者底唇已使用
AZUI)来虚理状同步、聊天配和輸入虚理等“管道:工作。

- A2UI的定位&#58;AZUI是互铺的。如果使用AGUI速接主機匯用程式,它可以將A2UI

用作数撼格式,来染来自其不控制的外部代理(以及主機代理)的回愿。这提供了雨全其
美的方案:一他墨富、有状感的主概愿用程式,同時能安全地渣染来自外部代理的内容。

- 奥A2A结合:可直接透過A2A定發送到客户端前端

- 奥AGUI结合&#58;AGUI 提供了支架,可轻疑横建和部置支援A2UI的鹰用程式。

- 其他德输&#58;REST等其他传输方式在技術上可行,但官方暂未提供直接支援。

## 2.UI作為「资源:(MCPApps)

模型上下文協定(MCP)最近推出了 MCP Apps,运是一图整合了 MCP-UI 和 OpenAI工作
的新標准,旨在使何服器能翔提供互勤式介面。这種方法將UI視為一種资源(透過
i://URI 存取),通常在沙盒化的iframe中渲染预建 HTML 内容。

- A2UI的區别&#58;AZUI 探用「原生優先:的方法,與MCPAPpS的資源獲取模型截然不

同,A2UI代理發送的是原生元件的蓝图,而非不透明的HTML负载,这允許UI完美
承主械愿用程式的様式和無障碳功能。在多代理系统中,器可以輕整理解醒量藏的
AZUI息内容,實现更流幅的協作。

## 3.特定平台生系統(OpenAIChatKit)

像ChatKit运機的工具提供了高应整合、優化的验,專門用於在OpenAI生服系统内部署
代理。

- A2UI的區别&#58;A2UI專為希望跨Web、FLutter 和原生移勤端碍建自已代理介面的

者设計,或用於需要跨越信任遗界通訊的企堂细格(如A2A)。AZUI客户端捷有更多
样式控制權,这整然牲了代理的部分控制,但损来了关主機惠用程式更高的视景一致
性。
黄際應用案例舆合作影伴
A2UI开發初期就具Google内部及外部的多個图隙合作,旨在解決现實世界的同题。以下
是频他期键的合作案例:
AG UI/ CopilotKit
Google強调了生感系作的重要性。AG UI/CopilotKit墨球與Google 合作硅保
了首日相容性(day-zero compatibility)。
代理-使用者互勤定(AG-UI)通接了代理微端和代理前端...AG-UI完全支援
A2UI规箱,用於代理勤慧生成的豐富宣告式生成UI。我们很高典能提供AG-UI和
AZUI 之的首日相客性。 -Ata1 Barkai,CopitotKit 和 AG UI 魁始人
Opal:疆動實验性AI迷你愿用程式
Opal是一图接使用者用自然語言椭建AI迷你癌用程式的平台。Google的Opal黑原是
A2UI的核心员戴者,亚将其用股快速原型設計及整合到核心标建流程中。0pal中的A2UI
旗使用者能橘建具有勐题、生成式UI的感用。
『A2UI是我們工作的基。它給了我們靈活性,镶AI以新颖的方式動使用者體驗,
而不受固定前端的限制。」-DimitriGlazkov,Opal團隧首席工程師
GeminiEnterprise:企業代理的自定羲UI
GeminiEnterprise正在整合A2UI,以允許企業代理在其主機鹰用程式中渲染豐富的互動
式UI,資料输入表單到塞批儀表板,加速工作流程自動化。
Flutter:多平台生成式UI
FLutter及其GenUISDK利用A2UI作為遠端伺服器端代理與應用程式之間的UI宣告
格式,助開發者生成符合品牌指南的動態UI。
『A2UI非常適合FLutter的GenUISDK,因為它確保每個平台上的每位使用者都能
獲得高質量的原生感覺體驗。」-VijayMenon,Dart工程總
AIPoweredGoogle:標灌化代理式UI
随著Google全面探用AI,A2UI為内部團隧提供了一種標化方式,AI代理交換使用
者介面。這使得内部構建的代理能輕在外部公開(如在GeminiEnterprise中)。
如何開始:試用A2UI
對於想要深入了解的開發者,最佳方式是親自操作。
首先,可以访問a2ui.org阅請快速入門指南和文件。接著,可以前往GitHub專案中
的samples資料夹,营試客户端UI和後台例代理(例如餐搜导器)。
以下是動餐搜导器例的步骤:
git clone `https://github.com/google/A2uI.git`
export GEMINI_API_KEY="your_gemini_api_key"
4#通行餐廊搜导器A2A代理
5 cd A2uI/samples/agent/adk/restaurant_finder
6uv run.
8#運行使用A2UIlit渲染器库的Lit客户端
9 cd A2UI/samples/client/lit/shell
npm install
10r
11 npm run dev

此外,也可以透過試用GenUISDKforFLutter来體驗A2UI,或者使用CopilotKit
提供的公開 A2UIWidgetBuilder。
支援的整合
目前該專案已摊有多個關鍵整合,Google也表示未来希望支援更多整合,亚歡迎社群獻。
Communication
Client libraries
Agent frameworks
Agent UI toolkits
protocols
Web Components
CopilotKit (AG UI)
Any agent with A2A via
the A2A Extension
A2A Extension
Open AI ChatKit
Flutter
ADK Plugin (soon)
AG UI Iintegration
Anguar
Vercel AI SDK UI
REST
uag
React
Websocket
LangGraph
ShadCN
Crew AI
MCP
SswitUI
AG2
Jetpack Compose
Claude Agent SDK
Microsoft Agent
Framework
AWS Strands Agent

展望未来
這是A2UI的第一個公開里程碑。目前的格式版本為V0.8,經過了多輪實戴测試,但仍有演
進空間。目前已提供FLutter、WebComponents 和AnguLar 的早期客户端库。
随著專案开源(Apache2授權),GoogleA2UI團隧邀請生態系統共同参與:

- 完善和演進格式。

- 将A2UI連接到更多客户端库。

- 橘建更强大的工具和演示。

有興趣的開發者可以查看其公開路線圖,了解專案的未来方向。
本文内容基於GoogleDevelopersBlog官方公告整理。

## 原始排版图

![Google 開源 A2UI：代理驅動介面（Agent-Driven Interfaces）的新標準：微信公众号导出原始排版图](/img/wechat/2025-12-25-google-開源-a2ui-代理驅動介面-agent-driven-interfaces-的新標準-2247485238/article.webp)

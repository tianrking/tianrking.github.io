---
slug: "2026-02-13-cloudflare-推出-markdown-for-agents-自動將網頁轉換為-markdown-格式-2247485533"
title: "Cloudflare 推出 Markdown for Agents：自動將網頁轉換為 Markdown 格式"
authors: [w0x7ce]
tags: [微信公眾號]
date: 2026-02-13
description: "从微信公众号导入的文章《Cloudflare 推出 Markdown for Agents：自動將網頁轉換為 Markdown 格式》，保留原始排版图并提供本地 OCR 转写。"
---

# Cloudflare 推出 Markdown for Agents：自動將網頁轉換為 Markdown 格式

> 发布于 2026-02-13 21:01:36（微信公众号导出记录）。
>
> 本文来自公众号后台的“导出文章内容”功能。博客正文由导出长图进行本地 OCR 转写，并保留原始排版图用于逐段核对。
>
> 原文链接：[查看原文](http://mp.weixin.qq.com/s?__biz=MzIwMjMyNzIzNw==&mid=2247485533&idx=1&sn=ca78c6091f7ccd7c208a2321c6ebd2c1&chksm=96e11df7a19694e1daccac5d79096397140178575afe4089f03c44ed83fc028ea9b6ef8d500e#rd)
>
> OCR 转写有效文字约 7641 字；代码、流程图和版式以文末原始排版图为准。

## 正文（本地 OCR 转写）

CLoudflare推出MarkdownforAgents:自動將網真轉换為
Markdown 格式
wθx7ce EI V1ajero 2826年2月13日 21:82 中国台湾
網路流量格局的變

線上内客和商業被登现的方式正在發生快速整化。遇去,流量主要来自传统搜毒引掌,SE0决
定了谁能被侵先找到。而今,流量越来越多地来自AI爬鑫和代理,它們提主要由人類设計
的、往往缺乏结福的细路中求结橘化数。
作為企案,若想持續保持领先地位,现在是時候不催要考南人類防客或传统的SE0侵化智慧,
更要開始將代理视為一等公民。
為什Markdown如此重要
将原始HTMIL想给AI,就像按字数付费去请包装上的文字,而不是请程面的信件。一個商單
的Markdown 格式#副龄在页面上大的消耗3個token:而其 HTML等價形式h2
class=*section-title id-about*&gt;About Us&lt;/h2x则要消耗 12-15個 token,這遭没
有計算每回真實纲真中都存在的&lt;div&gt;包装器、導航榈和图本標,而这些元素乎没有語
價值。
以您正在阅镇的遗篇博客文章為例,其 HTML 版本估用 16,189個token,而尊换為
Markdown後估3,158個token.运意味著80%的token使用量被前省。
PasiMesSity Riky aegr Dmo TurSpeds saseity LhMCyadfan
Q
Why markdown is important
Feedng rw HTML t anAlislle pang by ter to d pkaig istof te
emerini Asime bet Uh on painmed ts rughly 3tos&#58;s
HTML ogaert clsetite atAbst /2bm22-
5, andtsfe , s
eryh
This blog port yo/re eocing takes 16,180 toens in HTL snd350 sokns when
oet md ht's a 8 rtiine.
Mircicn has quicy becme theNrgce france for agents nd Al sytems as a hcle.
Thefmfig
better reuls whle mrimizng token wae.
Thepr ttb t, nds
been st makaesadFrans,
goal i ferut allnnenial esand scan the rela cert.
The conversion of HTML to merRdown is noe a common step fo any AI pipeline. StiI,
his pocess is far from ideal: It wastes computation, adcs costs and processig
comdlb rEVa
tobe usedinhe first place.
格式
Token 数量
前省比例
16,188
THLH
3,150

### 80.5%

Markdown
Markdown已迅速成為代理和整個AI系统的通用語言。格式明的结福使其非常適合AI
處理,最续能在最小化token浪费的同時得更好的结果。
然而,周题在於频路是由HTML横成的,而非Markdown,而且真面重量多年来一直在標步增
最,这使得真面難以解析。封於代理而言,它們的目标是過滤掉所有非必要元素,亚描相關内
容。
為HTML韩换为Markdown現在已成为任何AI流水综的常見步骤。债管如此,遗困過程通
非理想:它浪費计算资源,增加成本和虚理德性,最重要的是,可能不是内容創作者原本打
算使用其内容的方式。
如果AI代理能购過意图分析和文權轉换的瓣性,而是直接微源眼接收结标化的
Markdown,那官怎楼?
自勤將HTML轉换為Markdown
Cloudflare的路现已支援在源额进行即時内容辅换,到於敏用了旅功能的區域,使用内容
商標源(content negotiation headers)。现在,當AI系统向任何使用
Cloudflare 亚用了 Markdown for Agents 的站静求真面時,它們可以在求中表连
對text/narkdown的好。CLoudflare 的频路將自勤且高效地將HTML韩换為
Markdown,
工作原理
要用了 Markdown for Agents 的區域遵取任何真面的 Markdown 版本,客户端需要
在错求中添加Accept商標题,亚將text/markdown作為项之一。Cloudflare
機测到此求,源頭獲取原始HTML版本,在將其提供館客户端之前將其轉换為
Markdown。
flare Gl

以下是使用Arcept協商標原 CLoudflare 的用發者文權請求真面的curl示例:
Curl `https://developers` cloudfLare.com/fundamentals/reference/markdovn-

- H "Accept: text/narkdown"

或者,如果您正在使用 Workers 温AI代理,可以使用TypeScript:
1oa, 4teMe = J 15U03
headers: &#123;
Accept: *text/markdawn, text/html",
&#125;,
):
const tokencount = r.headers,gct(*xmarkdown-tokens");
const markdown = awalt r.text();
Cloudflare 已經看到一些當今最受数迎的编碼代理—如 CLaude Code和 OpenCode—在
它們的内容請求中送遗些accept标頭。現在,對此铺求的警癌將以Markdown格式返
回。就是磨單
誓應示例
HTTP/2 288
882 2/d11H
date: Wed, 11 Feb 2026 11:44:48 GMT
content-type: text/narkdown; charset=utf-8
content-length: 2899
vary: accept
x-narkdown-tokens: 725
content-signal: ai-train=yes, search=yes, ai-input=yes
title: Markdoun for Agents · Cloudflare Agents docs
\## what is Mankdown for Agents
Markdown has quickly become the Lingua franca for agents and AI system
as a whole. The fornat's explicit structure nakes it ideal for AI proc.
ultinately resulting in better results while nininizing token waste.
關標頭明
x-markdown-tokens:此標指示Markdown文檔中的预估token數量。您可以在流
程中使用此值,例如計算上下文视留的大小或决定分境策略。
content-signal:指示内容的使用權限,包括 AI 制辣、搜毒结果和AI输入(包括代
理使用)。
内容信號政策
在Cloudflare 上一次的生日遇期,宣布了内容信號(Content Signals)——個允許
任何人表達其内容在被访問後如何被使用的偏好的框架。
當您返回Markdown時,您希望保您的内容正在被代理或AI爬盈使用。这就是為什度
Markdown for Agents 韩换的暮感包含 Content-signal&#58;ai-train=yes, search=yes,
al-1nput=ye5棵显信號,敲信碱指示内容可用於 AI训额、搜最结果和AI 输入(包括代理
使用)。此功能将在未来提供定我自定教内容信赋政策的退项。

ai-train=yes,
User-Agent:
Content-Signal&#58;search=yes,
ai-input=yes

有此框架的更多信息,错查看Cloudflare的内容信真面。
`https://contentsignals` org/
在CLoudflare博客和開發者文檔上試試看
Cloudflare已經在的開發者文樓和博客上般用了此功能,遂所有AI 根鑫和代理使用
Markdown 而不是 HTML 来消费 CLoudflare 的内容。
现在就通透精求Accept&#58;text/markdown来斌越看:
Curl `https://blog.cloudflare.con/narkdown-for-agents/` \

- H "Accept: text/narkdown*

结果如下:
description: The way content is discovered online is shifting, fron tr.
title: Introducing Markdown for Agents
inage: `https://blog.` cToudflare com/images/markdov
\# Introducing Markuown far Agents
The way content and businesses are discovered online 1s changing rapid
其他轉换為Markdown的方式
如果您正在杨建需要CLoudflare 外部换任意文權的AI系统,或者内容源不提供
Markdown for Agents,Cloudflare 提供其他為文轉换為Markdown 的方式:
方法
用場景
Workers AI AI.toMarkdow
支援多文槽频型,不蛋限於HTML,以及摘要功能
n()
Browser Rendering /mark
如果您需要在转换前在真责测觉器中染勤慧真面或感用
程式,则支援 Markdown 韩换
down REST API
`https://developers.cloudflare,com/workers-`
ai/features/markdown-conversion/
`https://developers.cloudflare.com/browser-rendering/` rest-
api/ma rkdown-endpoint/
追Markdown使用情况
预見AI 系统测宽期路方式的碍曼,CloudfLare Radar 现在包含了 AI機器人和爬晶流量
的内容類型見解,既可在AIIns1ghts页面上全球查看,也可在革圆機器人信息页面上查
看。
新的content_type继度和通流器显示返回给 AI代理和爬囊的内容颜型分值,按 MIME 類
别分组。
Content typeworldwide
uofe ed; 3W q padno6 se,xe pue s\]
Distribution of content types returned to Al agent
Plain text
Documents
Markdown
HTML
NOSr
Other
Imagesi

### 75.2%7%

### 5.4%

### 0.1%

&lt;0.1%

### 8.4%

### 3.9%

603

ast7量,,
Cloudflare Racar
您遗可以查看針對特定代理或爬避遇滤的Markdown請求。以下是返回Markdown 给OAI-
Searchbot 的請求,是OpenAI用於為ChatGPT 搜寻提供助力的爬囊:
Content type for OAl-SearchBot
Distribution of content types retured to the specified bot, grouped by MIME type cate
HIML Pain tert Images
Pain text
Images
XML
HTML
Other
JSON

### 63.8%12.9%

### 3.4%4%

### 11.7%

4%

Sat, Feb 7, 00:00
Last,c
Cloudflare Radar
這些新数擦将使CLoudflare能约追胀AI机器人、爬邀和代理随著时南推移消费细路内容
的方式的清曼。與往常一楼,Radar上的所有内容都可以通透公共API和数據資源管理器自
由防同。
如何用MarkdownforAgents
通過CLoudflare控制面板敏用
L.登錄CloudfLare 控制面板亚透挥您的帐户(您需要Pro或 Business 計劃)

## 2.还挥您要配置的區域

## 3.找Qu1ck Act1ons

## 1.切换 Markdown for Agents 按钮以用

curl -x PATCH *https: //api .cloudflare,com/client/v4/zones/&#123;zone_tag)/se

- header Content-Type: application/ son’\

- -header "Authorization: Bearer fapi_token\]*

- -data-raw '&#123;value*: "a

Howtoenable
Dashboard
API
To enable Markdown for Agents for your zone using APIls, send a PATCH to
0 (uo, 1,ane,) peoed ai ym Jepanuoosupue/sbutasas/(be1suoz)/ssuez/pa/suats/
the Cloudflare API.
You wil need to create an API token with the Zone Settings edit pemissions enabled.
Example:
Enable Markdown for Agents
curl X PATCH *https1//api-cloudflare.com/client/v4/zones/(zone_tag)/settings/contel
header “Content-Type: application/json’\
uo, =anens), meu-eiep- &#123;uayoasde\] Jaueog suoezpuouany, Japeou-

可用性和定價
Markdown for Agents 目前向 Pro、Business 和 Enterprise 劃以及 SSL for
SaaS 客户免查提供(Beta版)。
Coullare Docs
Cloudflare
口
Availability and Pricing
Srarc1 sidktr.
Ovenee
Cet tsted
Try it with Cloudflare
Act)
pe Bup g5eg ro pu#g 9ep
Balt
Menners
Usr prelie
urt https:/beg stodtare

限制與注意事頂
在开始使用之前,清注意以下限制:

- CLoudflare便支持徙HTML酮换,其他频型的文榴可能管在將来被包含

- CLoudflare不支持来自源显的短缩显愿

- Markdowmfor Agents 是區减级别設置。如果您需要為域的不同子域使用不同的設

置,需要将它們解揭为章的區域
實際應用場景

## 1.AI研究助理

async function researchTapic(topic: string)&#123;
const searchResults = await searchEngine.search(topic);
const articles = await Promise.all(
searchResults.nap(async (url) =&gt; &#123;
const response = await fetch(url, &#123;
headers: &#123; Accept: *text/markdown*
return &#123;
url,
content: a/wait response.text(1,
tokens: response.headers -get("x-markdoun-tokens")
&#125;:
&#125; :
summarize(articles);

## 2.内容索引服務

到於需要横建知碳审或向量索引的企案,Markdown格式提供了更乾净的数球源:
inport requests
def index_website(url):
response - requests,get(url, headers=headers)
if respanse.headers.get(*content-type") == *text/markdawn*:
content = response.text
将Markdown内容转换為向量单存
vectar = enbed \[content)
store_in_database(url, vector, content)

## 3.自動化測試舆监控

//使用Markdown格式蓬行内容始避更加可靠
async functian validateLantent(url: string. expectedTitle: string) &#123;
const response = await fetch(url,&#123;
headers: &#123; Accept: "text/markdown"&#125;
&#125;1;
:(&#123;
const markdown = await response.text();
const lines = markdown.split('\n');
8
const title = lines.find(line =&gt; line.startsWith('# '));
6
10
if (title?.slice(2) !== expectedTitle)&#123;
11
ectedTitle\] &#123;
throw new Error('content validation failed');
12
13
14
未來展望
随著AI代理的普及,Cloudflare预計:
L.更多網站將探用Markdown原生格式:為AI優化的内容發布將成為標准做法

## 2.Token效率將成為SE0的新指標&#58;AI友好的内容將獲得更好的索引效果

## 3.内容協商將更加智能化:代理和伺服器之間的協商將更加精確地匹配需求

MarkdownforAgents代表了網路内容消費方式的一次重要轉燮。通過在源頭自動將HTML
轉换為Markdown,Cloudflare為AI系統提供了更高效、更具成本效益的内容訪問方
式。

修改于2026年2月13日

## 原始排版图

![Cloudflare 推出 Markdown for Agents：自動將網頁轉換為 Markdown 格式：微信公众号导出原始排版图](/img/wechat/2026-02-13-cloudflare-推出-markdown-for-agents-自動將網頁轉換為-markdown-格式-2247485533/article.webp)

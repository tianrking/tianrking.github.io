---
slug: "2026-01-24-anthropic-駭客松獲獎項目拆解-everything-claude-code-2247485331"
title: "Anthropic 駭客松獲獎項目拆解：everything-claude-code"
authors: [w0x7ce]
tags: [微信公眾號]
date: 2026-01-24
description: "从微信公众号导入的文章《Anthropic 駭客松獲獎項目拆解：everything-claude-code》，保留原始排版图并提供本地 OCR 转写。"
---

# Anthropic 駭客松獲獎項目拆解：everything-claude-code

> 发布于 2026-01-24 00:27:57（微信公众号导出记录）。
>
> 本文来自公众号后台的“导出文章内容”功能。博客正文由导出长图进行本地 OCR 转写，并保留原始排版图用于逐段核对。
>
> 原文链接：[查看原文](http://mp.weixin.qq.com/s?__biz=MzIwMjMyNzIzNw==&mid=2247485331&idx=1&sn=3e6b7de7faae2ca012f8c67349b3283c&chksm=96e11239a1969b2f3c8a61bbd072bda50fc09b19bd0fe09f11df5a9d17c7086a9c4e7860f3af#rd)
>
> OCR 转写有效文字约 10163 字；代码、流程图和版式以文末原始排版图为准。

## 正文（本地 OCR 转写）

original wex7ce EI V1ajero 2826年1月24日 00:28 中国垂港
花了點時間把everything-claude-code 这個项目的 Skills系统微底拆解了一遍,现
裡面有不少值得组聊的設計决策。这個项目是Anthropic骇客松的莫作品,經退 1θ個多
月的實際使用打离,理面的 agents、skills、hooks、commands、rules 组件硫實是能直
接上鞋璟的。
Pinned
cogsec
@affaanmustafa 21h
G
ANTHROPIC
HACKATHON
Claude Code v2.1.11
Opus 4.5 - Claude API
WINNER
/Users/affoon
TIPS&amp;TRICKSFOR
CLAUDECODE
X Article
TheShorthand Guide to EverythingClaudeCode
Here's my complete setup after 10 months of daily use: skils hooks,
subagents, MCPs, plugins, and what actually works.
Been an avid Claude Code user since the experimental rollout in Feb,
and won.

### 2.2K

197
Q39

下面就把我对Skills段计的理解、原始碼分析、以及一些慢化思路整理一下。
目錄
L.系统架構概置

## 2.Skills的本質:知端數體设計

## 3.Hooks 事件驱到系统

## 1.跨平台實现技術

## 5.核心Skills實现分析

## 3.般計决策的權衡

## 7.性能與可辱性分析

## 3.侵化建

## 1.结瞻

## 1.系统架構概

先看整噬结橘,這様後面聊颜的時候不會迷失:
Claude Code 主系统
[ 5essionstart]
|PreToolUse
|PostToolUse
I 5essionEnd
Hook
Hook
Hook
Hook

Ski11s度贝轨行
1
| snonuT1uo3|
strategic |
security
compact
learning
reviev

跨平台独象播(ut1ls.js)
文件操作·泄程管理·平台检测·Git集成

Skills 如氮康 (Markdoun + Scripts)
skills/continuous-learming/SKILL.md
skills/strategic-compact/SKILL.md
skills/security-review/SKILL.nd

整個系统的资料流大概是运檬走的:
用户操作CLaude 解析意图→登 Hook轨行 SkiLL 本-输出结果 CLaude +
個架标的健在於分清晰&#58;Hooks負贡酶髮,Skills负贡退辑,而跨平台抽象唇確保一
切都能在不同系统上炮。

## 2.Skills的本質:知識载體設計

為何選選Markdown?
傳统的知递管理有带种常見做法:

- 代磷驻爆:和實现期在一起,改起来麻

- Wiki文檔:需要手勤查找,和執行環境是分雕的

- 配置文件:表速能力有限,辩通辑寫不出来

CLaude Code 择 Markdown 作为Ski1ls 的税始,遗圆决策其實挺有道理:
最计豪务:

## 1.CLaude 原生理解&#58;Harkdown 是规語料之一

## 2.版本控制发好:和Git workfLow完英集成

## 3.语化標记&#58;YAML frontmatter 提供鳞化元慰搏

## 4.人额可插生:滑者可直接畜题和修改

技術约束:

## 1.惠教行遥相&#58;Markdown梓是知描述

## 2.需要配套卿本:實却软行由.js/.sh完成

Skill的標举結
每個Sk111都长一因樣:
随符
nane: skill-nane
description: Brief description
Claude理解用的描述
\# Skill Mane
\##when to Use
[具耀的阐發条件]

- \* How It Works

[真现细第]
[置现细筛]
\##Examples
[代碍示例]
Frontnatter不只是装,它能被程序解析用来做家引和匹配:
//解析frontmatter 的通辑
的道辑
const frontmatterRegex = /^---\n([&lt;s\S]+?)\n---/;
const skillMetadata = parseYAML(frontmatter):
51/可以用束:
// 1. 自数生成 SkILLs 索引
//7.智能匹配相skills

## 113、版本控制和经期普理

知識與辑的分離
这個設計我觉得挺魄明的:把规什和怎塞做分隔
skil1s/
continuous-lcarning/
—
—— SKILL.nd
什惠
知量:告斯CLaude
配置赠:定兼行为参款
—— config- json
cvaluate-scssion.j5
韩行层:置现绍何货
好虚很明:
维度
好處
可维性
知更新不影答敦行遥辑
可测腻性
敦行通潮可狮立單元测试
可摘展性
同一知端可有多種實现
可移植性
Narkdown可在其他系统復用

## 3.Hooks事件動系统

Hooks架構
CLaudeCode 的Hooks系統探用嬰明式配置+匹配器模式J:
"hooks":&#123;
"PreToolUse":[
"matcher*:"tool == "Edit" |I tool == \-Write\"",
"hooks*:[&#123;
'spupumas, =,adf1.
"connand*: "node \*$(CLAUDE_PLUGIN_RooT&#125;/scripts/hooks/suggc
5leAJaiut 1esffol 1e uoriseduos 1enueu 1sa66nsa &#58;suotidru3sap

这裸的matcher语法有贴像 SQL的WHERE 條件:
function evaluateMatcher(matcher, context] &#123;
const conditions = parseMatcher(natcher);
return conditions.every(c =&gt; evaluateCondition(c, context));

境炭量也做得不错:
\#ClaudeCode鲁注入运些碧境量
插件想目综
CLAUDE_PLUGIN_ROOT
CLAUDE_TRANSCRIPT_PATH路记段文件
重话想端符
CLAUDE_SESSION_ID
Hook類型與時機
Hook 期型
解發時機
典型用途
性能影春
加械上下文、榆测瑞境

## 一次性,低影暮

Sess1on5tart
PreToolUse
工具调用前
验温、指截、建摄
每次调用,需高效
PostToolUse
格式化、检查、配
工具用後
每次调用,需高效
PreConpact
低频,可接受
上下文整销前
保存状慧
官話结束
持久化、评信
SessionEnd

## 一次性,低影

Stop
智愿完成後
清理、部估
每次答度,需注意
為何選選Stop而非UserPromptSubmit?
Continuous Learming Skill 使用 Stop hook 而非 UserPronptSubnit,道個遂
有理由:
\#hooks/hooks-json 中的驻释
\# why Stop hook instead of UserPromptSubmit:
Stop runs once at session end (ligitweight)

- UserPronptSubmit runs every message (heavy. adds [atency)

算一下性能差异:
\#UserPromptSubmit:每次 propt 都就行
5 - uotssssJod sabessou
execution_time = 100 @s
total_overhead = 50 * 1H8 = 5G98ms
Stop:童陆结束际软行一次
total_overhead = 10Bms
性能提升:50X
為何使用stderr?
所有hook那本都的定用stderr 输出:
//wtiTs . js:182
function log(message)&#123;
console.errar(nessage): // 输出别 stderr
理由很單:
L.stdout 被保留给返回绘 Claude 的数
.stderr翻示给用户但不干摄主流程

## 3.符合 Unix 哲学

## 4.跨平台實現技術

平台检測策略
// scripts/l.ib/utels . js&#58;II - 14
Zeum, === uuojneld·ssaooud = saoputmsT isuo3
1,utip. === eofaeld ssssoud = sosewst 1suos
,xutl, == Buojseld ssaooud = xnutist isuos
對铃Hooks這種轻量级场景,prDces5-platforn用了,不需要引l人额外依。
路径虑理的跨平台抽象
//問题:硬端码监得在不同平台的表理
1,s11tMs/apne1o /-, = 4iedpeq 1suos
上辆法直授工作
11解决方案:统一抽象
function getClaudeDir() &#123;
return path.join(getHomeoir(), *.claude*);

環境爱量展間也感理了:
if (config.learned_skills_path) &#123;

文件系統操作的統一封装
跨平台的find實现(替代Unix f1nd命令):
function findFiles(cir, pattern, options = &#123;)) &#123;
const &#123; maxAge = null, recursive - false ) = options;
const results = [1:
//glob模式精换為正期表遥式
const regexPattern = pattern
.replace(/-/g,*.*)
.replace(/\?/g. *.*);
const regex = new RegExpf**$&#123;regexPattern&#125;s');
适障授索實项
searchoir(dir);
return results.sort([a, b) =&gt; b.ntine - a.ntine);

投针亮贴:

- 细 Node.js 實现,無需依赖外部命令

- 按修改时同排序

## 5.核心Skills實現分析

Continuous Learning Skill
合話评估退辑:
// evaTuate- sesslon. js:59 - 66
const messageCount = countInFile(transcriptPath, /*type":"user*/g);
If(nessageCount &lt; ninSessionLength)&#123;
Log[ [ContinuousLearning] Session too shart (S&#123;nessageCount&#125; messages
process,cxit(θ);

為何统計user频型消息?因為它更接近用户交互翰次,能更好地反映會話度。

- nin_session_length*: 13,

11太匠:噪音多:太高:混择有价值的短會話

- patterns_to_detect": [

(1额续解洪模式
1/用户修正模式
"user_corrections",
//要通方案
"workarounds*,
"debugging techniques*.
//调赋技巧
项目转定的定
"project_specific"

目前evaluate-5ession-js只做提示,實账的模式提取需要 Claude 手动执行。道部分其
實可以做得更自動化。
Strategic Compact Skill
工具额用計数器的實现:
Jap, 1l prdd ssaaoad 1l oI NDIss3s 3anvis Aua ssaooud = pIuotssas 1suo:
const counterFile = path.join(getTenpDir(),*claude-tool-count-s(scssio
let count = 1;
const existing = readFile(counterFile);
1f(existing)&#123;
count = parseInt(existing.trin(), 1e) + 1;
writeF1le(counterFile, String(count));
Session ID 的唇级回退策略:
L.CLAUDE SESSION ID&#58;CLaude 提供的雷括標蝶

## 2.PPID:父准程ID(Claude Code 逾程)

## 3.default':最後的備逻

提示策略也抵有心思:
166
50
75
125
首次提示
周期提示
周期提示
遥援25作為周期是因為它大的到鹰一因中等辖度任独的完整流程。
Security Review Skill
Security Review Skill是知鳞型Skill,没有配套的敦行群本。它探用正負例對比的
模式:
\####X NEVER Do This
typescript
.xx-faud-ys. = Aaxide isuos
xxxxx-od-xs.=faxtde isuo
ALWAYS Do This
const apiKey = process env.oPENAI_API_KEY

個模式更符合人频提知智情,Claude也能更好理解禁止贝「签勇的遗界。

TDDWorkflow定差了完蔡的测就金字塔:

少量厨链流程
API/显含
中等数量
单元别试|单元现式
大量雁蓝
代碍组端也很清晰:
src/ ——components/|—Button.test.tsx單元润试—app/api/|
route.test.ts #合潮
e2e/ markets.spec.ts E2E 式

\#6、段計决策的耀衡
\##SheLL 鄂本vs lode.s 本
skills目缘中存在”,sh和‘-js’两種言现,而”scripts/hooks/”目缘中全部使用
10 | 复 | Shel1 | Node.js | 腾出 1
............

### 1.2跨平台性丨需要滤理差|统一通行時丨Node.1s|

13丨JSDN 解析丨需翼 jq丨内建支持丨Node.js|
|踏换虚理丨校弱丨疆富丨Node.js|
1般速度|更快|特得|SheLL|
然赖管理丨無依赖|需要Node.js丨Shel1|
可语性丨较低|般高丨 Node-js |
建藏统一使用Node.js。操牲少量欣勤运度换取可体露性。
著善Hook的蜡联鹰理策略
所有hook 聊本统一的继误虚理硬式:
javascript
nain().catch(err =&gt; &#123;
console,error( [Skillname] Error:', err.message);
process.exit(e)://键:不阻塞主流程
&#125;) ;
這是侵雅降级的策略&#58;Hook失-记錯误-不影赛Claude誓鹰
但这也有潜在問题:

- 静默失可能隐服重錯误

- 用户可能不知道 Skil1未正常工作

可以考虚可配置的錯误虑理模式。

## 7.性能與可靠性分析

Hook敦行性能
每次工具铜用的额外闻销:
PreToolUse Hook

- 5m5(文件尬)

|Suggest Conpact;
~200ms (tsc
I Type Check:
Prettier Fornat:
Jatllaud) su5-
(2TJA--
10ms (grep)
Console Log Chcck:
谢开:-265ms/工具调用
TypeScr1pt频型查是性能瓶照。可以考增量频型检查:
11只检查账改的文件
const changedFiles - getGitModifledFiles(['\-(ts|tsx)$']);
If(changedFiles.Includes&#123;filePath)&#123;
runTypeCheck(filePath);
亚發舆航態條件
suggest-conpact.js有在的航修件:
//多留Hook 向崎镇离counterFiTe
// Thread A: readFile() → count = 16
4// Thread A: writeFITe(II)
5//Thread 8&#58;writeFile(1I)//愿是 12
解决方案是使用文件额:
const lockfile - requiref'proper-lockfile');
aMait lockfile.lock(counterFile);
const count - parseInt(readFile(counterFile)) + 1;
uriteF1le(counterFile, String(count)):
aMait lockfile.unlock (counterFile);
内存浊漏風险
脂時文件未清理的間题:
11如果會菇据常结束,文件育一言存在
const counterfile = path.join(getTenpDir(). *claude-tool-count-s&#123;sessi
11解决方案:定期清理
function cleanupoldcounters() &#123;
const tenpnir = getTempoir();
const files - findFiles(temppir, *claude-tool-count-*);
81 4 99 *09 + +=x0 1510
const now = Date.now[);
files.forEach( path, mtine ) =&gt; &#123;
if [now - ntine &gt; oneweek) &#123;
fs.unlinkSync(path) :
&#125;
&#125;

## 8.優化建

架眉面
Skill自勤驻册奥發现
需前Skills需要手勤在huoks.json中册。可以實現自勤發现:
function registerskills() &#123;
const skillsDir = path.join(__dirnane, *.*, *skills');
const skillFolders = fs.readdirsync(skillsDir);
const hooks = ();
skillFolders. forEach(skillNane =&gt; &#123;
Const skillconfig = loadskillconfig(skillNane);
const hookFile = path.joln(skillsDir, skilLNane, *hook.1s*);
if (fs.existssync(hookfile))(
//根球skill.json 自黏生成 hook 配置
hooks.SessionEnd = hooks.5essionEnd 1l []:
matcher: skillconfig-trigger.matcher 1l +
hooks: [&#123;
type: 'conmand',
1

: (&#123;

Skill依赖管理
skITLs/securty -revfew/skll. j son
"nane": "security-review",

- version": "1.0.0*,

- depends_an*: [*verification-loop*1.

- conflicts_with*: [],

- prlority°: 10

11依频解析闽加载质序
function resolveloadorder(skills)(
const graph = bulleDependencyGraph(skills):
return tapalagical5ort(graph);
實现唇面
增量频型检查
11只检查逐改的文件及其源入键
async function increnentalTypecheck(changedFite) (
const dependents - ana lyzeDependents (changedFile);
const filesToCheck = [changedFile, -..dependents];
const result = await execsync(
'npx tsc --noEnit sfilesTocheck.join*)*,
&#123; cwd: projectRoot &#125;
) ;
return result;

Hook结果存
const hookCache = new Map();
async function executeCachedHook(hookName, context) (
const cachekey = *s[hookName&#125;&#58;s[JsoN.stringity(context)]*:
return hookCache. get(cacheKey):
const result = avalt executeHook(hookName, context):
hookCache set(cacheKey, result);
return resutt;
签行 Hook敦行
//强立Hook签行执行
const independent = hooks. filter(h =&gt; 1h.dependencies);
const results = await Promise-all(
independent.nap (h =&gt; cxecuteHook(h))
for (const hook of dependent) &#123;
awalt executeHook(hook, results);

可觀测性增強
Hook敦行日
class HookLogger &#123;
static lag(hookNane, phase, data) &#123;
const logentry = &#123;
timestanp: new Date().toIsostring(),
hook: hookNane,
phase: phase,
data: data,
duration: data duration
&#125;;
10
11
appendFile(
path.join(getClaudeDir(),‘hooks.log'),
1 2
JSON.stringify(logEntry)+'\n'
13
1 4
);
:
15
16
性能监控
class HookMetrics &#123;
static record(hookName,duration)&#123;
const metricsFile = path.join(getclaudeDir(),‘hook-metrics.json')
let metrics = readFile(metricsFile) Il &#123;&#125;;
metrics[hookName] = metrics[hookName] Il &#123;
count:0,
maxDuration: 0
10
11
metrics[hookName].count++;
1 2
13
1 4
metrics[hookName].maxDuration,
15
duration
16
);
17
18
writeFile(metricsFile, JsoN.stringify(metrics,null, 2));
19
2 0
2 1

## 9.結

这個Skills系统做了一些有意思的誉試:
做得好的地方:
L.知識與遥辑分離&#58;Markdown承载知識,本實現邂辑
?.事件動架構&#58;Hooks提供非侵入式的摘展機制

## 3.跨平台抽象:統一的工具函數封装平台差翼

## 1.優雅降級&#58;Hook失败不影響主流程

## 5.可组合性&#58;Skills可以组合形成更复雜的工作流

可以改進的地方:
L.缺乏SkiLl自動發現機制

## 2.無依赖管理系統

## 3.TypeScript類型桧查是性能瓶

## 1.文件操作缺乏發安全機制

.可觀測性不足
ClaudeCodeSkills系統代表了一種知工程化的試:將人類的最佳實、模式和經驗
轉化為可執行、可重用、可進化的组件。然在實現上仍有改進空間,但其設計理念為AI辅
助開發的未来發展提供了有價值的参考。
未来可以發展的方向包括&#58;SkillMarketplace、AI生成Skills、版本控制集成、團隧協
作機制等。
参考資料
L.Claude Code Documentation

## 2.Event-Driven Architecture Pattern-Martin Fowler

## 3.Everything ClaudeCode-ThecompletecollectionofClaude Code

configs from an Anthropic hackathon winner.Production-ready
agents,skills,hooks,commands,rules,and McP configurations
evolvedover 10+ months of intensive daily use buildingreal
products.

## 1.Cross-Platform Node.js Development -Node.js Design Patterns

## 原始排版图

> 原始导出图超过单张 WebP 的尺寸上限，以下图片按从上到下的顺序连续保存。
![Anthropic 駭客松獲獎項目拆解：everything-claude-code：微信公众号导出原始排版图（第 1 段，共 2 段）](/img/wechat/2026-01-24-anthropic-駭客松獲獎項目拆解-everything-claude-code-2247485331/article-01.webp)
![Anthropic 駭客松獲獎項目拆解：everything-claude-code：微信公众号导出原始排版图（第 2 段，共 2 段）](/img/wechat/2026-01-24-anthropic-駭客松獲獎項目拆解-everything-claude-code-2247485331/article-02.webp)

---
slug: google-a2ui-agent-driven-interfaces
title: "[技術深度] Google 開源 A2UI：代理驅動介面（Agent-Driven Interfaces）的新標準"
authors: [w0x7ce]
tags: [AI, Google, A2UI, Agent, UI, Frontend, 技術深度]
date: 2025-12-15
---

# [技術深度] Google 開源 A2UI：代理驅動介面（Agent-Driven Interfaces）的新標準

**日期：2025 年 12 月 15 日**
**來源：Google A2UI 團隊**
**編譯/整理：[w0x7ce]**

生成式 AI 在生成文字、圖像和程式碼方面的表現已經相當出色。而現在，Google 認為是時候讓 AI 用於生成**上下文相關的介面（Contextually Relevant Interfaces）**了。

![A2UI Banner](https://storage.googleapis.com/gweb-developer-goog-blog-assets/images/train-gpt2-model-with-jax-on-tpu-banner.original.png)

Google A2UI 團隊近期正式公開了 **A2UI** 專案，旨在與開發者社群就這種早期階段的格式和實作進行協作。A2UI 的設計初衷是為了解決來自代理（Agents）的互通性、跨平台、生成式或基於模板的 UI 回應所面臨的特定挑戰。

透過 A2UI，代理可以生成最適合當前對話情境的介面，並將其發送到前端應用程式。Google 團隊表示，他們已在內部多個產品中構建並使用 A2UI，現在希望透過開源與社群互動，以完善規範、增加更多傳輸方式，並擴展更多的客戶端渲染器（Renderers）和整合支援。

A2UI 是一個開源專案，包含一種針對「可更新、由代理生成的 UI」進行優化的格式，以及一組初始渲染器。它允許代理生成或填充豐富的使用者介面，使其能在不同的主機應用程式中顯示，並由各種 UI 框架（如 Lit、Angular 或 Flutter，未來將支援更多）進行渲染。渲染器支援一組通用元件和/或客戶端宣告的自定義元件，並將這些元件組合成佈局。

值得注意的是，客戶端擁有渲染權，並可以將其無縫整合到其品牌的 UX 中。無論是協調器代理（Orchestrator agents）還是遠端 A2A 子代理，都可以生成 UI 佈局，這些佈局將作為訊息安全地傳遞，而不是作為可執行的程式碼。

以下是 A2UI 渲染卡片的範例，展示了該技術可以實現的各種 UI 組合。

![A2UI 渲染卡片範例，展示各種 UI 組合](https://storage.googleapis.com/gweb-developer-goog-blog-assets/images/a2ui-blog-1-component-gallery_2.original.png)

{/* truncate */}

## 核心問題：代理需要學會「講」UI 語言

想像一個旨在幫助使用者預訂餐廳座位的 AI 代理。如果是純文字的互動，過程可能相當笨拙且冗長：

* **使用者：** (打字) "訂一張 2 人的桌子。"
* **代理：** "好的，哪一天？"
* **使用者：** (打字) "明天。"
* **代理：** "什麼時間？"
* **使用者：** (打字) "大概晚上 7 點。"
* **代理：** "那時我們沒有空位，還有其他時間嗎？"
* **使用者：** (打字) "你們什麼時候有空位？"
* **代理：** "我們在 5:00、5:30、6:00、8:30、9:00、9:30 和 10:00 有空位，這些時間對您合適嗎？"

這種體驗既緩慢又低效。更好的體驗是讓代理快速生成、或使用一個包含日期選擇器、時間選擇器和提交按鈕的簡單表單。透過 A2UI，大型語言模型（LLM）可以從小工具目錄中組合出定製的 UI，為當下的確切任務提供圖形化、美觀且易於使用的介面。

例如，開發者可以使用 A2UI 來組合預訂 UI，取代上述基於文字的來回聊天。下圖展示了餐廳預訂 A2UI 表示的一種渲染效果。由於 A2UI 的設計賦予了前端主機應用程式對樣式的極大控制權，因此視覺呈現上還有許多其他可能性。

![餐廳預訂 UI 的 A2UI 渲染範例](https://storage.googleapis.com/gweb-developer-goog-blog-assets/images/a2ui-blog-2-reserve-table.original.png)

## 技術挑戰：跨越信任邊界的渲染

業界正進入多代理網格（Multi-agent mesh）的時代。來自 Google 的代理正在與來自 Cisco、IBM、SAP 和 Salesforce 等不同組織的代理進行對話，以協作解決複雜任務。這也是為何 Google 聯合多方創建了 **代理對代理 (Agent-to-Agent, A2A) 協定** 並將其捐贈給 Linux 基金會的原因：旨在使代理即使在不共享記憶體、工具或上下文的情況下也能進行協作。

然而，這種去中心化架構產生了一個使用者介面難題。

如果代理存在於應用程式內部，它可以直接操作視圖層（例如 DOM）。但在多代理世界中，執行工作的代理通常是遠端的——它們在後台運行、位於不同的伺服器上，甚至屬於不同的組織。它們不能直接觸碰使用者的 UI；它們必須透過發送訊息來溝通。

從歷史上看，渲染來自遠端、不受信任來源的 UI 通常意味著發送 HTML 或 JavaScript 並將其沙盒化（Sandboxing）在 `iframe` 中。這種方法不僅笨重，視覺上往往不連貫（難以匹配應用程式的原生樣式），並且引入了圍繞安全邊界的複雜性。

Google 團隊意識到，開發者需要一種方式來傳輸 UI，使其**像數據一樣安全，但像程式碼一樣具有表現力**。

## 解決方案：將 UI 規範視為訊息序列

A2UI 提供了一種標準格式，可以作為結構化輸出即時生成，或者用作模板並填充數值。生成此回應的代理可能是遠端 A2A 代理，或者是使用者正在互動的協調器。JSON 負載（Payload）可以透過 A2A、AG UI 以及潛在的其他傳輸方式發送到客戶端。

客戶端應用程式隨後使用其自己的原生 UI 元件進行渲染。這意味著客戶端保留對樣式和安全性的完全控制權，有助於確保代理的輸出始終感覺像是應用程式的原生內容。

在以下範例中，使用者上傳了一張照片，一個遠端代理使用 Gemini 模型來理解它，並為園藝客戶的特定需求製作了一個定製表單：

<video src="https://storage.googleapis.com/gweb-developer-goog-blog-assets/original_videos/landscape-architect-demo.mp4" controls width="100%"></video>

*園藝客戶的定製表單範例*

而在另一個例子中，代理決定回應一個包含互動式圖表的自定義元件，以及一個包含 Google 地圖的自定義元件：

<video src="https://storage.googleapis.com/gweb-developer-goog-blog-assets/original_videos/a2ui-custom-compnent.mp4" controls width="100%"></video>

*包含互動式圖表和 Google 地圖的自定義元件範例*

## 核心設計哲學：安全、可更新且解耦

A2UI 的設計圍繞著幾個關鍵原則：

* **安全至上 (Security first)：** 執行由 LLM 生成的任意程式碼存在重大的安全風險。A2UI 採用**宣告式**資料格式，而非可執行的程式碼。客戶端應用程式維護一個受信任、預先批准的 UI 元件目錄（例如 `Card`、`Button`、`TextField`），代理只能請求渲染該目錄中的元件。這有效降低了 UI 注入和其他漏洞的風險。
* **LLM 友善且可增量更新 (LLM-friendly and incrementally updateable)：** UI 被表示為帶有 ID 參照的扁平元件列表，這便於 LLM 增量生成，允許漸進式渲染和響應式的使用者體驗。代理可以根據對話進展中的新使用者請求，有效地對 UI 進行增量更改。
* **框架無關且可攜 (Framework-agnostic and portable)：** A2UI 將 UI **結構**與 UI **實作**分開。代理發送的是元件樹及其關聯資料模型的描述。客戶端應用程式負責將這些抽象描述映射到其原生小工具——無論是 Web Components、Flutter 小工具、React 元件、SwiftUI 視圖還是其他框架。來自代理的同一個 A2UI JSON 負載可以在構建於不同框架之上的多個不同客戶端上渲染。

## 導覽代理式 UI (Agentic UI) 生態系統

代理式 UI 的領域正在迅速發展，各種工具層出不窮。Google 團隊認為 A2UI 不是現有框架的替代品，而是一種專門的協定，旨在解決**互通性、跨平台、生成式或基於模板的回應**這一特定問題。

為了幫助開發者選擇正確的工具，Google 整理了以下生態系統地圖：

![生態系統地圖/架構圖](https://storage.googleapis.com/gweb-developer-goog-blog-assets/images/a2ui-blog-3-end-to-end-data-flow.original.png)

### 1. 構建「主機」應用程式 UI

如果您正在構建一個全端應用程式（即使用者互動的「主機」UI），除了構建實際介面外，還可能利用框架（如 **AG UI**、**Vercel AI SDK**、**GenUI SDK for Flutter**，後者底層已使用 A2UI）來處理狀態同步、聊天記錄和輸入處理等「管道」工作。

* **A2UI 的定位：** A2UI 是互補的。如果使用 AG UI 連接主機應用程式，它可以將 A2UI 用作數據格式，來渲染來自其不控制的外部代理（以及主機代理）的回應。這提供了兩全其美的方案：一個豐富、有狀態的主機應用程式，同時能安全地渲染來自外部代理的內容。
* **與 A2A 結合：** 可直接透過 A2A 協定發送到客戶端前端。
* **與 AG UI 結合：** AG UI 提供了支架，可輕鬆構建和部署支援 A2UI 的應用程式。
* **其他傳輸：** REST 等其他傳輸方式在技術上可行，但官方暫未提供直接支援。

### 2. UI 作為「資源」(MCP Apps)

**模型上下文協定 (MCP)** 最近推出了 **MCP Apps**，這是一個整合了 MCP-UI 和 OpenAI 工作的新標準，旨在使伺服器能夠提供互動式介面。這種方法將 UI 視為一種資源（透過 `ui://` URI 存取），通常在沙盒化的 `iframe` 中渲染預建 HTML 內容。

* **A2UI 的區別：** A2UI 採用「原生優先」的方法，與 MCP Apps 的資源獲取模型截然不同。A2UI 代理發送的是原生元件的藍圖，而非不透明的 HTML 負載。這允許 UI 完美繼承主機應用程式的樣式和無障礙功能。在多代理系統中，協調器可以輕鬆理解輕量級的 A2UI 訊息內容，實現更流暢的協作。

### 3. 特定平台生態系統 (OpenAI ChatKit)

像 **ChatKit** 這樣的工具提供了高度整合、優化的體驗，專門用於在 OpenAI 生態系統內部署代理。

* **A2UI 的區別：** A2UI 專為希望跨 Web、Flutter 和原生移動端構建自己代理介面的開發者設計，或用於需要跨越信任邊界通訊的企業網格（如 A2A）。A2UI 讓客戶端擁有更多樣式控制權，這雖然犧牲了代理的部分控制權，但換來了與主機應用程式更高的視覺一致性。

## 實際應用案例與合作夥伴

A2UI 從開發初期就與 Google 內部及外部的多個團隊合作，旨在解決現實世界的問題。以下是幾個關鍵的合作案例：

### AG UI / CopilotKit

Google 強調了生態系統協作的重要性。**AG UI / CopilotKit** 團隊與 Google 合作確保了首日相容性 (day-zero compatibility)。

> 「代理-使用者互動協定 (AG-UI) 連接了代理後端和代理前端... AG-UI 完全支援 A2UI 規範，用於代理動態生成的豐富宣告式生成 UI。我們很高興能提供 AG-UI 和 A2UI 之間的首日相容性。」
> — *Atai Barkai，CopilotKit 和 AG UI 創始人*

### Opal：驅動實驗性 AI 迷你應用程式

**Opal** 是一個讓使用者用自然語言構建 AI 迷你應用程式的平台。Google 的 Opal 團隊是 A2UI 的核心貢獻者，並將其用於快速原型設計及整合到核心構建流程中。Opal 中的 A2UI 讓使用者能構建具有動態、生成式 UI 的應用。

> 「A2UI 是我們工作的基礎。它給了我們靈活性，讓 AI 以新穎的方式驅動使用者體驗，而不受固定前端的限制。」
> — *Dimitri Glazkov，Opal 團隊首席工程師*

### Gemini Enterprise：企業代理的自定義 UI

**Gemini Enterprise** 正在整合 A2UI，以允許企業代理在其主機應用程式中渲染豐富的互動式 UI，從資料輸入表單到審批儀表板，加速工作流程自動化。

### Flutter：多平台生成式 UI

**Flutter** 及其 **GenUI SDK** 利用 A2UI 作為遠端伺服器端代理與應用程式之間的 UI 宣告格式，幫助開發者生成符合品牌指南的動態 UI。

> 「A2UI 非常適合 Flutter 的 GenUI SDK，因為它確保每個平台上的每位使用者都能獲得高質量的原生感覺體驗。」
> — *Vijay Menon，Dart 工程總監*

### AI Powered Google：標準化代理式 UI

隨著 Google 全面採用 AI，A2UI 為內部團隊提供了一種標準化方式，讓 AI 代理交換使用者介面。這使得內部構建的代理能輕鬆在外部公開（如在 Gemini Enterprise 中）。

## 如何開始：試用 A2UI

對於想要深入了解的開發者，最佳方式是親自操作。

首先，可以訪問 [a2ui.org](https://a2ui.org) 閱讀快速入門指南和文件。
接著，可以前往 GitHub 專案中的 `samples` 資料夾，嘗試客戶端 UI 和後台範例代理（例如餐廳搜尋器）。

以下是啟動餐廳搜尋器範例的步驟：

```bash
git clone https://github.com/google/A2UI.git
export GEMINI_API_KEY="your_gemini_api_key"

# 運行餐廳搜尋器 A2A 代理
cd A2UI/samples/agent/adk/restaurant_finder
uv run .

# 運行使用 A2UI lit 渲染器庫的 lit 客戶端
cd A2UI/samples/client/lit/shell
npm install
npm run dev
```

此外，也可以透過試用 **GenUI SDK for Flutter** 來體驗 A2UI，或者使用 CopilotKit 提供的公開 **A2UI Widget Builder**。

### 支援的整合

目前該專案已擁有多個關鍵整合，Google 也表示未來希望支援更多整合，並歡迎社群貢獻。

![目前支援的整合列表](https://storage.googleapis.com/gweb-developer-goog-blog-assets/images/a2ui-blog-4-checklist.original.png)

## 展望未來

這是 A2UI 的第一個公開里程碑。目前的格式版本為 **v0.8**，經過了多輪實戰測試，但仍有演進空間。目前已提供 **Flutter**、**Web Components** 和 **Angular** 的早期客戶端庫。

隨著專案開源（Apache 2 授權），Google A2UI 團隊邀請生態系統共同參與：

* 完善和演進格式。
* 將 A2UI 連接到更多客戶端庫。
* 構建更強大的工具和演示。

有興趣的開發者可以查看其公開路線圖，了解專案的未來方向。

---

*本文內容基於 Google Developers Blog 官方公告整理。*

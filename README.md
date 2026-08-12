# w0x7ce 技術工作台

[w0x7ce.eu](https://w0x7ce.eu) 是一個以繁體中文為主的個人工程工作台，整理嵌入式系統、Local AI、基礎設施、公開專案與可重現實驗。網站使用 Docusaurus 3 建置，內容與介面都直接維護在這個倉庫。

## 內容結構

- `docs/`：可長期維護的技術筆記與實作指南。
- `blog/`：帶有時間脈絡的開發紀錄、決策與回顧。
- `src/data/featured-projects.json`：首頁與專案頁的公開專案白名單。
- `src/pages/projects/`：精選專案與驗證狀態。
- `src/pages/labs/`：公開服務、工具與實驗入口。
- `static/data/featured-projects.json`：由 GitHub 公開 API 產生的最小化唯讀快照。

## 本機開發

需要 Node.js 20 以上；CI 與部署目前使用 Node.js 24。

```bash
npm ci
npm run start
```

正式建置會先更新公開 GitHub 專案快照，再執行嚴格的 MDX、連結、錨點與重複路由檢查：

```bash
npm run build
```

未設定 `GITHUB_TOKEN` 時，快照腳本會使用公開 API；若 API 暫時不可用，會保留經過驗證的 last-known-good 資料。請勿把權杖、密碼或私人倉庫資訊寫入內容或快照。

## 增加與更新內容

1. 長期指南放進 `docs/`，並在 `sidebars.js` 指定清楚的分類與順序。
2. 有日期脈絡的內容放進 `blog/`，保留作者、標籤、摘要與可分享圖片。
3. 精選專案只修改 `src/data/featured-projects.json`；腳本只允許 `tianrking` 名下、明確列入白名單的公開倉庫。
4. 新增公開工具或服務時更新 `src/pages/labs/index.jsx`，並確認入口、說明與示例指令仍然有效。
5. 移動或刪除既有頁面時，在 `docusaurus.config.js` 補上 redirect，避免舊連結失效。

每次變更至少完成：

```bash
npm run build
git diff --check
```

內容宣稱應區分「程式碼存在」、「本機建置通過」、「實板驗證」與「正式環境運作」；不要把推測寫成已驗證事實。合併前也應檢查桌面／行動版、明暗主題、導覽、篩選、外部連結與舊 URL redirect。

## 自動化與部署

- Pull request 會使用 Node.js 24 執行完整生產建置。
- `V3.10.2` 是目前的預設／部署來源分支；推送後會建置並發布到 `v3.10.2_HTML`。
- 每日排程會重新建置並刷新公開專案資料；另一個唯讀工作流程會保存快照 artifact 供檢查。

舊的 `yarn swizzle` 實驗指令已不再是日常維護入口；需要客製 Docusaurus theme 時，應先確認現有 `src/theme/` 覆寫是否仍有必要。

---
slug: cat1-audio-upload-http-tls-socket-performance
title: "為何錄音卡的 Cat.1 上傳選擇 HTTP over TLS Socket：從 UART、分片回執到可靠提速"
description: "從 SCS527E 的 AT 介面、HTTP over TLS 分片、SHA-256 回執到 UART 提速，拆解一張錄音卡如何在 Cat.1 網路上可靠上傳音訊。"
authors: [tianrking]
tags: [嵌入式系統, 技術深度, Cat.1, TLS, SCS527E, 音訊]
date: 2026-08-23
keywords: [LTE Cat.1, SCS527E, HTTP over TLS, HTTPS, UART, 音訊上傳, 分片, SHA-256, RTS CTS]
---

錄音裝置要把一段 MP3 傳到雲端，表面上像是「把檔案送出去」；真正困難的地方卻在於：模組的 AT 介面有長度上限，UART 可能比 LTE 快或慢，網路會在任何一片中間斷線，而裝置又不能因為收到一個看似成功的狀態碼就刪掉唯一的本地副本。

這篇整理一套可移植到 MCU 錄音卡的工程模型：使用 SCS527E 建立 TLS socket，由 MCU 自行組裝 HTTP/1.1 請求，以原始 MP3 bytes 分片傳送，再用帶有檔案身份、分片 SHA-256 與冪等鍵的 JSON 回執推進 checkpoint。重點不是某一個產品，而是如何把「可連線」做成「可恢復、可驗證、可量產」。

:::info[先講結論]

`AT+SSLOPEN` 加 `AT+SSLSEND` **不是不用 HTTPS**。完整協議仍然是：

```text
HTTP/1.1 → TLS → TCP → LTE Cat.1
```

差別只在於 MCU 不使用模組的高階 `AT+HTTPPOST` / `AT+HTTPREAD` API，而是取得 TLS byte stream 後自行組 HTTP、控制分片、解析回執。它不是裸 TCP，也不是繞過伺服器的 HTTP。

「可靠成功」也不等於「模組回了 OK」或「伺服器回了 HTTP 201」。只有當回執中的 `upload_id`、分片序號、byte 數、分片 SHA-256 與整檔 SHA-256 都和本地狀態吻合，裝置才可以推進下一片；目前的安全預設仍然是不自動刪除本地錄音。

:::

## 1. 為什麼選 HTTP over TLS Socket

高階 HTTP AT 命令看起來最省事，但在「每片都有身份、摘要與回執」的錄音上傳中，控制權很重要。

| 路徑 | 模組替 MCU 做什麼 | 工程代價 |
| --- | --- | --- |
| `AT+HTTPPOST` / `AT+HTTPREAD` | 模組處理較多 HTTP(S) 流程，MCU 透過 AT 傳資料與讀結果 | 自訂 header、body 長度與回執 framing 受模組 API 約束；不一定能穩定取得應用層確認 |
| `AT+SSLOPEN` / `AT+SSLSEND` | 模組提供 TCP 上的 TLS byte stream | MCU 需要自己處理 HTTP/1.1、長度、回執、超時、重試與狀態機，但每個 byte 和每個身份欄位都可驗證 |

`AT+HTTPPOST` 可以作為供應商功能測試、相容性實驗或檔案系統 staging 的工具；它不應被直接當成「某一片錄音已被正確接收、可以刪除本地檔」的唯一證據。對於可恢復的分片上傳，direct TLS socket 讓裝置能精確知道：本次送出的 body 有多長、它屬於哪一個 upload、伺服器回覆的是哪一片。

## 2. SCS527E 的原廠邊界

設計必須先服從模組文件，而不是從一次成功的 PC 測試倒推出理論能力。以下數值以 SCS527E 原廠文件為準；對應資料位置列在文末。

| 原廠能力 / 限制 | 工程含義 |
| --- | --- |
| `AT+SSLSEND` 每次送出 **1–1460 個原始 bytes** | 一個 HTTP request 可以拆成多次資料階段；1460 不是應用層分片大小，也不是檔案大小上限。 |
| `+SSLURC:"recv",<client>,<length>` 帶明確長度 | 接收端必須先讀取 `<length>` 個 raw bytes，再回到 AT/URC 狀態；不能用「讀到換行」處理 HTTP body。 |
| `AT+HTTPPOST=<data_length>` 在自訂 header 時，header + body 共用 **4096 B** | header 放入 SHA、冪等鍵和身份欄位後，留給 body 的空間會縮小；這是高階 API 的總預算，不可和 `SSLSEND` 上限混為一談。 |
| 大資料傳輸可使用 RTS/CTS | 流控主要用來避免高速 UART 的接收溢位；它不會把 LTE 空口變快，也不能只靠 `AT+IFC=2,2` 就宣稱硬體已完成。 |
| `AT+IPR` 固定速率文件列表最高到 **460800** | 必須以真實模組的 `AT+IPR=?` 回應為準，並同步切換 MCU 與模組；不能把硬體手冊提到的 921600 或 3 Mbps 直接當作現有 AT 韌體的量產承諾。 |

這裡有三個很容易混淆的單位：

1. **應用層 chunk**：例如一片 3072 B 的 MP3 body，對應一個 checkpoint 和一個應用回執。
2. **HTTP request**：包含 header 與該片 raw body。
3. **`SSLSEND` data phase**：每次最多 1460 B，可能只包含 header、只包含 body，或跨過 header/body 邊界。

因此，3072 B body 通常要拆成多個 `SSLSEND`，但它仍然只是一個應用片；不能看到 AT 寫入次數就誤判檔案被分成了那麼多片。

## 3. 從 Mic 到伺服器的完整資料平面

```text
┌──────────┐   ┌──────────────┐   ┌─────────┐   ┌────────────┐
│ Mic/ADC  │ → │ MP3 + NAND  │ → │ SHA-256 │ → │ checkpoint │
└──────────┘   └──────────────┘   └────┬────┘   └─────┬──────┘
                                      │               │
                                      ▼               ▼
                              ┌─────────────────────────┐
                              │ UART：HTTP header + raw  │
                              │ MP3 body，分段 SSLSEND   │
                              └────────────┬────────────┘
                                           ▼
                                      ┌─────────┐
                                      │ SCS527E │
                                      └────┬────┘
                                           │ TLS/TCP/LTE
                                           ▼
                              ┌─────────────────────────┐
                              │ HTTPS ingest             │
                              │ bytes/SHA/idempotency   │
                              └────────────┬────────────┘
                                           ▼
                              identity-bound JSON receipt
```

一個穩定的 upload 至少要有以下身份欄位：

- `upload_id`：整個檔案的穩定身份，不因重試改變；
- `chunk_index` / `total_chunks`：分片位置與總數；
- `Content-Length`：本片 **原始 MP3 body** 的 byte 數，不包括 HTTP header；
- `chunk_sha256`：本片內容摘要；
- `file_sha256`：整個錄音檔的摘要；
- `Idempotency-Key`：通常可由 `upload_id:chunk_index:chunk_sha256` 組成，讓伺服器能安全處理重送。

MCU 組出的請求可以抽象成這樣。路徑只是示意，正式端點應由產品後端定義：

```http
POST /ingest/v1/audio/chunks HTTP/1.1
Host: upload.example.invalid
Content-Type: audio/mpeg
Content-Length: 3072
X-Upload-Id: <stable-upload-id>
X-Chunk-Index: 3
X-Total-Chunks: 7
X-Chunk-SHA256: <chunk-sha256>
X-File-SHA256: <whole-file-sha256>
Idempotency-Key: <upload-id>:3:<chunk-sha256>
Connection: keep-alive

[3072 bytes of the original MP3 body]
```

header 之後的 body 是二進位原文，不是 Base64、HEX，也不是以 `\0` 結尾的 C 字串。`0x00`、`0x1A`、CR、LF 都必須依照明確長度傳輸。

## 4. 一片資料的交易狀態機

每片應該是一個可以重放、可以驗證、可以中斷後恢復的交易：

```text
穩定 MP3
   │
   ├─ 計算 file_sha256 / upload_id
   ├─ 讀取 chunk body，計算 chunk_sha256
   ├─ 組 HTTP header
   ├─ header + raw body → 多次 SSLSEND（每次 ≤ 1460 B）
   ├─ 依 SSLURC length 收滿 HTTP response
   ├─ 驗證 status + JSON + upload_id + index + bytes + SHA
   │
   ├─ 通過：寫入 checkpoint，進入下一片
   └─ 失敗：保留原片，有限退避後用同一個 key 重試
```

| 回應狀態 | 裝置動作 |
| --- | --- |
| 非末片 `200`，身份、byte 數與分片 SHA 全部吻合 | 寫入下一片 checkpoint。 |
| 末片 `201`，整檔 byte 數與 file SHA 全部吻合 | 標記伺服器端組裝完成；仍不代表可直接刪除本地檔。 |
| `4xx`、順序錯誤、SHA 不一致 | 不盲目重試；保留檔案與診斷資訊，等待人工或策略處理。 |
| `5xx`、`429`、超時、網路斷線 | 有限退避，用相同的 upload/chunk/key 重試。 |
| `+SSLURC:"closed"` | 只表示 TLS socket 關閉，不表示本片成功。 |
| HTTP header 不完整、body 截斷、JSON 不匹配 | 視為未確認，不推進 checkpoint。 |

### 為什麼不把 201 或 socket closed 當作刪除條件

HTTP 201 只表示伺服器接受了某個請求；如果回執被截斷、`upload_id` 錯配、body 長度錯誤，裝置仍不能證明「本地這一份檔案」已被正確保存。socket closed 甚至只說明連線結束，可能發生在伺服器回覆之前。

更安全的刪除策略是另外取得一個帶身份的完成回執，至少同時滿足 `complete=true`、`verified=true`、`delete_allowed=true`，並比對本地整檔 bytes 與 SHA。若 status 端點尚未經過正式部署與實機驗收，刪除開關就應保持關閉。

## 5. 為什麼不用 Base64、MQTT 大 payload 或裸 TCP

### Base64

Base64 會把資料量增加約三分之一，並且需要額外的編碼 buffer、CPU 時間與長度換算。對已經是二進位 MP3 的 body，直接以 `Content-Length` 傳 raw bytes 更簡單，也更容易用 SHA-256 驗證「傳了什麼」。

### MQTT 大 payload

MQTT 很適合事件、遙測與小訊息，但把一個錄音檔塞成大 payload 後，重試邊界、broker 限制、QoS 語意、分片身份和檔案完成狀態仍然要自己補上。若最後仍要自訂 chunk、hash、冪等和組裝服務，MQTT 並沒有自動提供錄音檔的可靠提交語意。

### 裸 TCP

裸 TCP 沒有伺服器身份驗證，也沒有 HTTP 的狀態、header 與代理/觀測工具生態。除非產品另行設計完整的 TLS、身份認證、版本、錯誤與重放防護，否則不能用「TCP 連得上」代替 HTTPS 的安全邊界。

## 6. 長連線 keep-alive：減少握手，不減少驗證

長連線的作用是讓多片資料在同一個 TLS socket 上依序傳送，避免每一片都重新做 TCP/TLS 建連。它不是把回執省掉，也不是允許 MCU 盲目連續塞入多片。

安全規則很簡單：

1. 只有伺服器實際回覆 `Connection: keep-alive`，才把 socket 標成可復用。
2. 每片仍然要等完整 HTTP response 和 JSON receipt。
3. 任何 `Connection: close`、`closed`、逾時、解析失敗或回執身份錯誤，都回退到「一片一連線」或重新 `SSLOPEN`。
4. 重連後沿用相同 `upload_id`、chunk index、body 和冪等鍵，讓後端可以判斷重送是否已經存在。

因此，keep-alive 是可靠性不變前提下的提速選項，而不是跳過提交確認的捷徑。

## 7. 一次實測告訴了我們什麼

以下數字是**單次伺服器觀測，不是理論上限，也不是量產效能承諾**：

| 指標 | 觀測值 |
| --- | ---: |
| 檔案大小 | 18,750 B |
| 應用分片 | 7 片，基準 body 3,072 B，末片較小 |
| 首片 body 開始至末片 body 收完 | 5,415 ms |
| 伺服器組裝、SHA、落盤與原子發布 | 2 ms |
| 有效 payload | 3,462.6 B/s = 27.7 kbps |

這個計時包含每片等待回執的時間，但不一定包含第一次 PDP、DNS、TLS `SSLOPEN` 的全部前置成本；它也不是 LTE 基地台的物理層吞吐率。

以 32 kbps CBR MP3 粗估：

- 一小時錄音約 `32,000 / 8 × 3,600 = 14,400,000 B`，即約 14.4 MB（13.73 MiB）；
- 以 27.7 kbps 的有效上傳速度，單純除法約需 69.3 分鐘，還未加首次連線、重試與網路波動；
- 因為音訊產生速率 32 kbps 高於這次觀測到的 27.7 kbps，無限邊錄邊傳會形成積壓，約每小時增加 1.9 MB。

所以目前更合理的產品模式是「停止錄音、完整刷盤、背景上傳」。若要改成真正的邊錄邊傳，平均有效速度必須長期高於編碼速率，還要重新設計檔案一致性、掉電恢復與本地緩衝，不是把上傳執行緒移到錄音執行緒旁邊就完成。

## 8. 提速路線：先保可靠，再提高吞吐

提速順序應該按照「改動小、可回退、容易證明」排列：

| 優先級 | 路線 | 必須驗收的事情 |
| --- | --- | --- |
| P0 | 保持 raw TLS HTTP、分片 SHA 與完整 receipt | 不因追求速度而跳過身份、長度或 checkpoint。 |
| P1 | 在真機驗證 keep-alive | 證明多片只 `SSLOPEN` 一次，並且伺服器真的允許復用；否則回退一片一連線。 |
| P2 | 評估更大的應用分片 | 伺服器可接受 4096 B body，但現有 MCU Kconfig 的 `HERA_RECORDING_UPLOAD_CHUNK_BYTES` 上限是 **3072 B**；必須先擴大 Kconfig、buffer、重傳與掉電邊界，再做 3072 → 4096 A/B，不能只改配置，也不能宣稱 4096 已驗證。 |
| P3 | UART 115200 → 230400 → 460800 | 每一檔都先以真實模組執行 `AT+IPR=?`，同步切換兩端，測連續上傳、掉網、模組重置、MCU 重置與 checkpoint resume。 |
| P4 | RTS/CTS + 1.8 V 硬體與 driver | 接線、pinmux、電平、`AT+IFC=2,2` 與 driver 必須一起通過 HIL；流控是可靠性基礎，不是單獨的 LTE 加速器。 |

不要把 921600 或 3 Mbps 寫成「已可用」：硬體手冊提到的 MAIN UART 能力，和目前 AT 文件的固定 `AT+IPR` 列表不是同一層證據。現階段可以審計的最高目標是 460800，而且仍需要真模組和真板 HIL。

### 高速切換的安全步驟

`AT+IPR` 是保存型設定，且原廠說明不支援自動波特率自適應。正確流程是：

1. 以已知的 115200 啟動，記錄 `AT+IPR=?` 和韌體版本回應。
2. 先測 230400，再測 460800；每次都同步切換 MCU UART 和模組設定。
3. 以 `AT` / `AT+IPR?` 雙向確認，保留外部救援或 PWRKEY/RESET 回退路徑。
4. 每個檔位用同一批音訊測成功、斷線、重置、重試與摘要一致性。
5. 只有連續 HIL 通過，才把新速率放進獨立候選 profile；原 115200 profile 必須保留。

## 9. 證據邊界：哪些已知，哪些仍未完成

工程文件最容易犯的錯，是把「原始碼存在」「PC 序列埠成功」和「整機量產完成」寫成同一件事。應該分層記錄：

| 項目 | 目前能說什麼 | 不能提前宣稱什麼 |
| --- | --- | --- |
| SCS527E direct TLS socket 最小互通 | 有 14 B 合成資料、伺服器 bytes/SHA 和 HTTP 201 的實機證據 | 不等於真實長 MP3、多片、弱網或整機錄音已通過。 |
| MCU HTTP/分片/checkpoint 邏輯 | 可由 source、fake modem 與後端契約回歸 | 不等於 ATS3085S UART2、供電、SIM/PDP 和音訊路徑已 HIL。 |
| 單次 18,750 B 速度觀測 | 有 5,415 ms、27.7 kbps 的伺服器記錄 | 不等於 Cat.1、UART 或 LTE 的理論峰值。 |
| keep-alive 設計 | 具備收到 `Connection: keep-alive` 才復用的安全回退規則 | 尚不能宣稱真機多片已只使用一條 TLS socket。 |
| 460800 | 可列為梯度 HIL 目標，原廠 AT 文件列表有此檔位 | 不能把 460800、RTS/CTS、弱網恢復寫成已量產。 |
| 生產 TLS | 應使用 CA、可信時間、SNI、`seclevel=1` 與裝置身份認證 | 測試用 `seclevel=0`、臨時 CA 或未驗證 hostname 絕不能進量產。 |

這個表不是保守措辭，而是讓測試、硬體、後端和產品驗收各自有明確的完成條件。

## 10. 量產安全與隱私紅線

1. 錄音不能走裸 TCP/UDP，也不能因 MQTT 「有 QoS」就跳過檔案級摘要與完成語意。
2. 生產 TLS 必須校驗 CA、可信時間、SNI 和伺服器身份；錯誤 CA、錯誤時間與錯誤 hostname 都應該失敗。
3. `upload_id` 是冪等身份，不是認證憑據。正式後端仍需要每設備認證、防重放、權限、儲存加密、保留與刪除政策、審計記錄。
4. 日誌只能輸出檔案大小、分片序號、狀態碼與摘要結果；不要輸出 token、私鑰、activation code、內網 IP、完整測試端點或音訊正文。
5. `seclevel=0` 僅可留在隔離的臨時互通測試，不能和生產設定共用，也不能在公開文件中提供可直接利用的憑證繞過設定。
6. 自動刪除是獨立的產品決策：在後端完整回執、裝置身份、掉電恢復和資料保留政策都未驗收前，預設保留本地錄音。

## 11. 一份可以直接拿去做 HIL 的清單

```text
[ ] 以真實 SCS527E 執行 AT+IPR=?、AT+IFC=? 與 AT+SSLCFG=?
[ ] 確認 1.8 V 電平、共地、供電峰值、PWRKEY/RESET 與 SIM/PDP
[ ] 上傳多片真實 MP3，確認每片 receipt、整檔 SHA 與檔案大小
[ ] 測 keep-alive 真復用；伺服器回 close 時驗證安全回退
[ ] 測斷網、TLS close、模組 reset、MCU reset、掉電與 checkpoint resume
[ ] 在 115200、230400、460800 分別做同批音訊的重複測試
[ ] 只有先擴大 MCU Kconfig/buffer/重傳邊界後，才做 3072 → 4096 A/B
[ ] 接上 RTS/CTS 後做高 baud 溢位、長時間傳輸與錯誤注入
[ ] 驗證生產 CA、時間、SNI、seclevel=1、裝置認證與撤銷策略
[ ] 在 status receipt 通過前，保持本地檔案不可自動刪除
```

## 12. 原廠資料定位

本文的模組參數與 AT 行為以以下原廠資料為準，版本與頁碼應在每次供應商韌體更新後重新核對：

1. **AN0701《SCS527E AT 指令手冊》**：`AT+IPR` 約第 97–98 頁；`AT+IFC` 約第 102 頁。
2. **AN0708《SCS527E CAT.1 芯片級模組應用指導／硬體使用手冊》**：MAIN UART、RTS/CTS、預設速率與硬體能力約第 29–30 頁。
3. **AN0714《SCS527E 應用指導：SSL & TLS》**：TLS context、`SSLOPEN`、`SSLSEND` 的 1–1460 B 限制，以及 `SSLURC recv/closed` 約第 15–21 頁。
4. **AN0715《SCS527E 應用指導：HTTP(S)》**：`HTTPPOST` 的 4096 B header + body 預算、`HTTPPOSTFILE` 與 `HTTPREAD` 約第 17–20 頁。

如果供應商韌體、AT 文件或伺服器契約變更，應重新做同一套「原始資料 → 模組回顯 → 真機 HIL → 後端回執」鏈路，而不是只更新文章中的一個數字。

## 結語

HTTP over TLS Socket 的價值不是把 AT 指令寫得更低階，而是把錄音上傳拆成一組可驗證的邊界：UART 只負責有長度的 byte stream，TLS 負責保密與伺服器身份，HTTP 負責請求語意，SHA-256 和冪等鍵負責資料身份，checkpoint 負責中斷恢復，後端 receipt 則負責告訴裝置「這一片到底是哪一片」。

在這個模型上，keep-alive、較大 chunk、較高 baud 和 RTS/CTS 都可以逐步測量、逐步回退；在模型之外，任何「201 就刪檔」「921600 已經可用」或「測試 TLS 等於量產 TLS」的捷徑，都只是把尚未解決的風險藏到下一次掉電、斷網或資料爭議裡。

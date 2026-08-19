---
slug: smart-wearable-sensor-research
title: "智能穿戴傳感器與介面選型研究：從物理量、器件到系統驗證"
description: "按智能穿戴物理量與產品模態梳理傳感器家族、代表器件、主機介面、資料協議、價格級別、系統風險與驗證邊界。"
authors: [w0x7ce]
tags: [嵌入式系統, 技術深度]
date: 2026-08-19
keywords:
  - 智能穿戴
  - 傳感器
  - 感測器
  - PPG
  - ECG
  - BioZ
  - IMU
  - 毫米波雷達
  - 汗液電化學
  - 硬體選型
  - BOM
  - RFQ
---


**版本：** 1.1（PM／硬體規劃版）
**資料截止：** 2026-08-19（UTC+8）
**適用範圍：** 智能手錶、手環、戒指、耳掛／耳機、胸牌／卡片、吊墜、貼片、戶外穿戴與健康／運動穿戴

> 本文件是通用的智能穿戴傳感器調研，不針對任何單一品牌、晶片平台或既有產品工程。文中型號是用於建立選型池的代表性量產器件，不宣稱已覆蓋全球所有 SKU，也不等同於實機、人體或醫療驗證。

> **完整性口徑：** 本版的「完整」是指在智能手錶、手環、戒指、耳掛／耳機、胸牌／卡片、貼片與戶外穿戴的適用範圍內，按物理量與產品模態覆蓋主要感測家族，並為每個家族提供可落地的代表器件、主機接口／資料協議、價格級別和工程風險；不是靜態窮舉全球每一家供應商的每一個 orderable SKU。罕見的實驗室、工業或醫療專用模態會在「邊界與未納入主 BOM」中標明，不能把代表性器件表誤讀成全球 AVL。

## 1. 執行摘要

智能穿戴不是把多顆感測 IC 疊在同一張 PCB 上，而是「感測元件 + 光學／電極／聲學／天線結構 + 電源 + 韌體 + 演算法 + 驗證」的系統工程。最常見的錯誤，是把晶片資料手冊中的解析度、ADC 位數或「支援 HR／SpO₂／ECG」直接當成最終產品精度。

### 1.1 先按產品形態選感測器

| 產品形態 | 第一優先 | 可選擴展 | 通常不適合首版的器件 | 主要原因 |
|---|---|---|---|---|
| 卡片／夾式／胸牌 | 6 軸 IMU、麥克風、霍爾、環境溫度、電量計、震動 | 氣壓、環境光、NFC、接觸式振動拾音 | PPG、ECG、PM、CO₂、GNSS | 沒有穩定貼膚壓力；光學與通風體積受限 |
| 手環／手錶 | IMU、PPG、皮膚溫度、氣壓、環境光 | ECG、EDA／BioZ、磁力計、NFC、GNSS | PM、CO₂、蜂窩全堆疊 | 手腕接觸穩定，但光學、電極與射頻共存仍很難 |
| 戒指／貼片 | PPG、皮膚溫度、IMU、EDA／ECG | BioZ、汗液／電化學、低功耗 NFC | 大型 PM、CO₂、揚聲器／大天線 | 面積、電池、散熱和電極間距非常受限 |
| 耳掛／耳機 | 空氣麥、接觸振動／骨傳導路徑、IMU、磁力計、耳內溫度 | 耳內 PPG、ToF、NFC、超低功耗動作感測 | 大型氣體／顆粒物模組 | 聲學結構是主體；耳內光學需要定製佩戴結構 |
| 戶外／安全穿戴 | IMU、氣壓、GNSS、磁力計、溫度、光線 | UWB、蜂窩、NFC、環境氣體 | 首版同時加入所有健康 AFE | 天線、峰值功耗、認證和散熱優先級更高 |

### 1.2 建議的產品分層

1. **基礎互動層：** IMU、霍爾、按鍵／電容觸控、麥克風、震動、電量計。
2. **環境與運動層：** 氣壓、溫濕度、環境光、磁力計、ToF／接近。
3. **Wellness 趨勢層：** PPG、皮膚溫度、EDA／BioZ、單導聯 ECG；先定義為趨勢與生活方式資訊。
4. **連線與安全層：** GNSS、NFC、UWB、Wi‑Fi／蜂窩、安全元件；每一項都需要天線、認證、供電和軟體服務配套。
5. **特殊環境層：** VOC、PM、CO₂、汗液／電化學。這些不應只看 IC 單價，需把暖機、氣流、污染、校準、演算法與機構成本納入。

### 1.3 本文價格口徑

- 價格以 2026-08-19 查到的公開原廠／分銷頁面或公開價格錨點為基礎，單位為美元。
- 表內「約」是用於立項、BOM 上限和 RFQ 優先級，不是採購承諾；裸 IC、模組、評估板的價格不能混用。
- 除非特別註明，價格**不含** PCB、光學件、LED／光電二極體、電極、天線、晶振、匹配網路、電池、SMT、認證、演算法授權、雲服務和稅運費。
- 公開切帶／小批量價格通常高於 500／1k／10k 量產價；量產必須向原廠或代理商按 1k、10k、50k 重新 RFQ。

| 價格標籤 | 用法 |
|---|---|
| `&lt;$1` | 低成本開關、基礎溫度、簡單環境／光線器件常見區間 |
| `$1–3` | 常見低功耗 MEMS、磁力計、溫度、電量／充電協同器件 |
| `$3–8` | 中高性能 IMU、ToF、NFC、PPG AFE、音訊 Codec |
| `$8–20` | ECG／BioZ AFE、GNSS、UWB、小型高整合模組 |
| `>$20／RFQ` | 蜂窩模組、PM／CO₂ 模組、含預置憑證或演算法服務的方案 |
| `NDA／RFQ` | 需要註冊、保密資料、特殊校準或客製演算法，不能用網頁價替代 |

## 2. 感測器物理分類與可交付能力

| 類別 | 實際感知的物理量 | 可做的產品功能 | 不能直接宣稱的能力 | 常見主機接口 |
|---|---|---|---|---|
| 加速度計 | 線性加速度、重力分量 | 計步、姿態、敲擊、跌落／碰撞、活動分類 | 精確跌倒救援、醫療級姿態判定 | I²C、SPI、I3C、IRQ |
| 陀螺儀 | 角速度 | 旋轉、手勢、穩定、姿態融合 | 長時間無漂移的絕對方位 | I²C、SPI、I3C、IRQ |
| 磁力計 | 地磁與局部磁場 | 指南針、磁吸座、旋鈕／霍爾補充、室內方向 | 有強磁、馬達、喇叭時仍能可靠指北 | I²C、SPI、I3C、IRQ |
| 氣壓計 | 絕對氣壓 | 相對高度、樓層、爬升、天氣趨勢 | 僅靠氣壓確認海拔或救援位置 | I²C、SPI、I3C |
| PPG | LED 光被血液容積變化調制的反射／透射 | 心率、HRV 趨勢、SpO₂ 趨勢 | 貼上晶片就有準確血氧、血壓或疾病診斷 | I²C、SPI、IRQ |
| ECG | 皮膚電極間的心臟生物電位 | 心電波形、節律趨勢、運動恢復 | 消費級單導聯直接等同臨床診斷 | SPI、模擬輸出、IRQ |
| BioZ／BIA | 身體阻抗／複阻抗 | 呼吸趨勢、接觸檢測、身體阻抗研究 | 直接得到體脂、血糖或疾病結果 | SPI、I²C 控制、模擬前端 |
| EDA／GSR | 皮膚導電／電化學反應 | 皮膚電反應趨勢、壓力相關研究 | 將 EDA 數值直接等同心理狀態或診斷 | SPI、I²C 控制、模擬前端 |
| 接觸／皮膚溫度 | 皮膚附近熱平衡 | 溫度趨勢、佩戴狀態、熱事件 | 不經熱路徑設計就代表核心體溫 | I²C、SMBus、ADC |
| 紅外非接觸溫度 | 熱輻射／熱電堆 | 耳內／額頭／目標物溫度 | 任何角度、距離和遮擋下都維持醫療精度 | I²C |
| 溫濕度 | 周圍空氣溫度與相對濕度 | 佩戴微環境、舒適度、環境記錄 | 由手腕附近濕度推出身體水分或健康診斷 | I²C |
| VOC／NOx／氣體 | 化學吸附或電化學反應 | 空氣趨勢、污染事件、通風提示 | 不經目標氣體校準就輸出精確 ppm | I²C、模擬 AFE |
| 顆粒物 PM | 光散射／雷射與光電探測 | PM1／PM2.5／PM10 趨勢 | 小型穿戴內置後一定等同環境站數據 | I²C、SPI |
| 環境光 | 可見光／近紅外光強度 | 自動亮度、日照／光暴露趨勢 | 單一 ALS 直接代表 UV 劑量 | I²C |
| UV／光譜 | UVA／UVB／UVC 光譜輻照 | 紫外暴露、特殊光源監測 | 沒有光學校準就把 count 當成皮膚劑量 | I²C |
| 顏色／多通道光譜 | 可見光、近紅外、清光與閃爍等波段 | 色彩／皮膚色調研究、顯示與相機白平衡、光源識別 | 單顆光譜 IC 直接完成膚色、血液或健康判定 | I²C；部分方案另有 IRQ |
| CMOS 影像／深度影像 | 光子、像素陣列、近紅外／ToF 回波 | 拍照、視覺交互、姿態／手勢、環境識別 | 裝上影像 sensor 就有完整視覺 AI；不含鏡頭、ISP、資料存儲與隱私流程 | MIPI CSI-2／D-PHY；配置接口依型號 |
| 熱成像陣列 | 遠紅外輻射的空間分佈 | 熱源／人體輪廓／環境熱分佈研究 | 熱像素直接等同核心體溫或醫療影像 | I²C、SPI（依模組） |
| 毫米波雷達 | FMCW 回波的距離、速度、角度與微動 | 存在／距離／姿態、呼吸微動、非接觸交互 | 只放雷達 IC 就能完成人體識別、呼吸或跌倒救援 | SPI；FMCW 原始／目標資料與本地 DSP |
| ToF／接近 | 紅外光飛行時間或反射 | 手勢、距離、接近、佩戴／遮擋檢測 | 在所有玻璃、陽光和黑色目標上都同樣可靠 | I²C、GPIO IRQ |
| 霍爾 | 磁場閾值／磁場強度 | 充電座、蓋合、佩戴、位置開關 | 以低成本霍爾取代高精度 3D 磁力計 | GPIO、ADC、I²C（視器件） |
| 電容／Qvar | 電場／電容變化 | 觸控、滑動、接近、隔著外殼手勢 | 不處理人體、外殼、濕度和 EMI 就保證觸控穩定 | I²C、GPIO、ADC |
| 力／應變／壓力 | 電阻、電容、壓電或應變變化 | 按壓、佩戴壓力、鞋墊／貼片受力 | FSR 電壓直接等同標準力值 | ADC、電橋 AFE、I²C |
| 直接氣囊／袖帶壓力 | 氣囊或流體的差壓／絕對壓力 | 袖帶式血壓、氣壓腔、阻塞／氣流監測 | 壓力 sensor 讀值本身不是收縮壓／舒張壓；仍需袖帶、閥、泵與演算法 | 類比、I²C、SPI |
| 肌電／腦電／眼電 | 肌肉、腦部或眼球運動造成的微弱生物電位 | EMG 動作／疲勞研究、EEG／睡眠研究、EOG 眼動 | 多通道 AFE 或高分辨率 ADC 不等於可穿戴醫療診斷 | SPI、類比 ADC、IRQ |
| 汗液／電化學 | 電流、電位、阻抗或化學反應 | pH、離子、乳酸等研究型趨勢 | AFE 本身不是葡萄糖／乳酸／電解質 sensor；需外部電極、微流道與校準 | SPI、I²C 控制、類比 |
| 呼吸／血壓／睡眠／體脂等推導量 | 多源訊號的時間、形態與模型特徵 | 呼吸率、PTT／PAT、睡眠習慣、體脂／水合趨勢 | 這些通常不是單顆 sensor 的直接輸出，不能從資料手冊宣稱準確度 | 取決於原始訊號鏈 |
| 空氣麥克風 | 聲壓 | 通話、錄音、VAD、聲景 | 麥克風本身分離說話者或理解語義 | PDM、I²S、模擬 ADC |
| 接觸式振動／VPU | 機身／外殼／皮膚的振動 | 補充通話另一端、碰撞、機械事件、聲音活動檢測 | 單一 VPU 自動知道「對面說了什麼」或完成聲源分離 | 模擬 ADC、PDM、I²S、專用 AFE |
| GNSS | 衛星訊號到達時間與軌道資訊 | 戶外位置、速度、時間 | 室內、人體遮擋和小天線下保證定位 | UART、I²C、USB；NMEA／UBX |
| NFC／RFID | 13.56 MHz 近場耦合 | 一碰配對、標籤、門禁、配置、支付方案 | 只放天線就有完整 NFC 功能 | SPI、I²C；ISO／NFC Forum |
| UWB | 超寬頻脈衝飛行時間／相位 | 精確測距、尋物、角度 | 只放 UWB IC 就能與所有手機互通 | SPI；IEEE 802.15.4z／FiRa |

## 3. 主機接口與協議梳理

### 3.1 接口不是應用協議

設計文件必須分成兩層：

- **晶片與主控之間的接口：** I²C、I3C、SPI、UART、PDM、I²S、ADC、GPIO。
- **空中或資料語義協議：** BLE GATT、NMEA／UBX、ISO 14443／15693、NFC Forum、IEEE 802.15.4z、FiRa、Wi‑Fi AT 指令等。

例如，GNSS 可能用 UART 連到主控，但資料內容是 NMEA 或 UBX；NFC 讀卡器可能用 SPI 或 I²C 控制，但射頻側跑的是 ISO 14443、ISO 15693 或 FeliCa；UWB 常用 SPI 控制收發器，空中側則是 IEEE 802.15.4z／FiRa。把這兩層混寫，後續很容易誤判 MCU 是否「支援某協議」。

### 3.2 接口選擇表

| 接口 | 電氣／資料特徵 | 適合器件 | 主要風險與設計規則 |
|---|---|---|---|
| I²C／SMBus | 兩線、多從機、開漏、需上拉；常見 100 kHz／400 kHz／1 MHz | 溫度、壓力、環境光、PPG 控制、電量計、安全元件 | 位址衝突、總線電容、上拉功耗、線長和共地；為每顆器件記錄位址與 reset 行為 |
| MIPI I3C | 兩線、動態位址、In-Band Interrupt、高於 I²C 的吞吐；可與多數 I²C 從機共存 | 新一代 IMU、磁力計、手機／穿戴多感測器 | 主控要有 I3C Controller；I²C 從機相容性、電平和 hot-join 需實機驗證。MIPI 公開頁面目前列出 I3C v1.2／I3C Basic v1.2。 |
| SPI | SCLK、MOSI、MISO、CS；全雙工，吞吐高，無統一暫存器格式 | ECG／BioZ AFE、IMU、NFC、UWB、Flash、部分壓力／PM | 每個從機通常需要獨立 CS；CPOL／CPHA、最高頻率、DMA、三線／四線和中斷要逐顆確認 |
| UART | 非同步點對點，TX／RX，可加 RTS／CTS | GNSS、蜂窩模組、Wi‑Fi／藍牙協處理器、調試 | 波特率、流控、睡眠喚醒、AT 指令和資料 framing 必須凍結；不要把 UART 裸資料當成應用協議 |
| PDM | 麥克風輸出的 1-bit 高速脈衝密度流，共享時鐘，主控做抽取／濾波 | 數位 MEMS 麥克風 | 必須有 PDM Clock、DMA 和 decimation；左右聲道時鐘邊沿／L-R 選擇要確認 |
| I²S／TDM | BCLK、WCLK／LRCLK、SD，可選 MCLK；承載 PCM 音訊樣本 | I²S 麥克風、音訊 Codec、DSP、功放 | 音訊資料時序、bit width、master／slave、採樣率和時鐘樹要凍結；Codec 的控制介面常另用 I²C／SPI |
| ADC／GPIO | 直接取類比電壓或數位事件 | NTC、FSR、壓電、類比 ECG／VPU、霍爾開關、按鍵 | 需考慮 ADC 參考、輸入保護、偏置、取樣頻率、抗混疊、漏電和 ESD；GPIO interrupt 要定義去抖與喚醒條件 |
| PWM／脈衝計數 | 用占空比、頻率或脈寬表示輸出／感測量 | 震動馬達、簡單光源、頻率型感測器 | 要指定計時器、解析度、硬體捕獲和低功耗狀態 |
| 1-Wire／SWI | 單線、器件特定協議 | 溫度、部分安全元件 | 不要因為都是單線就互相相容；確認電氣時序、地址、休眠和驅動授權 |
| USB | 主機／設備枚舉、電源與高吞吐資料 | 音訊、調試、資料導出、蜂窩模組 | USB 不是感測器總線；要定義 descriptor、功耗角色、ESD、Type-C CC 和資料安全 |

MIPI 將 I3C 定義為面向感測器與周邊的低功耗兩線控制總線，並強調 I²C 共存與 In-Band Interrupt；應以 [MIPI I3C 官方頁面](https://www.mipi.org/specifications/i3c-sensor-specification) 和 [I3C FAQ](https://www.mipi.org/resources/i3c-frequently-asked-questions) 為規格入口。I²C 電氣與時序應以 [NXP UM10204](https://www.nxp.com/docs/en/user-guide/UM10204.pdf) 為基準，而非只照某一顆 sensor 的簡化範例。

### 3.3 音訊接口特別說明

```text
空氣聲／機身振動
        │
        ├─ 數位 MEMS 麥克風 ─ PDM／I²S ─┐
        ├─ 類比麥／壓電接觸拾音 ─ ADC ──┼─ DSP／主控
        └─ 多通道 Codec ─ I²S／TDM ──────┘
```

- **PDM／I²S 傳的是採樣資料，不是「音訊理解協議」。**
- **VPU／接觸式拾音器不是固定的一種晶片。** 它可能是壓電薄膜、陶瓷、接觸式麥克風、MEMS 加速度計或專用 AFE；接口可能是類比 ADC、PDM 或 I²S。
- 接觸式路徑能改善機械耦合下的抗環境噪聲能力，但必須在真實外殼、手機接觸面、風噪、敲擊與佩戴狀態下測試；它不會自動完成聲源分離、說話者識別或語音轉文字。

## 4. 代表性器件池

### 4.1 運動、姿態與方向

| 子類別 | 廠商／代表型號 | 主要能力 | 主機接口／封裝要點 | 公開價格粗估 | 生命週期／選型備註 |
|---|---|---|---|---:|---|
| 6 軸 IMU | Bosch BMI270 | 3 軸加速度 + 3 軸陀螺；低功耗、步數／姿態／活動特徵 | I²C／SPI；約 2.5 × 3.0 × 0.8 mm | `$1.5–4` | 成熟、資料和軟體資源多；適合第一版運動層 |
| 6 軸 IMU | Bosch BMI323 | 16 位加速度與陀螺，內建事件與步數特徵 | I²C／I3C／SPI；約 2.5 × 3.0 × 0.83 mm | `$2–5` | 新設計可評估；確認主控 I3C 與既有驅動能力 |
| 6 軸 IMU | TDK ICM-42688-P | 低噪聲、高速、APEX 動作功能，適合可穿戴與運動 | I²C／I3C／SPI；約 2.5 × 3.0 × 0.91 mm | `$2–6` | 小批量切帶價可能遠高於量產；要核對溫漂與 FIFO 使用方式 |
| 6 軸 IMU | TDK ICM-45686 | 低噪聲 6 軸，APEX／FIFO，面向穿戴與 AR／VR | I²C／I3C／SPI | `$3–8` | 高性能但軟體、供貨與價格需按目標量 RFQ |
| 6 軸 IMU | ST LSM6DSV16X | 三通道資料路徑、FSM／MLC、Qvar、步數與手勢 | I²C／SPI／I3C；LGA 約 2.5 × 3.0 × 0.83 mm | `$3–5`；曾公開 `$2.98/1k` | Active、volume production；功能多但驅動配置複雜 |
| 3 軸加速度計 | Bosch BMA400／BMA530 | 超低功耗喚醒、步數、敲擊、活動事件 | I²C／SPI；約 2 mm 級封裝 | `$0.8–2.5` | 若產品只需動作喚醒，不要為陀螺付出額外功耗與成本 |
| 3 軸磁力計 | Bosch BMM350 | 16 位 TMR 磁力計，低噪聲、抗磁場衝擊恢復 | I²C／I3C；1.28 × 1.28 × 0.5 mm WLCSP | `$1.5–3.5` | 可做指南針、方向、旋鈕／磁吸狀態；需要遠離磁鐵、喇叭和大電流走線 |
| 3 軸磁力計 | ST LIS2MDL | ±50 gauss、16 位、可產生磁場中斷 | I²C／SPI；LGA | `$0.8–2.5` | Active、volume production；適合成本敏感的電子羅盤 |
| 3 軸磁力計 | Memsic MMC5983MA／TDK AK09918 | 高解析地磁／磁場檢測 | I²C／SPI（按型號確認） | `$1.5–5` | 需逐顆確認驅動、校準工具與磁場範圍，不能只按品牌替換 |

原廠資料： [Bosch BMI270](https://www.bosch-sensortec.com/en/products/motion-sensors/imus/bmi270)、[Bosch BMM350](https://www.bosch-sensortec.com/en/products/motion-sensors/magnetometers/bmm350)、[TDK ICM-42686-P](https://adm.invensense.tdk.com/icm-42686-p)、[ST LSM6DSV16X](https://www.st.com/en/mems-and-sensors/lsm6dsv16x.html)、[ST LIS2MDL](https://www.st.com/en/mems-and-sensors/lis2mdl.html)。

**選型重點：** 如果主要功能是計步、敲擊和佩戴狀態，低功耗加速度計可能比完整 6 軸 IMU 更合理；如果要做姿態、旋轉手勢或聲學穩定，再加陀螺。磁力計必須在整機結構內重新校準，不能只在開發板上校準後照搬。

### 4.2 氣壓、高度與壓力

| 廠商／代表型號 | 主要能力 | 主機接口／尺寸 | 公開價格粗估 | 選型備註 |
|---|---|---|---:|---|
| Bosch BMP390 | 24 位絕對氣壓；300–1250 hPa；低噪聲 | I²C／SPI；2.0 × 2.0 × 0.75 mm | `$1.5–4` | 1 Hz 典型電流約 3.2 µA；適合高度、爬升、樓層 |
| Bosch BMP580／BMP581／BMP585 | 新一代低功耗、高性能壓力系列 | I²C／SPI；按型號確認封裝與資料率 | `$2–6` | 新設計要比較噪聲、功耗、供貨和 driver maturity |
| Infineon DPS310／DPS368 | 高解析氣壓；面向穿戴、導航、IoT | I²C／SPI；小型 LGA | `$1–4` | 防水膜、通氣孔、汗水與膠水是實機風險 |
| ST LPS22DF | 260–1260 hPa；低功耗、FIFO、中斷 | I²C／SPI／I3C；2.0 × 2.0 × 0.73 mm | `$1–4` | 低功耗與 I3C 適合多感測器匯流排 |

原廠資料： [Bosch BMP390](https://www.bosch-sensortec.com/en/products/environmental-sensors/pressure-sensors/pressure-sensors-bmp390.html)、[Infineon DPS310 datasheet](https://www.infineon.com/assets/row/public/documents/24/49/infineon-dps310-datasheet-en.pdf)、[ST LPS22DF datasheet](https://www.st.com/resource/en/datasheet/lps22df.pdf)。

氣壓計感知的是**絕對壓力**，高度是由氣壓模型、海平面基準、溫度和時間濾波推導出來；室內空調、電梯壓差、衣物遮擋與防水膜都可能造成偏差。要把「爬樓層」作為功能，應以樓梯／電梯／戶外路線做 HIL 測試，而不是只驗證暫存器能讀到數值。

### 4.3 接觸與非接觸溫度

| 廠商／代表型號 | 類型與能力 | 主機接口／尺寸 | 公開價格粗估 | 選型備註 |
|---|---|---|---:|---|
| ADI MAX30208 | 人體溫度方向的數位溫度 IC；30–50°C 可達 ±0.1°C 規格 | I²C；2.0 × 2.0 × 0.75 mm LGA | `$1.89/1k` 起 | 需要正確熱路徑、貼膚壓力和自熱管理；芯片規格不等於人體測量精度 |
| TI TMP117 | 高精度數位溫度；16 位、低功耗 | I²C／SMBus；小型 BGA／DFN | `$1.5–3` | 適合板溫／環境／接觸溫度；應隔離 MCU、PMIC、LED 熱源 |
| ST STTS22H | 低功耗、出廠校準，帶 ALERT／閾值 | I²C／SMBus；2.0 × 2.0 × 0.50 mm UDFN | `$0.5–2` | 低成本環境／結構溫度；人體溫度主張需另行驗證 |
| Melexis MLX90632 | 遠紅外熱電堆；可做非接觸目標溫度 | I²C；約 3 × 3 × 1 mm QFN | `$4–10`／RFQ | 有 commercial／medical grade 版本；窗口、距離、視場和環境熱輻射影響很大 |

原廠資料： [MAX30208](https://www.analog.com/en/products/MAX30208.html)、[STTS22H](https://www.st.com/en/mems-and-sensors/stts22h.html)、[MLX90632](https://www.melexis.com/en/product/mlx90632/miniature-smd-infrared-thermometer-ic)。

### 4.4 溫濕度、VOC、氣體與顆粒物

| 子類別 | 廠商／代表型號 | 主要能力 | 主機接口／關鍵供電 | 公開價格粗估 | 量產風險 |
|---|---|---|---|---:|---|
| 溫濕度 | Sensirion SHT45 | 約 ±1%RH、±0.1°C；低功耗 | I²C；1.08–3.6 V；DFN | `$2–6` | 需要通風、避免膠水／汗液堵塞；佩戴微環境不是室內環境 |
| 溫濕度／氣壓 | Bosch BME280 | 溫度、濕度、氣壓一體 | I²C／SPI | `$1–4` | 成熟、成本低；要核對長期供貨和精度需求 |
| 氣體／環境 | Bosch BME688／BME690 | 溫度、濕度、氣壓、氣體／IAQ | I²C／SPI；BME690 約 3 × 3 × 0.93 mm | `$5–12` | BSEC／BME AI Studio 等軟體與授權、暖機、污染和分類模型要納入；BME690 當前原廠頁面顯示部分渠道缺貨 |
| VOC／NOx | Sensirion SGP41 | VOC 與 NOx 原始量及指數 | I²C；約 2.44 × 2.44 × 0.85 mm | `$2–6` | 有暖機、濕度補償、氣體交叉敏感性；不應把 VOC Index 當通用 ppm |
| CO₂ | Sensirion SCD41 | 光聲 NDIR，400–5000 ppm 主量程 | I²C；約 10 × 10 × 6.5 mm；電流高於一般 MEMS | `$15–30` | 需要空氣交換和暖機；手錶／戒指通常體積、耗電不合適 |
| PM | Bosch BMV080 | 無風扇雷射／光電，PM1／PM2.5／PM10 | I²C／SPI；感測元件約毫米級，系統電流可達數十 mA | `>$10／RFQ` | 激光、光路、污染、氣流和峰值功耗；更適合胸牌、掛件或環境節點 |
| PM／VOC／RH／T 模組 | Sensirion SEN54／SEN55 | 顆粒物、VOC、溫濕度；SEN55 另含 NOx | I²C；約 52.8 × 43 × 22.3 mm、4.5 V | `>$20／RFQ` | 更像環境節點而非手腕 IC；尺寸和 63 mA 級平均電流要先否決不適用形態 |

原廠資料： [SHT45](https://sensirion.com/products/catalog/SHT45?show_inventory=SHT45-AD1B-R2)、[BME690](https://www.bosch-sensortec.com/en/products/environmental-sensors/gas-sensors/bme690)、[BME688／BME690 軟體](https://www.bosch-sensortec.com/en/software-tools/software/bme688-and-bme690-software)、[SGP41](https://sensirion.com/products/catalog/SGP41?show_inventory=SGP41-D-R4)、[SCD41](https://sensirion.com/products/catalog/SCD41?show_inventory=SCD41-D-R2)、[BMV080](https://www.bosch-sensortec.com/en/products/environmental-sensors/particulate-matter-sensor/bmv080)、[SEN54](https://sensirion.com/products/catalog/SEN54?show_inventory=SEN54-SDN-T)。

**結論：**「環境感測」應拆成兩種產品：低功耗的微環境趨勢（溫濕度／壓力／光）和有氣流、暖機、污染管理的空氣品質節點（VOC／PM／CO₂）。不要把後者直接縮小成手腕健康傳感器。

### 4.5 環境光、UV 與光譜

| 廠商／代表型號 | 主要能力 | 主機接口／尺寸 | 公開價格粗估 | 選型備註 |
|---|---|---|---:|---|
| TI OPT3001 | 人眼響應 ALS；約 0.01–83 klux、23 位有效動態範圍 | I²C；2 × 2 mm USON | `$0.66/1k` 公開錨點 | 自動亮度、日照趨勢的低成本首選之一 |
| Vishay VEML7700 | 16 位 ALS；0–140 klux，低關斷電流 | I²C；6.8 × 2.35 × 3.0 mm | `$1–3` | 側視封裝高度較大；窗口與遮光設計影響結果 |
| ams OSRAM AS7331 | UVA／UVB／UVC 三通道，內置 ADC | I²C 400 kHz；3.65 × 2.60 × 1.09 mm | `$3–10`／RFQ | 原廠頁面列為 pre-production；必須確認可量產狀態、校準和光學窗口 |
| Vishay VEML6075／LTR390 | UVA／UVB 或 UV／ALS 類器件 | I²C | `$1–4` | 依實際波段、響應和供貨選擇；UV 量測需做光譜與窗口校準 |

原廠資料： [OPT3001](https://www.ti.com/product/OPT3001)、[VEML7700](https://www.vishay.com/docs/84286/veml7700.pdf)、[AS7331](https://ams-osram.com/products/sensor-solutions/ambient-light-color-spectral-proximity-sensors/ams-as7331-spectral-uv-sensor)。

### 4.6 PPG、心率與血氧光學前端

| 廠商／代表型號 | 主要能力 | 主機接口／供電 | 公開價格粗估 | 量產必查項 |
|---|---|---|---:|---|
| ADI MAX86141 | PPG AFE；19 位 ADC、3 路 LED 電流 DAC，面向腕、指、耳 | SPI；主電源約 1.8 V，LED 供電約 3.1–5.5 V | `$5.05/1k` 起 | 外部 LED／PD、光學隔離、LED 峰值電流、FIFO、演算法授權 |
| ADI MAXM86161／MAXM86161A | 高整合光學 HR／SpO₂ 模組／AFE | I²C；部分方案可直通原始資料 | `$7–15`／RFQ | 應確認是裸 AFE、含光學元件的 module，還是搭配演算法的方案 |
| TI AFE4950 | PPG + 單導聯 ECG 同步 AFE；最多 8 LED／4 PD | I²C 或 SPI；接收端約 1.7–3.6 V、LED 端可至 5.5 V | `$6–15` | ECG 電極與 PPG 光學共存、同步時序、電源峰值與雜訊 |
| TI AFE49I30 | PPG／ECG 可穿戴 AFE；FIFO、多 LED | I²C；接收端 1.7–3.6 V、LED 端 3–5.5 V | `$5–12` | 需取得完整資料表、GUI、演算法與參考設計條件 |
| Goodix GH3026 | 多通道 PPG；HR／HRV／SpO₂／佩戴檢測方向 | I²C／SPI；WLCSP 約 2.6 × 2.9 × 0.46 mm | `$3–8`／NDA／RFQ | 原廠頁面顯示部分資料與演算法庫需註冊／NDA；不可把型錄能力當產品驗證 |
| ams OSRAM AS7058 | PPG、ECG、BioZ、EDA 整合 AFE；8 PD 輸入、8 LED 輸出 | I²C／SPI；WLCSP 約 2.82 × 2.55 × 0.5 mm | `$5–15`／RFQ | 適合需要多種生理訊號的方案，但電極、光學、演算法和醫療邊界更複雜 |

原廠資料： [MAX86141](https://www.analog.com/en/products/max86141.html)、[MAXM86161](https://www.analog.com/en/products/MAXM86161.html)、[AFE4950](https://www.ti.com/product/AFE4950)、[Goodix GH3026](https://www.goodix.com/en/product/sensors/health_sensors/ppg_afe/gh3026/)、[AS7058](https://ams-osram.com/products/sensor-solutions/analog-frontend/ams-as7058-high-performance-vital-sign-analog-frontend)。

PPG 系統的最低設計清單：

1. LED 波長與光譜、峰值電流、占空比和電源瞬態。
2. 光電二極體面積、數量、串擾、遮光膠圈、窗口材料與厚度。
3. 皮膚接觸壓力、佩戴鬆緊、皮膚色調、毛髮、汗水與運動補償。
4. 板級地平面、LED 回流、模擬電源、數位時鐘和射頻共存。
5. 原始波形保存、演算法版本、資料標註、參考儀器、受試者分層與統計方法。

### 4.7 ECG、BioZ、EDA、呼吸與電化學

| 廠商／代表型號 | 主要能力 | 主機接口／形式 | 公開價格粗估 | 適用範圍與風險 |
|---|---|---|---:|---|
| ADI MAX30001 | 單通道 ECG／生物電位 + BioZ；可做呼吸相關量 | 高速 SPI；WLP | `$8.79/1k` 起 | 電極間距、接觸阻抗、導聯位置和 ESD 決定實際結果；不等同醫療器械 |
| ADI AD5941／AD5940 | BioZ、EDA、複阻抗、低功耗精密 AFE | SPI；含序列器／FIFO／ADC | `$7–15`／RFQ | 需要外部電極、激勵波形、阻抗校準與安全限制 |
| TI ADS1292R | 2 通道 24 位生物電位 AFE，整合呼吸阻抗 | SPI；4 × 4 mm VQFN 或 TQFP | `$6–15` | 適合 ECG／呼吸研究；需要正確右腿驅動、導聯保護和人體測試規範 |
| TI AD8233 | 單導聯 ECG 類比前端 | 類比輸出至 ADC | `$2–6` | 成本較低；主控 ADC、濾波、偏置和保護需自行完成 |
| ams OSRAM AS7058 | 同一 AFE 兼顧 PPG、ECG、BioZ、EDA | I²C／SPI | `$5–15`／RFQ | 便於多模態探索，但集成不會消除電極、光學與演算法難題 |
| TI LMP91000 | 電化學傳感器可配置 potentiostat／TIA | I²C 控制 + 類比 VOUT | `$2–5` | 本身不是汗液、乳酸或葡萄糖傳感器；需要外部化學電極和校準 |
| ADI ADuCM355 | 帶電化學 AFE、potentiostat、ADC、MCU 的系統 | UART／I²C／SPI；6 × 5 mm LGA | `$11.58/1k` 起 | 適合研究型電化學／氣體／生物傳感器；BOM、軟體和方法學負擔較大 |
| TI ADS1299 | 4／6／8 通道 24 位生物電位 AFE | SPI | `>$15`／RFQ | EEG／多通道生物電位研究，不適合在小型首版穿戴中無目的加入 |

原廠資料： [MAX30001](https://www.analog.com/en/products/max30001.html)、[AD5941](https://www.analog.com/en/products/ad5941.html)、[ADS1292R](https://www.ti.com/product/ADS1292R)、[LMP91000](https://www.ti.com/product/LMP91000)、[ADuCM355](https://www.analog.com/en/products/aducm355.html)。

**必須分清三件事：**

- **ECG 是電位波形，不是 PPG 的另一個軟體模式。** 需要兩個或多個電極、接觸、右腿驅動／參考和人體安全設計。
- **BioZ／EDA 是激勵與測量系統。** 外部電極材料、皮膚界面、電流密度、激勵頻率、濾波和溫度補償都會改變結果。
- **汗液／乳酸／葡萄糖等化學量不是「加一顆 AFE」就完成。** 需要化學選擇性電極、微流道、校準、漂移控制和人體研究；產品主張應單獨走合規評估。

### 4.8 接近、ToF、霍爾、觸控與佩戴檢測

| 廠商／代表型號 | 主要能力 | 主機接口 | 公開價格粗估 | 選型備註 |
|---|---|---|---:|---|
| ST VL53L5CX | 8 × 8 多區 ToF，最遠約 4 m、最高 60 Hz | I²C；約 6.4 × 3.0 × 1.5 mm | `$5.67/500` 公開錨點 | 有 VCSEL、SPAD、DOE 和內置 MCU；蓋板串擾、陽光、玻璃和功耗要實測 |
| ST VL53L1X／VL53L4CD | 單區／短距 ToF，佩戴／接近／手勢 | I²C | `$2–6` | 若不需要多區，優先比較成本與功耗 |
| TI DRV5032 | 超低功耗數位霍爾開關；5 Hz 版本 &lt;1 µA | GPIO 開漏／推挽 | `&lt;$1` | 充電座、磁吸、蓋合、佩戴偵測很實用；不是連續 3D 磁場量測 |
| TI FDC2214 | 4 通道、28 位電容數位轉換；可做接近與觸控 | I²C；4 × 4 mm WQFN | `$2–5` | 感測電極是 PCB／金屬結構的一部分；EMI、寄生電容、外殼和濕度需一起設計 |
| ST LSM6DSV16X Qvar | 內置電荷變化通道，可做點按／滑動等 UI | I²C／SPI／I3C | 已列於 IMU 價格 | 這是特定 IMU 的附加功能，不代表所有加速度計都能做 Qvar |
| 電容觸控控制器 | Microchip CAP12xx／Azoteq IQS 系列等 | I²C／SPI／GPIO | `$0.5–3` | 需按電極數量、濕手、手套和外殼厚度選型 |

原廠資料： [VL53L5CX](https://www.st.com/en/imaging-and-photonics-solutions/vl53l5cx.html)、[VL53L5CX 原廠購買頁](https://estore.st.com/en/products/imaging-and-photonics-solutions/time-of-flight-sensors/vl53l5cx.html)、[DRV5032](https://www.ti.com/product/DRV5032)、[FDC2214](https://www.ti.com/product/FDC2214)。

### 4.9 力、應變、壓電與接觸式振動

這一類通常不是「一顆數位 sensor IC」，而是**換能器 + 類比前端 + ADC + 機械結構**：

| 換能器類型 | 常見代表／方案 | 電氣接口 | 公開成本粗估 | 適合功能 | 主要風險 |
|---|---|---|---:|---|---|
| FSR 薄膜電阻 | Interlink／TE Connectivity FSR 400 系列 | 分壓至 ADC | `$1–5`／片 | 按壓、佩戴壓力、鞋墊受力 | 非線性、遲滯、溫漂、批次差；需產品級標定 |
| 壓電薄膜／陶瓷 | TE LDT 系列、客製壓電片 | 高阻抗 ADC／電荷放大器 | `$0.5–5`／片 | 敲擊、機械振動、接觸聲 | 輸出與結構共振相關，靜態力不能直接測 |
| 接觸式麥克風 | 壓電接觸拾音器、接觸式 MEMS／類比麥 | 類比 ADC、Codec | `$1–10`／RFQ | 機身振動、通話另一端補聲、機械異常 | 耦合面、膠材、預壓、風噪和人體佩戴差異 |
| 應變計／柔性應變 | 金屬箔／柔性應變片 + 儀表放大器 | 電橋 AFE、ADC | `$2–15`／RFQ | 彎曲、拉伸、姿態或結構負荷 | 溫度補償、應變集中、黏貼可靠性和防水 |
| 電容式壓力 | PCB 電極／柔性電極 + FDC2214 等 | I²C 控制 + 電極 | `$2–8`／RFQ | 軟結構按壓、佩戴接觸 | 寄生電容與手指／濕度造成的漂移 |

**接觸式 VPU 的正確定位：** 它能提供一條與空氣麥不同的機械振動通道，對手機揚聲器經機身傳來的成分、敲擊或佩戴者自身振動可能有幫助；但是否能分離通話兩端、改善 SNR 或做語音活動判定，取決於整機的機械耦合、頻響、雙麥布置、DSP 和測試資料。不能從「接觸式」三個字推導出語義理解能力。

### 4.10 空氣麥克風、接觸拾音與音訊 Codec

| 廠商／代表型號 | 類型與能力 | 數位／控制接口 | 公開價格粗估 | 生命週期／選型備註 |
|---|---|---|---:|---|
| Infineon IM69D130 | 高性能數位 MEMS 麥；130 dB SPL 級聲壓能力 | PDM；4 × 3 × 1.2 mm | `$1–3` | 適合錄音、通話、VAD；要核對 PDM clock、底／頂部聲孔和防水網 |
| TDK InvenSense ICS-43434 | 數位 MEMS 麥；I²S 輸出，面向 mobile／wearable | I²S；約 3.5 × 2.65 × 0.98 mm | `$1–3` | 原廠頁面顯示 Production（NRND）；新設計需先做替代料與供貨確認 |
| Knowles SPH0645LM4H-B | 數位 MEMS 麥；I²S 底部聲孔 | I²S | `$0.8–2` | 料號、封裝和供貨需以最新原廠／代理資料確認 |
| TI TLV320AIC3204 | 低功耗立體聲 Audio Codec；ADC／DAC、數位／類比麥克風 | 控制 I²C／SPI；音訊 I²S／DSP／TDM | `$2–8` | 適合多路類比／數位音訊；時鐘、PLL、音訊電源與耳機輸出需整體設計 |
| 接觸式振動路徑 | 壓電／接觸麥／加速度計 + AFE | ADC、PDM 或 I²S | `$1–10`／RFQ | 沒有統一「VPU 協議」；先用機械樣件確認頻響，再定 AFE |

原廠資料： [IM69D130](https://www.infineon.com/part/IM69D130?tab=~%27boards_designs)、[ICS-43434](https://product.tdk.com/en/search/sw_piezo/mic/mems-mic/info?part_no=ICS-43434)、[TLV320AIC3204](https://www.ti.com/product/TLV320AIC3204)。TI 資料表明確把 Codec 的控制總線（I²C／SPI）與音訊總線（I²S／DSP／TDM）分開，這是多麥設計中常被忽略的接口層次。

### 4.11 GNSS、NFC、UWB、BLE、Wi‑Fi 與蜂窩

這些嚴格說不是「被動環境傳感器」，但在智能穿戴產品中承擔位置、身份與資料連線，應與傳感器一起做系統選型。

| 類別 | 廠商／代表型號 | 主機接口 | 空中／資料協議 | 公開價格粗估 | 主要風險 |
|---|---|---|---|---:|---|
| GNSS | u-blox MAX-M10S／MAX-M10N | UART、I²C | NMEA／UBX；GPS、Galileo、BeiDou、GLONASS 等依型號 | `$9–15`／RFQ | 天線、LNA／SAW、人體遮擋、冷啟動、星曆、法規與戶外實測 |
| GNSS | Quectel LC29H 等 | UART、I²C／USB（按模組） | NMEA／廠商命令 | `$10–25`／RFQ | 雙頻／高精度版本更依賴天線與服務；不能只比較晶片單價 |
| NFC 讀寫器 | ST ST25R3916／3917 | SPI、I²C | ISO 14443 A/B、ISO 15693、FeliCa、NFC Forum、P2P／卡模擬依型號 | `$2.4–7` | 13.56 MHz 天線、調諧、金屬／電池影響、EMV／NFC 認證 |
| NFC 動態標籤 | ST25DV-I²C、NTAG I²C | I²C + RF | ISO 15693 或 NFC Forum／NDEF（依型號） | `$1–4` | 讀距、能量收集、EEPROM 壽命、手機兼容和 NDEF 交互 |
| UWB | Qorvo DW3110／DW3120 | SPI | IEEE 802.15.4z、FiRa；TWR／TDoA／PDoA 依型號 | `$8–15` | 天線延遲校準、射頻佈局、手機兼容、FiRa／法規認證和功耗 |
| BLE MCU | Nordic nRF52840／nRF54 系列等 | 直接整合 I²C、SPI、UART、PDM／I²S、ADC | Bluetooth LE；應用層常用 GATT | `$3–10`／RFQ | 這是無線主控／協處理器，不是傳感器；需凍結 GATT、OTA、配對和安全模型 |
| Wi‑Fi／BLE 模組 | Espressif ESP32-C3-MINI-1／C6 等 | UART、SPI、SDIO／I²C（依方案） | IEEE 802.11、Bluetooth LE、AT 或自有主機協議 | `$2–6` | 2.4 GHz 共存、天線、峰值電流、韌體供應鏈和認證 |
| 蜂窩／LPWA | Quectel BG95／BG77 等 | UART、USB、GPIO（部分有 I²C） | LTE‑M、NB‑IoT、EGPRS、AT；型號含 GNSS | `$15–40`／RFQ | SIM／eSIM、運營商認證、天線、峰值功耗、資費和地區頻段 |

原廠資料： [MAX-M10 系列](https://www.u-blox.com/en/product/max-m10-series?legacy=Current)、[MAX-M10S 資料表](https://content.u-blox.com/sites/default/files/MAX-M10S_DataSheet_UBX-20035208.pdf)、[ST25R NFC 讀寫器](https://www.st.com/en/nfc/st25-nfc-readers.html)、[Qorvo DW3110](https://www.qorvo.com/products/p/DW3110)、[nRF52840 規格](https://docs.nordicsemi.com/r/bundle/ps_nrf52840/page/keyfeatures_html5.html)、[ESP32-C3-MINI-1 資料表](https://documentation.espressif.com/esp32-c3-mini-1_datasheet_en.html)、[Quectel BG95](https://www.quectel.com/product/lpwa-bg95-cat-m1-cat-nb2-egprs-series/)。

### 4.12 供電、電量、安全與觸覺協同器件

它們不是人體／環境傳感器，但會直接決定感測結果能否穩定取得，因此列入同一份選型手冊。

| 類別 | 廠商／代表型號 | 主要能力 | 接口 | 公開價格粗估 | 選型備註 |
|---|---|---|---|---:|---|
| 電量計 | TI BQ27441-G1 | 單節 Li‑Ion／Li‑Poly，SOC／容量／老化估計 | I²C／HDQ | `$1–3` | 系統側電量計；需做 battery profile、學習週期和低電量負載測試 |
| 充電／電源路徑 | TI BQ25155 | 單節線性充電、power path、ADC、LDO、按鍵控制 | I²C | `$2–5` | 穿戴與小型醫療／便攜器件常見；熱、充電安全和電池 NTC 要驗證 |
| 安全元件 | Microchip ATECC608C | ECC、ECDH／ECDSA、SHA、AES、金鑰／憑證保護 | I²C／SWI | `$0.8–3`／RFQ | 新設計應優先評估 C 版；原廠已將 ATECC608B 標為 Not Recommended for new designs |
| 安全元件 | Infineon OPTIGA Trust M | CC EAL6+、ECC／RSA／AES、受保護 I²C、憑證配置 | I²C | `$1.5–5`／RFQ | 適合雲端身份、設備證書、受保護更新；配置與 provisioning 是製造流程的一部分 |
| 安全元件 | NXP EdgeLock SE050 | EAL6+／FIPS 方案、TLS、裝置認證、資料保護 | I²C | `$2–8`／RFQ | 需要評估 applet、認證版本、主控軟體和供應鏈 provisioning |
| 震動驅動 | TI DRV2605L + LRA／ERM | 觸覺效果庫、Smart Loop | I²C／PWM／類比 | `$1.5–3` + 馬達 | 馬達、結構、共振頻率、噪聲和電流峰值要整體驗證 |
| 顯示／指示 | OLED／LCD／LED 驅動器 | 顯示狀態、錄音／隱私指示 | I²C／SPI／RGB／GPIO | `$1–15+` | 顯示不是傳感器；要將刷新電流、EMI、可視角和防水窗口納入電源預算 |

原廠資料： [BQ27441-G1](https://www.ti.com/product/BQ27441-G1)、[BQ25155](https://www.ti.com/product/BQ25155/part-details/BQ25155YFPR)、[ATECC608C](https://www.microchip.com/en-us/product/atecc608c)、[OPTIGA Trust M](https://www.infineon.com/part/OPTIGA-TRUST-M-EXPRESS)、[SE050](https://www.nxp.com/pages/edgelock-se050-plug-and-trust-secure-element-family-enhanced-iot-security-with-high-flexibility%3ASE050)、[DRV2605L](https://www.ti.com/product/DRV2605L)。

### 4.13 影像、熱成像、毫米波雷達與顏色／光譜

這一組器件容易被「一般穿戴 sensor 清單」漏掉，但在智能眼鏡、耳掛、胸牌、戶外安全穿戴和視覺交互產品中可能是核心。它們對鏡頭／視窗、ISP／DSP、散熱、資料儲存和隱私的要求，通常比一顆 I²C sensor 更高。

| 子類別 | 廠商／代表型號 | 主要能力 | 主機接口／資料協議 | 公開價格粗估 | 適用範圍與風險 |
|---|---|---|---|---:|---|
| ToF／近紅外影像 | Sony IMX611／IMX518／IMX316 | 近紅外／ToF 影像與深度感知方向 | MIPI CSI-2／D-PHY；配置接口依型號 | `>$5–30／模組 RFQ` | 視覺／深度方案常需發射器、光學、ISP 和校準；不一定適合手環或卡片 |
| CMOS 影像 | Sony IMX775／IMX908 等 | RGB 或 RGB-IR 影像；可做視覺交互／環境識別 | MIPI CSI-2／D-PHY；控制接口依型號 | `>$10–30／RFQ` | 多數影像 sensor 面積、功耗、鏡頭和主控吞吐都偏高；需獨立做隱私指示、權限與加密儲存 |
| 熱成像陣列 | Melexis MLX90640 | 32 × 24 遠紅外像素陣列，輸出熱分佈 | I²C 數位接口 | `>$30／RFQ` | 它是熱像陣列，不是接觸式皮膚溫度 IC；視場、距離、窗口、背景輻射和熱校準決定結果，成本通常不適合普通手環 |
| 60 GHz FMCW 雷達 | Infineon XENSIV BGT60TR13C | 距離、速度、角度、存在／微動感知；可供本地 DSP 做呼吸／姿態研究 | SPI；FMCW sweep、FIFO／原始或目標資料 | `$5–15／RFQ` | 天線／AiP、射頻匹配、FFT／跟蹤演算法、人體遮擋、法規與峰值功耗要一起驗證；不能直接宣稱跌倒救援或醫療呼吸率 |
| 多通道顏色／光譜 | ams OSRAM AS7341 | 8 個可見光通道 + Clear／Flicker／NIR，11 通道光譜方向 | I²C slave，最高 400 kHz | `$3–8／RFQ` | 可做色彩／光源／顯示／皮膚色調研究；需暗電流、光學窗口和波段校準，不應把 count 當生理量 |

原廠資料： [Sony 影像產品](https://www.sony-semicon.com/en/products/is/camera/index.html)、[Sony sensing image sensors](https://www.sony-semicon.com/en/products/is/mobile/sensing.html)、[Sony IMX908](https://www.sony-semicon.com/en/products/is/security/security/IMX908.html)、[Melexis MLX90640](https://www.melexis.com/en/product/mlx90640/far-infrared-thermal-sensor-array)、[Infineon BGT60TR13C](https://www.infineon.com/cms/de/product/sensor/radar-sensors/radar-sensors-for-iot/60ghz-radar/bgt60tr13c/?redirId=159471)、[ams OSRAM AS7341](https://ams-osram.com/products/sensor-solutions/ambient-light-color-spectral-proximity-sensors/ams-as7341-11-channel-spectral-color-sensor)。

### 4.14 肌電、腦電、汗液電化學與推導型生理量

EMG、EEG、EOG 是**信號模態**，不是一定對應某一顆專用 IC。工程上通常由電極、保護／偏置、低噪聲生物電位 AFE、ADC、同步時鐘和演算法共同實現；同一顆 AFE 可因電極位置、帶寬、增益和安全設計而承擔不同用途。

| 子類別 | 廠商／代表型號／外部元件 | 主要能力 | 主機接口 | 公開價格粗估 | 選型與合規邊界 |
|---|---|---|---|---:|---|
| EMG／多通道生物電位 | TI ADS1292R、AD8233；電極／導線另算 | 肌電、ECG 或低頻生物電位研究；ADS1292R 另含呼吸阻抗路徑 | ADS1292R：SPI；AD8233：類比輸出 | `$2–15／RFQ` + 電極 | 需按肌肉位置、電極間距、帶寬、運動偽影和人體安全設計；不是「貼上就能識別動作」 |
| EEG／多通道腦電 | TI ADS1299／ADS1299-4／-6／-8 | 4／6／8 通道低噪聲 24 位生物電位 AFE，面向 EEG／睡眠研究 | SPI | `>$15／RFQ` | 電極帽／耳電極、參考與接地、屏蔽和資料率是系統瓶頸；通常不是普通手環首版能力 |
| EOG／眼動 | ADS1299、ADS1292R 等通用生物電位 AFE + 眼周電極 | 眼球轉動、眨眼／睡眠研究 | SPI／類比 ADC | `$2–20／RFQ` + 電極 | 電極位置、皮膚接觸、眨眼偽影和個體差需做資料集；不能由 IMU 代替 |
| 汗液／電化學 AFE | ADI AD5940／AD5941、TI LMP91000／ADuCM355 + 屏印電極／微流道 | 安培、伏安、阻抗量測；可研究 pH、離子、乳酸等 | AD5941：SPI；LMP91000：I²C 控制 + 類比；ADuCM355：UART／I²C／SPI | `$2–12／AFE` + 電極／微流道 RFQ | AFE 不等於分析物 sensor；選擇性、抗污染、汗液流量、漂移、校準與人體研究都不能省略；不要把它寫成無創血糖能力 |
| 呼吸率 | BioZ／ECG／PPG／IMU／麥克風／毫米波雷達等多源輸入 | 呼吸頻率、呼吸節律、睡眠習慣趨勢 | 取決於原始鏈：SPI、I²C、PDM 等 | `演算法／系統 RFQ` | 通常是推導量，不是單顆 sensor 直接讀出；姿態、運動、衣物、咳嗽和佩戴位置要分層驗證 |
| 血壓 | PPG + ECG 的 PTT／PAT、PPG 形態或袖帶壓力鏈 | 研究型無袖帶估計，或袖帶式測量 | PPG／ECG AFE：I²C／SPI；壓力 sensor：I²C／SPI／類比 | `>$5–30／系統 RFQ` | 無袖帶血壓是模型與個體校準問題；不能把 PPG／ECG IC 的存在寫成血壓準確度或醫療能力 |
| 體脂／水合／身體組成 | BioZ／BIA AFE + 多電極 | 阻抗與模型趨勢 | SPI／I²C 控制／類比 | `$5–20／RFQ` + 電極 | 頻率、電極幾何、接觸、身高／體重先驗和族群模型都影響結果；不是阻抗一次讀值就是真實體脂 |

原廠資料： [TI ADS1299](https://www.ti.com/product/ADS1299)、[TI ADS1292R](https://www.ti.com/product/ADS1292R)、[ADI AD5941](https://www.analog.com/en/products/ad5941.html)、[TI LMP91000](https://www.ti.com/product/LMP91000)。

**推導量的資料鏈要單獨建模：** 原始波形、同步時間戳、電極／光學／機械條件、演算法版本、個體校準、參考儀器和誤差統計，至少要比「讀到一個數字」多一層證據。血壓、呼吸率、睡眠分期、體脂、水合、壓力等都應在需求文件中標為 derived metric，而不是把它們當成 sensor SKU。

### 4.15 直接壓力與系統電流／電壓監測

直接壓力與電源監測在清單中常被混入「氣壓」或「電量」，但對袖帶、氣囊、堵塞檢測、電池安全和感測器峰值負載很重要。

| 子類別 | 廠商／代表型號 | 主要能力 | 主機接口 | 公開價格粗估 | 選型備註 |
|---|---|---|---|---:|---|
| 差壓／氣囊壓力 | Honeywell TruStability HSC；TE Connectivity／MEAS MS4525DO | 差壓／絕對壓力，適合氣囊、流體和堵塞檢測 | HSC：類比或 I²C／SPI；MS4525DO：I²C／SPI | `$5–30／RFQ` | 封裝、壓力範圍、介質相容、接管、泵／閥和校準成本通常遠高於普通 MEMS 氣壓計 |
| 電流／匯流排電壓／功率 | TI INA219 | 分流電阻上的電流、匯流排電壓和功率 | I²C／SMBus | `$1–3` | 適合原型與電源路徑觀測；分流電阻、壓降和共模範圍要按電池／負載核算 |
| 高精度電流／功率／能量 | TI INA228／INA238 | 電流、匯流排電壓、功率；INA228 另支援能量／電荷累積，INA238 為 16 位版本 | I²C；SPI 版本需按同系列料號另確認 | `$2–8／RFQ` | 適合建立 PPG LED、雷達、蜂窩、馬達等峰值電流證據；不是電量計替代品 |
| 電池電量與狀態 | TI BQ27441-G1、ADI MAX17048 | SOC、剩餘容量、電池電壓／老化估計 | I²C；BQ27441 另有 HDQ | `$1–4` | 需要電池化學、容量、負載、學習週期和溫度模型；SOC 不是直接量到的剩餘百分比 |

原廠資料： [Honeywell HSC](https://automation.honeywell.com/us/en/products/sensing-solutions/sensors/pressure-sensors/board-mount-pressure-amplified/trustability-hsc-series-board-mount-pressure-sensor)、[TE MS4525DO](https://www.te.com/en/product-20003581-00.html)、[TI INA219](https://www.ti.com/product/INA219/part-details/INA219AIDCNR)、[TI INA228／INA238](https://www.ti.com/product/INA238)、[TI BQ27441-G1](https://www.ti.com/product/BQ27441-G1)。

## 5. 各形態的推薦組合

### 5.1 卡片／夾式／胸牌

**推薦首版：**

- 低功耗 6 軸 IMU 或加速度計：計步、翻轉、敲擊、活動事件。
- 數位 PDM 麥克風 + 可選接觸式振動通道：空氣聲與機械聲分路記錄。
- 霍爾：夾具、充電座、蓋合或佩戴狀態。
- 溫度／濕度／環境光：做微環境和使用狀態，不做醫療宣稱。
- 電量計、充電 PMIC、安全元件、震動與物理錄音指示。

**不建議首版直接加入：** PPG／ECG（沒有穩定貼膚界面）、PM／CO₂（體積、氣流、暖機、功耗）、GNSS／蜂窩（天線與峰值功耗會改變整機形態）。

### 5.2 手環／手錶

**推薦順序：** IMU → PPG／皮膚溫度 → 氣壓／環境光 → 電極型 ECG／EDA／BioZ → GNSS／NFC／UWB。

PPG 光學窗口和電極要從 ID／MD 階段一起設計；把傳感器放在柔性排線上並不會自動解決皮膚壓力、遮光和自熱。GNSS、UWB、NFC 也不能共用同一套天線假設，需要獨立的 RF 佈局、匹配和認證計畫。

### 5.3 戒指／貼片

優先低功耗、短距離、貼膚穩定的 PPG、皮膚溫度、EDA／ECG、IMU；把電池、充電、封裝、生物相容性、汗水腐蝕和電極壽命放在選型前面。對戒指而言，多顆高電流 LED、UWB、PM 和蜂窩通常比 IC 尺寸更先成為瓶頸。

### 5.4 耳掛／耳機

空氣麥克風、接觸振動、IMU、磁力計和耳內溫度是最自然的組合。耳內 PPG 有穩定貼合優勢，但需要專用光學窗口、耳道位置、衛生和個體差驗證。接觸式振動可以做通話／VAD 輔助通道，但必須拿真實外殼、手機接觸面和不同佩戴姿態建立資料集。

## 6. 系統級設計風險

### 6.1 光學風險

- PPG 的有效訊號通常比環境光、運動干擾和 LED 直漏光小很多。
- 黑色遮光膠圈、窗口透過率、LED／PD 幾何、皮膚壓力和手腕曲率必須同時最佳化。
- LED 峰值電流會影響 PMIC、地彈、射頻和音訊底噪；要用示波器看真正的電源波形。
- 應保存 raw PPG，否則後續很難定位是光學、AFE、演算法還是傳輸丟包。

### 6.2 電極與人體電氣風險

- ECG／EDA／BioZ 的電極材料、面積、間距、接觸壓力、汗水和皮膚阻抗決定訊號品質。
- 電極附近要做 ESD、漏電、充電狀態、人體接觸與故障電流評估。
- 「單導聯」只是導聯數量，不代表臨床診斷能力；使用者姿勢、接觸位置與參考電極都要寫入驗收條件。

### 6.3 溫度與氣壓風險

- 溫度 IC 遠離 MCU、PMIC、LED、充電線圈和射頻功率器件；必要時做熱隔離槽或柔性延伸。
- 非接觸紅外溫度需要固定距離、視場、窗口和背景補償；人體表面溫度不是核心體溫。
- 氣壓計需要通氣孔和防水／防汗膜；膠水、泡棉、灰塵和服裝壓力會造成慢性偏差。

### 6.4 氣體、PM、CO₂ 風險

- 金屬氧化物 VOC 方案常需要暖機和演算法；溫濕度、酒精、香水、清潔劑會造成交叉響應。
- PM 需要光路和空氣流動，雷射、光電二極體和污染管理會帶來機構與功耗成本。
- CO₂ 需要空氣交換；把感測孔貼在皮膚或衣物附近，讀到的可能是局部呼氣而不是環境值。
- 供應商提供的「Index」或「分類」不能不經校準直接改寫成 ppm 或健康指標。

### 6.5 IMU、磁場與機械風險

- PCB 應力、焊接、外殼鎖螺絲、膠材和柔性板彎折會改變 IMU 偏置。
- 磁力計要做硬鐵／軟鐵校準，並在最終馬達、喇叭、磁吸、NFC 線圈和電池配置下重做。
- 「晶片內建步數／姿態」是演算法功能，不是完整產品驗證；不同佩戴位置要分開評估。

### 6.6 聲學與接觸振動風險

- 空氣麥克風看的是聲壓；接觸式路徑看的是機械耦合，兩者的頻響、延遲和噪聲模型不同。
- 需要評估風噪、防水網、外殼聲孔、手指遮擋、衣物摩擦、敲擊和手機接觸面。
- 多麥陣列的「雙通道」不等於「雙聲道獨立內容」；真正的分離能力還需要陣列幾何、時鐘同步、回聲消除、波束形成或 source separation。

### 6.7 射頻與功耗風險

- 人體、腕帶、金屬裝飾、電池和顯示窗口會讓天線失諧；天線驗證需在最終外殼和佩戴狀態下完成。
- PPG LED、UWB、GNSS、蜂窩、Wi‑Fi、振動馬達和 PM 雷射的峰值電流可能互相干擾。
- 量產前要有「傳感器 duty cycle → 峰值電流 → 電池壓降 → RF／音訊底噪」的完整電源模型。

### 6.8 供貨、生命週期與軟體依賴

- Active、volume production、NRND、pre-production、out of stock 必須在 BOM 中分欄記錄。
- 原廠演算法、BSEC、PPG／SpO₂ library、NFC stack、UWB stack 可能有 NDA、授權或版本綁定。
- 把一顆器件換成同接口的替代料，通常仍會改變量程、FIFO、IRQ 極性、上電時序、校準和演算法輸入；不可只按封裝或 I²C 位址替換。

### 6.9 影像、熱成像、雷達與光譜風險

- CMOS／ToF 影像需要鏡頭、濾光片、對焦／固定、MIPI CSI-2 接收、ISP／DSP、儲存頻寬和熱設計；影像資料還需要實體隱私指示、權限、加密與刪除策略。
- 熱成像陣列的像素是遠紅外輻射響應，和貼膚溫度 IC、紅外熱電堆單點溫度不是同一類證據；視場、距離、背景和窗口材料必須一起校準。
- 毫米波雷達輸出的通常是 IQ／range-Doppler／目標特徵，呼吸、存在或跌倒類功能是本地 DSP／演算法與資料集的結果；天線、射頻法規、人體遮擋和功耗要做整機驗證。
- 顏色／光譜 sensor 需要暗電流、光源、窗口、角度和溫度校準；通道 count 不能直接改寫成皮膚健康、血液或環境劑量。

### 6.10 生物電位、化學與推導量風險

- EMG／EEG／EOG 的微弱訊號容易被運動、工頻、射頻、充電器和電極脫落污染；必須保存同步 raw data、導聯狀態和接觸阻抗。
- 汗液電化學量測的瓶頸通常在外部電極、微流道、分析物選擇性、汗液流量、污染與漂移，不在 AFE 的 ADC 位數；應將每一種分析物分開做方法學與人體驗證。
- 呼吸率、血壓、睡眠、體脂和水合等 derived metric 要同時驗證訊號鏈、演算法、參考儀器、族群、個體校準和失效輸出，不能只驗證 API 回傳非空。
- 直接袖帶壓力 sensor 仍需要泵、閥、袖帶／氣囊、洩壓與安全設計；它和「無袖帶血壓估計」是兩條不同的產品路徑。

## 7. 健康、醫療與隱私邊界

### 7.1 Wellness 與醫療不是同一個級別

可以先把產品輸出定義為「活動、睡眠習慣、心率趨勢、皮膚溫度趨勢、環境暴露」等一般健康資訊；若輸出涉及疾病診斷、急救、治療決策、醫療告警或醫療級數值，就需要重新評估 intended use、臨床證據、風險管理、品質系統和地區法規。

FDA 2026 年的 General Wellness 指引針對低風險、促進健康生活方式且不涉及疾病診斷／治療的產品提供政策說明，仍不代表任何特定傳感器或演算法自動獲得醫療資格，請參考 [FDA General Wellness: Policy for Low Risk Devices](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/general-wellness-policy-low-risk-devices)。

### 7.2 不把無創血糖列為普通穿戴功能

FDA 已明確警告：不要使用宣稱可在不刺破皮膚的情況下測量血糖的智能手錶或智能戒指；FDA 表示並未授權、批准或核准任何可自行測量或估算血糖的智能手錶／戒指。參考 [FDA Safety Communication](https://www.fda.gov/medical-devices/safety-communications/do-not-use-smartwatches-or-smart-rings-measure-blood-glucose-levels-fda-safety-communication)。

### 7.3 隱私要求

- 原始音訊、PPG、ECG、EDA、位置、設備身份和生物特徵應分級存取。
- 應明確區分「本地暫存」「同步傳輸」「雲端處理」「模型訓練」和「使用者刪除」。
- 錄音／生理資料的指示燈、實體按鍵、配對確認、加密、權限和審計記錄應在產品需求階段凍結。
- 安全元件解決的是金鑰與身份保護，不會自動解決錄音合法性、使用者同意或醫療合規。

## 8. 建議的通用開發階段與 BOM 閘門

### P0：基礎互動與可靠資料

**建議器件池：** BMI270／BMI323／LSM6DSV16X 三選一；DRV5032；IM69D130；MAX30208 或 TMP117；BQ27441；BQ25155；ATECC608C／OPTIGA Trust M；LRA + DRV2605L；必要時 OPT3001。

**通過條件：**

- 低功耗待機、喚醒、計步／敲擊、錄音、音訊資料完整性、電量估計和充電溫升可重複。
- 任何原始音訊／感測資料都有時間戳、丟包／校驗和明確的資料刪除策略。
- 供應商可提供正式料號、封裝、PCN／EOL 路徑和 1k／10k RFQ。

### P1：環境與近場互動

**建議器件池：** BMP390／BMP580／LPS22DF；SHT45；VEML7700；ST25DV-I²C 或 ST25R3916；必要時 VL53L1X／VL53L5CX。

**通過條件：**

- 通氣孔、防水膜、窗口、磁吸和外殼裝配完成後，氣壓、溫濕度、ALS、NFC／ToF 仍達到產品需求。
- I²C 位址、I3C／I²C 共存、SPI CS、IRQ、上拉與睡眠喚醒圖已凍結。

### P2：Wellness 趨勢

**建議器件池：** MAX86141／MAXM86161／AFE49I30／GH3026／AS7058；MAX30208／TMP117；若確有電極形態，再評估 MAX30001、ADS1292R、AD5941。

**通過條件：**

- 光學堆疊／電極／機構樣件先於軟體演算法凍結。
- 在不同膚色、佩戴鬆緊、運動強度、環境溫度和充電狀態下取得 raw data。
- 明確把「晶片規格」「工程樣機指標」「人體研究」「醫療宣稱」分成四份證據，不能混寫。

### P3：戶外與連接擴展

**建議器件池：** MAX-M10N／MAX-M10S；DW3110／DW3120；NFC；BLE／Wi‑Fi 協處理器；BG95 等蜂窩模組。

**通過條件：**

- 最終外殼、佩戴狀態、天線、匹配、共存、電池峰值和認證方案完成。
- GNSS 冷／暖／熱啟動、UWB 兩端兼容、NFC 讀距、BLE／Wi‑Fi 共存和 OTA／安全更新都有測試記錄。

## 9. 驗證與驗收矩陣

| 領域 | 最小驗證 | 需要保存的證據 | 常見誤判 |
|---|---|---|---|
| 器件識別 | 上電、Chip ID、reset、版本、位址掃描 | 原理圖、波形、寄存器 dump、driver 版本 | 能讀 ID 就當成已支援整個功能 |
| I²C／I3C／SPI | 不同電壓、最高速、總線負載、睡眠／喚醒、異常復位 | 邏輯分析儀、示波器、錯誤計數、24 h soak | 只在空載開發板上測一次 |
| IMU | 靜止偏置、六面、旋轉、敲擊、步行、佩戴位置 | 校準參數、原始資料、事件混淆矩陣 | 以資料手冊步數功能等同產品步數精度 |
| 磁力計 | 無磁／有磁、馬達／喇叭／NFC／磁吸座 | 硬鐵／軟鐵校準、失真圖、恢復時間 | 在開發板校準後直接搬到整機 |
| 氣壓 | 氣密／通氣、樓梯、電梯、室外基準 | 壓力、溫度、相對高度、濾波延遲 | 直接把 hPa 轉成絕對海拔 |
| PPG | 靜止、走路、跑步、不同膚色／鬆緊／溫度 | raw PPG、LED 電流、參考儀器、統計分層 | 只在一位測試者靜止時看心率 |
| ECG／EDA／BioZ | 導聯接觸、導線脫落、工頻、充電、ESD | 電極阻抗、SNR、漂移、保護和故障狀態 | 把 24 位 ADC 寫成醫療級 |
| 溫度 | 熱源距離、穩態／瞬態、充電／LED／人體接觸 | 校準曲線、熱像、響應時間、自熱 | 讀到高解析度就代表人體溫度準確 |
| 氣體／PM／CO₂ | 暖機、濕度、污染、氣流、基準儀器 | 原始值、環境條件、漂移、換氣時間 | 把 VOC Index 或 PM 演算法輸出當標準 ppm |
| ALS／UV | 黑／白窗口、不同光源、角度和溫度 | 光譜響應、窗口透過率、校準係數 | 用 ALS lux 推導 UV 劑量 |
| 顏色／光譜 | 標準光源、暗室、窗口、角度、溫度、閃爍源 | 各通道 raw count、校準矩陣、波段響應、漂移 | 把 11 通道數值直接當膚色／健康指標 |
| 影像／ToF／熱成像 | 鏡頭／視場、距離、遮擋、光照／熱源、不同背景 | raw frame、深度／熱像誤差、ISP 版本、隱私事件 | 只看預覽畫面，不驗證曝光、熱漂移、資料刪除 |
| 毫米波雷達 | 靜止／運動／多人、距離、遮擋、呼吸微動、溫度 | IQ／range-Doppler、天線校準、目標跟蹤、誤報／漏報 | 把雷達存在檢測寫成醫療呼吸或跌倒救援 |
| EMG／EEG／EOG | 電極位置、導聯、動作、工頻、充電／ESD、脫落 | raw waveform、SNR、接觸阻抗、頻帶、事件標註 | 讀到 24 位 ADC 就等於腦電／肌電可用 |
| 汗液／電化學 | 空白、標準液、汗液流量、溫度、交叉干擾、長期漂移 | 校準曲線、選擇性、LOD、回收率、電極批次 | 把 AFE 的 potentiostat 宣稱成特定分析物 sensor |
| 呼吸／血壓／睡眠／體脂 | 參考儀器、族群、姿態、活動、個體校準與失效狀態 | 原始訊號、模型版本、置信度、偏差／Limits of Agreement | 把 derived metric 當單顆 IC 的直接量測 |
| 電流／電壓／功率 | 低／高負載、脈衝、分流電阻、電池電壓與熱 | 電流波形、峰值、壓降、SOC 誤差、負載事件 | 只看平均電流，漏掉 LED／雷達／蜂窩／馬達峰值 |
| ToF／接近 | 黑白目標、玻璃、陽光、不同距離和角度 | 距離誤差、串擾、功耗、IRQ 延遲 | 只測白色牆面 |
| 音訊／VPU | 靜音、風噪、摩擦、敲擊、手機接觸、不同外殼 | 多通道同步 raw PCM、頻響、SNR、延遲 | 將 VPU 直接等同語義識別／對端語音分離 |
| GNSS／UWB／NFC | 最終外殼與人體狀態、不同手機／anchor／標籤 | 位置／距離誤差、啟動時間、封包、射頻報告 | 只在空曠桌面測試 |
| 功耗 | 各模式、峰值、喚醒、充電、低電量 | 電流波形、電池壓降、熱、續航模型 | 只看資料手冊平均電流 |
| 供應鏈 | 多家代理、PCN／EOL、替代料、RFQ | 料號、封裝、批次、交期、價格有效期 | 把分銷庫存當長期供貨承諾 |
| 隱私／安全 | 金鑰、配對、錄音指示、資料刪除、OTA 回滾 | 威脅模型、權限、審計、測試報告 | 只加安全元件就認為資料全安全 |

## 10. RFQ 與供應商問卷

每一顆列入 AVL 前，至少向原廠／代理商索取：

1. 完整 orderable part number、封裝、溫度等級、MSL、RoHS／REACH。
2. Active／NRND／EOL 狀態、PCN／PDN 通知週期、最後一次資料表版本。
3. 1k／10k／50k 價格、MOQ、交期、產地、替代料和安全庫存建議。
4. 評估板、driver、SDK、演算法庫、授權條款、NDA、版本相容性。
5. 上電／reset／休眠／中斷時序、I²C 位址、SPI mode、I3C 相容性。
6. 峰值電流、平均電流、LED／雷射／加熱器／暖機條件和電源噪聲要求。
7. 對光學件、電極、天線、氣流、窗口、膠材、校準和機械尺寸的依賴。
8. 是否有客戶可公開的 reference design、量產測試方法和失效分析邊界。
9. 對健康／醫療相關器件，不只問「是否 medical grade」，還要問適用的 intended use、認證範圍和可引用證據。

## 11. 結論

對多數智能穿戴，最穩妥的工程順序不是一次集成全部功能，而是：

1. 先用 IMU、麥克風、霍爾、溫度、電量、震動和安全元件建立可靠底座。
2. 再加入氣壓、溫濕度、環境光、NFC／ToF 等對機構要求可控的環境／互動器件。
3. 只有在佩戴形態、光學窗口、電極和資料採集方法確定後，才加入 PPG、ECG、EDA／BioZ。
4. GNSS、UWB、Wi‑Fi、蜂窩、PM、CO₂ 和電化學傳感器應以獨立系統工程評審，不要按「多一顆 IC」估算。
5. 所有健康輸出先按 wellness 趨勢定義；任何診斷、急救、疾病預警或醫療級主張，都必須另建法規、臨床和風險管理路徑。

這份器件池可作為下一輪原理圖、板級 Adapter、機構樣件、BOM 成本上限和供應商 RFQ 的共同入口；正式定案前，仍需對目標地區、最終外殼、真實電池、天線、人體樣本、演算法授權和量產測試重新核驗。

### 11.1 完整性邊界與後續維護

經本輪補查後，本文已按智能穿戴的主要物理量／產品模態補齊：運動與方向、壓力與高度、接觸／非接觸溫度、溫濕度、VOC／NOx／CO₂／PM、環境光／UV／顏色／光譜、PPG、ECG、BioZ／BIA、EDA、EMG、EEG、EOG、汗液電化學、影像／ToF、熱成像、毫米波雷達、力／應變／壓電、空氣／接觸音訊、GNSS、NFC、UWB、BLE／Wi‑Fi／蜂窩，以及電量／電流／電壓／安全／觸覺協同器件。這個層級可以稱為**類別完整、選型可落地**。

仍然不能把它描述成「全球所有型號全部列完」：供應商的新料號、區域封裝、模組、客製化汗液／醫療探頭、超聲／超音波成像、電離輻射等少量或研究型模態會持續變化；它們應作為獨立的 emerging／medical／industrial 清單按產品形態追加。價格、庫存、生命周期、NDA、演算法授權和法規狀態也不是一次寫入後永久有效，應由 AVL／RFQ 表持續維護。

因此，本版可以作為博客的完整調研基線發布；若要形成可下單的 BOM，下一步仍必須把目標形態、量產數量、地區法規、封裝、實際供貨和第三方驗證結果再篩選一次。

## 附錄 A：主要公開資料入口

- [MIPI I3C／I3C Basic](https://www.mipi.org/specifications/i3c-sensor-specification)
- [NXP I²C-bus specification UM10204](https://www.nxp.com/docs/en/user-guide/UM10204.pdf)
- [Bluetooth Core Specification — GATT](https://www.bluetooth.com/wp-content/uploads/Files/Specification/HTML/Core-61/out/en/host/generic-attribute-profile--gatt-.html)
- [Bosch Sensortec Wearables](https://www.bosch-sensortec.com/en/applications-solutions/wearables)
- [ST MEMS and sensors](https://www.st.com/en/mems-and-sensors.html)
- [Analog Devices wearable／vital signs products](https://www.analog.com/en/solutions/healthcare/vital-signs-measurements.html)
- [Texas Instruments sensors](https://www.ti.com/sensors)
- [Sensirion environmental sensors](https://sensirion.com/products)
- [ams OSRAM wearable vital sign monitoring](https://ams-osram.com/applications/mobile-wearables/vital-sign-monitoring)
- [Sony Semiconductor image sensors](https://www.sony-semicon.com/en/products/is/camera/index.html)
- [Melexis MLX90640 far-infrared array](https://www.melexis.com/en/product/mlx90640/far-infrared-thermal-sensor-array)
- [Infineon XENSIV BGT60TR13C radar](https://www.infineon.com/cms/de/product/sensor/radar-sensors/radar-sensors-for-iot/60ghz-radar/bgt60tr13c/?redirId=159471)
- [ams OSRAM AS7341 spectral sensor](https://ams-osram.com/products/sensor-solutions/ambient-light-color-spectral-proximity-sensors/ams-as7341-11-channel-spectral-color-sensor)
- [Honeywell TruStability HSC pressure sensors](https://automation.honeywell.com/us/en/products/sensing-solutions/sensors/pressure-sensors/board-mount-pressure-amplified/trustability-hsc-series-board-mount-pressure-sensor)
- [TI INA219 current／power monitor](https://www.ti.com/product/INA219/part-details/INA219AIDCNR)
- [TI INA238 current／voltage／power monitor](https://www.ti.com/product/INA238)
- [Microchip ATECC608C](https://www.microchip.com/en-us/product/atecc608c)
- [FDA General Wellness policy](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/general-wellness-policy-low-risk-devices)
- [FDA smartwatches／rings blood glucose safety communication](https://www.fda.gov/medical-devices/safety-communications/do-not-use-smartwatches-or-smart-rings-measure-blood-glucose-levels-fda-safety-communication)

> **資料狀態聲明：** 價格、庫存、生命週期、資料表版本和授權條款都會變動。下單、打樣、投板或對外發布前，應重新打開原廠頁面和最新 datasheet 核對，並取得書面 RFQ。

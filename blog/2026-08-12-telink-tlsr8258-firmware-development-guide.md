---
slug: telink-tlsr8258-firmware-development-guide
title: "泰凌微 TLSR8258 開發實戰：從 SWS 燒錄到韌體驗證"
description: "以 TLSR8258F512ET48 為例，整理 Telink 工具鏈、SWS 接線、編譯產物、BDT 燒錄、指令級除錯與可追溯的韌體驗證流程。"
authors: [w0x7ce]
tags: [Telink, TLSR8258, BLE, 嵌入式系統, 技術深度]
date: 2026-08-12
image: /img/blog/telink-tlsr8258/tlsr8258-development-social.png
keywords: [Telink, 泰凌微, TLSR8258, TLSR8258F512ET48, B85, SWS, SWIRE, BLE, BDT]
---

![泰凌微 TLSR8258 開發實戰封面](/img/blog/telink-tlsr8258/tlsr8258-development-cover.svg)

泰凌微 TLSR8258 的開發難點，通常不在 C 語言本身，而在於要同時理解 **PC 工具、Burning EVK、USB 驅動、SWS 單線介面、建置產物與韌體啟動狀態**。只要其中兩層被混為一談，就很容易遇到「工具看得到、晶片卻連不上」、「Download 顯示成功、程式卻沒有執行」或「明明選了新 BIN，板上跑的仍是舊版本」。

這篇文章整理自一次真實 TLSR8258 產品板的板級啟動（bring-up）與燒錄除錯過程，目標是建立一套可重複、可診斷、可驗證的開發閉環。

{/* truncate */}

:::info[本文範圍]

本文以 **TLSR8258F512ET48／B85 系列、Telink IoT Studio、Burning EVK 與 SWS** 為主。這是真實 MCU 的線上燒錄與指令級除錯流程，不是 PC 上的 CPU 模擬器教學。

:::

## 先認識 TLSR8258

依據 [Telink TLSR825x 官方產品頁](https://www.telink-semi.com/products/bluetooth-mesh/tlsr825x)與 TLSR8258 Ver 1.0.1 Datasheet，這是一顆整合 2.4 GHz 無線能力的 TLSR8 系列 SoC：

- Telink 自研 32-bit MCU，最高 48 MHz；它不是 RISC-V 核心。
- 64 KB SRAM；`F512` 與 `F1K` 分別代表 512 KB 與 1 MB Flash 版本。
- 支援 Bluetooth LE 1M／2M、Long Range、IEEE 802.15.4、Zigbee、BLE Mesh 與 2.4 GHz proprietary 應用。
- 周邊包含 14-bit ADC、SPI、I²C、UART、USB、I²S、PWM 與 QDEC 等。
- 供電範圍為 1.8–3.6 V，並提供 Swire 單線介面。

TLSR8258 並不存在一個能取代所有通訊協定堆疊的「萬用 SDK」。開始專案前，應先根據產品選擇 Bluetooth LE Single／Multi Connection、Bluetooth Mesh、Zigbee、Zigbee + BLE Concurrent、IEEE 802.15.4 或 Platform SDK，再確認該 SDK 的 Flash layout、boot 與 OTA 規則。

## 先把完整開發流程拆成四層

![PC 前端經 Burning EVK 與 SWM/SWS 寫入 TLSR8258，重設後由 UART 或 BLE 驗證版本](/img/blog/telink-tlsr8258/tlsr8258-development-chain.svg)

整套流程可以簡化成：

```text
PC（GUI / CLI / WebUSB）
  → Telink Burning EVK
  → 程式器端 SWM
  → 目標端 SWS
  → TLSR8258
  → Reset
  → UART / BLE 版本驗證
```

其中最容易混淆的是下面三組概念：

| 層級 | 可選項 | 真正決定的事情 |
|---|---|---|
| PC 前端 | 經典 Windows BDT、libusb BDT GUI/CLI、Web BDT | 電腦用哪套協定操作下載器 |
| Burning EVK 的 USB 身分 | 傳統模式、Web/libusb 模式 | Windows 載入哪個驅動、哪套 BDT 能看到裝置 |
| EVK 到目標板 | EVK/SWS、目標 MCU 自身 USB | 最後一段如何進入目標晶片 |

對常見 TLSR8258 自製板而言，推薦的日常路徑是：

```text
libusb BDT → Burning EVK → EVK/SWS → TLSR8258
```

:::tip[先記住這個判斷]

新版 libusb/Web 工具中選擇具體晶片 `8258`；經典 Windows BDT 通常以家族名顯示為 `B85`。`B91`、`B92` 不是 TLSR8258 的別名。

:::

## 硬體接線：SWS 只需一根訊號線，但供電不能含糊

以 **TLSR8258F512ET48** 封裝為例，開發階段至少需要：

| Burning EVK | 目標板 | 說明 |
|---|---|---|
| `SWM` | `PA7 / SWS`（ET48 pin 9） | 單線燒錄與除錯訊號 |
| `GND` | `GND` | 必須共地 |
| `VDD` 或參考電壓 | 依板上供電設計 | 先確認誰是唯一主動電源 |
| 可選控制線 | `RESETB`（ET48 pin 36） | 建議在設計階段保留恢復能力 |

:::caution[供電與封裝風險]

- 不確定供電拓撲時，**不要把 EVK 的 3.3 V 與電池、USB 或板載 3.3 V 直接並聯**。
- 上述 pin 編號只適用 `TLSR8258F512ET48`；換封裝必須重新查 datasheet。
- 一般 J-Link SWD、CMSIS-DAP 或 DAPLink 不能直接取代 Telink SWS 程式器。
- SWS 線要短、地線要可靠；線材、接地與目標供電往往比反覆點擊 `Activate` 更值得先檢查。

:::

## 工具版本：先分清「哪一層的版本」

以下是 **2026-08-12** 可核實的版本快照。不同平台與發行管道不是同一條升級線，不能只比較數字大小；「作者環境」也不代表所有人的安裝版本。

<table tabIndex={0} aria-label="Telink 開發工具版本快照">
  <thead>
    <tr><th>元件</th><th>可核實版本</th><th>定位</th></tr>
  </thead>
  <tbody>
    <tr><td>Telink IoT Studio</td><td><code>2025.2</code>／頁面寫 <code>2025.02</code></td><td>TLSR8/TLSR9/TL 專案管理、工具鏈與燒錄入口</td></tr>
    <tr><td>Web BDT</td><td>使用手冊 <code>V1.1.0</code>；線上工具標題仍可能顯示 <code>v1.0.0</code></td><td>瀏覽器 WebUSB/PWA 前端</td></tr>
    <tr><td>libusb BDT</td><td>官方仍標示 beta；作者環境 <code>1.4.1</code></td><td>IoT Studio 內建桌面 GUI/CLI，沒有公開統一版號</td></tr>
    <tr><td>經典 Windows BDT</td><td>現行文件可辨識 <code>release_v5.9.2</code>；作者環境 <code>5.8.2</code></td><td>傳統 Windows BDT 發行管道</td></tr>
    <tr><td>Linux／macOS BDT</td><td>舊 Wiki 曾列 <code>2.2.1</code>；現行文件未公布統一版號</td><td>不應把舊 Wiki 數字稱為現行最新版</td></tr>
    <tr><td>Burning EVK</td><td>依 BDT 發行套件而定</td><td>這是下載器韌體版本，不是 PC 軟體版本</td></tr>
  </tbody>
</table>

Telink 官方的 [IoT Studio 使用指南](https://doc.telink-semi.cn/doc/zh/software/res/tools/telink_ide/Telink_IoT_Studio_User_Guide_cn/) 明確把 TLSR8 的 TC32 工具鏈、Windows BDT、libusb BDT，以及 TLSR9/TL 的 JTAG/GDB 除錯分開描述。升級 BDT 時，也應同時閱讀該版本對 Burning EVK 韌體的要求。

### 藍色與綠色模式不是裝飾燈

Burning EVK 可向電腦呈現不同 USB 身分：

<table tabIndex={0} aria-label="Burning EVK USB 模式與工具對照">
  <thead>
    <tr><th>EVK 狀態</th><th>PC 前端</th><th>Windows 驅動</th><th>常見現象</th></tr>
  </thead>
  <tbody>
    <tr><td>Web/libusb 模式</td><td>libusb BDT 或 Web BDT</td><td>WinUSB/libusb</td><td>裝置可列舉為 Telink Web Debugger</td></tr>
    <tr><td>傳統模式</td><td>經典 Windows BDT</td><td>傳統 Windows 驅動路徑</td><td>libusb/Web 前端可能找不到裝置</td></tr>
  </tbody>
</table>

切換 `SW2` 後通常需要重新拔插或完整斷電上電，讓 USB 重新列舉。同一時間只開一個用戶端，不要讓瀏覽器 Web BDT、桌面 GUI 與 CLI 同時搶同一臺 EVK。

<details>
<summary>什麼時候才用經典 Windows BDT？</summary>

如果專案既有產線腳本明確依賴經典 `Telink BDT.exe` 或 `Cmd_download_tool.exe`，可以把 EVK 切回傳統模式後使用。但不要把傳統模式的驅動、晶片名稱與命令，和藍色 libusb 模式混在同一條流程裡。

</details>

## 建置 TLSR8258 專案

Telink IoT Studio 為 TLSR8 提供 `tc32-elf` 工具鏈。若工程已經使用 CMake，可以明確指定產生器與工具鏈路徑，讓 IDE 與命令列產物一致。

```powershell title="PowerShell：建立可重複的 TC32 建置"
$env:TELINK_HOME = 'D:\TelinkIoTStudio'
$toolchain = Join-Path $env:TELINK_HOME 'opt\tc32'
$make = Join-Path $env:TELINK_HOME 'mingw\bin\mingw32-make.exe'

cmake -S <SDK_ROOT> -B <BUILD_DIR> -G 'MinGW Makefiles' `
  "-DTOOLCHAIN_PATH=$toolchain" `
  "-DCMAKE_MAKE_PROGRAM=$make"

cmake --build <BUILD_DIR> --target <B85_TARGET> -- -j
```

:::note[目標名稱由專案決定]

`<SDK_ROOT>`、`<BUILD_DIR>` 與 `<B85_TARGET>` 都是佔位符。不同 TLSR8258 SDK 的 target、linker script 與輸出檔名並不相同，應以自己的工程設定為準。

:::

### BIN、ELF、LST 必須成套保存

| 產物 | 內容 | 用途 |
|---|---|---|
| `.bin` | 純 Flash 映像 | BDT 真正寫入晶片的檔案 |
| `.elf` | 段、符號、可能的除錯資訊 | `size`、`nm`、`objdump` 與連結分析 |
| `.lst` | 地址、反組譯與可能的原始碼對照 | BDT 的 PC/Var 與卡死定位 |

從當次 ELF 產生 LST：

```powershell title="產生與韌體完全匹配的 LST"
$objdump = Join-Path $env:TELINK_HOME 'opt\tc32\bin\tc32-elf-objdump.exe'

& $objdump -x -S -d <firmware.elf> |
  Set-Content -Encoding ascii <firmware.lst>
```

再記錄檔案大小與雜湊：

```powershell title="固定本次燒錄產物的識別資訊"
Get-Item <firmware.bin> | Select-Object FullName, Length, LastWriteTime
Get-FileHash -Algorithm SHA256 <firmware.bin>
```

**同名 BIN 不等於同一個韌體。** GUI 可能只顯示被截短的檔名，也可能記住上一次目錄；因此路徑、大小、SHA-256 與 Build ID 缺一不可。

## 使用 libusb BDT 燒錄

以下命令展示一條完整的開發流程。執行前，先用目前安裝版本的 `bdt.exe help` 核對參數。

```powershell title="TLSR8258：列舉、同步、啟用、寫入與重設"
$bdt = 'D:\TelinkIoTStudio\tools\libusbBDT\bin\bdt.exe'
$firmware = 'C:\firmware\firmware.bin'

& $bdt lsusb -v

# 依 lsusb 輸出填入實際值；不要直接照抄範例編號
$usbBus = 2
$usbDevice = 1

& $bdt 8258 sws b0 10 b0 10 -b $usbBus -d $usbDevice
& $bdt 8258 ac -b $usbBus -d $usbDevice
& $bdt 8258 wf 0x000000 -i $firmware -p -b $usbBus -d $usbDevice
& $bdt 8258 rst -b $usbBus -d $usbDevice
```

每一步的責任不同：

1. `lsusb -v`：確認目前 BDT 能看到 Burning EVK。
2. `sws b0 10 b0 10`：依 8258 設定建立或檢查單線同步；這組值不是 UART baud rate。
3. `ac`：目標低功耗或失聯時，嘗試恢復 SWS 存取。
4. `wf`：把 BIN 寫入 Flash。
5. `rst`：真正重設 MCU，讓它從 Flash 啟動。

`-b` 與 `-d` 會把每一步綁定到同一臺 Burning EVK；如果同時接了多臺下載器，這是避免燒錯板的必要保護。不同 BDT 版本的重設命令可能是 `rst` 或 `reset`：作者環境的 libusb BDT 1.4.1 使用 `rst`，現行 Linux／macOS 手冊則示範 `reset`，請以該安裝包的 `help` 為準。

:::warning[寫入前先確認供電與保留資料]

- 低電壓或供電不穩時不要執行 Flash 擦寫。
- 先閱讀工程的 Flash layout，盤點 bootloader、OTA 槽、校準、配對（bonding）與非揮發性資料區。
- 若工程啟用了 Flash protection，應按對應 SDK 的設計解鎖、寫入並恢復保護，不要為了省事永久關閉保護。

:::

:::caution[地址不是萬用常數]

`0x000000` 只適用於 linker script 將完整啟動映像放在 Flash 0 地址，且本次映像不會覆蓋必要資料區的工程。若產品有 bootloader、雙槽 OTA、自訂 Flash 佈局或保留資料，必須先按該工程的記憶體配置確認，不能照抄。

:::

### 為什麼 Download 成功後仍要 Reset 或重新上電？

這是最常見、也最容易被誤判成韌體壞掉的現象：

```text
Activate → 恢復 SWS 存取
Download → 寫入 Flash
Reset    → 從新映像的啟動入口執行
```

`Activate` 不是「啟動剛寫入的韌體」。下載後 CPU 可能仍停留在下載或除錯狀態；請執行 `Reset`，或將目標板完整斷電後重新上電，讓 MCU 重新走啟動流程。

## 不要把「寫入成功」當成「韌體驗收成功」

一個可信的燒錄結果至少包含五項證據：

- `wf`／Download 的退出碼為成功。
- 工具回報的寫入位元組數等於 BIN 大小。
- 已執行 `Reset`。
- 已保存本次 BIN 的 SHA-256。
- 板端透過 UART、BLE 或產品診斷介面回報正確的版本與 Build ID。

建議在每個韌體內提供只讀識別資訊：

| 欄位 | 用途 |
|---|---|
| 語意版本（semantic version） | 對外辨識功能版本 |
| 發布序號（release counter） | 判斷映像的新舊次序 |
| 建置識別碼（Build ID） | 精確對應單次建置 |
| 原始碼版本（source revision） | 回溯來源 commit |
| 功能旗標（feature flags） | 確認編譯時啟用的功能 |

這樣才能回答最重要的問題：**板上現在實際執行的，是否就是剛才選擇的那份映像？**

:::tip[最短成功路徑]

固定產物完整路徑與 SHA-256 → `wf` → `rst` → 讀回版本／Build ID。這比只看 GUI 的檔名或綠色進度條可靠得多。

:::

## SWS 除錯能做什麼？

TLSR8258 的 BDT/SWS 是對真實晶片的線上控制，常見能力包括：

| 操作 | 用途 | 注意事項 |
|---|---|---|
| `Pause` / `Run` | 抓住卡死現場，再繼續執行 | CPU 暫停後 BLE 主迴圈與中斷無法正常服務；硬體 Timer／watchdog 是否繼續計數取決於配置，watchdog 可能觸發重設 |
| `Step` | 單條機器指令步進 | 不等於穩定的一行 C 程式碼 |
| `PC` | 讀取 Program Counter | 必須搭配同一次建置的 LST |
| `Var` | 觀察部分全域變數 | 最佳化後的區域變數不保證存在 |
| `rf` / `rc` / `ra` | 讀 Flash、Core/SRAM、Analog | 初步故障排除以唯讀為主 |

幾個安全的唯讀示例：

```powershell title="讀取 Flash、SRAM 與目前 PC"
# Flash 開頭 16 bytes
bdt.exe 8258 rf 0x000000 -s 16

# TLSR8258 SRAM 起點 16 bytes
bdt.exe 8258 rc 0x40000 -s 16

# 用匹配的 LST 解釋目前 PC
bdt.exe 8258 pc -i firmware.lst
```

:::warning[它不是完整的 GDB 模擬環境]

- BDT 不會在 PC 上模擬 TLSR8258 指令執行。
- `.lst` 是地址解釋檔，不會憑空帶來完整 C 原始碼斷點體驗。
- `Pause` 會改變即時系統狀態，不適合用來觀察 BLE 連線間隔、PWM、WS2812、馬達或 watchdog 等周邊裝置的正常時序。
- Telink IoT Studio 文件中的 ICEMan/JTAG/GDB 章節主要面向 TLSR9 與 TL 系列，不能因為選單存在就把 TLSR8258 當成 B92 使用。

:::

實際專案中，最有效的組合通常是：

```text
UART 結構化日誌
+ BLE 通訊協定／封包擷取
+ 示波器或邏輯分析儀
+ 卡死時的 Pause / PC / LST
```

## 常見錯誤與最短判斷

| 現象 | 先判斷哪一層 | 建議處理 |
|---|---|---|
| 經典 BDT 顯示 `No available Device` | EVK 的 USB 身分 | 若仍是 Web/libusb 模式，改用 libusb BDT，或切回傳統模式後重新拔插 |
| Web/libusb 找不到裝置 | 模式、驅動、獨占 | 確認 WinUSB、關閉其他 BDT/WebUSB 用戶端 |
| `Swire error` | EVK 到目標板 | 檢查 SWS、GND、供電、線長、低功耗狀態 |
| `DUT command execute error` | 受測裝置（DUT）的晶片與輔助程式 | 新工具選 `8258`，經典 GUI 選 `B85`；不要選 B91/B92 |
| `Activate OK` 但程式不跑 | 啟動狀態 | 寫入完成後執行 `Reset` |
| Download OK 但版本不對 | 產物識別資訊 | 查完整路徑、檔案大小、SHA-256 與板端 Build ID |
| PC 落在不合理的函式 | 符號配對 | BIN、ELF、LST 必須來自同一次建置 |
| Pause 後 BLE 斷線 | 即時副作用 | 這通常是暫停真實 CPU 的正常結果，Run/Reset 後再測 |

<details>
<summary>一棵可以貼在工作臺旁的故障樹</summary>

```text
工具看不到 Burning EVK？
  → 查 USB 身分、驅動、重新列舉、是否被另一程式佔用

工具看到 EVK，但 SWS 失敗？
  → 查 8258/B85、SWS、共地、供電、線長與低功耗

SWS/Activate 成功，但 Flash 寫入失敗？
  → 查晶片選型、寫入地址、Flash 保護與供電穩定度

寫入成功，但產品沒有功能反應？
  → Reset

Reset 後仍不對？
  → 讀回版本與 Build ID，確認是否燒錯同名 BIN

版本正確但功能異常？
  → 進入 UART／BLE／波形／PC／暫存器的功能除錯
```

</details>

## 從「能編譯」走到「可以交付」

嵌入式驗證應分成三層，不要互相替代：

| 層級 | 能證明什麼 | 不能證明什麼 |
|---|---|---|
| Source / Build | 語法、連結、映像格式、尺寸與靜態檢查通過 | 板上周邊裝置與電氣行為正確 |
| 實板驗證 | SWS 寫入、啟動、UART/BLE、GPIO 與時序在指定板上工作 | 批次裝置與長期可靠度均已完成 |
| Release / Production | 固定產物、雜湊、版本、燒錄記錄與驗收規則一致 | 未執行的現場條件或老化測試 |

發布前建議至少保存：

- 來源 commit 或不可變標籤；
- 乾淨工作樹建置證據；
- BIN、ELF、LST；
- BIN 大小與 SHA-256；
- BDT／Burning EVK 版本；
- 實板讀回的版本與 Build ID；
- 失敗裝置與錯誤碼，而不只記錄成功數量。

:::danger[預設不要做的操作]

不要把整片 Flash 擦除，或對 OTP、安全啟動、金鑰與 Analog 暫存器盲寫，當成一般連線問題的第一個故障排除動作。先讀、確認地址與恢復方法，再考慮任何寫操作。

:::

## 結語

TLSR8258 的穩定開發流程，不是「選 BIN 然後按 Download」，而是建立一條完整的證據鏈：

```text
固定來源
→ 可重複建置
→ BIN / ELF / LST 成套
→ 正確 USB 身分與驅動
→ EVK / SWS 寫入
→ Reset 啟動
→ 板端版本與 Build ID 驗證
→ 實際周邊裝置與無線功能測試
```

一旦這幾層被清楚拆開，`No available Device`、`Swire error`、同名 BIN、Activate/Reset 等問題就不再是玄學，而是可以逐層定位的工程問題。

## 官方資料

- [Telink TLSR825x 官方產品頁](https://www.telink-semi.com/products/bluetooth-mesh/tlsr825x)
- [Telink IoT Studio 使用指南](https://doc.telink-semi.cn/doc/zh/software/res/tools/telink_ide/Telink_IoT_Studio_User_Guide_cn/)
- [Web BDT 線上工具](https://doc.telink-semi.cn/webtool/web_bdt/)
- [Web BDT 使用指南](https://doc.telink-semi.cn/doc/zh/openplatform/web_bdt/)
- [Web BDT V1.1.0 詳細手冊](https://doc.telink-semi.cn/doc/zh/openplatform/res/web_bdt/README.html)
- [Windows Burning and Debugging Tool](https://doc.telink-semi.cn/doc/zh/software/res/tools/bdt_wins/bdt_wins_cn/)
- [Linux／macOS BDT](https://doc.telink-semi.cn/doc/zh/software/res/tools/bdt_linux_mac/bdt_linux_mac_cn/)
- [TLSR8258 開發板資料](https://doc.telink-semi.cn/doc/zh/hardware/res/devboard/tlsr8258/)
- [TC BLE Single Connection SDK](https://doc.telink-semi.cn/doc/zh/software/res/sdk/ble/tc_ble_cn/tc_ble_single_connection_cn/)

---

*版本與工具狀態核對日期：2026-08-12。官方下載頁可能更新；實際操作請以目前安裝包的手冊、`help` 輸出與對應 Burning EVK 韌體要求為準。*

---
slug: pio-uart-implementation-rp2040
title: Implementing UART (TX )with PIO on RP2040

authors:
 - name: w0x7ce
   title: Embedded Systems Engineer
   url: https://github.com/tianrking
   image_url: https://github.com/tianrking.png

tags: [RP2040, PIO, UART, Raspberry Pi Pico, embedded systems, serial communication]
---

# RP2040 PIO UART(TX) 實現綜合總結

## 1. UART 基本原理

:::info
UART（通用非同步收發傳輸器）是一種常用的串行通信協議。在我們的實現中：
- 使用 8 數據位，1 起始位，1 停止位（8N1 格式）
- 不使用流控制和奇偶校驗
- 預設波特率設置為 9600 bps
:::

## 2. PIO 程序結構

### 2.1 UART TX PIO 程序

```pio title="uart_tx.pio"
.program uart_tx
.side_set 1 opt

    pull       side 1 [7]  ; 從 FIFO 獲取數據，設置停止位（高電平）
    set x, 7   side 0 [7]  ; 設置循環計數器，發送起始位（低電平）
bitloop:
    out pins, 1            ; 發送一位數據
    jmp x-- bitloop   [6]  ; 循環直到發送完 8 位數據
```

:::tip[關鍵點]
- `.side_set 1 opt`: 定義一個可選的 1 位側設，用於控制 TX 引腳
- `pull`: 從 TX FIFO 獲取 32 位數據
- `set x, 7`: 設置循環計數器為 7（8位數據）
- `out pins, 1`: 輸出一位數據
- `jmp x-- bitloop [6]`: 循環發送 8 位數據，每次迭代 8 個週期
:::

### 2.2 FIFO 使用和字符存儲

<details>
<summary>FIFO 基本容量和合併</summary>

- 每個方向（TX 或 RX）的 FIFO 可以存儲 4 個 32 位字。
- 1 個 32 位字理論上可存儲 4 個 char（每個 char 8 位）。
- TX 和 RX FIFO 合併後，深度增加到 8 個 32 位字。
- 理論上合併後可存儲 32 個 char。

</details>

:::caution[實際使用中的 char 存儲]
- 典型 UART 實現中，通常每次只放入一個 char（8 位）到 FIFO。
- PIO 程序每次從 FIFO 取出 32 位數據，但通常只使用其中的 8 位。
:::

#### FIFO 填充示例（"ABCD"）

```
32位FIFO條目1: [A] [ ] [ ] [ ]  （只有 'A' 被存儲，其餘未使用）
32位FIFO條目2: [B] [ ] [ ] [ ]  （只有 'B' 被存儲）
32位FIFO條目3: [C] [ ] [ ] [ ]  （只有 'C' 被存儲）
32位FIFO條目4: [D] [ ] [ ] [ ]  （只有 'D' 被存儲）
```

:::note[FIFO 使用策略]
- 通常逐個 char 填充 FIFO，簡化 PIO 程序邏輯。
- PIO 程序設計為在 FIFO 有數據時立即處理，不等待 FIFO 填滿。
:::

### 2.3 時序控制

- 每個 UART 位使用 8 個 PIO 時鐘週期
- 使用指令後的延遲（如 `[7]`）來精確控制時序
- 總幀長度：1（起始位）+ 8（數據位）+ 1（停止位）= 10 位 * 8 週期 = 80 PIO 時鐘週期/幀

## 3. PIO 初始化和配置

```c title="uart_tx_init.c"
static inline void uart_tx_program_init(PIO pio, uint sm, uint offset, uint pin_tx, uint baud) {
    pio_sm_config c = uart_tx_program_get_default_config(offset);
    
    sm_config_set_sideset_pins(&c, pin_tx);
    sm_config_set_out_pins(&c, pin_tx, 1);
    sm_config_set_fifo_join(&c, PIO_FIFO_JOIN_TX);
    
    float div = (float)clock_get_hz(clk_sys) / (8 * baud);
    sm_config_set_clkdiv(&c, div);

    pio_gpio_init(pio, pin_tx);
    pio_sm_set_consecutive_pindirs(pio, sm, pin_tx, 1, true);
    
    pio_sm_init(pio, sm, offset, &c);
    pio_sm_set_enabled(pio, sm, true);
}
```

:::info[關鍵配置步驟]
1. 設置側設（side-set）和輸出引腳
2. 配置 FIFO 為僅 TX 模式
3. 計算並設置時鐘分頻以匹配目標波特率
4. 初始化 GPIO 和設置引腳方向
5. 初始化和啟用狀態機
:::

## 4. FIFO 使用和管理

<details>
<summary>FIFO 操作示例</summary>

```c
static inline void uart_tx_program_putc(PIO pio, uint sm, char c) {
    pio_sm_put_blocking(pio, sm, (uint32_t)c);
}

static inline void uart_tx_program_puts(PIO pio, uint sm, const char *s) {
    while (*s) {
        uart_tx_program_putc(pio, sm, *s++);
    }
}
```

</details>

## 5. 主程序實現

```c title="main.c"
#include "pico/stdlib.h"
#include "hardware/pio.h"
#include "uart_tx.pio.h"

int main() {
    const uint PIN_TX = 0;
    const uint SERIAL_BAUD = 9600;

    PIO pio = pio0;
    uint sm = 0;
    uint offset = pio_add_program(pio, &uart_tx_program);
    uart_tx_program_init(pio, sm, offset, PIN_TX, SERIAL_BAUD);

    while (true) {
        uart_tx_program_puts(pio, sm, "Hello, world! (from PIO!)\n");
        sleep_ms(1000);
    }
}
```

:::tip[主程序步驟]
1. 選擇 PIO 實例和狀態機
2. 將 PIO 程序加載到 PIO 指令內存
3. 初始化 UART TX 程序
4. 在主循環中發送數據
:::

## 6. 波特率計算和精度

:::note[實際波特率計算]
實際波特率 = (系統時鐘頻率) / (時鐘分頻 * 每幀週期數)
           = 125,000,000 / (div * 80)

其中，`div` 是初始化時計算的分頻值。
:::

注意：實際波特率可能與目標波特率略有偏差，這取決於系統時鐘頻率和可用的分頻值。

## 7. 8 位 UART 傳輸詳解：發送 "ABC"

### 7.1 UART 幀結構（8N1 格式）

每個 UART 字符幀包含 10 位：

- 1 個起始位（始終為 0）
- 8 個數據位（最低有效位 LSB 先發送）
- 1 個停止位（始終為 1）

### 7.2 字符 "ABC" 的二進制表示

- 'A': ASCII 65  = 0100 0001
- 'B': ASCII 66  = 0100 0010
- 'C': ASCII 67  = 0100 0011

### 7.3 發送過程詳解

<details>
<summary>字符 'A' 的發送過程</summary>

完整幀：

```
0 01000001 1
↑ ↑        ↑
| |        |
| |        停止位
| 數據位
起始位
```

PIO 程序執行過程：

1. `pull side 1 [7]`:
   - 從 FIFO 獲取 'A'（0x41）
   - TX 引腳保持高電平（停止位狀態）

2. `set x, 7 side 0 [7]`:
   - 設置循環計數器 x = 7
   - 發送起始位（低電平）

3. `bitloop:` 循環 8 次：
   - `out pins, 1`: 發送一位數據
   - `jmp x-- bitloop [6]`: 減少計數器並跳轉
   - 發送順序：1, 0, 0, 0, 0, 0, 1, 0 (LSB first)

4. 循環結束後，通過 `side 1` 設置停止位（高電平）

</details>

:::info[字符 'B' 和 'C' 的發送]
'B' 和 'C' 的發送過程與 'A' 相同，只是數據位不同：
- 'B': 0 01000010 1
- 'C': 0 01000011 1
:::

### 7.4 FIFO 操作

當調用 `uart_tx_program_puts(pio, sm, "ABC")` 時：

1. 'A' 被放入 FIFO
2. PIO 程序從 FIFO 拉取 'A' 並開始發送
3. 同時，'B' 被放入 FIFO
4. 'A' 發送完成後，PIO 程序立即拉取並發送 'B'
5. 'C' 被放入 FIFO
6. 'B' 發送完成後，PIO 程序拉取並發送 'C'

### 7.5 時序分析

假設 UART 波特率為 9600 bps：

- 每個位持續時間：1/9600 秒 ≈ 104.17 微秒
- 每個字符（10 位）傳輸時間：104.17 * 10 ≈ 1.0417 毫秒
- "ABC" 總傳輸時間：3 * 1.0417 ≈ 3.125 毫秒

## 8. 高級考慮因素

1. 錯誤處理：
   - PIO 不提供內置的幀錯誤檢測
   - 可以通過額外的 PIO 程序邏輯或軟件層面實現錯誤檢測

2. 雙向通信：
   - 需要單獨的 RX PIO 程序
   - 可能需要使用額外的狀態機或 PIO 實例

3. DMA 使用：
   - 對於大量數據傳輸，可以配合 DMA 使用
   - DMA 可以自動填充 TX FIFO，減少 CPU 干預

4. 資源利用：
   - 一個 UART 實例佔用一個 PIO 狀態機
   - 需要考慮 PIO 指令內存的使用

5. 靈活性：
   - 可以輕鬆修改 PIO 程序以支持不同的數據格式（如 7 位數據、2 個停止位）
   - 可以實現自定義協議或非標準波特率

## 9. 調試技巧

:::tip[調試方法]
1. 使用邏輯分析儀或示波器驗證信號時序
2. 利用 `printf` 調試輸出來監控數據流
3. 使用 Pico 的 LED 進行簡單的可視化調試
4. 在關鍵點添加 GPIO 觸發，方便使用示波器捕獲特定事件
:::

## 10. 性能考慮

- PIO UART 實現允許高速數據傳輸，僅受 PIO 時鐘頻率限制
- 對於簡單的數據發送，PIO 方法可能比硬件 UART 更靈活
- 對於複雜的協議或需要頻繁更改配置的場景，PIO 方法尤其有優勢

## 11. 未來擴展

:::note[可能的擴展方向]
1. 實現 UART 接收功能
2. 添加流控制支持
3. 實現奇偶校驗
4. 支持可變數據位數（5-8 位）和停止位數
5. 實現自動波特率檢測
:::

## 完整代碼

```c++ title="main.cpp"
#include "pico/stdlib.h"
#include "hardware/pio.h"
#include "uart_tx.pio.h"

int main() {
    // We're going to use PIO to print "Hello, world!" on the same GPIO which we
    // normally attach UART0 to.
    const uint PIN_TX = 7;
    // This is the same as the default UART baud rate on Pico
    const uint SERIAL_BAUD = 9600;

    PIO pio = pio0;
    uint sm = 0;
    uint offset = pio_add_program(pio, &uart_tx_program);
    uart_tx_program_init(pio, sm, offset, PIN_TX, SERIAL_BAUD);

    while (true) {
        uart_tx_program_puts(pio, sm, "Hello, world! (from PIO!)\n");
        sleep_ms(1000);
    }
}
```

```c++ title="uart_tx.pio"
;
; Copyright (c) 2020 Raspberry Pi (Trading) Ltd.
;
; SPDX-License-Identifier: BSD-3-Clause
;

.program uart_tx
.side_set 1 opt

; An 8n1 UART transmit program.
; OUT pin 0 and side-set pin 0 are both mapped to UART TX pin.

    pull       side 1 [7]  ; Assert stop bit, or stall with line in idle state
    set x, 7   side 0 [7]  ; Preload bit counter, assert start bit for 8 clocks
bitloop:                   ; This loop will run 8 times (8n1 UART)
    out pins, 1            ; Shift 1 bit from OSR to the first OUT pin
    jmp x-- bitloop   [6]  ; Each loop iteration is 8 cycles.


% c-sdk {
#include "hardware/clocks.h"

static inline void uart_tx_program_init(PIO pio, uint sm, uint offset, uint pin_tx, uint baud) {
    // Tell PIO to initially drive output-high on the selected pin, then map PIO
    // onto that pin with the IO muxes.
    pio_sm_set_pins_with_mask(pio, sm, 1u << pin_tx, 1u << pin_tx);
    pio_sm_set_pindirs_with_mask(pio, sm, 1u << pin_tx, 1u << pin_tx);
    pio_gpio_init(pio, pin_tx);

    pio_sm_config c = uart_tx_program_get_default_config(offset);

    // OUT shifts to right, no autopull
    sm_config_set_out_shift(&c, true, false, 32);

    // We are mapping both OUT and side-set to the same pin, because sometimes
    // we need to assert user data onto the pin (with OUT) and sometimes
    // assert constant values (start/stop bit)
    sm_config_set_out_pins(&c, pin_tx, 1);
    sm_config_set_sideset_pins(&c, pin_tx);

    // We only need TX, so get an 8-deep FIFO!
    sm_config_set_fifo_join(&c, PIO_FIFO_JOIN_TX);

    // SM transmits 1 bit per 8 execution cycles.
    float div = (float)clock_get_hz(clk_sys) / (8 * baud);
    sm_config_set_clkdiv(&c, div);

    pio_sm_init(pio, sm, offset, &c);
    pio_sm_set_enabled(pio, sm, true);
}

static inline void uart_tx_program_putc(PIO pio, uint sm, char c) {
    pio_sm_put_blocking(pio, sm, (uint32_t)c);
}

static inline void uart_tx_program_puts(PIO pio, uint sm, const char *s) {
    while (*s)
        uart_tx_program_putc(pio, sm, *s++);
}

%}



```
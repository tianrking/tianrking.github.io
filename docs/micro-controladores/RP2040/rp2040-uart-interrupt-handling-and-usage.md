---
slug: rp2040-uart-interrupt-handling-and-usage
title: UART Interrupt Handling and Data Transmission in RP2040
authors:
  - name: w0x7ce
    title: Embedded Systems Engineer
    url: https://github.com/tianrking
    image_url: https://github.com/tianrking.png
tags: [RP2040, UART, interrupts, Raspberry Pi Pico, embedded systems, serial communication]
---

在這篇文章中,我將與大家分享如何在 RP2040 中使用 UART 進行資料收發,並透過中斷方式有效地處理接收到的資料。我會詳細解析程式碼,討論 FIFO 的使用,並提供實際應用的範例,帶領大家深入理解 UART 在 RP2040 中的工作原理和使用方法。

:::note[UART 簡介]
UART（Universal Asynchronous Receiver/Transmitter,通用異步收發傳輸器）是一種常用的串口通信協議,廣泛應用於嵌入式系統中。它以異步的方式進行資料傳輸,透過 TX（發送）和 RX（接收）兩條線來實現全雙工通信。UART 的資料格式包括起始位、資料位、校驗位（可選）和停止位。
:::

## 在 RP2040 中使用 UART

RP2040 是 Raspberry Pi Pico 的核心,它提供了兩個 UART 模組（UART0 和 UART1）,可以用於與其他裝置進行串口通信。要在 RP2040 中使用 UART,我們需要執行以下步驟:

### 1. 初始化 UART

- 設定 UART 的參數,如波特率（baud rate）、資料位元數（data bits）、停止位元（stop bits）和同位檢查位元（parity bit）。
- 選擇要使用的 UART 模組（UART0 或 UART1）。
- 配置 UART 使用的 TX 和 RX 引腳。

### 2. 發送資料

- 使用 `uart_putc()` 函式發送單個字元。
- 使用 `uart_puts()` 函式發送字串。
- 透過檢查 UART 的可寫入狀態（`uart_is_writable()`）來避免資料覆寫。

### 3. 接收資料

- 使用 `uart_getc()` 函式接收單個字元。
- 透過檢查 UART 的可讀取狀態（`uart_is_readable()`）來判斷是否有新資料到達。
- 在中斷處理函式中處理接收到的資料。

### 4. 設定中斷

- 設定 UART 的中斷處理函式。
- 啟用 UART 的 RX 中斷。
- 在中斷處理函式中讀取接收到的資料,並進行相應的處理。

以下是一個使用 UART 的程式碼範例:

```c
#include "pico/stdlib.h"
#include "hardware/uart.h"
#include "hardware/irq.h"

#define UART_ID uart0
#define BAUD_RATE 115200
#define DATA_BITS 8
#define STOP_BITS 1
#define PARITY    UART_PARITY_NONE

#define UART_TX_PIN 0
#define UART_RX_PIN 1

static int chars_rxed = 0;

void on_uart_rx() {
    while (uart_is_readable(UART_ID)) {
        uint8_t ch = uart_getc(UART_ID);
        // 在此處理接收到的資料
        // ...
        chars_rxed++;
    }
}

int main() {
    // 初始化 UART
    uart_init(UART_ID, BAUD_RATE);
    
    // 設定 TX 和 RX 引腳的功能
    gpio_set_function(UART_TX_PIN, GPIO_FUNC_UART);
    gpio_set_function(UART_RX_PIN, GPIO_FUNC_UART);
    
    // 設定 UART 資料格式
    uart_set_format(UART_ID, DATA_BITS, STOP_BITS, PARITY);
    
    // 設定 RX 中斷
    int UART_IRQ = UART_ID == uart0 ? UART0_IRQ : UART1_IRQ;
    irq_set_exclusive_handler(UART_IRQ, on_uart_rx);
    irq_set_enabled(UART_IRQ, true);
    uart_set_irq_enables(UART_ID, true, false);
    
    // 發送初始訊息
    uart_puts(UART_ID, "Hello, UART!\n");
    
    // 主迴圈
    while (1) {
        // 在此執行其他任務
        // ...
    }
}
```

在這個程式碼範例中,我們首先引入了必要的標頭檔,並定義了 UART 的相關參數,如波特率、資料位元數、停止位元和校驗位元。接著,我們初始化 UART,設定 TX 和 RX 引腳的功能,並配置 UART 的資料格式。

為了處理接收到的資料,我們設定了 RX 中斷,並定義了中斷處理函式 `on_uart_rx()`。當 UART 接收到資料時,中斷處理函式會被觸發,我們可以在其中讀取接收到的資料並進行相應的處理。

接下來,我們發送一個初始訊息,表示 UART 已經就緒。在主迴圈中,我們可以執行其他任務,而接收到的資料會透過中斷處理函式自動處理。

## FIFO 的使用

FIFO（First In First Out,先進先出）是一種資料緩衝區,可以用於暫存 UART 接收到的資料。在 RP2040 中,每個 UART 模組都有一個對應的 FIFO。

:::tip[啟用 FIFO]
- 使用 `uart_set_fifo_enabled()` 函式啟用 UART 的 FIFO 功能。
- 設定 FIFO 的深度,即可存儲的資料量。
:::

:::warning[不啟用 FIFO]
- 如果不啟用 FIFO,每次接收到資料都會觸發中斷。
- 這種方式適用於對即時性要求較高的場景,但可能會增加 CPU 的負擔。
:::

:::info[使用 FIFO 的好處]
- 啟用 FIFO 後,只有當 FIFO 中累積了一定數量的資料或達到設定的閾值時,才會觸發中斷。
- 這種方式可以減少中斷的頻率,降低 CPU 的負擔。
- FIFO 提供了緩衝區,可以暫存一定量的資料,避免資料丟失。
:::

以下是啟用 FIFO 的程式碼範例:

```c
// 啟用 FIFO
uart_set_fifo_enabled(UART_ID, true);

// 設定 FIFO 的深度
uart_set_fifo_threshold(UART_ID, UART_FIFO_DEPTH);
```

在這個範例中,我們使用 `uart_set_fifo_enabled()` 函式啟用了 UART 的 FIFO 功能,並使用 `uart_set_fifo_threshold()` 函式設定了 FIFO 的深度。啟用 FIFO 後,當 FIFO 中累積的資料量達到設定的閾值時,才會觸發中斷。

## 資料發送和接收

在 RP2040 中,我們可以使用以下函式來發送和接收 UART 資料:

### 發送單個字元

```c
uart_putc(UART_ID, char_to_send);
```

### 發送字串

```c
uart_puts(UART_ID, string_to_send);
```

### 接收單個字元

```c
uint8_t received_char = uart_getc(UART_ID);
```

### 檢查是否有可讀取的資料

```c
if (uart_is_readable(UART_ID)) {
    // 有可讀取的資料
    // ...
}
```

### 檢查是否可以寫入資料

```c
if (uart_is_writable(UART_ID)) {
    // 可以寫入資料
    // ...
}
```

透過這些函式,我們可以方便地發送和接收 UART 資料。在發送資料時,我們可以使用 `uart_putc()` 發送單個字元,或使用 `uart_puts()` 發送字串。在接收資料時,我們可以使用 `uart_getc()` 接收單個字元,並使用 `uart_is_readable()` 檢查是否有可讀取的資料。

## 實際應用範例

以下是一個使用 UART 控制 LED 的範例:

```c
#include "pico/stdlib.h"
#include "hardware/uart.h"
#include "hardware/irq.h"

#define UART_ID uart0
#define BAUD_RATE 115200
#define DATA_BITS 8
#define STOP_BITS 1
#define PARITY    UART_PARITY_NONE

#define UART_TX_PIN 0
#define UART_RX_PIN 1

#define LED_PIN 25

void on_uart_rx() {
    while (uart_is_readable(UART_ID)) {
        uint8_t ch = uart_getc(UART_ID);
        switch (ch) {
            case 'o':
                gpio_put(LED_PIN, 1);
                uart_puts(UART_ID, "LED ON\n");
                break;
            case 'f':
                gpio_put(LED_PIN, 0);
                uart_puts(UART_ID, "LED OFF\n");
                break;
            default:
                uart_puts(UART_ID, "Invalid command\n");
                break;
        }
    }
}

int main() {
    // 初始化 UART 和 LED
    uart_init(UART_ID, BAUD_RATE);
    gpio_set_function(UART_TX_PIN, GPIO_FUNC_UART);
    gpio_set_function(UART_RX_PIN, GPIO_FUNC_UART);
    uart_set_format(UART_ID, DATA_BITS, STOP_BITS, PARITY);
    
    gpio_init(LED_PIN);
    gpio_set_dir(LED_PIN, GPIO_OUT);
    
    // 設定 RX 中斷
    int UART_IRQ = UART_ID == uart0 ? UART0_IRQ : UART1_IRQ;
    irq_set_exclusive_handler(UART_IRQ, on_uart_rx);
    irq_set_enabled(UART_IRQ, true);
    uart_set_irq_enables(UART_ID, true, false);
    
    uart_puts(UART_ID, "UART LED Control\n");
    uart_puts(UART_ID, "Commands: 'o' - LED ON, 'f' - LED OFF\n");
    
    while (1) {
        tight_loop_contents();
    }
}
```

在這個範例中,我們使用 UART 接收指令,並根據接收到的指令控制 LED 的亮滅。當接收到字元 'o' 時,LED 會亮起,並回傳 "LED ON" 的訊息;當接收到字元 'f' 時,LED 會熄滅,並回傳 "LED OFF" 的訊息。如果接收到其他字元,則回傳 "Invalid command" 的訊息。

透過這種方式,我們可以使用 UART 發送簡單的指令來控制 RP2040 上的 LED,實現遠端控制的功能。


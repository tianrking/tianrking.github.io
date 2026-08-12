---
slug: advanced-pio-led-control-resource-management-rp2040
title: Advanced PIO LED Control and Resource Management on RP2040

authors:
 - name: w0x7ce
   title: Embedded Systems Engineer
   url: https://github.com/tianrking
   image_url: https://github.com/tianrking.png

tags: [RP2040, PIO, LED Control, Resource Management, Raspberry Pi Pico, embedded systems, state machine optimization]
---

# RP2040 上的進階 PIO LED 控制與資源管理

在嵌入式系統開發中，有效利用微控制器的資源至關重要。本文將深入探討如何在 Raspberry Pi Pico 的 RP2040 晶片上使用可程式化輸入/輸出（PIO）來實現複雜的 LED 控制邏輯，同時有效管理 PIO 資源。

## PIO 程式設計：實現複雜的 LED 控制邏輯

首先，讓我們來看我們的 PIO 程式，它實現了一個特定的 LED 控制邏輯：

```asm title="hello.pio"
.program led_controller
.side_set 1 opt

.wrap_target
    pull block                  ; 從 FIFO 提取數據到 OSR
    out x, 32                   ; 將 32 位數據移至 x 寄存器
    
    ; 檢查 x 是否為 0
    jmp !x, off                 ; 如果 x 為 0，跳轉至 off

    ; 檢查 x 是否為 3、8、15 或 21
    mov y, x                    ; 將 x 複製到 y
    set x, 2                    ; 設置 x 為 3（二進制 11）
    jmp x!=y, check_8           ; 如果不是 3，檢查是否為 8
    jmp off                     ; 如果是 3，關閉 LED

check_8:
    set x, 8                    ; 檢查是否為 8
    jmp x!=y, check_15          ; 如果不是 8，檢查是否為 15
    jmp off                     ; 如果是 8，關閉 LED

check_15:
    set x, 15                   ; 檢查是否為 15
    jmp x!=y, check_21          ; 如果不是 15，檢查是否為 21
    jmp off                     ; 如果是 15，關閉 LED

check_21:
    set x, 21                   ; 檢查是否為 21
    jmp x!=y, on                ; 如果不是 21，開啟 LED
    jmp off                     ; 如果是 21，關閉 LED

off:
    nop             side 0      ; 關閉 LED
    jmp continue

on:
    nop             side 1      ; 開啟 LED

continue:
    nop                         ; 確保最後標籤後有指令
.wrap
```

### 程式解析

1. `.side_set 1 opt`：設置一個可選的側設置引腳，用於控制 LED。
2. `pull block` 和 `out x, 32`：從 FIFO 讀取 32 位數據到 x 寄存器。
3. 接下來的邏輯檢查輸入值是否為 0、3、8、15 或 21，如果是則關閉 LED，否則開啟 LED。
4. `side 0` 和 `side 1` 用於控制 LED 的開關。

:::info
這個程式實現了一個特殊的 LED 控制邏輯：當輸入值為 0、3、8、15 或 21 時關閉 LED，其他值則開啟 LED。
:::

## PIO 初始化函數

在 PIO 程式之後，我們定義了一個 C 函數來初始化 PIO 狀態機：

```c title="hello.pio"
% c-sdk {
#include "hardware/clocks.h"

static inline void led_controller_program_init(PIO pio, uint sm, uint offset, uint pin) {
    pio_sm_config c = led_controller_program_get_default_config(offset);
    
    sm_config_set_set_pins(&c, pin, 1);
    sm_config_set_sideset_pins(&c, pin);
    pio_gpio_init(pio, pin);
    pio_sm_set_consecutive_pindirs(pio, sm, pin, 1, true);
    
    sm_config_set_clkdiv(&c, 1);
    
    pio_sm_init(pio, sm, offset, &c);
    pio_sm_set_enabled(pio, sm, true);
}
%}
```

這個函數設置 PIO 狀態機的配置，包括設置引腳、時鐘分頻等。

## 主程式實現

現在讓我們看看如何在主程式中使用這個 PIO 程式：

```c title="main.c"
#include <stdio.h>
#include "pico/stdlib.h"
#include "hardware/pio.h"
#include "hello.pio.h"

int main() {
    stdio_init_all();
    printf("LED Controller Test\n");

    PIO pio = pio0;
    uint sm = 0;
    uint offset = pio_add_program(pio, &led_controller_program);
    led_controller_program_init(pio, sm, offset, 25);  // 假設 LED 連接到 GPIO 25

    while (true) {
        for (int i = 1; i <= 25; i++) {
            if (i == 0 || i == 3 || i == 8 || i == 15 || i == 21) {
                printf("LED off (%d)\n", i);
            } else {
                printf("LED on (%d)\n", i);
            }
            pio_sm_put_blocking(pio, sm, i);
            sleep_ms(1000);  // 等待 1 秒
        }
        printf("\nRestarting sequence...\n\n");
        sleep_ms(2000);  // 重新開始前等待 2 秒
    }

    return 0;
}
```

### 主程式解析

1. 初始化標準輸入輸出和 PIO。
2. 將 PIO 程式加載到 pio0 的狀態機 0 中。
3. 在一個無限循環中，遍歷 1 到 25 的數字。
4. 對於每個數字，將其發送到 PIO 狀態機，並印出 LED 的預期狀態。
5. 每次操作後等待 1 秒，每輪循環後等待 2 秒。

## 編譯和運行

要編譯這個程式，您需要確保您的 `CMakeLists.txt` 文件正確設置。以下是一個示例：

```cmake title="CMakeLists.txt"
cmake_minimum_required(VERSION 3.13)
include(pico_sdk_import.cmake)
project(led_controller C CXX ASM)
set(CMAKE_C_STANDARD 11)
set(CMAKE_CXX_STANDARD 17)
pico_sdk_init()

add_executable(led_controller
    main.c
)

pico_generate_pio_header(led_controller ${CMAKE_CURRENT_LIST_DIR}/hello.pio)

target_link_libraries(led_controller 
    pico_stdlib 
    hardware_pio
)

pico_enable_stdio_usb(led_controller 1)
pico_enable_stdio_uart(led_controller 0)

pico_add_extra_outputs(led_controller)
```

編譯完成後，將程式上傳到您的 Raspberry Pi Pico。

## 測試結果

當您運行這個程式時，您應該會在串口終端看到類似以下的輸出：

```
LED Controller Test
LED on (1)
LED on (2)
LED off (3)
LED on (4)
LED on (5)
LED on (6)
LED on (7)
LED off (8)
...
LED off (21)
LED on (22)
LED on (23)
LED on (24)
LED on (25)

Restarting sequence...

LED on (1)
LED on (2)
LED off (3)
...
```

同時，您應該能觀察到連接到 GPIO 25 的 LED 相應地開啟和關閉。

## PIO 資源管理和優化

在這個例子中，我們的 PIO 程式使用了 12 個指令槽。RP2040 的每個 PIO 實例有 32 個指令槽，因此我們還有 20 個指令槽可用於其他目的。

:::tip[優化考慮]
1. 如果需要在同一個 PIO 中運行多個程式，可以考慮減少每個程式的指令數。
2. 使用 pio1 來運行額外的程式，它有完整的 32 個指令槽可用。
3. 考慮讓多個狀態機共享部分指令，以最大化指令使用效率。
:::

您提出了一個很好的觀點。我會為您添加這些重要的知識點，詳細解釋 PIO 的整體架構、多狀態機使用以及指令限制。以下是新增的段落，您可以將其插入到適當的位置：

---

## PIO 架構與資源管理

### PIO 實例與狀態機

RP2040 擁有兩個 PIO 實例（PIO0 和 PIO1），每個 PIO 實例包含四個獨立的狀態機。這種設計提供了極大的靈活性：

- 每個 PIO 實例可以同時運行最多四個獨立的程序。
- 狀態機可以獨立運行，也可以協同工作，實現複雜的功能。

:::info
例如，在 VGA 信號生成中，一個狀態機可能負責水平同步，另一個負責垂直同步，而第三個處理像素數據輸出。
:::

### 指令內存共享

每個 PIO 實例擁有 32 條指令的共享內存。這是一個關鍵的限制和設計考慮：

- 所有四個狀態機共享這 32 條指令空間。
- 每個程序可以使用任意數量的指令，只要總和不超過 32。
- 一個狀態機可以使用全部 32 條指令，或者多個狀態機可以使用不同數量的指令。

:::caution
當設計 PIO 程序時，必須考慮到 32 條指令的限制。這要求開發者在功能實現和資源使用之間取得平衡。
:::

### 資源優化策略

考慮到 32 條指令的限制，以下是一些優化策略：

1. **指令重用**：設計可以被多個狀態機共享的指令序列。
2. **功能劃分**：將複雜功能分解為多個簡單程序，分配給不同的狀態機。
3. **跨 PIO 實例設計**：如果一個 PIO 實例的資源不足，考慮使用另一個 PIO 實例。

### 實際應用示例

在我們的 LED 控制器示例中：

- 我們使用了 12 條指令，佔用了 PIO 實例約 37.5% 的指令空間。
- 這意味著我們還有足夠的空間在同一 PIO 實例中實現其他功能。
- 例如，我們可以添加另一個程序來控制不同的 LED 模式，或實現其他 I/O 功能。

```python
剩餘指令空間 = 32 - 當前程序使用的指令數
剩餘指令空間 = 32 - 12 = 20 條指令
```

### 擴展性考慮

理解 PIO 架構和資源限制後，我們可以更好地規劃複雜項目：

1. **並行任務**：利用多個狀態機同時執行不同任務。
2. **資源分配**：在設計初期就考慮指令使用，合理分配資源。
3. **跨 PIO 協作**：對於更複雜的項目，考慮 PIO0 和 PIO1 的協同工作。

:::tip
在開發過程中，定期檢查指令使用情況，確保不會超出 32 條指令的限制。如果接近限制，考慮重構代碼或使用另一個 PIO 實例。
:::



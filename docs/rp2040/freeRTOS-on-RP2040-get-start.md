---
description: freeRTOS-on-RP2040-get-start.md
title: FreeRTOS on RP2040 Getting started
tags:
  - embedded
  - rp2040
  - FreeRTOS
keywords:
  - embedded
  - rp2040
  - FreeRTOS
image: https://github.com/tianrking.png
last_update:
  date: 12/2/2022
  author: w0x7ce

---

```bash
git clone https://github.com/raspberrypi/pico-sdk.git ~/pico-sdk
export PICO_SDK_PATH=~/pico-sdk
```

```bash
git clone https://github.com/tianrking/FreeRTOS-SMP-Demos.git --recurse-submodules
```

```bash
git submodule update --init --recursive
```

```bash
cd FreeRTOS/Demo/CORTEX_M0+_RP2040
mkdir build
cd build
cmake ..
make 
```

- Blinky Demo - FreeRTOS/Demo/CORTEX_M0+_RP2040/build/Standard/main_blinky.uf2.

- Comprehensive Demo - FreeRTOS/Demo/CORTEX_M0+_RP2040/build/Standard/main_full.uf2

- Multicore Demo

  - FreeRTOS/Demo/CORTEX_M0+_RP2040/build/OnEitherCore/on_core_zero.uf2
  - FreeRTOS/Demo/CORTEX_M0+_RP2040/build/OnEitherCore/on_core_one.uf2


## Install tools on Linux

```bash
sudo apt install cmake
sudo apt install gcc-arm-none-eabi
sudo apt install build-essential
```

```bash
mkdir freertos-pico
cd freertos-pico
git clone https://github.com/RaspberryPi/pico-sdk --recurse-submodules
git clone -b smp https://github.com/FreeRTOS/FreeRTOS-Kernel --recurse-submodules
export PICO_SDK_PATH=$PWD/pico-sdk
export FREERTOS_KERNEL_PATH=$PWD/FreeRTOS-Kernel
mkdir blink
cd blink
```

```cpp title='main.c'
#include "pico/stdlib.h"

#include "FreeRTOS.h"

#include "task.h"

void vBlinkTask() {

   for (;;) {

      gpio_put(PICO_DEFAULT_LED_PIN, 1);

      vTaskDelay(250);

      gpio_put(PICO_DEFAULT_LED_PIN, 0);

      vTaskDelay(250);

   }

}

void main() {

   gpio_init(PICO_DEFAULT_LED_PIN);

   gpio_set_dir(PICO_DEFAULT_LED_PIN, GPIO_OUT);

   xTaskCreate(vBlinkTask, "Blink Task", 128, NULL, 1, NULL);

   vTaskStartScheduler();

}
```


```bash
mkdir build
cd build
cmake ..
make
```

## NOTE

https://github.com/tianrking/FreeRTOS-SMP-Demos

https://github.com/tianrking/freertos-rp2040



### 資料型態及命名規則

在不同硬體裝置上，通訊埠設定上也不同，定義在portmacro.h標頭檔內，有兩種特殊資料型態portTickType以及portBASE_TYPE。

資料型態
- portTickType : 用以儲存tick的計數值，可以用來判斷block次數
- portBASE_TYPE : 定義為架構基礎的變數，隨各不同硬體來應用，如在32-bit架構上，其為32-bit型態，最常用以儲存極限值或布林數。
FreeRTOS明確的定義變數名稱以及資料型態，不會有unsigned以及signed搞混使用的情形發生。

變數
- char 類型：以 c 為字首
- short 類型：以 s 為字首
- long 類型：以 l 為字首
- float 類型：以 f 為字首
- double 類型：以 d 為字首
- Enum 變數：以 e 為字首
- portBASE_TYPE 或其他（如 struct）：以 x 為字首
- pointer 有一個額外的字首 p , 例如 short 類型的 pointer 字首為 ps
- unsigned 類型的變數有一個額外的字首 u , 例如 unsigned short 類型的變數字首為 us

- 函式：以回傳值型態與所在檔案名稱為開頭(prefix)
- vTaskPriority() 是 task.c 中回傳值型態為 void 的函式
- xQueueReceive() 是 queue.c 中回傳值型態為 portBASE_TYPE 的函式
- 只能在該檔案中使用的 (scope is limited in file) 函式，以 prv 為開頭 (private)

- 巨集名稱：巨集在FreeRTOS裡皆為大寫字母定義，名稱前小寫字母為巨集定義的地方
- portMAX_DELAY : portable.h
- configUSE_PREEMPTION : FreeRTOSConfig.h

### Code

#### Task Function

void ATaskFunction(void *pvParameters)
{
   int i = 0;   // 每個用這個函數建立的 task 都有自己的一份 i 變數

   while(1)
   { /* do something here */ }

   /* 
    * 如果你的 task 就是需要離開 loop 並結束
    * 需要用 vTaskDelete 來刪除自己而非使用 return 或自然結束(執行到最後一行)
    * 這個參數的 NULL 值是表示自己 
    */
   vTaskDelete(NULL);
}

#### 建立 task 的函數

```bash
portBASE_TYPE xTaskCreate( pdTASK_CODE pvTaskCode,
                           const signed portCHAR * const pcName,
                           unsigned portSHORT usStackDepth,
                           void *pvParameters,
                           unsigned portBASE_TYPE uxPriority,
                           xTaskHandle *pxCreatedTask );
```

- pvTaskCode：就是我們定義好用來建立 task 的 C 函數
- pcName：任意給定的 task name，這個名稱只被用來作識別，不會在 task 管理中被採用
- usStackDepth：堆疊的大小
- pvParameters：要傳給 task 的參數陣列，也就是我們在 C 函數宣告的參數
- uxPriority：定義這個任務的優先權，在 FreeRTOS 中，0 最低，(configMAX_PRIORITIES – 1) 最高
- pxCreatedTask：handle，是一個被建立出來的 task 可以用到的識別符號

#### 刪除 task 的函數

```bash
void vTaskDelete( xTaskHandle pxTaskToDelete );
```

- pxTaskToDelete: 利用handle去識別出哪一個task。 這種可能性存在於如果在 loop 中發生執行錯誤 (fail)，則需要跳出迴圈並終止(自己)執行，此時就需要使用 vTaskDelete 來刪除自己，發生錯誤的例子：
  
  - 假如一個 task 是要存取資料庫，但是資料庫或資料表不存在，則應該結束 task
  - 假如一個 client task 是要跟 server 做連線( listening 就是 loop)，卻發現 client 端沒有網路連線，則應結束 task




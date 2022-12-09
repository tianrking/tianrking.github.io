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
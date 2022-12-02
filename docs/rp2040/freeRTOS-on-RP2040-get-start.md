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
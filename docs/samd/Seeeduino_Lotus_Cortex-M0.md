---
description: Seeeduino_Lotus_Cortex-M0
title: Seeeduino_Lotus_Cortex-M0
tags:
  - embedded
  - samd
  - platformio
keywords:
  - embedded
  - samd
  - platformio
image: https://github.com/tianrking.png
last_update:
  date: 12/6/2022
  author: w0x7ce

---

[SAMD21G18A Seeeduino_Lotus_Cortex-M0](https://wiki.seeedstudio.com/Seeeduino_Lotus_Cortex-M0-)
[Wio Lite W600](https://wiki.seeedstudio.com/Wio-Lite-W600/)

```bash
pio project init --board seeed_zero
touch src/main.cpp
```

```cxx title="src/main.cpp"
#include<Arduino.h>
void setup()
{

}

void loop(){

}
```

```bash
pio run
pio run --target upload
```

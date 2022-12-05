---
description: PlatformIO-on-RP2040-get-start.md
title: PlatformIO on RP2040 Getting started
tags:
  - embedded
  - rp2040
  - PlatformIO
keywords:
  - embedded
  - rp2040
  - PlatformIO
image: https://github.com/tianrking.png
last_update:
  date: 12/2/2022
  author: w0x7ce

---

# Create Project

```bash
mkdir ~/pico_work_dir
cd ~/pico_work_dir
pio boards |grep 2040
pio project init --board pico 
```

# Build project

```bash
pio run
```

# Upload firmware

```bash
pio run --target upload
```

# Build specific environment

```bash
pio run -e pico
```

# Upload firmware for the specific environment

```bash
pio run -e pico --target upload
```

# Clean build files

```bash
pio run --target clean
```
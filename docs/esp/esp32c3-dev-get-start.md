---
description: ESP32 Setting up Development Environment
title: ESP32 Getting started
tags:
  - Demo
  - Getting started
keywords:
  - embedded
  - esp
image: https://github.com/tianrking.png
last_update:
  date: 12/2/2022
  author: w0x7ce

---

## Step 1. Install Prerequisites

- ubuntu & Debian 

```bash
sudo apt-get install git wget flex bison gperf python3 python3-venv cmake ninja-build ccache libffi-dev libssl-dev dfu-util libusb-1.0-0
```

```bash
mkdir -p ~/esp
cd ~/esp
git clone --recursive https://github.com/espressif/esp-idf.git
```

```bash
cd ~/esp/esp-idf
./install.sh esp32
./install.sh esp32,esp32s2
. ./export.sh
```

```bash
cd ~/esp/esp-idf
export IDF_GITHUB_ASSETS="dl.espressif.com/github_assets"
./install.sh
```

```bash
. $HOME/esp/esp-idf/export.sh
```

```bash
alias get_idf='. $HOME/esp/esp-idf/export.sh'
```

```bash
cd ~/esp
cp -r $IDF_PATH/examples/get-started/hello_world .
```

```bash
export IDF_PATH=~/esp/esp-idf
cd ~/esp
cp -r $IDF_PATH/examples/get-started/hello_world .
```

```bash
cd ~/esp/hello_world
idf.py set-target esp32
idf.py menuconfig
```


```bash
idf.py build
```



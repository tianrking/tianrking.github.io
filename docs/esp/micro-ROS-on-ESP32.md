---
description: micro ROS on ESP32
title: micro ROS on ESP32
tags:
  - embedded
  - esp
keywords:
  - embedded
  - esp
image: https://github.com/tianrking.png
last_update:
  date: 12/2/2022
  author: w0x7ce

---


```bash
git clone https://github.com/espressif/esp-idf
git submodule update --init --recursive
rm -rf ~/.espressif
```

```bash
git clone https://github.com/micro-ROS/micro_ros_espidf_component
. $IDF_PATH/export.sh
pip3 install catkin_pkg lark-parser empy colcon-common-extensions
```

```bash
docker run -it --rm espressif/idf:release-v4.4
```
- esp32 success
- esp32s3 success
- esp32c3 fail

```bash
idf.py set-target esp32c3
idf.py menuconfig
idf.py build
```



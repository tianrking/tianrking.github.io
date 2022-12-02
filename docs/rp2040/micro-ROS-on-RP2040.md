---
description: micro-ROS-RP2040
title: micro-ROS on RP2040 Getting started
tags:
  - embedded
  - rp2040
  - micro-ROS
keywords:
  - embedded
  - rp2040
  - micro-ROS
image: https://github.com/tianrking.png
last_update:
  date: 12/2/2022
  author: w0x7ce

---


```bash
git clone https://github.com/raspberrypi/pico-examples # For Example
git clone https://github.com/raspberrypi/pico-sdk.git ~/pico-sdk
export PICO_SDK_PATH=~/pico-sdk
```

```bash
git clone https://github.com/micro-ROS/micro_ros_raspberrypi_pico_sdk.git
```

```bash
sudo apt install cmake g++ gcc-arm-none-eabi doxygen libnewlib-arm-none-eabi git python3 -y
```


```bash
docker run -it --rm -v /dev:/dev --privileged --net=host microros/micro-ros-agent:humble serial --dev /dev/ttyACM0 -b 115200
```

```bash
cp pico_micro_ros_example.uf2 /media/$USER/RPI-RP2
```
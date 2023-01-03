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
  date: 12/29/2022
  author: w0x7ce

---

PR2040 是一款高性能，灵活的I/O，低成本的控制器。在这里我们将介绍利用 Raspberry Pi Pico 实现基于ROS的电机控制。 

## 准备

### 硬件

- [Pi Pico](https://www.raspberrypi.com/products/raspberry-pi-pico/)
- [L298N motor Driver](https://lastminuteengineers.com/l298n-dc-stepper-driver-arduino-tutorial/)

### 接线方式

- Encoder

    - GPIO 10
    - GPIO 11

- PWM for L298N motor control
    
    - GPIO 6

## 拷贝代码

[Detailed Tutorial](https://me.w0x7ce.eu/rp2040/micro-ROS-on-RP2040)

```bash
git clone https://github.com/tianrking/MicroROS_RP2040.git ~/MicroROS_RP2040
```

### 依赖安装

首先， 确保 Pico SDK 正确安装并且配置到环境变量:

```bash
# Install dependencies
sudo apt install cmake g++ gcc-arm-none-eabi doxygen libnewlib-arm-none-eabi git python3
git clone --recurse-submodules https://github.com/raspberrypi/pico-sdk.git $HOME/pico-sdk

# Configure environment
echo "export PICO_SDK_PATH=$HOME/pico-sdk" >> ~/.bashrc
source ~/.bashrc
```

然后, 确保 microros 和 pico-example 被正确配置， 我们将调用 pico-example 里面的函数快速实现编码器数值获取

```bash
git clone https://github.com/micro-ROS/micro_ros_raspberrypi_pico_sdk ~/micro_ROS_SDK_PATH
export micro_ROS_SDK_PATH=~/micro_ROS_SDK_PATH

git clone https://github.com/raspberrypi/pico-examples ~/pico-examples
export pico_examples_PATH=~/pico-examples
```

如果想支持 FreeRTOS 可以添加 smp 版本的 FreeRTOS ，因为 RP2040 是对称多处理器

```bash
git clone -b smp https://github.com/FreeRTOS/FreeRTOS-Kernel --recurse-submodules ~/FreeRTOS-Kernel-SMP 
export FREERTOS_KERNEL_PATH=~/FreeRTOS-Kernel-SMP/FreeRTOS-Kernel
```

然后我们开始编译代码

### Build

```bash
cd ~/MicroROS_RP2040
mkdir build
cd build
cmake ..
make
```

### Flash

按住 boot 键，将 pico 插入电脑， 然后松开boot键

```bash
cp pico_micro_ros_example.uf2 /media/$USER/RPI-RP2
```

### 运行 Micro-ROS 服务

Micro-ROS 遵循C/S架构，所以需要在Linux端启动Micro-ROS代理，解析单片机端传回的数据。 

- Docker 方式

```bash
docker run -it --rm -v /dev:/dev --privileged --net=host microros/micro-ros-agent:humble serial --dev /dev/ttyACM0 -b 115200
```

- snap 方式

1. 安装

```bash
sudo snap install micro-ros-agent
```

2. 启动热插拔

```bash
sudo snap set core experimental.hotplug=true
sudo systemctl restart snapd
```

3. 运行

```bash
sudo micro-ros-agent serial --dev /dev/ttyACM0 baudrate=115200
```

## 远端控制

### 上位机控制

```bash
git clone -b GUI https://github.com/tianrking/MicroROS_RP2040.git ~/MicroROS_RP2040_GUI
cd ~/MicroROS_RP2040_GUI 
pip install -r requirements.txt
source /opt/ros/humble/setup/bash
python3 main.py
```

### 快速测试

#### 命令行

- 查看 Topic

```bash
ros2 topic list
```

- 调节转速

```bash
ros2 topic pub /speed_change std_msgs/Int32 "data: 28" -t 1
```

- 获取转速

```bash
ros2 topic echo /pico_publisher_encoder
```

#### rclpy

1. 编译

```bash
cd ~/MicroROS_RP2040/PC_Control/
colcon build
source install/setup.bash
```

2. 运行

```bash
ros2 run motor_control_rclpy change_speed
ros2 run motor_control_rclpy get_speed
```

## Thanks

- https://github.com/micro-ROS/micro-ROS-demos
- https://github.com/raspberrypi/pico-examples

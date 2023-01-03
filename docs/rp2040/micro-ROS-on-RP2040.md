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

### 关键部分解析

#### CMakeList

这里利用 CMakeLists 自动检索并关联相关的头文件 利用 quadrature_encoder/quadrature_encoder.pio 快速实现pico对编码器数值解析，以便获得相对转速

```cpp title="CMakeLists.txt"
include($ENV{PICO_SDK_PATH}/external/pico_sdk_import.cmake)

add_executable(pico_micro_ros_motor_control
    pico_micro_ros_motor_control.c
    $ENV{micro_ROS_SDK_PATH}/pico_uart_transport.c
)

pico_generate_pio_header(pico_micro_ros_motor_control $ENV{pico_examples_PATH}/pio/quadrature_encoder/quadrature_encoder.pio)
```

这里我们添加了 micro ros 开发包

```cpp title="CMakeLists.txt"
link_directories($ENV{micro_ROS_SDK_PATH}/libmicroros)
```

如果我们需要使用 FreeRTOS 需要添加目录链接 并确依赖安装 FreeRTOS SMP 版本，同时完成环境变量的设定

```cpp title="CMakeLists.txt"
target_link_libraries(pico_micro_ros_motor_control
    pico_multicore
    FreeRTOS-Kernel 
    FreeRTOS-Kernel-Heap4
)
```

配置是否使用 usb(数据线串口) uart(GPIO串口)

```cpp title="CMakeLists.txt"
# Configure Pico
pico_enable_stdio_usb(pico_micro_ros_motor_control 1)
pico_enable_stdio_uart(pico_micro_ros_motor_control 0)
add_compile_definitions(PICO_UART_ENABLE_CRLF_SUPPORT=0)
add_compile_definitions(PICO_STDIO_ENABLE_CRLF_SUPPORT=0)
add_compile_definitions(PICO_STDIO_DEFAULT_CRLF=0)
```

生成 UF2 固件 后续我们可以直接复制粘贴到 pico 中 (烧录模式)

```cpp title="CMakeLists.txt"
pico_add_extra_outputs(pico_micro_ros_motor_control)
```

#### 代码部分

- 初始化节点

```bash
rcl_node_t node;
rclc_support_t support;
rcl_allocator_t allocator;
rclc_support_init(&support, 0, NULL, &allocator);
rclc_node_init_default(&node, "pico_node", "", &support);
```

- 话题发布

```c
rclc_publisher_init_default(
        &publisher,
        &node,
        ROSIDL_GET_MSG_TYPE_SUPPORT(std_msgs, msg, Int32),
        "pico_publisher");

msg_publisher_encoder.data = 123 ;  // 比如我们要发布123 在我们的代码中 利用定时器做回调函数 定时发送 编码器获取到的转速数值
rcl_ret_t ret = rcl_publish(&publisher, &msg, NULL);
ret = rcl_publish(&publisher_encoder, &msg_publisher_encoder, NULL); 
```

- 话题订阅

在这里我们每次接收到数据，都会传到回调函数中，当我们发送转速，PWM 随之改变， 通过回调函数实现转速控制

```c 
// 初始化
rclc_subscription_init_default(
      &subscriber_speed_change,
      &node,
      ROSIDL_GET_MSG_TYPE_SUPPORT(std_msgs, msg, Int32),
      "speed_change");

// 回调函数
float speed_value;
void subscription_callback_speed_change(const void *msgin_diy)
{
    // Cast received message to used type
    const std_msgs__msg__Int32 *msg_diy = (const std_msgs__msg__Int32 *)msgin_diy;
    speed_value = (float)msg_diy->data / 100 ;
    // pwm_set_chan_level(slice_num, PWM_CHAN_A, _value * 62500);

}
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

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

```bash
```

## Remote Control

### RCLCPP

```bash
mkdir ~/PC_Control
cd ~/PC_Control
ros2 pkg create motor_control_rclcpp --build-type ament_cmake --dependencies rclcpp
cd ~/PC_Control/src
touch ~/PC_Control/src/get_speed.cpp
```

```cpp title="get_speed.cpp"
#include "rclcpp/rclcpp.hpp"

class TopicPublisher01 : public rclcpp::Node
{
public:
    // 构造函数,有一个参数为节点名称
    TopicPublisher01(std::string name) : Node(name)
    {
        RCLCPP_INFO(this->get_logger(), "%s.", name.c_str());
    }

private:
    // 声明节点
};

int main(int argc, char **argv)
{
    rclcpp::init(argc, argv);
    /*产生一个的节点*/
    auto node = std::make_shared<TopicPublisher01>("topic_publisher_01");
    /* 运行节点，并检测退出信号*/
    rclcpp::spin(node);
    rclcpp::shutdown();
    return 0;
}

```

```cpp title='Add to CMakeList.txt'
add_executable(get_speed src/get_speed.cpp)

// After find_package

ament_target_dependencies(get_speed rclcpp)
```

```bash
cd ~/PC_Control/
colcon build --packages-select motor_control_rclcpp
ros2 run motor_control_rclcpp get_speed
ros2 run motor_control_rclcpp change_speed
```


### RCLCPP

```bash
cd ~/PC_Control/src
ros2 pkg create example_topic_rclpy  --build-type ament_python --dependencies rclpy
```

```bash
cd example_topic_rclpy/example_topic_rclpy
touch topic_subscribe_02.py
touch topic_publisher_02.py
```

```bash
cd ~/PC_Control/
colcon build
```

https://github.com/micro-ROS/micro-ROS-demos

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
git clone --recurse-submodules https://github.com/raspberrypi/pico-sdk.git ~/pico-sdk
export PICO_SDK_PATH=~/pico-sdk
git clone https://github.com/tianrking/1_ros ~/1_ros
```

```bash
sudo apt install cmake g++ gcc-arm-none-eabi doxygen libnewlib-arm-none-eabi git python3 -y
```

```bash
cd ~/1_ros
mkdir build
cd build
cmake ..
make
```

```bash
cp pico_micro_ros_example.uf2 /media/$USER/RPI-RP2
```

```bash
docker run -it --rm -v /dev:/dev --privileged --net=host microros/micro-ros-agent:humble serial --dev /dev/ttyACM0 -b 115200
```

## Remote Control

### RCLCPP (Unfinish)

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
cd ~/1_ros/PC_Control/
colcon build --packages-select motor_control_rclcpp
ros2 run motor_control_rclcpp get_speed
ros2 run motor_control_rclcpp change_speed
```

### RCLPY

1. Creat Project

  ```bash
  cd ~/1_ros/PC_Control/src
  ros2 pkg create motor_control_rclpy  --build-type ament_python --dependencies rclpy
  ```

2. Write Code

  ```bash
  cd ~/1_ros/PC_Control/src/motor_control_rclpy/motor_control_rclpy
  wget https://raw.githubusercontent.com/tianrking/1_ros/pico_control_motor/PC_Control/src/motor_control_rclpy/motor_control_rclpy/change_speed.py
  wget https://raw.githubusercontent.com/tianrking/1_ros/pico_control_motor/PC_Control/src/motor_control_rclpy/motor_control_rclpy/get_speed.py
  ```

  Modify package.xml like [this](https://github.com/tianrking/1_ros/blob/pico_control_motor/PC_Control/src/motor_control_rclpy/package.xml)

  ```xml
  <test_depend>ament_copyright</test_depend>
  <test_depend>ament_flake8</test_depend>
  <test_depend>ament_pep257</test_depend>
  <test_depend>python3-pytest</test_depend>
  ```

  Modify setup.cfg like [this](https://github.com/tianrking/1_ros/blob/pico_control_motor/PC_Control/src/motor_control_rclpy/setup.cfg)

  ```bash
  [develop]
  script_dir=$base/lib/motor_control_rclpy
  [install]
  install_scripts=$base/lib/motor_control_rclpy
  ```

  Modify setup.py like [this](https://github.com/tianrking/1_ros/blob/pico_control_motor/PC_Control/src/motor_control_rclpy/setup.py)

  ```py
  entry_points={
          'console_scripts': [
              "get_speed = motor_control_rclpy.get_speed:main",
              "change_speed = motor_control_rclpy.change_speed:main"      
          ],
      },
  ```

3. Build

  ```bash
  cd ~/1_ros/PC_Control/
  colcon build
  source install/setup.bash
  ```

4. Run

  ```bash
  ros2 run motor_control_rclpy change_speed
  ros2 run motor_control_rclpy get_speed
  ```

## Thanks

- https://github.com/micro-ROS/micro-ROS-demos
- https://github.com/raspberrypi/pico-examples

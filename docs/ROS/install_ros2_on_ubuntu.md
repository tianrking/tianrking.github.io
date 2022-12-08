---
description: ROS2 humble
title: ROS2 humble 
tags:
  - ros2
  - ubuntu
keywords:
  - ros2
  - ubuntu
image: https://github.com/tianrking.png
last_update:
  date: 12/6/2022
  author: w0x7ce
---

```bash
locale  # check for UTF-8

sudo apt update && sudo apt install locales
sudo locale-gen en_US en_US.UTF-8
sudo update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
export LANG=en_US.UTF-8

locale  # verify settings
```


```bash
sudo apt install software-properties-common
sudo add-apt-repository universe
```

```bash
sudo apt update && sudo apt install curl
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key -o /usr/share/keyrings/ros-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(. /etc/os-release && echo $UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null
```

```bash
sudo apt update
sudo apt upgrade
```

```bash
sudo apt install ros-humble-desktop

sudo apt install ros-humble-ros-base

sudo apt install ros-dev-tools
```

## rqt

```bash
sudo apt install ros-humble-rqt*
```

```bash 
ros-humble-rqt-action                ros-humble-rqt-image-overlay-dbgsym  ros-humble-rqt-robot-dashboard
ros-humble-rqt-bag                   ros-humble-rqt-image-overlay-layer   ros-humble-rqt-robot-monitor
ros-humble-rqt-bag-plugins           ros-humble-rqt-image-view            ros-humble-rqt-robot-steering
ros-humble-rqt-common-plugins        ros-humble-rqt-image-view-dbgsym     ros-humble-rqt-runtime-monitor
ros-humble-rqt-console               ros-humble-rqt-moveit                ros-humble-rqt-service-caller
ros-humble-rqt-graph                 ros-humble-rqt-msg                   ros-humble-rqt-shell
ros-humble-rqt-gui                   ros-humble-rqt-plot                  ros-humble-rqt-srv
ros-humble-rqt-gui-cpp               ros-humble-rqt-publisher             ros-humble-rqt-top
ros-humble-rqt-gui-cpp-dbgsym        ros-humble-rqt-py-common             ros-humble-rqt-topic
ros-humble-rqt-gui-py                ros-humble-rqt-py-console
ros-humble-rqt-image-overlay         ros-humble-rqt-reconfigure
```

```bash
rqt

ros2 run rqt_py_console rqt_py_console

ros2 pkg list
```

plugin code dir

```bash
/opt/ros/humble/lib/python3.10/site-packages
```

bin dir

```bash
/opt/ros/humble/bin
```
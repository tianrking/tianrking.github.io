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
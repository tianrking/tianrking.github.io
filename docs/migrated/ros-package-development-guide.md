---
legacy: true
id: ros-package-development-guide
title: ROS 软件包开发完全指南
sidebar_label: ROS 软件包开发
description: 详细介绍 ROS 软件包的创建、配置、构建和管理，包括 catkin 工作空间、依赖关系、CMakeLists.txt 和 package.xml 的最佳实践
date: 2021-09-13T20:15:37+08:00
tags: [ROS, 机器人, 自动化, 软件包开发, Catkin]
authors: [w0x7ce]
---

# ROS 软件包开发完全指南

ROS（Robot Operating System）软件包是 ROS 系统的核心组成部分。本指南将详细介绍如何创建、管理和维护 ROS 软件包。

## 创建 ROS 软件包

### 什么是 Catkin 软件包

Catkin 是 ROS 的官方构建系统，基于 CMake。一个标准的 Catkin 软件包必须包含：

- **package.xml**：软件包元数据文件
- **CMakeLists.txt**：构建配置文件
- **独立的目录结构**：每个包必须有自己独立的目录

### 目录结构

典型的 ROS 工作空间结构：

```
workspace_folder/                    # 工作空间根目录
├── src/                            # 源代码空间
│   ├── CMakeLists.txt             # 顶层 CMake 文件
│   ├── package_1/                 # 软件包 1
│   │   ├── CMakeLists.txt
│   │   ├── package.xml
│   │   ├── include/package_1/
│   │   ├── src/
│   │   ├── launch/
│   │   ├── urdf/
│   │   ├── meshes/
│   │   ├── worlds/
│   │   └── config/
│   └── package_n/                 # 软件包 n
│       ├── CMakeLists.txt
│       └── package.xml
├── devel/                          # 开发空间（构建后生成）
└── build/                          # 构建空间（构建后生成）
```

## 创建 Catkin 软件包

### 方法 1：使用 catkin_create_pkg

```bash
# 切换到工作空间的 src 目录
cd ~/catkin_ws/src

# 创建新软件包
catkin_create_pkg beginner_tutorials std_msgs rospy roscpp

# 参数说明：
# beginner_tutorials: 包名
# std_msgs: 依赖包 1
# rospy: 依赖包 2
# roscpp: 依赖包 3
```

### 方法 2：手动创建

```bash
# 1. 创建包目录
mkdir my_robot_pkg
cd my_robot_pkg

# 2. 创建必要的目录
mkdir include/my_robot_pkg
mkdir src
mkdir launch
mkdir config
mkdir urdf
mkdir meshes

# 3. 手动创建 package.xml 和 CMakeLists.txt
```

### 创建软件包示例

```bash
# 创建一个完整的机器人控制软件包
catkin_create_pkg robot_controller \
    roscpp \
    rospy \
    std_msgs \
    geometry_msgs \
    nav_msgs \
    sensor_msgs \
    tf2 \
    tf2_ros \
    control_msgs \
    actionlib \
    dynamic_reconfigure \
    pluginlib \
    nodelet

# 创建一个感知软件包
catkin_create_pkg robot_perception \
    roscpp \
    rospy \
    std_msgs \
    sensor_msgs \
    geometry_msgs \
    cv_bridge \
    image_transport \
    pcl_ros \
    pcl_conversions \
    tf2 \
    tf2_ros \
    dynamic_reconfigure \
    laser_geometry \
    laser__filters
```

## 配置 package.xml

package.xml 文件定义软件包的元数据和依赖关系。

### 完整的 package.xml 示例

```xml
<?xml version="1.0"?>
<package format="2">
  <name>robot_controller</name>
  <version>1.0.0</version>
  <description>Robot motion controller package</description>

  <!-- 维护者信息 -->
  <maintainer email="developer@example.com">Developer Name</maintainer>

  <!-- 许可证 -->
  <license>BSD</license>

  <!-- 项目链接 -->
  <url type="website">http://example.com</url>
  <url type="bugtracker">https://github.com/user/robot_controller/issues</url>

  <!-- 作者信息 -->
  <author email="author@example.com">Author Name</author>

  <!-- 构建工具依赖 -->
  <buildtool_depend>catkin</buildtool_depend>

  <!-- 构建时依赖 -->
  <build_depend>roscpp</build_depend>
  <build_depend>rospy</build_depend>
  <build_depend>std_msgs</build_depend>
  <build_depend>geometry_msgs</build_depend>
  <build_depend>nav_msgs</build_depend>
  <build_depend>sensor_msgs</build_depend>
  <build_depend>tf2</build_depend>
  <build_depend>tf2_ros</build_depend>
  <build_depend>control_msgs</build_depend>
  <build_depend>actionlib</build_depend>
  <build_depend>dynamic_reconfigure</build_depend>
  <build_depend>pluginlib</build_depend>
  <build_depend>nodelet</build_depend>
  <build_depend>message_generation</build_depend>

  <!-- 运行时依赖 -->
  <exec_depend>roscpp</exec_depend>
  <exec_depend>rospy</exec_depend>
  <exec_depend>std_msgs</exec_depend>
  <exec_depend>geometry_msgs</exec_depend>
  <exec_depend>nav_msgs</exec_depend>
  <exec_depend>sensor_msgs</exec_depend>
  <exec_depend>tf2</exec_depend>
  <exec_depend>tf2_ros</exec_depend>
  <exec_depend>control_msgs</exec_depend>
  <exec_depend>actionlib</exec_depend>
  <exec_depend>dynamic_reconfigure</exec_depend>
  <exec_depend>pluginlib</exec_depend>
  <exec_depend>nodelet</exec_depend>
  <exec_depend>message_runtime</exec_depend>

  <!-- 测试依赖 -->
  <test_depend>rostest</test_depend>
  <test_depend>rostest</test_depend>
  <test_depend>gtest</test_depend>
  <test_depend>python-catkin-lint</test_depend>

  <!-- 导出标签 -->
  <export>
    <!-- 其他包可以使用的功能 -->
    <nodelet plugin="${prefix}/plugins.xml" />
  </export>
</package>
```

### 依赖类型说明

| 依赖类型 | 用途 | 示例 |
|----------|------|------|
| **build_depend** | 编译时依赖 |roscpp, rospy, std_msgs |
| **buildtool_depend** | 构建工具依赖 |catkin |
| **build_export_depend** | 被依赖包的导出 |geometry_msgs |
| **build_import_depend** | 导入依赖 |roscpp |
| **exec_depend** | 运行时依赖 |rospy, std_msgs |
| **test_depend** | 测试时依赖 |gtest, rostest |
| **doc_depend** | 文档生成依赖 |doxygen, graphviz |

## 配置 CMakeLists.txt

CMakeLists.txt 文件定义如何构建软件包。

### 完整的 CMakeLists.txt 示例

```cmake
cmake_minimum_required(VERSION 3.0.2)
project(robot_controller)

## 编译标志
set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

## 编译选项
set(CMAKE_CXX_FLAGS "-Wall -Wextra")
set(CMAKE_CXX_FLAGS_DEBUG "-g -O0")
set(CMAKE_CXX_FLAGS_RELEASE "-O3 -DNDEBUG")

## 查找 Catkin 包和依赖
find_package(catkin REQUIRED COMPONENTS
  roscpp
  rospy
  std_msgs
  geometry_msgs
  nav_msgs
  sensor_msgs
  tf2
  tf2_ros
  control_msgs
  actionlib
  dynamic_reconfigure
  pluginlib
  nodelet
  message_generation
)

## 查找系统依赖
find_package(Boost REQUIRED COMPONENTS system)
find_package(Eigen3 REQUIRED)
find_package(PCL REQUIRED)

## 动态重配置
generate_dynamic_reconfigure_options(
  cfg/Controller.cfg
)

## 消息和服务
add_message_files(
  FILES
  RobotStatus.msg
  ControllerCommand.msg
)

add_service_files(
  FILES
  ResetController.srv
)

## 生成消息、服务和动作
generate_messages(
  DEPENDENCIES
  std_msgs
  geometry_msgs
)

## 动作文件
add_action_files(
  DIRECTORY action
  FILES
  MoveTo.action
)

## 生成动作消息和服务
generate_actionlib_msgs(
  DEPENDENCIES
  std_msgs
  geometry_msgs
)

## 包含目录
include_directories(
  include
  ${catkin_INCLUDE_DIRS}
  ${Boost_INCLUDE_DIRS}
  ${EIGEN3_INCLUDE_DIRS}
  ${PCL_INCLUDE_DIRS}
)

## 库
catkin_package(
  INCLUDE_DIRS include
  LIBRARIES robot_controller
  CATKIN_DEPENDS
    roscpp
    rospy
    std_msgs
    geometry_msgs
    nav_msgs
    sensor_msgs
    tf2
    tf2_ros
    control_msgs
    actionlib
    dynamic_reconfigure
    pluginlib
    nodelet
    message_runtime
  DEPENDS
    system_lib
)

## 源文件
set(SOURCES
  src/controller_node.cpp
  src/motion_planner.cpp
  src/robot_interface.cpp
)

## 头文件
set(HEADERS
  include/robot_controller/controller.h
  include/robot_controller/motion_planner.h
  include/robot_controller/robot_interface.h
)

## 共享库
add_library(${PROJECT_NAME} ${SOURCES} ${HEADERS})
target_link_libraries(${PROJECT_NAME}
  ${catkin_LIBRARIES}
  ${Boost_LIBRARIES}
  ${PCL_LIBRARIES}
)

## 可执行文件
add_executable(controller_node
  src/controller_node.cpp
)

target_link_libraries(controller_node
  ${catkin_LIBRARIES}
  ${PROJECT_NAME}
)

add_dependencies(controller_node
  ${PROJECT_NAME}_generate_messages_cpp
  ${PROJECT_NAME}_generate_messages_py
  ${PROJECT_NAME}_generate_actionlib_msgs_cpp
  ${PROJECT_NAME}_generate_actionlib_msgs_py
  dynamic_reconfigure
)
```

### CMakeLists.txt 关键部分详解

#### 1. 基本设置

```cmake
# 最低 CMake 版本
cmake_minimum_required(VERSION 3.0.2)

# 项目名称
project(robot_controller)

# C++ 标准
set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
```

#### 2. 查找依赖包

```cmake
find_package(catkin REQUIRED COMPONENTS
  roscpp
  rospy
  std_msgs
  # 其他依赖包
)

# 查找系统库
find_package(Boost REQUIRED COMPONENTS system)
find_package(PCL 1.8 REQUIRED)
```

#### 3. 包含目录

```cmake
include_directories(
  include
  ${catkin_INCLUDE_DIRS}
  ${Boost_INCLUDE_DIRS}
)
```

#### 4. 构建库

```cmake
add_library(${PROJECT_NAME} ${SOURCES})
target_link_libraries(${PROJECT_NAME} ${catkin_LIBRARIES})
```

#### 5. 构建可执行文件

```cmake
add_executable(node_name src/file.cpp)
target_link_libraries(node_name ${catkin_LIBRARIES})
```

#### 6. 生成消息

```cmake
add_message_files(
  FILES
  Message1.msg
  Message2.msg
)

generate_messages(
  DEPENDENCIES
  std_msgs
)
```

## 构建工作空间

### 编译工作空间

```bash
# 进入工作空间根目录
cd ~/catkin_ws

# 清理之前的构建
catkin clean

# 编译
catkin_make

# 只编译特定包
catkin_make -DCATKIN_WHITELIST_PACKAGES="package_name"

# 编译特定目标
catkin_make run_tests
```

### 设置环境

```bash
# 添加到 ~/.bashrc
echo "source ~/catkin_ws/devel/setup.bash" >> ~/.bashrc

# 或者手动 source
source ~/catkin_ws/devel/setup.bash

# 检查环境变量
echo $ROS_PACKAGE_PATH
```

## 依赖关系管理

### 查看依赖关系

```bash
# 查看一级依赖
rospack depends1 package_name

# 查看所有依赖（递归）
rospack depends package_name

# 查看包的位置
rospack find package_name

# 查看包的内容
rospack profile
```

### 示例依赖查询

```bash
# 查看 beginner_tutorials 的依赖
$ rospack depends1 beginner_tutorials
std_msgs
rospy
roscpp

# 查看间接依赖
$ rospack depends beginner_tutorials
cpp_common
rostime
roscpp_traits
roscpp_serialization
catkin
# ... 更多依赖
```

### 依赖关系最佳实践

1. **最小化依赖**：只添加必需的依赖包
2. **使用正确的依赖类型**：
   - `build_depend`：编译时需要
   - `exec_depend`：运行时需要
   - `test_depend`：测试时需要
3. **避免循环依赖**：包之间不应相互依赖

## 常见软件包类型

### 1. 库包

```bash
catkin_create_pkg robot_utils roscpp rospy std_msgs
```

### 2. 节点包

```bash
catkin_create_pkg robot_driver \
    roscpp \
    rospy \
    std_msgs \
    sensor_msgs \
    hardware_interface \
    controller_manager
```

### 3. 消息包

```bash
catkin_create_pkg robot_messages \
    std_msgs \
    geometry_msgs
```

### 4. 模拟包

```bash
catkin_create_pkg robot_gazebo \
    roscpp \
    rospy \
    std_msgs \
    gazebo_ros \
    gazebo_msgs \
    gazebo_plugins \
    urdf \
    xacro
```

## 高级功能

### 插件系统

#### 1. 定义插件基类

```cpp
// include/robot_controller/controller_interface.h
#include <pluginlib/class_list_macros.h>

class ControllerInterface {
public:
  virtual ~ControllerInterface() {}
  virtual bool initialize() = 0;
  virtual void update() = 0;
};

PLUGINLIB_EXPORT_CLASS(ControllerInterface, robot_controller::ControllerInterface)
```

#### 2. 实现插件

```cpp
// src/simple_controller.cpp
#include "robot_controller/controller_interface.h"

class SimpleController : public ControllerInterface {
public:
  bool initialize() override {
    // 初始化代码
    return true;
  }

  void update() override {
    // 更新代码
  }
};

PLUGINLIB_EXPORT_CLASS(SimpleController, ControllerInterface)
```

#### 3. 注册插件

```xml
<!-- plugins.xml -->
<library path="lib/librobot_controller">
  <class name="robot_controller/SimpleController"
         type="SimpleController"
         base_class_type="ControllerInterface" />
</library>
```

#### 4. 在 package.xml 中导出

```xml
<export>
  <robot_controller plugin="${prefix}/plugins.xml" />
</export>
```

### Nodelet

Nodelet 允许在同一进程中运行多个节点，提高性能。

#### 1. 创建 Nodelet

```cpp
// src/image_processor_nodelet.cpp
#include <nodelet/nodelet.h>
#include <pluginlib/class_list_macros.h>
#include <sensor_msgs/Image.h>
#include <cv_bridge/cv_bridge.h>

class ImageProcessorNodelet : public nodelet::Nodelet {
public:
  void onInit() override {
    NODELET_DEBUG("Initializing nodelet...");
    // 初始化代码
  }
};

PLUGINLIB_EXPORT_CLASS(ImageProcessorNodelet, nodelet::Nodelet)
```

#### 2. 在 package.xml 中声明

```xml
<export>
  <nodelet plugin="${prefix}/nodelets.xml" />
</export>
```

### 动态重配置

#### 1. 定义配置文件

```yaml
# cfg/Controller.cfg
#!/usr/bin/env python
PACKAGE = "robot_controller"

from dynamic_reconfigure.parameter_generator_catkin import *

gen = ParameterGenerator()

gen.add("max_velocity", double_t, 0, "Maximum velocity", 1.0, 0.1, 5.0)
gen.add("min_velocity", double_t, 0, "Minimum velocity", 0.1, 0.0, 1.0)
gen.add("Kp", double_t, 0, "Proportional gain", 1.0, 0.0, 10.0)
gen.add("Ki", double_t, 0, "Integral gain", 0.1, 0.0, 5.0)
gen.add("Kd", double_t, 0, "Derivative gain", 0.05, 0.0, 2.0)
gen.add("enable_controller", bool_t, 0, "Enable controller", True)

exit(gen.generate(PACKAGE, "robot_controller", "Controller"))
```

#### 2. 使用动态重配置

```cpp
#include <dynamic_reconfigure/server.h>
#include <robot_controller/ControllerConfig.h>

void reconfigureCallback(robot_controller::ControllerConfig &config, uint32_t level) {
  NODELET_INFO("Reconfiguring...");
  max_velocity_ = config.max_velocity;
  Kp_ = config.Kp;
  Ki_ = config.Ki;
  Kd_ = config.Kd;
}

void onInit() {
  dynamic_reconfigure::Server<robot_controller::ControllerConfig>::CallbackType f;
  f = boost::bind(&reconfigureCallback, _1, _2);
  server_.setCallback(f);
}
```

## 测试

### 单元测试

#### 1. 创建测试

```cpp
// test/test_controller.cpp
#include <gtest/gtest.h>
#include "robot_controller/controller.h"

TEST(ControllerTest, Initialization) {
  Controller controller;
  EXPECT_TRUE(controller.initialize());
}

int main(int argc, char **argv) {
  testing::InitGoogleTest(&argc, argv);
  return RUN_ALL_TESTS();
}
```

#### 2. 在 CMakeLists.txt 中添加测试

```cmake
if(CATKIN_ENABLE_TESTING)
  find_package(rostest REQUIRED)
  find_package(gtest)

  catkin_add_gtest(controller_test
    test/test_controller.cpp
  )
  if(TARGET controller_test)
    target_link_libraries(controller_test
      ${catkin_LIBRARIES}
    )
  endif()
endif()
```

### 集成测试

```xml
<!-- test/test_controller.launch -->
<launch>
  <node name="controller"
        pkg="robot_controller"
        type="controller_node"
        output="screen" />

  <test test-name="controller_test"
        pkg="robot_controller"
        type="controller_test" />
</launch>
```

```bash
# 运行测试
catkin_make run_tests
rostest robot_controller controller_test.launch
```

## 发布软件包

### 1. 版本管理

```xml
<version>1.0.0</version>
```

版本格式：`主版本.次版本.修订版本`

- **主版本**：不兼容的 API 变更
- **次版本**：向后兼容的功能添加
- **修订版本**：向后兼容的 bug 修复

### 2. 准备发布

```bash
# 检查包
rosdep check --from-paths src --ignore-src

# 安装依赖
rosdep install --from-paths src --ignore-src

# 清理构建
catkin clean

# 构建
catkin_make install

# 创建发布包
bloom-generate rosdebian
```

### 3. 社区包索引

在 GitHub 上发布并添加到 ROS 索引：
1. 创建公共仓库
2. 添加 README.md 和 LICENSE
3. 提交到 ROS 索引

## 最佳实践

### 1. 包命名

```bash
# ✅ 推荐
robot_controller
navigation_planner
perception_pipeline
motion_execution

# ❌ 不推荐
RobotController
nav_planner
image_processing
```

### 2. 目录组织

```
package_name/
├── CMakeLists.txt
├── package.xml
├── include/package_name/
│   ├── header1.h
│   └── header2.h
├── src/
│   ├── node1.cpp
│   └── node2.cpp
├── launch/
│   ├── demo.launch
│   └── test.launch
├── config/
│   ├── params.yaml
│   └── controller.yaml
├── urdf/
│   └── robot.urdf
├── meshes/
│   └── link1.stl
├── worlds/
│   └── environment.world
├── scripts/
│   ├── script1.py
│   └── script2.py
├── test/
│   ├── test_node.cpp
│   └── launch/test.launch
└── msg/
    ├── CustomMessage.msg
    └── AnotherMessage.msg
```

### 3. 代码规范

- 使用一致的命名约定
- 添加注释和文档字符串
- 使用 ROS 编码规范
- 添加单元测试

### 4. 性能优化

- 使用 `roscpp` 的优化编译标志
- 避免不必要的内存分配
- 使用智能指针
- 优化消息传递

### 5. 调试技巧

```bash
# 查看节点计算图
rqt_graph

# 查看节点信息
rosnode info /node_name

# 回放数据
rosbag play

# 可视化数据
rviz
rqt_plot
rqt_console
```

## 故障排除

### 常见问题

1. **找不到依赖包**
   ```bash
   rosdep install --from-paths src --ignore-src
   ```

2. **构建失败**
   ```bash
   catkin clean
   catkin_make
   ```

3. **包未找到**
   ```bash
   source ~/catkin_ws/devel/setup.bash
   echo $ROS_PACKAGE_PATH
   ```

4. **CMake 错误**
   - 检查 CMakeLists.txt 语法
   - 确认所有依赖已安装
   - 清理构建缓存

### 调试命令

```bash
# 检查环境
env | grep ROS

# 查找包
rospack find package_name

# 列出包内容
rospack profile
roswtf

# 检查依赖
rosdep check --from-paths src --ignore-src
```

## 总结

ROS 软件包开发是机器人应用开发的核心技能。通过本指南，您已经学习了：

- **包结构**：了解标准目录结构
- **配置文件**：掌握 package.xml 和 CMakeLists.txt
- **依赖管理**：正确声明和使用依赖
- **构建系统**：使用 catkin 编译
- **高级功能**：插件、Nodelet、动态重配置
- **测试**：单元测试和集成测试
- **最佳实践**：命名、编码、性能优化

持续实践这些概念，您将成为 ROS 开发专家！

## 相关资源

- [ROS Wiki](http://wiki.ros.org/)
- [Catkin 文档](http://wiki.ros.org/catkin)
- [ROS 包开发教程](http://wiki.ros.org/ROS/Tutorials)
- [ROS 编码标准](http://wiki.ros.org/ROS/Standards)

祝您在 ROS 开发之路上取得成功！

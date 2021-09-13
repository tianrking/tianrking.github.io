---
title: "ROS学习(一)"
date: 2021-09-13T20:08:40+08:00
draft: false

tags: ["ROS","自动化","机器人"]
categories: ["机器人操作系统"]
author: "w0x7ce"
---

# ROS文件系统导览
Description: 本教程介绍ROS文件系统的概念，包括如何使用roscd、rosls和rospack命令行工具。

Tutorial Level: BEGINNER

Next Tutorial: 创建ROS软件包


## 预备工作
本教程中我们将会用到ros-tutorials程序包。如果你之前安装的ROS不是完整桌面版（Desktop-Full），请先：
```
$ sudo apt-get install ros-<distro>-ros-tutorials
```
将<distro>替换成你安装的ROS发行版简称（比如kinetic或noetic等）。

文件系统概念简介
软件包（Packages）：包是ROS代码的软件组织单元，每个软件包都可以包含程序库、可执行文件、脚本或其他构件。

Manifests (package.xml)： 清单（Manifest）是对软件包的描述。它用于定义软件包之间的依赖关系，并记录有关软件包的元信息，如版本、维护者、许可证等。


Show    note about stacks

文件系统工具
程序代码散落在许多ROS包中。使用Linux内置命令行工具（如ls和cd）来进行查找和导航可能非常繁琐，因此ROS提供了专门的命令工具来简化这些操作。

## 使用rospack
rospack允许你获取软件包的有关信息。在本教程中，我们只涉及到find参数选项，该选项可以返回软件包的所在路径。

用法：
```
$ rospack find [package_name]
```
比如：
```
$ rospack find roscpp
```
将会输出：
```
YOUR_INSTALL_PATH/share/roscpp
```
如果你是在Ubuntu操作系统上通过apt安装的ROS，你看到的应该是：
```
/opt/ros/<distro>/share/roscpp
```
## 使用roscd
roscd是rosbash命令集的一部分，它允许你直接切换目录（cd）到某个软件包或者软件包集当中。

用法：
```
$ roscd [locationname[/subdir]]
```
要想验证是否能切换到roscpp包的位置，请运行以下示例：
```
$ roscd roscpp
```
现在让我们使用Unix命令pwd输出工作目录：
```
$ pwd
```
你应该会看到：
```
YOUR_INSTALL_PATH/share/roscpp
```
你可以看到YOUR_INSTALL_PATH/share/roscpp和之前使用rospack find输出的路径是一样的。

注意，就像ROS中的其它工具一样，roscd只能切换到那些路径已经包含在ROS_PACKAGE_PATH环境变量中的软件包。要查看 ROS_PACKAGE_PATH中包含的路径，可以输入：
```
$ echo $ROS_PACKAGE_PATH
```
你的ROS_PACKAGE_PATH环境变量应该包含那些保存有ROS软件包的路径，并且每个路径之间用冒号（:）分隔开来。一个典型的ROS_PACKAGE_PATH环境变量如下：
```
/opt/ros/<distro>/base/install/share
```
跟其他环境变量路径类似，你可以在ROS_PACKAGE_PATH中添加更多的目录，每条路径使用冒号（:）分隔。

子目录
roscd也可以切换到一个软件包或软件包集的子目录中。

执行：
```
$ roscd roscpp/cmake
$ pwd
```
应该会看到：
```
YOUR_INSTALL_PATH/share/roscpp/cmake
```
## roscd log
roscd log将带您进入存储ROS日志文件的目录。需要注意的是，如果你没有执行过任何ROS程序，系统会报错说该目录不存在。

如果你已经运行过ROS程序，那么可以尝试：

$ roscd log
## 使用 rosls
rosls 是rosbash命令集的一部分，它允许你直接按软件包的名称执行 ls 命令（而不必输入绝对路径）。

用法：
```
$ rosls [locationname[/subdir]]
```
示例：
```
$ rosls roscpp_tutorials
```
应输出：
```
cmake launch package.xml  srv
```
Tab补全
总是输入完整的软件包名称感觉比较繁琐。在之前的例子中，roscpp tutorials是个相当长的名称。幸运的是，一些ROS工具支持TAB补全的功能。

试着开始输入：
```
$ roscd roscpp_tut<<<按TAB键>>>
```
当按TAB键后，命令行应该会自动补充剩余部分：
```
$ roscd roscpp_tutorials/
```
这是因为roscpp_tutorials是目前唯一一个名称以roscpp_tut开头的ROS软件包。

现在试着输入：
```
$ roscd tur<<<按TAB键>>>
```
当按TAB键后，命令应该会尽可能地自动补充完整：
```
$ roscd turtle
```
然而，在这种情况下有许多软件包都以turtle开头。当再次按TAB键后会列出所有以turtle开头的ROS软件包：
turtle_actionlib/  turtlesim/         turtle_tf/
这时在命令行中你仍然只输入了：
```
$ roscd turtle
```
现在在turtle后面输入s然后按TAB键：
```
$ roscd turtles<<<按TAB键>>>
```
因为只有一个软件包的名称以turtles开头，所以你应该会看到：
```
$ roscd turtlesim/
```
如果要查看当前安装的所有软件包的列表，你也可以利用TAB补全：
```
$ rosls <<<双击TAB键>>>
```
---
title: "ROS学习(二)"
date: 2021-09-13T20:15:37+08:00
draft: false

tags: ["ROS","自动化","机器人"]
categories: ["机器人操作系统"]
author: "w0x7ce"

---

# 创建ROS软件包
Description: 本教程介绍如何使用roscreate-pkg或catkin创建新的ROS软件包，并使用rospack列出软件包的依赖关系。

Tutorial Level: BEGINNER

Next Tutorial: 编译ROS软件包


## 一个catkin软件包由什么组成?
一个包要想称为catkin软件包，必须符合以下要求：

这个包必须有一个符合catkin规范的package.xml文件

这个package.xml文件提供有关该软件包的元信息

这个包必须有一个catkin版本的CMakeLists.txt文件

如果它是个Catkin元包的话，则需要有一个CMakeList.txt文件的相关样板

每个包必须有自己的目录
这意味着在同一个目录下不能有嵌套的或者多个软件包存在
最简单的软件包看起来就像这样：
```
my_package/
  CMakeLists.txt
  package.xml
catkin工作空间中的软件包
开发catkin软件包的推荐方法是使用catkin工作空间，但是你也可以单独开发catkin软件包。一个简单的工作空间如下所示：

workspace_folder/        -- WORKSPACE
  src/                   -- SOURCE SPACE
    CMakeLists.txt       -- 'Toplevel' CMake file, provided by catkin
    package_1/
      CMakeLists.txt     -- CMakeLists.txt file for package_1
      package.xml        -- Package manifest for package_1
    ...
    package_n/
      CMakeLists.txt     -- CMakeLists.txt file for package_n
      package.xml        -- Package manifest for package_n
```     
在继续本教程之前请先按照创建catkin工作空间教程创建一个空白的catkin工作空间。

## 创建catkin软件包
本部分教程将演示如何使用catkin_create_pkg脚本来创建一个新的catkin软件包，以及创建之后都能做些什么。

首先切换到刚才创建的空白catkin工作空间中的源文件空间目录：

```
# You should have created this in the Creating a Workspace Tutorial
$ cd ~/catkin_ws/src
```
现在使用catkin_create_pkg命令创建一个名为beginner_tutorials的新软件包，这个软件包依赖于std_msgs、roscpp和rospy：

```
$ catkin_create_pkg beginner_tutorials std_msgs rospy roscpp
```
这将会创建一个名为beginner_tutorials的文件夹，这个文件夹里面包含一个package.xml文件和一个CMakeLists.txt文件，这两个文件都已经部分填写了你在执行catkin_create_pkg命令时提供的信息。

catkin_create_pkg命令会要求你输入package_name，如有需要还可以在后面添加一些需要依赖的其它软件包：

```
# This is an example, do not try to run this
# catkin_create_pkg <package_name> [depend1] [depend2] [depend3]
```
catkin_create_pkg命令也有更多的高级功能，这些功能在catkin/commands/catkin_create_pkg中有描述。

## 构建一个catkin工作区并生效配置文件
现在你需要在catkin工作区中构建软件包：
```
$ cd ~/catkin_ws
$ catkin_make
```
工作空间构建完成后，在devel子目录下创建了一个与你通常在/opt/ros/$ROSDISTRO_NAME下看到的目录结构类似的结构。

## 要将这个工作空间添加到ROS环境中，你需要source一下生成的配置文件：
```
$ . ~/catkin_ws/devel/setup.bash
```
## 软件包依赖关系

### 一级依赖
之前在使用catkin_create_pkg命令时提供了几个软件包作为依赖关系，现在我们可以使用rospack命令工具来查看这些一级依赖包。

```
$ rospack depends1 beginner_tutorials 
```
```
std_msgs
rospy
roscpp
```
如你所见，rospack列出了在运行catkin_create_pkg命令时作为参数的依赖包，这些依赖关系存储在package.xml文件中。

```
$ roscd beginner_tutorials
$ cat package.xml
```
```
<package>
...
  <buildtool_depend>catkin</buildtool_depend>
  <build_depend>roscpp</build_depend>
  <build_depend>rospy</build_depend>
  <build_depend>std_msgs</build_depend>
...
</package>
```
### 间接依赖
在很多情况下，一个依赖包还会有它自己的依赖关系，比如，rospy就有其它依赖包。

```
$ rospack depends1 rospy
```
```
genpy
roscpp
rosgraph
rosgraph_msgs
roslib
std_msgs
```
一个软件包可以有相当多间接的依赖关系，好在使用rospack可以递归检测出所有嵌套的依赖包。

```
$ rospack depends beginner_tutorials
```
```
cpp_common
rostime
roscpp_traits
roscpp_serialization
catkin
genmsg
genpy
message_runtime
gencpp
geneus
gennodejs
genlisp
message_generation
rosbuild
rosconsole
std_msgs
rosgraph_msgs
xmlrpcpp
roscpp
rosgraph
ros_environment
rospack
roslib
rospy
```
#### 自定义你的软件包
本部分教程将剖析catkin_create_pkg命令生成的每个文件，并详细描述这些文件的组成部分，以及如何自定义这些文件。

#### 自定义package.xml
自动生成的package.xml文件应该在你的新软件包中。现在让我们一起来看看新生成的package.xml文件以及每一个需要你关注的元素。

#### 描述标签
首先关注description标签：



```
<description>The beginner_tutorials package</description>
```
将描述信息修改为任何你喜欢的内容，但是按照惯例，第一句话应该简短一些，因为它包括了软件包的范围。如果用一句话难以描述完全那就需要换行了。

#### 维护者标签
接下来是maintainer标签：


```
   <!-- One maintainer tag required, multiple allowed, one person per tag --> 
   <!-- Example:  -->
   <!-- <maintainer email="jane.doe@example.com">Jane Doe</maintainer> -->
   <maintainer email="user@todo.todo">user</maintainer>
```
这是package.xml中要求填写的一个重要标签，因为它能够让其他人联系到软件包的相关人员。至少需要填写一个维护者，但如果你想的话可以添加多个。除了在标签里面填写维护者的名字外，还应该在标签的email属性中填写电子邮件地址：

```
<maintainer email="you@yourdomain.tld">Your Name</maintainer>
```
#### 许可证标签
再接下来是license标签，同样地也需要：


```
 <!-- One license tag required, multiple allowed, one license per tag -->
 <!-- Commonly used license strings: -->
 <!--   BSD, MIT, Boost Software License, GPLv2, GPLv3, LGPLv2.1, LGPLv3 -->
<license>TODO</license>
```
你应该选择一种许可证并将它填写到这里。一些常见的开源许可协议有BSD、MIT、Boost Software License、GPLv2、GPLv3、LGPLv2.1和LGPLv3。你可以在Open Source Initiative中阅读其中的若干个许可协议的相关信息。对于本教程，我们使用BSD许可证，因为其他核心ROS组件已经在使用它：


```
<license>BSD</license>
```
#### 依赖项标签
接下来的标签描述了软件包的依赖关系，这些依赖项分为build_depend、buildtool_depend、run_depend、test_depend。有关这些标记的详细说明，请参考Catkin Dependencies相关的文档。在之前的操作中，因为我们将roscpp、rospy和std_msgs作为catkin_create_pkg命令的参数，因此依赖关系如下所示：


```
<!-- The *_depend tags are used to specify dependencies -->
<!-- Dependencies can be catkin packages or system dependencies -->
<!-- Examples: -->
<!-- Use build_depend for packages you need at compile time: -->
<!--   <build_depend>genmsg</build_depend> -->
<!-- Use buildtool_depend for build tool packages: -->
<!--   <buildtool_depend>catkin</buildtool_depend> -->
<!-- Use exec_depend for packages you need at runtime: -->
<!--   <exec_depend>python-yaml</exec_depend> -->
<!-- Use test_depend for packages you need only for testing: -->
<!--   <test_depend>gtest</test_depend> -->
<buildtool_depend>catkin</buildtool_depend>
<build_depend>roscpp</build_depend>
<build_depend>rospy</build_depend>
<build_depend>std_msgs</build_depend>
```
除了catkin中默认提供的buildtool_depend，所有我们列出的依赖包都已经被添加到build_depend标签中。在本例中，因为在编译和运行时都需要用到所有指定的依赖包，因此还要将每一个依赖包分别添加到run_depend标签中：


```
<buildtool_depend>catkin</buildtool_depend>
<build_depend>roscpp</build_depend>
<build_depend>rospy</build_depend>
<build_depend>std_msgs</build_depend>
<exec_depend>roscpp</exec_depend>
<exec_depend>rospy</exec_depend>
<exec_depend>std_msgs</exec_depend>
```
最终的package.xml
现在看下面最后去掉了注释和未使用标签后的package.xml文件就显得更加简洁了：


```
<?xml version="1.0"?>
<package format="2">
<name>beginner_tutorials</name>
<version>0.1.0</version>
<description>The beginner_tutorials package</description>
<maintainer email="you@yourdomain.tld">Your Name</maintainer>
<license>BSD</license>
<url type="website">http://wiki.ros.org/beginner_tutorials</url>
<author email="you@yourdomain.tld">Jane Doe</author>
<buildtool_depend>catkin</buildtool_depend>
<build_depend>roscpp</build_depend>
<build_depend>rospy</build_depend>
<build_depend>std_msgs</build_depend>
<exec_depend>roscpp</exec_depend>
<exec_depend>rospy</exec_depend>
<exec_depend>std_msgs</exec_depend>
</package>
```
自定义CMakeLists.txt
到此，这个包含软件包元信息的package.xml文件已经按照需要完成了裁剪整理，现在你可以继续下面的教程了。catkin_create_pkg命令生成的CMakeLists.txt文件将在后续关于构建ROS程序代码的教程中讲述。
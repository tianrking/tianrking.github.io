---
title: "图像基本运算概述"
date: 2020-03-04
tags: ["不知所云"]
category: "图像处理"
description: "按图像处理运算的数学特征分类：点运算、代数运算、逻辑运算、几何运算"
---

:::note[Archived University Note]
This content is from my university archives and may not be reliable or up-to-date.
:::

按图像处理运算的数学特征，图像基本运算可分为：

## 1. 点运算 (Point Operation)

点运算是指对一幅图像中每个像素点的灰度值进行计算的方法。

## 2. 代数运算 (Algebra Operation)

## 3. 逻辑运算 (Logical Operation)

代数运算或逻辑运算是指将两幅或多幅图像通过对应像素之间的加、减、乘、除运算或逻辑与、或、非运算得到输出图像的方法。

## 4. 几何运算 (Geometric Operation)

几何运算就是改变图像中物体对象（像素）之间的空间关系。

从变换性质来分，几何变换可以分为：

- 图像的位置变换（平移、镜像、旋转）
- 形状变换（放大、缩小）
- 图像的复合变换等

## 点运算公式

设输入图像的灰度为f(x,y)，输出图像的灰度为g(x,y)，则点运算可以表示为：

$$G = T[f]$$

**其中T[ ]是对 f 在（x，y）点值的一种数学运算，即点运算是一种像素的逐点运算，是灰度到灰度的映射过程，故称T[ ]为灰度变换函数。**

---
title: "机器学习中的基本计算机视觉概念"
date: 2020-05-07
tags: ["不知所云"]
category: "机器学习"
description: "使用TensorFlow构建简单的神经网络模型进行回归预测"
---

:::note[Archived University Note]
This content is from my university archives and may not be reliable or up-to-date.
:::

参考：https://codelabs.developers.google.com/codelabs/tensorflow-lab1-helloworld/#0

## 代码示例

```python
import tensorflow as tf
import numpy as np
from tensorflow import keras

# 定义模型：单层神经网络
# units=1：1个神经元
# input_shape=[1]：单个数据放入神经元，一个x值
model = tf.keras.Sequential([keras.layers.Dense(units=1, input_shape=[1])])

# 优化函数：sgd（随机梯度下降）
# 损失函数：mean_squared_error（均方误差）
model.compile(optimizer='sgd', loss='mean_squared_error')

# 训练数据
xs = np.array([-1.0, 0.0, 1.0, 2.0, 3.0, 4.0], dtype=float)
ys = np.array([-2.0, 1.0, 4.0, 7.0, 10.0, 13.0], dtype=float)

# 训练模型
# epochs=500：模型经过循环次数500次
model.fit(xs, ys, epochs=500)

# 预测
print(model.predict([10.0]))
```

## 模型说明

这是一个简单的线性回归模型，用于学习Y = 3X + 1的关系：

- **输入数据X**: [-1, 0, 1, 2, 3, 4]
- **输出数据Y**: [-2, 1, 4, 7, 10, 13]
- **目标**: 学习到Y = 3X + 1的规律
- **预测**: 当X=10时，Y应该接近31

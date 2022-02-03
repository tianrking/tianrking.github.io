---
title: "JAX使用记录"
date: 2022-01-25T23:48:54+08:00
draft: true
---




## JAX 是 Autograd 与 XLA 的结合 

JAX 使用 XLA 在 GPU 和 TPU 上编译和运行 NumPy 程序。默认情况下，编译发生在幕后，库调用得到及时编译和执行。但是 JAX 还允许使用单功能 API jit 将自己的 Python 函数即时编译到 XLA 优化的内核中。编译和自动微分可以任意组合，因此可以在不离开 Python 的情况下表达复杂的算法并获得最大的性能。甚至可以使用 pmap 一次对多个 GPU 或 TPU 内核进行编程。

## JAX 的安装

CPU
```shell
pip install --upgrade pip
pip install --upgrade "jax[cpu]"
```
GPU
```
pip install --upgrade pip
# Installs the wheel compatible with CUDA 11 and cuDNN 8.2 or newer.
pip install --upgrade "jax[cuda]" -f https://storage.googleapis.com/jax-releases/jax_releases.html  # Note: wheels only available on linux.
```

## 实现示例

tanh
```python
from jax import grad
import jax.numpy as jnp

def tanh(x):  # Define a function
  y = jnp.exp(-2.0 * x)
  return (1.0 - y) / (1.0 + y)

grad_tanh = grad(tanh)  # Obtain its gradient function
print(grad_tanh(1.0))   # Evaluate it at x = 1.0
# prints 0.4199743
```
abs
```python
def abs_val(x):
  if x > 0:
    return x
  else:
    return -x

abs_val_grad = grad(abs_val)
print(abs_val_grad(1.0))   # prints 1.0
print(abs_val_grad(-1.0))  # prints -1.0 (abs_val is re-evaluated)
```

3x^2+2x+5
```python
from jax import grad
def f(x):
  return 3*x**2 + 2*x + 5
def f_prime(x):
  return 6*x +2
grad(f)(1.0)
# DeviceArray(8., dtype=float32)
f_prime(1.0)
# 8.0
```

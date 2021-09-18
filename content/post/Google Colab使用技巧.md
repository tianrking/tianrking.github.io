---
title: "Google Colab使用技巧"
date: 2021-09-18T22:58:24+08:00
draft: false

tags: ["Colab","Jupyterbook","Python"]
categories: ["云计算","技巧"]
author: "w0x7ce"

---

#  在 Google colab上使用 conda

## Step 1

首先，需要确认在 Google Colab 中默认使用的是哪个 Python。 运行以下命令返回默认 Python 可执行文件的绝对路径。
```
!which python # should return /usr/local/bin/python
```
现在检查这个默认 Python 的版本号。
```
!python --version
```
最后，检查是否已设置 PYTHONPATH 变量。
```
!echo $PYTHONPATH

%env PYTHONPATH=
```
## Step 2
安装 Miniconda
在 Google Colab 单元中执行时，以下代码将下载适合 Miniconda 版本的安装程序脚本并将其安装到 /usr/local。直接安装到 /usr/local，而不是默认位置 ~/miniconda3，确保 Conda 及其所有必需的依赖项将自动在 Google Colab 中可用。
```
%%bash
MINICONDA_INSTALLER_SCRIPT=Miniconda3-4.5.4-Linux-x86_64.sh
MINICONDA_PREFIX=/usr/local
wget https://repo.continuum.io/miniconda/$MINICONDA_INSTALLER_SCRIPT
chmod +x $MINICONDA_INSTALLER_SCRIPT
./$MINICONDA_INSTALLER_SCRIPT -b -f -p $MINICONDA_PREFIX
```

## Step 3
安装 Miniconda 后，您应该能够看到 Conda 可执行文件可用……
```
!which conda # 应该返回 /usr/local/bin/conda
```
...而且版本号是正确的。
```
!conda --version # 应该返回 4.5.4
```
请注意，虽然安装 Miniconda 不会影响 Python 可执行文件......
```
!which python # 仍然返回 /usr/local/bin/python
```
……然而，Miniconda 实际上安装了一个其他 Python 版本。
```
!python --version # 现在返回 Python 3.6.5 :: Anaconda, Inc.
```

现在已经安装了 Conda，需要将 Conda 及其所有依赖项更新到最新版本，而无需将 Python 更新到 3.7（或 3.8）。下面的 conda install 命令实际上将 Conda 更新到最新版本，同时将 Python 版本固定为 3.6。然后 conda update 命令将 Conda 的所有依赖项更新到它们的最新版本。
```
%%bash
conda install --channel 默认值 conda python=3.6 --yes
conda update --channel defaults --all --yes
```
现在您可以通过检查 Conda 的版本号来确认更新。
```
!conda --version # 现在返回 4.8.3
```
Python 版本再次更改。
```
!python --version # 现在返回 Python 3.6.10 :: Anaconda, Inc.
```


# Colab 清除输出

## 方法1

from google.colab import output
output.clear()

## 方法2

from IPython.display import clear_output
clear_output()

# Colab Jupyterbook matplotlib 绘图

## 未完待续
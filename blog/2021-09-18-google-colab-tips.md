---
slug: google-colab-tips
title: Google Colab使用技巧
authors: [w0x7ce]
tags: [Colab, Jupyter, Python, 雲計算]
description: Google Colab使用技巧詳解，包括在Colab上安裝conda、清除輸出和matplotlib繪圖等實用功能
date: 2021-09-18T22:58:24+08:00
---

#  在 Google colab上使用 conda

## Step 1

首先，需要確認在 Google Colab 中默認使用的是哪個 Python。 運行以下命令返回默認 Python 可執行檔案的絕對路徑。
```
!which python # should return /usr/local/bin/python
```
現在檢查這個默認 Python 的版本號。
```
!python --version
```
最後，檢查是否已設置 PYTHONPATH 變量。
```
!echo $PYTHONPATH

%env PYTHONPATH=
```
## 第2步
安裝 Miniconda
在 Google Colab 單元中執行時，以下代碼將下載適合 Miniconda 版本的安裝程序腳本並將其安裝到 /usr/local。直接安裝到 /usr/local，而不是默認位置 ~/miniconda3，確保 Conda 及其所有必需的依賴項將自動在 Google Colab 中可用。
```
%%bash
MINICONDA_INSTALLER_SCRIPT=Miniconda3-4.5.4-Linux-x86_64.sh
MINICONDA_PREFIX=/usr/local
wget https://repo.continuum.io/miniconda/$MINICONDA_INSTALLER_SCRIPT
chmod +x $MINICONDA_INSTALLER_SCRIPT
./$MINICONDA_INSTALLER_SCRIPT -b -f -p $MINICONDA_PREFIX
```

## 第 3 步
安裝 Miniconda 後，您應該能夠看到 Conda 可執行檔案可用……
```
!which conda # 應該返回 /usr/local/bin/conda
```
...而且版本號是正確的。
```
!conda --version # 應該返回 4.5.4
```
請注意，雖然安裝 Miniconda 不會影響 Python 可執行檔案......
```
!which python # 仍然返回 /usr/local/bin/python
```
……然而，Miniconda 實際上安裝了一個其他 Python 版本。
```
!python --version # 現在返回 Python 3.6.5 :: Anaconda, Inc.
```

現在已經安裝了 Conda，需要將 Conda 及其所有依賴項更新到最新版本，而無需將 Python 更新到 3.7（或 3.8）。下面的 conda install 命令實際上將 Conda 更新到最新版本，同時將 Python 版本固定為 3.6。然後 conda update 命令將 Conda 的所有依賴項更新到它們的最新版本。
```
%%bash
conda install --channel 默認值 conda python=3.6 --yes
conda update --channel defaults --all --yes
```
現在您可以通過檢查 Conda 的版本號來確認更新。
```
!conda --version # 現在返回 4.8.3
```
Python 版本再次更改。
```
!python --version # 現在返回 Python 3.6.10 :: Anaconda, Inc.
```


# Colab 清除輸出

## 方法1

from google.colab import output
output.clear()

## 方法2

from IPython.display import clear_output
clear_output()

# Colab Jupyterbook matplotlib 繪圖

##


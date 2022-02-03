---
title: "Nvidia驱动安装相关问题"
date: 2022-02-03T21:08:48+08:00
draft: false
tags: ["nvidia"]
categories: ["nvidia","Python","cuda"]
author: "w0x7ce"

---

## Failed to initialize NVML: Driver/library version mismatch. 

驱动与驱动内核版本不匹配

```txt
方式1: 直接重启
方式2：手动重新加载内核模块（先移除旧模块，再加载新模块）
查看依赖（可略）
```

### 查看依赖
```bash
lsmod | grep -i nvidia
```

### 依次移除依赖模块
```bash
sudo rmmod nvidia_uvm
sudo rmmod nvidia_drm 
sudo rmmod nvidia_modeset
```

### 移除旧模块
```bash 
sudo rmmod nvidia
```

### 会自动加载相关模块
```bash
sudo nvidia-smi
```

### 查看已有驱动版本
```bash
dpkg -l | grep -i nvidia
cat /proc/driver/nvidia/version
```



---
title: "conda安装与使用"
date: 2021-09-20T17:53:38+08:00
draft: false

tags: ["conda"]
categories: ["工具","Python"]
author: "w0x7ce"
---

# Prerequisites

To use GUI packages with Linux, you will need to install the following extended dependencies for Qt:

Debian	apt-get install libgl1-mesa-glx libegl1-mesa libxrandr2 libxrandr2 libxss1 libxcursor1 libxcomposite1 libasound2 libxi6 libxtst6

RedHat	yum install libXcomposite libXcursor libXi libXtst libXrandr alsa-lib mesa-libEGL libXdamage mesa-libGL libXScrnSaver

ArchLinux	pacman -Sy libxau libxi libxss libxtst libxcursor libxcomposite libxdamage libxfixes libxrandr libxrender mesa-libgl  alsa-lib libglvnd

OpenSuse/SLES	zypper install libXcomposite1 libXi6 libXext6 libXau6 libX11-6 libXrandr2 libXrender1 libXss1 libXtst6 libXdamage1 libXcursor1 libxcb1 libasound2  libX11-xcb1 
Mesa-libGL1 Mesa-libEGL1

Gentoo	emerge x11-libs/libXau x11-libs/libxcb x11-libs/libX11 x11-libs/libXext x11-libs/libXfixes x11-libs/libXrender x11-libs/libXi x11-libs/libXcomposite x11-libs/libXrandr x11-libs/libXcursor x11-libs/libXdamage x11-libs/libXScrnSaver x11-libs/libXtst media-libs/alsa-lib media-libs/mesa

# Installation

```
https://www.anaconda.com/products/individual-d
```

```
bash Anaconda*sh
```

```
source <path to conda>/bin/activate and then run conda init
```

# Use

```
conda create -n name python=3.7 -y
conda activate name
```
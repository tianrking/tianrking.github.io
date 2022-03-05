---
title: "國内使用Kali的Docker鏡像相關記錄"
date: 2022-03-04T19:47:42+08:00
draft: false

tags: ["Kali","hack"]
categories: ["Linux","Hack"]
author: "w0x7ce"

---

## Using Kali Linux Docker Images

```bash
kali@kali:~$ docker pull kalilinux/kali-rolling
kali@kali:~$
kali@kali:~$ docker run -p 61102:2 -p 61101:1 -p 61180:80 -p61122:22 --tty --interactive tianrking/kali_rolling_diy:v0.1 /bin/bash
root@e4ae79503654:/
root@e4ae79503654:/ exit
```

Please also note, all the images below do not come with the “default” metapackage. You will need to

```bash
apt update && apt -y install kali-linux-headless.
```

From the terminal use apt-get command to install SSH packages:

### Install ssh server

```bash
# apt-get update
# apt-get install ssh
```

Enable and Start SSH
To make sure that secure shell starts after reboot use systemctl command to enable it:

```bash
# systemctl enable ssh
```

To start SSH for a current session execute:

```bash
# service ssh start
```
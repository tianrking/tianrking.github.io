---
title: "常用docker鏡像便捷记录"
date: 2022-03-05T08:33:02+08:00
draft: true

tags: ["Linux"]
categories: ["系统"]
author: "w0x7ce"

---

## OS

- [Fedora](https://hub.docker.com/_/fedora) docker pull fedora
- [kasmweb/core-kali-rolling](https://hub.docker.com/r/kasmweb/core-kali-rolling) docker pull kasmweb/core-kali-rolling
- [ufoym/deepo](https://hub.docker.com/r/ufoym/deepo) docker pull ufoym/deepo

```bash
docker run -p 61102:2 -p 61101:1 -p 61180:80 -p 61122:22 --tty fedora /bin/bash
```
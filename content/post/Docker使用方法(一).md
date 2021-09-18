---
title: "Docker使用方法(一)"
date: 2021-09-14T20:32:49+08:00
draft: false

tags: ["Linux","Docker"]
categories: ["軟件"]
author: "w0x7ce"

---


# Docker的應用場景
- Web 應用的自動化打包和發布。
- 自動化測試和持續集成、發布。
- 在服務型環境中部署和調整數據庫或其他的後台應用。
- 從頭編譯或者擴展現有的 OpenShift 或 Cloud Foundry 平台來搭建自己的 PaaS 環境。

# Docker 的優點
Docker 是一個用於開發，交付和運行應用程序的開放平台。 Docker 使您能夠將應用程序與基礎架構分開，從而可以快速交付軟件。借助 Docker，您可以與管理應用程序相同的方式來管理基礎架構。通過利用 Docker 的方法來快速交付，測試和部署代碼，您可以大大減少編寫代碼和在生產環境中運行代碼之間的延遲。

1. 快速，一致地交付您的應用程序
Docker 允許開發人員使用您提供的應用程序或服務的本地容器在標準化環境中工作，從而簡化了開發的生命週期。

容器非常適合持續集成和持續交付（CI / CD）工作流程，請考慮以下示例方案：

您的開發人員在本地編寫代碼，並使用 Docker 容器與同事共享他們的工作。

他們使用 Docker 將其應用程序推送到測試環境中，並執行自動或手動測試。

當開發人員發現錯誤時，他們可以在開發環境中對其進行修復，然後將其重新部署到測試環境中，以進行測試和驗證。

測試完成後，將修補程序推送給生產環境，就像將更新的鏡像推送到生產環境一樣簡單。

2. 響應式部署和擴展
Docker 是基於容器的平台，允許高度可移植的工作負載。 Docker 容器可以在開發人員的本機上，數據中心的物理或虛擬機上，雲服務上或混合環境中運行。

Docker 的可移植性和輕量級的特性，還可以使您輕鬆地完成動態管理的工作負擔，並根據業務需求指示，實時擴展或拆除應用程序和服務。

3. 在同一硬件上運行更多工作負載
Docker 輕巧快速。它為基於虛擬機管理程序的虛擬機提供了可行、經濟、高效的替代方案，因此您可以利用更多的計算能力來實現業務目標。 Docker 非常適合於高密度環境以及中小型部署，而您可以用更少的資源做更多的事情

# Docker安裝
```
curl -sSL https://get.daocloud.io/docker | sh
```

# Docker卸載
```
 sudo apt-get remove docker docker-engine docker.io containerd runc
```


# Docker使用基礎
## Docker Hello World
Docker 允許你在容器內運行應用程序， 使用 docker run 命令來在容器內運行一個應用程序。

輸出Hello world
```
w0x7ce@w0x7ce:~$ docker run ubuntu:15.10 /bin/echo "Hello world"
Hello world
```

各個參數解析：
```
docker: Docker 的二進制執行文件。

run: 與前面的 docker 組合來運行一個容器。

ubuntu:15.10 指定要運行的鏡像，Docker 首先從本地主機上查找鏡像是否存在，如果不存在，Docker 就會從鏡像倉庫 Docker Hub 下載公共鏡像。

/bin/echo "Hello world": 在啟動的容器裡執行的命令
```
以上命令完整的意思可以解釋為：Docker 以 ubuntu15.10 鏡像創建一個新容器，然後在容器裡執行 bin/echo "Hello world"，然後輸出結果。

## 運行交互式的容器
我們通過 docker 的兩個參數 -i -t，讓 docker 運行的容器實現"對話"的能力：
```
w0x7ce@w0x7ce:~$ docker run -i -t ubuntu:15.10 /bin/bash
root@0123ce188bd8:/#
```
各個參數解析：
```
-t: 在新容器內指定一個偽終端或終端。

-i: 允許你對容器內的標準輸入 (STDIN) 進行交互。
```
注意第二行 root@0123ce188bd8:/#，此時我們已進入一個 ubuntu15.10 系統的容器

我們嘗試在容器中運行命令 cat /proc/version和ls分別查看當前系統的版本信息和當前目錄下的文件列表
```
root@0123ce188bd8:/#  cat /proc/version
Linux version 4.4.0-151-generic (buildd@lgw01-amd64-043) (gcc version 5.4.0 20160609 (Ubuntu 5.4.0-6ubuntu1~16.04.10) ) #178-Ubuntu SMP Tue Jun 11 08:30:22 UTC 2019
root@0123ce188bd8:/# ls
bin  boot  dev  etc  home  lib  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
root@0123ce188bd8:/# 
```
我們可以通過運行 exit 命令或者使用 CTRL+D 來退出容器。
```
root@0123ce188bd8:/#  exit
exit
root@w0x7ce:~# 
```
注意第三行中 root@w0x7ce:~# 表明我們已經退出了當前的容器，返回到當前的主機中。

## 啟動容器（後台模式）
使用以下命令創建一個以進程方式運行的容器
```
w0x7ce@w0x7ce:~$ docker run -d ubuntu:15.10 /bin/sh -c "while true; do echo hello world; sleep 1; done"
2b1b7a428627c51ab8810d541d759f072b4fc75487eed05812646b8534a2fe63
```
在輸出中，我們沒有看到期望的 "hello world"，而是一串長字符

2b1b7a428627c51ab8810d541d759f072b4fc75487eed05812646b8534a2fe63

這個長字符串叫做容器 ID，對每個容器來說都是唯一的，我們可以通過容器 ID 來查看對應的容器發生了什麼。

首先，我們需要確認容器有在運行，可以通過 docker ps 來查看：
```
w0x7ce@w0x7ce:~$ docker ps
CONTAINER ID        IMAGE                  COMMAND              ...  
5917eac21c36        ubuntu:15.10           "/bin/sh -c 'while t…"    ...
```
輸出詳情介紹：
```
CONTAINER ID: 容器 ID。

IMAGE: 使用的鏡像。

COMMAND: 啟動容器時運行的命令。

CREATED: 容器的創建時間。

STATUS: 容器狀態。

狀態有7種：

created（已創建）
restarting（重啟中）
running 或 Up（運行中）
removing（遷移中）
paused（暫停）
exited（停止）
dead（死亡）
PORTS: 容器的端口信息和使用的連接類型（tcp\udp）。

NAMES: 自動分配的容器名稱。
```
在宿主主機內使用 docker logs 命令，查看容器內的標準輸出：
```
w0x7ce@w0x7ce:~$ docker logs 2b1b7a428627
```
```
w0x7ce@w0x7ce:~$ docker logs amazing_cori
```

## 停止容器
我們使用 docker stop 命令來停止容器:



通過 docker ps 查看，容器已經停止工作:
```
w0x7ce@w0x7ce:~$ docker ps
```
可以看到容器已經不在了。

也可以用下面的命令來停止:
```
w0x7ce@w0x7ce:~$ docker stop amazing_cori
```
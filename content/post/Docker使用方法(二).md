---
title: "Docker使用方法(二)"
date: 2021-09-14T21:51:28+08:00
draft: false

tags: ["Linux","Docker"]
categories: ["軟件"]
author: "w0x7ce"
---


# Docker 客戶端
docker 客戶端非常簡單 ,我們可以直接輸入 docker 命令來查看到 Docker 客戶端的所有命令選項。
```
w0x7ce@w0x7ce:~# docker
```

可以通過命令 docker command --help 更深入的了解指定的 Docker 命令使用方法。

例如我們要查看 docker stats 指令的具體使用方法：
```
w0x7ce@w0x7ce:~# docker stats --help

```
# 容器使用
## 獲取鏡像
如果我們本地沒有 ubuntu 鏡像，我們可以使用 docker pull 命令來載入 ubuntu 鏡像：
```
$ docker pull ubuntu
```
## 啟動容器
以下命令使用 ubuntu 鏡像啟動一個容器，參數為以命令行模式進入該容器：
```
$ docker run -it ubuntu /bin/bash
```

參數說明：
```
-i: 交互式操作。
-t: 終端。
ubuntu: ubuntu 鏡像。
/bin/bash：放在鏡像名後的是命令，這裡我們希望有個交互式 Shell，因此用的是 /bin/bash。
要退出終端，直接輸入 exit:
```
```
root@ed09e4490c57:/# exit
```

## 啟動已停止運行的容器
查看所有的容器命令如下：
```
$ docker ps -a
```



使用 docker start 啟動一個已停止的容器：
```
$ docker start b750bbbcfd88 
```

## 後台運行
在大部分的場景下，我們希望 docker 的服務是在後台運行的，我們可以過 -d 指定容器的運行模式。
```
$ docker run -itd --name ubuntu-test ubuntu /bin/bash
```


注：加了 -d 參數默認不會進入容器，想要進入容器需要使用指令 docker exec（下面會介紹到）。

## 停止一個容器
停止容器的命令如下：
```
$ docker stop <容器 ID>
```

停止的容器可以通過 docker restart 重啟：
```
$ docker restart <容器 ID>
```

## 進入容器
在使用 -d 參數時，容器啟動後會進入後台。此時想要進入容器，可以通過以下指令進入：
```
docker attach
```
```
docker exec：推薦大家使用 docker exec 命令，因為此退出容器終端，不會導致容器的停止。
```
```
attach 命令
```
下面演示了使用 docker attach 命令。
```
$ docker attach 1e560fca3906 
```

注意： 如果從這個容器退出，會導致容器的停止。

exec 命令

下面演示了使用 docker exec 命令。
```
docker exec -it 243c32535da7 /bin/bash
```

注意： 如果從這個容器退出，容器不會停止，這就是為什麼推薦大家使用 docker exec 的原因。

更多參數說明請使用 docker exec --help 命令查看。

## 導出和導入容器
### 導出容器

如果要導出本地某個容器，可以使用 docker export 命令。
```
$ docker export 1e560fca3906 > ubuntu.tar
```
導出容器 1e560fca3906 快照到本地文件 ubuntu.tar。


這樣將導出容器快照到本地文件。

### 導入容器快照

可以使用 docker import 從容器快照文件中再導入為鏡像，以下實例將快照文件 ubuntu.tar 導入到鏡像 test/ubuntu:v1:
```
$ cat docker/ubuntu.tar | docker import - test/ubuntu:v1
```
此外，也可以通過指定 URL 或者某個目錄來導入，例如：
```
$ docker import http://example.com/exampleimage.tgz example/imagerepo
```
## 刪除容器
刪除容器使用 docker rm 命令：
```
$ docker rm -f 1e560fca3906
```
下面的命令可以清理掉所有處於終止狀態的容器。
```
$ docker container prune
```
## 運行一個 web 應用
前面我們運行的容器並沒有一些什麼特別的用處。

接下來讓我們嘗試使用 docker 構建一個 web 應用程序。

我們將在docker容器中運行一個 Python Flask 應用來運行一個web應用。
```
w0x7ce@w0x7ce:~# docker pull training/webapp  # 載入鏡像
w0x7ce@w0x7ce:~# docker run -d -P training/webapp python app.py
```
```
參數說明:

-d:讓容器在後台運行。

-P:將容器內部使用的網絡端口隨機映射到我們使用的主機上。
```
## 查看 WEB 應用容器
使用 docker ps 來查看我們正在運行的容器：
```
w0x7ce@w0x7ce:~#  docker ps
CONTAINER ID        IMAGE               COMMAND             ...        PORTS                 
d3d5e39ed9d3        training/webapp     "python app.py"     ...        0.0.0.0:32769->5000/tcp
```
這裡多了端口信息。
```
PORTS
0.0.0.0:32769->5000/tcp
Docker 開放了 5000 端口（默認 Python Flask 端口）映射到主機端口 32769 上。
```
這時我們可以通過瀏覽器訪問WEB應用



我們也可以通過 -p 參數來設置不一樣的端口：
```
w0x7ce@w0x7ce:~$ docker run -d -p 5000:5000 training/webapp python app.py
```
## docker ps查看正在運行的容器
```
w0x7ce@w0x7ce:~#  docker ps
CONTAINER ID        IMAGE                             PORTS                     NAMES
bf08b7f2cd89        training/webapp     ...        0.0.0.0:5000->5000/tcp    wizardly_chandrasekhar
d3d5e39ed9d3        training/webapp     ...        0.0.0.0:32769->5000/tcp   xenodochial_hoov
```
容器內部的 5000 端口映射到我們本地主機的 5000 端口上。

## 網絡端口的快捷方式
通過 docker ps 命令可以查看到容器的端口映射，docker 還提供了另一個快捷方式 docker port，使用 docker port 可以查看指定 （ID 或者名字）容器的某個確定端口映射到宿主機的端口號。

上面我們創建的 web 應用容器 ID 為 bf08b7f2cd89 名字為 wizardly_chandrasekhar。

我可以使用 docker port bf08b7f2cd89 或 docker port wizardly_chandrasekhar 來查看容器端口的映射情況。
```
w0x7ce@w0x7ce:~$ docker port bf08b7f2cd89
5000/tcp -> 0.0.0.0:5000
w0x7ce@w0x7ce:~$ docker port wizardly_chandrasekhar
5000/tcp -> 0.0.0.0:5000
```
## 查看 WEB 應用程序日誌
docker logs [ID或者名字] 可以查看容器內部的標準輸出。
```
w0x7ce@w0x7ce:~$ docker logs -f bf08b7f2cd89
 * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
192.168.239.1 - - [09/May/2016 16:30:37] "GET / HTTP/1.1" 200 -
192.168.239.1 - - [09/May/2016 16:30:37] "GET /favicon.ico HTTP/1.1" 404 -
-f: 讓 docker logs 像使用 tail -f 一樣來輸出容器內部的標準輸出。
```
從上面，我們可以看到應用程序使用的是 5000 端口並且能夠查看到應用程序的訪問日誌。

## 查看WEB應用程序容器的進程
我們還可以使用 docker top 來查看容器內部運行的進程
```
w0x7ce@w0x7ce:~$ docker top wizardly_chandrasekhar
UID     PID         PPID          ...       TIME                CMD
root    23245       23228         ...       00:00:00            python app.py
```
## 檢查 WEB 應用程序
使用 docker inspect 來查看 Docker 的底層信息。它會返回一個 JSON 文件記錄著 Docker 容器的配置和狀態信息。
```
w0x7ce@w0x7ce:~$ docker inspect wizardly_chandrasekhar
[
    {
        "Id": "bf08b7f2cd897b5964943134aa6d373e355c286db9b9885b1f60b6e8f82b2b85",
        "Created": "2018-09-17T01:41:26.174228707Z",
        "Path": "python",
        "Args": [
            "app.py"
        ],
        "State": {
            "Status": "running",
            "Running": true,
            "Paused": false,
            "Restarting": false,
            "OOMKilled": false,
            "Dead": false,
            "Pid": 23245,
            "ExitCode": 0,
            "Error": "",
            "StartedAt": "2018-09-17T01:41:26.494185806Z",
            "FinishedAt": "0001-01-01T00:00:00Z"
        },
    }

]
```
## 停止 WEB 應用容器
```
w0x7ce@w0x7ce:~$ docker stop wizardly_chandrasekhar   
wizardly_chandrasekhar
```
## 重啟WEB應用容器
已經停止的容器，我們可以使用命令 docker start 來啟動。
```
w0x7ce@w0x7ce:~$ docker start wizardly_chandrasekhar
wizardly_chandrasekhar
docker ps -l 查詢最後一次創建的容器：
```
```
#  docker ps -l 
CONTAINER ID        IMAGE                             PORTS                     NAMES
bf08b7f2cd89        training/webapp     ...        0.0.0.0:5000->5000/tcp    wizardly_chandrasekhar
```
正在運行的容器，我們可以使用 docker restart 命令來重啟。

## 移除WEB應用容器
我們可以使用 docker rm 命令來刪除不需要的容器
```
w0x7ce@w0x7ce:~$ docker rm wizardly_chandrasekhar  
wizardly_chandrasekhar
```
刪除容器時，容器必須是停止狀態，否則會報如下錯誤
```
w0x7ce@w0x7ce:~$ docker rm wizardly_chandrasekhar
Error response from daemon: You cannot remove a running container bf08b7f2cd897b5964943134aa6d373e355c286db9b9885b1f60b6e8f82b2b85. Stop the container before attempting removal or force remove
```
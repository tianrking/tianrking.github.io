---
legacy: true
id: docker-usage-guide-part-2
title: Docker 使用指南（二）- 容器管理与监控
sidebar_label: Docker 使用指南（二）
description: 深入探讨 Docker 容器管理的高级操作，包括容器生命周期管理、网络配置、日志监控、数据导入导出等核心功能
date: 2021-09-14T21:51:28+08:00
tags: [Docker, 容器, Linux, DevOps, 监控]
authors: [w0x7ce]
---

# Docker 使用指南（二）- 容器管理与监控

在第一部分中，我们介绍了 Docker 的基础概念和基本操作。本部分将深入探讨 Docker 容器的高级管理功能，包括镜像管理、容器生命周期控制、网络配置、日志监控以及容器导入导出等实用技能。

## Docker 客户端命令详解

Docker 客户端提供了丰富的命令来管理容器和镜像。

### 查看所有可用命令

```bash
# 查看 Docker 客户端的所有命令
docker

# 查看特定命令的帮助
docker stats --help
docker run --help
docker inspect --help
```

**主要命令分类**：
- **容器管理**：`run`, `start`, `stop`, `restart`, `rm`, `ps`
- **镜像管理**：`pull`, `push`, `build`, `images`, `rmi`
- **信息查询**：`inspect`, `logs`, `stats`, `top`, `port`
- **系统管理**：`system`, `volume`, `network`

## 镜像管理

### 拉取镜像

```bash
# 拉取最新版本的镜像
docker pull ubuntu

# 拉取指定版本的镜像
docker pull ubuntu:20.04

# 拉取所有标签
docker pull -a ubuntu

# 拉取镜像时显示详细过程
docker pull --quiet ubuntu

# 从私有仓库拉取镜像
docker pull registry.example.com/my-app:v1.0
```

### 查看本地镜像

```bash
# 查看所有本地镜像
docker images

# 查看镜像详细信息
docker images ubuntu

# 显示镜像 ID
docker images -q

# 格式化输出
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.ID}}\t{{.Size}}"
```

### 删除镜像

```bash
# 删除指定镜像
docker rmi ubuntu:20.04

# 强制删除镜像（即使有容器在使用）
docker rmi -f ubuntu:20.04

# 删除所有未使用的镜像
docker image prune

# 删除所有镜像
docker rmi $(docker images -q)

# 删除悬空镜像（未标记的）
docker image prune -a
```

### 构建镜像

```bash
# 使用 Dockerfile 构建镜像
docker build -t my-app:1.0 .

# 指定 Dockerfile 路径
docker build -f Dockerfile.prod -t my-app:prod .

# 构建时传递参数
docker build --build-arg VERSION=1.0 -t my-app:1.0 .

# 多阶段构建
docker build --target builder -t my-app:build .
```

## 容器生命周期管理

### 启动容器

```bash
# 交互式启动
docker run -it ubuntu:20.04 /bin/bash

# 后台运行
docker run -d --name my-app nginx

# 后台运行并自动重启
docker run -d --restart always nginx

# 根据重启策略运行
docker run -d --restart unless-stopped nginx
docker run -d --restart on-failure nginx
```

### 启动已停止的容器

```bash
# 查看所有容器（包括已停止的）
docker ps -a

# 启动已停止的容器
docker start <container-id>

# 启动并附加到容器
docker start -a <container-id>

# 启动多个容器
docker start container1 container2 container3
```

### 后台运行模式

```bash
# 后台运行容器
docker run -d nginx

# 后台运行并指定名称
docker run -d --name web-server nginx

# 后台运行并设置环境变量
docker run -d --name my-app -e ENV=production -e DEBUG=false my-app

# 后台运行并限制资源
docker run -d --name my-app --memory=512m --cpus=0.5 my-app
```

### 停止和重启容器

```bash
# 停止容器（优雅关闭）
docker stop <container-id>

# 强制停止容器
docker kill <container-id>

# 重启容器
docker restart <container-id>

# 停止所有运行中的容器
docker stop $(docker ps -q)

# 强制删除所有容器
docker rm $(docker ps -aq)
```

## 进入容器

### docker attach 命令

```bash
# 附加到正在运行的容器
docker attach <container-id>

# 示例
docker attach 1e560fca3906
```

**注意**：使用 `attach` 命令进入容器，退出时会导致容器停止。

### docker exec 命令（推荐）

```bash
# 进入运行中的容器
docker exec -it <container-id> /bin/bash

# 执行特定命令
docker exec <container-id> ls -la

# 以特定用户身份执行
docker exec -it --user root <container-id> /bin/bash

# 指定工作目录
docker exec -it -w /app <container-id> /bin/bash
```

**为什么推荐使用 exec**：
- 退出容器不会导致容器停止
- 可以在不重启容器的情况下执行新命令
- 更安全，适合生产环境

```bash
# 实际使用示例
# 1. 启动容器
docker run -d --name web-app nginx

# 2. 进入容器（推荐方式）
docker exec -it web-app /bin/bash

# 3. 在容器内执行命令
root@container:/# ls -la
root@container:/# nginx -t
root@container:/# exit  # 容器继续运行

# 4. 如果使用 attach（不推荐）
docker attach web-app
# 退出会导致容器停止
```

## 容器的导入与导出

### 导出容器

```bash
# 导出容器文件系统
docker export <container-id> > ubuntu.tar

# 导出容器到文件
docker export -o ubuntu.tar <container-id>

# 示例
docker export 1e560fca3906 > ubuntu.tar
ls -lh ubuntu.tar
```

**用途**：
- 备份容器文件系统
- 迁移容器到其他主机
- 创建基础镜像

### 导入容器

```bash
# 从本地文件导入
cat ubuntu.tar | docker import - my-ubuntu:v1.0

# 从 URL 导入
docker import http://example.com/exampleimage.tgz my-image:v1.0

# 指定 URL 和标签
docker import https://example.com/image.tar.gz my-image:latest

# 从标准输入导入
docker import - my-ubuntu:v1.0 < ubuntu.tar
```

**导入与加载的区别**：
- `docker import`：从容器快照导入，创建镜像
- `docker load`：从镜像包（tarball）加载，恢复镜像

## 删除容器

```bash
# 删除停止的容器
docker rm <container-id>

# 强制删除运行中的容器
docker rm -f <container-id>

# 删除多个容器
docker rm container1 container2 container3

# 删除所有已停止的容器
docker container prune

# 删除所有容器（包括运行中的）
docker rm -f $(docker ps -aq)

# 按条件删除容器
docker rm $(docker ps -aq --filter "status=exited")
```

**删除容器时的注意事项**：
1. 运行中的容器需要先停止或使用 `-f` 强制删除
2. 删除容器不会删除镜像
3. 删除容器会丢失容器内的数据（除非使用数据卷）

```bash
# 安全的删除流程
# 1. 查看容器状态
docker ps -a

# 2. 停止容器
docker stop <container-id>

# 3. 删除容器
docker rm <container-id>

# 4. 确认删除
docker ps -a | grep <container-id>  # 应该没有结果
```

## Web 应用容器实战

### 部署 Python Flask 应用

```bash
# 1. 拉取镜像
docker pull training/webapp

# 2. 运行容器（后台模式，随机端口映射）
docker run -d -P training/webapp python app.py

# 3. 查看运行状态
docker ps

# 4. 查看端口映射
docker port <container-id>

# 5. 查看日志
docker logs -f <container-id>
```

### 指定端口映射

```bash
# 映射到指定端口
docker run -d -p 5000:5000 training/webapp python app.py

# 映射到特定 IP 和端口
docker run -d -p 127.0.0.1:5000:5000 training/webapp python app.py

# 映射 UDP 端口
docker run -d -p 5000:5000/udp training/webapp python app.py

# 映射多个端口
docker run -d -p 8080:80 -p 8443:443 training/webapp
```

**端口映射示例**：

| 容器端口 | 主机端口 | 协议 | 访问方式 |
|----------|----------|------|----------|
| 5000 | 5000 | TCP | http://localhost:5000 |
| 80 | 8080 | TCP | http://localhost:8080 |
| 443 | 8443 | TCP | https://localhost:8443 |
| 53 | 53 | UDP | udp://localhost:53 |

## 网络端口管理

### 查看端口映射

```bash
# 查看特定容器的端口映射
docker port <container-id>

# 查看端口映射详细信息
docker port <container-id> 5000

# 查看所有容器的端口映射
docker ps --format "table {{.Names}}\t{{.Ports}}"
```

### 网络端口快捷方式

```bash
# 使用容器 ID 查看端口
docker port bf08b7f2cd89
# 输出：5000/tcp -> 0.0.0.0:5000

# 使用容器名称查看端口
docker port wizardly_chandrasekhar
# 输出：5000/tcp -> 0.0.0.0:5000

# 查看特定端口映射到的主机端口
docker port <container-id> 5000
```

## 容器监控

### 查看容器日志

```bash
# 查看容器日志
docker logs <container-id>

# 实时跟踪日志（类似 tail -f）
docker logs -f <container-id>

# 查看最后 N 行日志
docker logs --tail 100 <container-id>

# 查看指定时间后的日志
docker logs --since 2023-01-01T10:00:00 <container-id>

# 查看指定时间范围内的日志
docker logs --since 2023-01-01T10:00:00 --until 2023-01-01T11:00:00 <container-id>

# 显示时间戳
docker logs -t <container-id>

# 组合使用
docker logs -ft --tail 50 <container-id>
```

**日志示例分析**：

```bash
$ docker logs -f web-app
 * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
192.168.239.1 - - [09/May/2016 16:30:37] "GET / HTTP/1.1" 200 -
192.168.239.1 - - [09/May/2016 16:30:37] "GET /favicon.ico HTTP/1.1" 404 -
```

**日志字段说明**：
- 时间戳：请求时间
- 客户端IP：192.168.239.1
- HTTP方法：GET
- 路径：/ 或 /favicon.ico
- 状态码：200（成功）或 404（未找到）

### 查看容器进程

```bash
# 查看容器内运行的进程
docker top <container-id>

# 以 BSD 格式显示
docker top <container-id> -o pid,ppid,cmd

# 查看进程树
docker top <container-id> -H
```

**示例输出**：

```bash
$ docker top wizardly_chandrasekhar
UID     PID         PPID          %CPU    MEM      VSZ      RSS   STIME      TTY      TIME       CMD
root    23245       23228         0.0     0.2      12080     1968 ?        00:00      0:00       python app.py
```

### 检查容器状态

```bash
# 查看容器详细信息
docker inspect <container-id>

# 查看特定字段
docker inspect -f '{{.State.Status}}' <container-id>
docker inspect -f '{{.NetworkSettings.IPAddress}}' <container-id>

# 格式化输出
docker inspect --format='{{json .State}}' <container-id> | jq

# 查看多个字段
docker inspect --format='Name: {{.Name}}, Status: {{.State.Status}}, IP: {{.NetworkSettings.IPAddress}}' <container-id>
```

**常用检查项目**：

| 检查项 | 命令 |
|--------|------|
| 容器状态 | `docker inspect -f '{{.State.Status}}'` |
| 容器IP | `docker inspect -f '{{.NetworkSettings.IPAddress}}'` |
| 挂载点 | `docker inspect -f '{{.Mounts}}'` |
| 环境变量 | `docker inspect -f '{{.Config.Env}}'` |
| 重启次数 | `docker inspect -f '{{.RestartCount}}'` |
| 创建时间 | `docker inspect -f '{{.Created}}'` |

### 实时监控容器资源

```bash
# 实时查看容器资源使用情况
docker stats

# 查看特定容器
docker stats <container-id>

# 查看多个容器
docker stats container1 container2

# 查看容器网络 IO
docker stats --no-stream <container-id>

# 查看容器磁盘 IO
docker stats --no-stream --format "table {{.Name}}\t{{.Container}}\t{{.CPUPerc}}\t{{.NetIO}}\t{{.BlockIO}}"
```

**stats 输出说明**：

| 列名 | 说明 | 示例 |
|------|------|------|
| CONTAINER ID | 容器 ID | a1b2c3d4e5f6 |
| NAME | 容器名称 | web-app |
| CPU % | CPU 使用率 | 2.5% |
| MEM USAGE / LIMIT | 内存使用 / 限制 | 120MiB / 512MiB |
| MEM % | 内存使用率 | 23.44% |
| NET I/O | 网络 IO | 1.2kB / 648B |
| BLOCK I/O | 磁盘 IO | 4.1kB / 0B |
| PIDS | 进程数 | 2 |

## 容器重启策略

```bash
# 容器退出时总是重启
docker run -d --restart always nginx

# 容器退出时重启，除非被手动停止
docker run -d --restart unless-stopped nginx

# 容器退出时重启，最多重启 3 次
docker run -d --restart on-failure:3 nginx

# 查看容器的重启策略
docker inspect <container-id> | grep -A 5 RestartPolicy
```

**重启策略对比**：

| 策略 | 说明 | 适用场景 |
|------|------|----------|
| `no` | 不自动重启 | 开发测试 |
| `always` | 总是重启 | Web 服务 |
| `unless-stopped` | 除非手动停止 | 守护进程 |
| `on-failure[:max-retries]` | 退出码非 0 时重启 | 批处理任务 |

## 批量操作

### 批量停止容器

```bash
# 停止所有运行中的容器
docker stop $(docker ps -q)

# 停止特定模式的容器
docker stop $(docker ps -q --filter "name=web")

# 批量停止并删除
docker stop $(docker ps -q) && docker rm $(docker ps -aq)
```

### 批量清理

```bash
# 清理所有已停止的容器
docker container prune

# 清理所有悬空镜像
docker image prune

# 清理所有未使用资源
docker system prune

# 完全清理（包括数据卷）
docker system prune -a --volumes

# 清理构建缓存
docker builder prune
```

## 最佳实践

### 1. 命名规范

```bash
# 使用描述性名称
docker run -d --name web-server-nginx nginx

# 使用环境标识
docker run -d --name prod-web-server nginx

# 使用版本标识
docker run -d --name app-v1.0.0 my-app:1.0.0
```

### 2. 日志管理

```bash
# 配置日志轮转
docker run -d --log-opt max-size=10m --log-opt max-file=3 nginx

# 清空容器日志
docker logs -f <container-id> 2>&1 | tee /dev/null
```

### 3. 资源限制

```bash
# 限制内存
docker run -d --memory=512m nginx

# 限制 CPU
docker run -d --cpus=0.5 nginx

# 限制磁盘 IO
docker run -d --device-read-bps=/dev/sda:1mb nginx
```

### 4. 健康检查

```bash
# 添加健康检查
docker run -d --health-cmd="curl -f http://localhost/ || exit 1" --health-interval=30s nginx
```

## 故障排除

### 常见问题

#### 1. 容器无法启动

```bash
# 查看启动日志
docker logs <container-id>

# 查看详细错误
docker inspect <container-id> | grep -A 10 "State"

# 以交互模式启动调试
docker run -it --entrypoint /bin/bash <image>
```

#### 2. 端口冲突

```bash
# 检查端口占用
sudo netstat -tlnp | grep :5000

# 查找占用端口的进程
sudo lsof -i :5000

# 使用其他端口
docker run -d -p 5001:5000 my-app
```

#### 3. 容器自动退出

```bash
# 检查容器退出码
docker inspect -f '{{.State.ExitCode}}' <container-id>

# 检查启动命令
docker inspect -f '{{.Config.Cmd}}' <container-id>

# 使用前台进程
docker run -d --name my-app --entrypoint bash my-app -c "python app.py"
```

#### 4. 权限问题

```bash
# 检查容器用户
docker inspect -f '{{.Config.User}}' <container-id>

# 以 root 用户运行
docker run -it --user root <image> /bin/bash

# 修改文件权限
docker exec -it <container-id> chown -R user:user /app
```

## 总结

本指南详细介绍了 Docker 容器的高级管理功能：

- **镜像管理**：拉取、查看、删除和构建镜像
- **容器生命周期**：启动、停止、重启和删除容器
- **容器进入**：exec 和 attach 命令的正确使用
- **数据管理**：容器的导入导出
- **网络配置**：端口映射和管理
- **监控调试**：日志、进程和资源监控
- **批量操作**：提高管理效率的命令技巧

掌握这些技能将帮助您更高效地管理和监控 Docker 容器。

## 进阶学习

### 推荐主题
- Docker Compose：管理多容器应用
- Docker Swarm：容器编排
- Docker 网络：自定义网络和 DNS
- Docker 数据卷：数据持久化
- Docker 安全：最佳安全实践

### 实用工具
- **ctop**：命令行容器监控工具
- **dive**：分析镜像层
- **docker-compose**：多容器应用管理
- **portainer**：Web UI 管理工具

通过持续实践这些命令，您将能够熟练地管理 Docker 容器，构建可靠的容器化应用。

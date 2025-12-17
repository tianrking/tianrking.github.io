---
legacy: true
title: Docker完全入门指南：从基础到实战应用
description: 全面学习Docker容器技术，包含Docker安装、基础操作、镜像管理、容器编排等完整教程，适合初学者和有经验的开发者
tags: [Docker, 容器, 虚拟化, DevOps, 云计算]
category: DevOps
author: w0x7ce
date: 2021-09-14
---

# Docker完全入门指南：从基础到实战应用

## 目录

- [Docker概述](#docker概述)
- [Docker的应用场景](#docker的应用场景)
- [Docker的核心优势](#docker的核心优势)
- [Docker安装指南](#docker安装指南)
- [Docker基础概念](#docker基础概念)
- [Docker使用基础](#docker使用基础)
- [镜像管理](#镜像管理)
- [容器操作](#容器操作)
- [数据管理](#数据管理)
- [网络配置](#网络配置)
- [Docker Compose](#docker-compose)
- [实际应用案例](#实际应用案例)
- [最佳实践](#最佳实践)
- [故障排除](#故障排除)
- [进阶主题](#进阶主题)

---

## Docker概述

Docker是一个开源的容器化平台，允许开发者将应用程序及其依赖项打包到轻量级、可移植的容器中。它彻底改变了应用程序的交付和部署方式，使得"构建一次，随处运行"成为现实。

### 什么是容器？

容器是一个隔离的运行环境，其中包含了应用程序运行所需的所有组件：
- 代码
- 运行时环境
- 系统工具
- 系统库
- 设置

容器共享宿主机的操作系统内核，但相互隔离，提供类似虚拟机但更轻量级的解决方案。

### Docker vs 虚拟机

| 特性 | Docker容器 | 虚拟机 |
|------|------------|--------|
| 启动速度 | 秒级 | 分钟级 |
| 资源占用 | 轻量级 | 重量级 |
| 性能 | 接近原生 | 有额外开销 |
| 隔离级别 | 进程级 | 硬件级 |
| 操作系统 | 共享宿主内核 | 每个虚拟机独立系统 |

---

## Docker的应用场景

Docker在现代软件开发中有着广泛的应用场景：

### 1. Web应用部署
```bash
# 快速部署Web应用程序
docker run -d -p 80:80 nginx
```

### 2. 持续集成/持续部署（CI/CD）
- 自动化测试环境
- 持续集成流水线
- 自动化部署流程

### 3. 微服务架构
- 服务拆分和独立部署
- 服务间隔离
- 弹性伸缩

### 4. 开发环境标准化
- 统一开发环境
- 快速环境搭建
- 避免"在我机器上工作正常"问题

### 5. 数据库部署
```bash
# 快速部署MySQL
docker run -d --name mysql \
  -e MYSQL_ROOT_PASSWORD=password \
  mysql:8.0
```

### 6. 批处理作业
- 数据处理任务
- 定时任务
- ETL流程

### 7. 云平台部署
- 容器化服务
- 混合云环境
- 多云平台迁移

---

## Docker的核心优势

### 1. 快速、一致地交付应用程序

Docker简化了开发周期，为开发团队提供了标准化环境。

#### 开发工作流示例
```mermaid
graph TD
    A[开发者本地编写代码] --> B[Docker容器中测试]
    B --> C[推送代码到版本控制]
    C --> D[CI/CD流水线自动构建Docker镜像]
    D --> E[部署到测试环境]
    E --> F[测试和验证]
    F --> G{测试通过?}
    G -->|是| H[部署到生产环境]
    G -->|否| I[修复问题并重新部署]
    I --> E
```

**优势：**
- 开发者使用相同的Docker环境工作
- 一键部署到测试和生产环境
- 快速迭代和修复

### 2. 响应式部署和扩展

Docker容器的高度可移植性使其成为动态工作负载管理的理想选择。

**特点：**
- 可以在开发机、数据中心、云平台或混合环境中运行
- 实时扩展或缩减应用程序和服务
- 快速响应业务需求变化

### 3. 在相同硬件上运行更多工作负载

Docker的轻量级特性允许更高的资源利用率。

**实际效果：**
- 降低硬件成本
- 提高服务器密度
- 减少运维开销

### 4. 其他关键优势

#### 环境一致性
```bash
# 开发、测试、生产环境完全一致
docker run -d -p 3000:3000 myapp:latest
```

#### 资源隔离
- 应用程序间相互隔离
- 资源限制和分配
- 安全性增强

#### 快速恢复
```bash
# 容器故障时快速恢复
docker restart container_id
```

---

## Docker安装指南

### Ubuntu/Debian系统安装

#### 方法一：使用官方脚本（推荐）
```bash
# 自动安装Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

#### 方法二：手动安装
```bash
# 更新包索引
sudo apt-get update

# 安装依赖包
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# 添加Docker官方GPG密钥
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# 添加稳定版仓库
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装Docker Engine
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io

# 启动Docker服务
sudo systemctl start docker
sudo systemctl enable docker
```

### CentOS/RHEL安装
```bash
# 安装Docker
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install docker-ce docker-ce-cli containerd.io

# 启动服务
sudo systemctl start docker
sudo systemctl enable docker
```

### macOS安装
```bash
# 使用Homebrew
brew install --cask docker

# 或下载Docker Desktop
# https://www.docker.com/products/docker-desktop
```

### Windows安装
- 下载Docker Desktop for Windows
- 运行安装程序
- 按照向导完成安装

### 验证安装
```bash
# 检查Docker版本
docker --version

# 运行测试容器
docker run hello-world

# 查看Docker信息
docker info
```

### Docker卸载

#### Ubuntu/Debian完全卸载
```bash
# 卸载Docker包
sudo apt-get remove docker docker-engine docker.io containerd runc

# 删除Docker相关目录
sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/containerd

# 删除Docker组（可选）
sudo groupdel docker
```

#### CentOS/RHEL卸载
```bash
# 卸载Docker
sudo yum remove docker-ce docker-ce-cli containerd.io

# 删除数据目录
sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/containerd
```

---

## Docker基础概念

### 核心组件

#### 1. Docker Engine
Docker的核心守护进程，负责：
- 镜像管理
- 容器运行
- 网络管理
- 数据卷管理

#### 2. 镜像（Image）
只读的模板，用于创建容器。
```bash
# 列出本地镜像
docker images

# 搜索镜像
docker search ubuntu

# 拉取镜像
docker pull ubuntu:20.04
```

#### 3. 容器（Container）
镜像的运行实例。
```bash
# 运行容器
docker run ubuntu:20.04

# 列出运行中的容器
docker ps

# 查看所有容器（包括停止的）
docker ps -a
```

#### 4. 仓库（Repository）
存储Docker镜像的地方。
- **Docker Hub**：默认公共仓库
- **私有仓库**：企业自建仓库

### Docker架构

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Docker Client │───▶│  Docker Daemon   │◀───│  Docker Registry│
│   (Docker CLI)  │    │  (Docker Engine) │    │   (Hub/Registry)│
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   Container      │
                       │   Runtime        │
                       └──────────────────┘
```

---

## Docker使用基础

### 第一个容器：Hello World

#### 运行Hello World容器
```bash
w0x7ce@w0x7ce:~$ docker run ubuntu:15.10 /bin/echo "Hello world"
Hello world
```

#### 命令解析
```bash
docker                    # Docker客户端
run                       # 运行容器命令
ubuntu:15.10              # 指定镜像和标签
/bin/echo "Hello world"   # 容器内执行的命令
```

#### 执行流程
1. Docker客户端向Docker守护进程发送请求
2. 守护进程检查本地是否有ubuntu:15.10镜像
3. 如果不存在，从Docker Hub下载
4. 创建新容器并执行命令
5. 输出结果后容器自动停止

### 运行交互式容器

#### 进入容器shell
```bash
w0x7ce@w0x7ce:~$ docker run -i -t ubuntu:15.10 /bin/bash
root@0123ce188bd8:/#
```

#### 参数说明
- `-i`：保持STDIN打开（交互式）
- `-t`：分配伪终端

#### 在容器中执行命令
```bash
# 查看系统版本
root@0123ce188bd8:/# cat /proc/version
Linux version 4.4.0-151-generic (buildd@lgw01-amd64-043)...

# 查看目录内容
root@0123ce188bd8:/# ls
bin  boot  dev  etc  home  lib  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var

# 查看当前工作目录
root@0123ce188bd8:/# pwd
/

# 退出容器
root@0123ce188bd8:/# exit
exit
root@w0x7ce:~#
```

### 后台运行容器

#### 创建后台运行的容器
```bash
w0x7ce@w0x7ce:~$ docker run -d ubuntu:15.10 /bin/sh -c "while true; do echo hello world; sleep 1; done"
2b1b7a428627c51ab8810d541d759f072b4fc75487eed05812646b8534a2fe63
```

#### 参数说明
- `-d`：后台运行模式（detached）

#### 查看容器状态
```bash
w0x7ce@w0x7ce:~$ docker ps
CONTAINER ID    IMAGE           COMMAND                  CREATED
2b1b7a428627    ubuntu:15.10    "/bin/sh -c 'while t…"   5 seconds ago

STATUS          PORTS           NAMES
Up 5 seconds                    optimistic_euclid
```

#### 容器输出信息
```bash
# 查看容器日志
docker logs optimistic_euclid

# 实时跟踪日志
docker logs -f optimistic_euclid

# 查看最近10行日志
docker logs --tail 10 optimistic_euclid

# 显示时间戳
docker logs -t optimistic_euclid
```

### 停止容器

#### 停止运行中的容器
```bash
# 使用容器ID
docker stop 2b1b7a428627

# 使用容器名
docker stop optimistic_euclid

# 强制停止
docker kill 2b1b7a428627
```

#### 验证容器已停止
```bash
w0x7ce@w0x7ce:~$ docker ps
CONTAINER ID    IMAGE    COMMAND    CREATED    STATUS    PORTS    NAMES

# 查看所有容器（包括停止的）
docker ps -a
```

---

## 镜像管理

### 搜索镜像
```bash
# 搜索镜像
docker search nginx

# 搜索星级大于10的镜像
docker search --filter stars=10 nginx

# 显示详细信息
docker search --no-trunc nginx
```

### 拉取镜像
```bash
# 拉取最新版本
docker pull nginx

# 拉取特定版本
docker pull nginx:1.20

# 拉取所有标签
docker pull -a nginx
```

### 列出镜像
```bash
# 列出本地镜像
docker images

# 显示镜像ID
docker images -q

# 显示悬空镜像
docker images -f dangling=true

# 显示特定格式
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.ID}}"
```

### 删除镜像
```bash
# 删除镜像（必须先删除相关容器）
docker rmi nginx:1.20

# 强制删除
docker rmi -f nginx:1.20

# 删除所有悬空镜像
docker image prune

# 删除所有未使用的镜像
docker image prune -a
```

### 构建镜像

#### Dockerfile示例：创建Python应用镜像
```dockerfile
# 使用官方Python运行时作为父镜像
FROM python:3.9-slim

# 设置工作目录
WORKDIR /app

# 复制requirements文件
COPY requirements.txt .

# 安装依赖
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 8000

# 运行应用
CMD ["python", "app.py"]
```

#### 构建命令
```bash
# 构建镜像
docker build -t myapp:1.0 .

# 指定Dockerfile路径
docker build -f Dockerfile.dev -t myapp:dev .

# 构建时传递参数
docker build --build-arg VERSION=1.0 -t myapp:1.0 .
```

#### 多阶段构建示例
```dockerfile
# 构建阶段
FROM golang:1.19 AS builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# 运行阶段
FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
CMD ["./main"]
```

### 镜像标签
```bash
# 为镜像添加标签
docker tag myapp:1.0 myapp:latest

# 查看标签
docker images myapp
```

### 推送镜像
```bash
# 登录Docker Hub
docker login

# 推送镜像
docker push username/myapp:latest

# 推送到私有仓库
docker tag myapp:latest registry.example.com/myapp:latest
docker push registry.example.com/myapp:latest
```

---

## 容器操作

### 启动容器
```bash
# 启动已停止的容器
docker start container_id

# 交互式启动
docker start -i container_id

# 重启容器
docker restart container_id
```

### 停止容器
```bash
# 优雅停止
docker stop container_id

# 强制停止
docker kill container_id

# 停止所有运行中的容器
docker stop $(docker ps -q)
```

### 删除容器
```bash
# 删除停止的容器
docker rm container_id

# 强制删除运行中的容器
docker rm -f container_id

# 删除所有停止的容器
docker container prune

# 删除所有容器（包括运行中的）
docker rm -f $(docker ps -aq)
```

### 查看容器信息
```bash
# 查看容器详细信息
docker inspect container_id

# 查看特定信息
docker inspect --format='{{.State.Status}}' container_id

# 查看容器资源使用情况
docker stats

# 查看容器进程
docker top container_id

# 查看容器端口映射
docker port container_id

# 查看容器日志
docker logs container_id

# 查看容器内文件系统变更
docker diff container_id
```

### 进入运行中的容器
```bash
# 使用exec（推荐）
docker exec -it container_id /bin/bash

# 在容器中运行命令
docker exec container_id ls -la

# 使用attach（附加到容器的主进程）
docker attach container_id
```

### 复制文件
```bash
# 从容器复制文件到宿主机
docker cp container_id:/path/in/container /path/on/host

# 从宿主机复制文件到容器
docker cp /path/on/host container_id:/path/in/container

# 复制目录
docker cp ./local_dir container_id:/remote_dir/
```

### 查看容器变更
```bash
# 查看文件系统变更
docker diff container_id

# A - 添加的文件
# C - 修改的文件
# D - 删除的文件
```

---

## 数据管理

### 数据卷（Volumes）

#### 创建数据卷
```bash
# 创建命名数据卷
docker volume create my_volume

# 列出数据卷
docker volume ls

# 查看数据卷详情
docker volume inspect my_volume

# 删除数据卷
docker volume rm my_volume

# 清理未使用的数据卷
docker volume prune
```

#### 使用数据卷
```bash
# 运行时挂载数据卷
docker run -d \
  -v my_volume:/var/lib/mysql \
  mysql:8.0

# 挂载特定目录
docker run -d \
  -v /host/path:/container/path \
  nginx:latest

# 只读挂载
docker run -d \
  -v /host/path:/container/path:ro \
  nginx:latest
```

#### 数据卷的优势
- 持久化存储
- 独立于容器生命周期
- 可以在多个容器间共享
- 性能优异

### 绑定挂载（Bind Mounts）

```bash
# 绑定挂载目录
docker run -d \
  -v /host/directory:/container/directory \
  -p 8080:80 \
  nginx:latest
```

**用途：**
- 开发时实时同步代码
- 配置文件挂载
- 日志输出

### tmpfs挂载

```bash
# 使用内存存储（临时）
docker run -d \
  --tmpfs /tmp \
  nginx:latest
```

### 数据卷容器

```bash
# 创建数据卷容器
docker create -v /data --name data_container ubuntu

# 其他容器使用数据卷容器
docker run -it --volumes-from data_container ubuntu
```

---

## 网络配置

### 网络模式

#### 1. Bridge模式（默认）
```bash
# 默认bridge网络
docker run --network bridge nginx

# 自定义bridge网络
docker run --network my_network nginx
```

#### 2. Host模式
```bash
# 使用宿主机网络
docker run --network host nginx
```

#### 3. None模式
```bash
# 无网络
docker run --network none nginx
```

#### 4. Container模式
```bash
# 使用另一个容器的网络
docker run --network container:other_container nginx
```

### 创建自定义网络

```bash
# 创建bridge网络
docker network create my_network

# 创建overlay网络（swarm模式）
docker network create -d overlay my_overlay

# 列出网络
docker network ls

# 查看网络详情
docker network inspect my_network

# 删除网络
docker network rm my_network
```

### 端口映射

```bash
# 映射单个端口
docker run -p 8080:80 nginx

# 映射多个端口
docker run -p 8080:80 -p 443:443 nginx

# 随机端口映射
docker run -P nginx

# UDP端口映射
docker run -p 8080:80/udp nginx
```

### 网络别名

```bash
# 在自定义网络中设置别名
docker run --network my_network --network-alias web nginx
```

---

## Docker Compose

Docker Compose是一个用于定义和运行多容器Docker应用程序的工具。

### 安装Docker Compose

```bash
# 下载并安装
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 赋予执行权限
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker-compose --version
```

### docker-compose.yml示例

```yaml
version: '3.8'

services:
  # Web应用
  web:
    image: nginx:latest
    ports:
      - "8080:80"
    networks:
      - frontend
    volumes:
      - ./html:/usr/share/nginx/html

  # 数据库
  database:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: myapp
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - backend

  # Redis缓存
  redis:
    image: redis:alpine
    networks:
      - backend

networks:
  frontend:
  backend:

volumes:
  db_data:
```

### 常用命令

```bash
# 启动所有服务
docker-compose up

# 后台启动
docker-compose up -d

# 停止所有服务
docker-compose down

# 重建服务
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 查看服务状态
docker-compose ps

# 执行命令
docker-compose exec web bash

# 扩展服务实例
docker-compose up -d --scale web=3

# 清理
docker-compose down -v --rmi all
```

### 环境变量文件

```bash
# .env文件
DB_PASSWORD=secretpassword
API_KEY=your_api_key
```

```yaml
# docker-compose.yml
services:
  database:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
```

### 高级功能

#### 依赖关系
```yaml
services:
  web:
    depends_on:
      - database
      - redis
```

#### 健康检查
```yaml
services:
  web:
    image: nginx
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3
```

---

## 实际应用案例

### 1. 部署Web应用

```bash
# 使用官方nginx镜像
docker run -d \
  --name my_nginx \
  -p 80:80 \
  -v /host/html:/usr/share/nginx/html:ro \
  nginx:latest
```

### 2. 运行Python应用

```bash
# 创建Python应用
mkdir python-app
cd python-app

# 编写app.py
cat > app.py << EOF
from flask import Flask
import os

app = Flask(__name__)

@app.route('/')
def hello():
    return f"Hello from container! Host: {os.environ.get('HOSTNAME', 'unknown')}"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
EOF

# 编写Dockerfile
cat > Dockerfile << EOF
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "app.py"]
EOF

# 构建和运行
docker build -t python-app .
docker run -d -p 5000:5000 python-app
```

### 3. MySQL数据库

```bash
# 运行MySQL容器
docker run -d \
  --name mysql_db \
  -e MYSQL_ROOT_PASSWORD=secret123 \
  -e MYSQL_DATABASE=myapp \
  -e MYSQL_USER=appuser \
  -e MYSQL_PASSWORD=apppass \
  -v mysql_data:/var/lib/mysql \
  -p 3306:3306 \
  mysql:8.0

# 连接数据库
docker exec -it mysql_db mysql -u root -p
```

### 4. 多容器应用（Web + DB）

```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=mysql://appuser:apppass@database:3306/myapp
    depends_on:
      - database
    networks:
      - app_network

  database:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: secret123
      MYSQL_DATABASE: myapp
      MYSQL_USER: appuser
      MYSQL_PASSWORD: apppass
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - app_network

volumes:
  db_data:

networks:
  app_network:
    driver: bridge
```

---

## 最佳实践

### 1. 镜像优化

#### 使用多阶段构建
```dockerfile
# 构建阶段
FROM golang:1.19 AS builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 go build -o main .

# 运行阶段
FROM alpine:latest
RUN apk --no-cache add ca-certificates
COPY --from=builder /app/main .
CMD ["./main"]
```

#### 减少镜像层数
```dockerfile
# 好的做法：合并RUN命令
RUN apt-get update && \
    apt-get install -y nginx && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 避免：多个RUN命令
# RUN apt-get update
# RUN apt-get install -y nginx
```

#### 使用较小的基础镜像
```dockerfile
# 选择合适的基础镜像
FROM python:3.9-slim  # 而不是 python:3.9

# 使用Alpine Linux（更轻量）
FROM alpine:latest
RUN apk add --no-cache python3 py3-pip
```

#### .dockerignore文件
```
# .dockerignore
node_modules
npm-debug.log
.git
.gitignore
README.md
Dockerfile
.dockerignore
.env
```

### 2. 安全最佳实践

#### 不要在镜像中包含敏感信息
```dockerfile
# 错误做法
ENV API_KEY=secret_key_12345

# 正确做法：运行时传入
docker run -e API_KEY=secret_key_12345 myapp
```

#### 使用非root用户
```dockerfile
# 创建非root用户
RUN groupadd -r appuser && useradd -r -g appuser appuser
USER appuser
```

#### 定期更新基础镜像
```bash
# 更新基础镜像
docker pull ubuntu:20.04
docker build -t myapp .
```

### 3. 容器管理

#### 设置资源限制
```bash
# CPU限制
docker run --cpus=1.5 myapp

# 内存限制
docker run -m 512m myapp

# 同时限制
docker run --cpus=1.5 -m 512m myapp
```

#### 健康检查
```bash
# 自定义健康检查
docker run -d \
  --health-cmd="curl -f http://localhost/health || exit 1" \
  --health-interval=30s \
  --health-timeout=3s \
  --health-retries=3 \
  myapp
```

#### 日志管理
```bash
# 配置日志驱动
docker run --log-driver=json-file --log-opt max-size=10m myapp
```

### 4. 网络安全

#### 避免使用Host网络模式
```bash
# 避免：除非必要
docker run --network host myapp

# 推荐：使用Bridge网络
docker run --network bridge myapp
```

#### 端口最小暴露
```bash
# 只暴露必要端口
docker run -p 8080:80 -p 443:443 nginx

# 避免暴露不必要的端口
```

### 5. 监控和日志

```bash
# 查看容器资源使用
docker stats

# 查看容器日志
docker logs -f --tail=100 myapp

# 清理日志
echo "" > $(docker inspect --format='{{.LogPath}}' myapp)
```

---

## 故障排除

### 常见问题及解决方案

#### 1. 容器无法启动

**问题：**
```bash
docker run myapp
# Error: Exited (1) 2 seconds ago
```

**解决方案：**
```bash
# 查看详细错误信息
docker logs myapp

# 查看容器详情
docker inspect myapp

# 检查配置
docker run --dry-run myapp
```

#### 2. 端口冲突

**问题：**
```bash
# Error: Port 80 is already in use
```

**解决方案：**
```bash
# 检查端口占用
netstat -tuln | grep :80

# 使用不同端口
docker run -p 8080:80 nginx

# 或停止占用端口的进程
sudo lsof -ti:80 | xargs sudo kill
```

#### 3. 权限问题

**问题：**
```bash
# Permission denied
```

**解决方案：**
```bash
# 添加用户到docker组
sudo usermod -aG docker $USER

# 重新登录或运行
newgrp docker

# 或者使用sudo（不推荐）
sudo docker run myapp
```

#### 4. 镜像拉取失败

**问题：**
```bash
# Error: image library/ubuntu:latest not found
```

**解决方案：**
```bash
# 检查网络连接
ping registry-1.docker.io

# 使用国内镜像源
docker pull registry.cn-hangzhou.aliyuncs.com/library/ubuntu:latest

# 配置镜像加速器
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<EOF
{
  "registry-mirrors": [
    "https://registry.cn-hangzhou.aliyuncs.com"
  ]
}
EOF
sudo systemctl restart docker
```

#### 5. 磁盘空间不足

**问题：**
```bash
# No space left on device
```

**解决方案：**
```bash
# 清理未使用的数据
docker system prune -a

# 清理悬空镜像
docker image prune -a

# 清理未使用的容器
docker container prune

# 清理未使用的卷
docker volume prune

# 清理构建缓存
docker builder prune
```

#### 6. 容器内网络问题

**问题：容器无法访问外网**

**解决方案：**
```bash
# 检查DNS配置
docker run --rm busybox nslookup google.com

# 重启Docker服务
sudo systemctl restart docker

# 配置DNS
sudo tee /etc/docker/daemon.json <<EOF
{
  "dns": ["8.8.8.8", "8.8.4.4"]
}
EOF
sudo systemctl restart docker
```

---

## 进阶主题

### Docker Swarm（集群管理）

```bash
# 初始化Swarm
docker swarm init

# 添加节点
docker swarm join --token <TOKEN> <IP>:<PORT>

# 部署服务
docker service create --replicas 3 nginx

# 查看服务
docker service ls
docker service ps nginx

# 扩容服务
docker service scale nginx=5

# 删除服务
docker service rm nginx

# 退出Swarm
docker swarm leave --force
```

### Kubernetes（容器编排）

虽然Kubernetes是更复杂的编排工具，但Docker是构建容器的基础。

```bash
# 将容器部署到Kubernetes
kubectl create deployment nginx --image=nginx
kubectl expose deployment nginx --port=80 --type=NodePort
```

### Docker Registry（私有仓库）

```bash
# 运行私有仓库
docker run -d -p 5000:5000 --name registry registry:2

# 标记镜像
docker tag myapp localhost:5000/myapp

# 推送到私有仓库
docker push localhost:5000/myapp

# 从私有仓库拉取
docker pull localhost:5000/myapp
```

### CI/CD集成

#### GitHub Actions示例
```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker image
        run: docker build -t myapp .
      - name: Login to Docker Hub
        run: echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
      - name: Push image
        run: docker push myapp:latest
```

### 监控和性能调优

```bash
# 查看资源使用
docker stats

# 查看容器详细信息
docker inspect --format '{{.HostConfig}}' container_id

# 分析镜像层
docker history nginx:latest

# 性能测试
docker run --rm --cpus=2 -m 1g benchmark/image
```

---

## 总结

Docker作为现代软件开发的重要工具，已经成为DevOps和云原生应用开发的核心技术。通过本指南的学习，你应该已经掌握了：

### 核心技能
- Docker基础概念和架构
- 镜像管理和构建
- 容器操作和管理
- 网络和数据卷配置
- Docker Compose使用
- 实际应用部署

### 进阶能力
- 镜像优化和安全
- 集群管理（Swarm）
- CI/CD集成
- 故障排除和监控

### 实际应用场景
- Web应用部署
- 微服务架构
- 开发环境标准化
- 持续集成/持续部署

### 学习建议

1. **实践为主**：多动手操作各种命令和配置
2. **项目驱动**：在实际项目中使用Docker
3. **持续学习**：关注Docker生态系统的最新发展
4. **社区参与**：加入Docker社区，分享经验

### 下一步学习

- Kubernetes容器编排
- Helm包管理器
- Service Mesh（Istio）
- 容器安全
- 云原生架构

Docker的世界非常广阔，本指南只是入门。持续实践和学习，你将能够充分发挥Docker的强大功能，提升开发效率和部署质量。

## 参考资源

- [Docker官方文档](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Docker最佳实践](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Compose文档](https://docs.docker.com/compose/)
- [Docker中文社区](https://www.docker.org.cn/)

记住：**容器化不是终点，而是现代软件交付的开始。**

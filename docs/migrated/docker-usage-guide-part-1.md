---
legacy: true
id: docker-usage-guide-part-1
title: Docker 使用指南（一）- 基础入门与核心概念
sidebar_label: Docker 使用指南（一）
description: Docker 基础入门指南，详细介绍 Docker 的应用场景、优势、安装方法以及基本使用命令
date: 2021-09-14T20:32:49+08:00
tags: [Docker, 容器, Linux, DevOps]
authors: [w0x7ce]
---

# Docker 使用指南（一）- 基础入门与核心概念

Docker 是一个开源的容器化平台，让开发者能够将应用程序及其依赖打包到轻量级、可移植的容器中。本指南将详细介绍 Docker 的核心概念、应用场景、优势以及基本使用方法。

## Docker 的应用场景

Docker 在现代软件开发中有广泛的适用性：

### 1. Web 应用自动化
- 自动化打包和发布 Web 应用程序
- 确保开发、测试、生产环境一致性
- 简化部署流程，降低环境配置复杂度

### 2. 持续集成与持续部署（CI/CD）
- 自动化测试流程
- 快速构建和部署应用
- 支持蓝绿部署、滚动更新等策略

### 3. 微服务架构
- 部署和调整数据库或后台应用
- 独立扩展各个服务组件
- 服务间隔离，提高系统稳定性

### 4. PaaS 平台搭建
- 从头编译或扩展 OpenShift 或 Cloud Foundry
- 构建自己的 PaaS 环境
- 快速交付软件解决方案

## Docker 的核心优势

### 1. 快速、一致地交付应用程序

Docker 简化了开发生命周期，提供了标准化的环境：

**开发阶段**：
- 开发人员在本地编写代码
- 使用 Docker 容器与团队成员共享工作
- 保持环境一致性，避免"在我机器上可以工作"的问题

**测试阶段**：
- 将应用程序推送到测试环境
- 执行自动化或手动测试
- 快速重现和修复 bug

**部署阶段**：
- 测试完成后推送生产环境
- 如推送更新的镜像一样简单
- 大大减少开发和生产环境之间的延迟

```bash
# 开发流程示例
# 1. 本地开发
docker run -v $(pwd):/app my-app:dev

# 2. 推送测试
docker tag my-app:dev my-app:test
docker push my-registry/test/my-app:test

# 3. 生产部署
docker pull my-app:prod
docker run my-app:prod
```

### 2. 响应式部署和扩展

Docker 的高度可移植性使其成为云原生应用的首选：

- **开发人员本机**：本地开发和调试
- **数据中心的物理或虚拟机**：私有云部署
- **云服务**：AWS、Azure、GCP 等公有云
- **混合环境**：多云和本地混合部署

**动态管理能力**：
```bash
# 根据负载实时扩展
docker-compose up -d --scale api=3

# 动态调整服务
kubectl scale deployment api --replicas=5
```

### 3. 在同一硬件上运行更多工作负载

Docker 相比传统虚拟机具有显著优势：

| 特性 | Docker 容器 | 虚拟机 |
|------|-------------|--------|
| 启动速度 | 秒级 | 分钟级 |
| 资源占用 | 低（共享主机内核） | 高（独立操作系统） |
| 密度 | 高 | 低 |
| 性能 | 接近原生 | 有性能损失 |
| 隔离性 | 进程级 | 硬件级 |

**高密度部署示例**：
```bash
# 查看系统资源
docker stats

# 监控多个容器
docker-compose ps
```

## Docker 安装

### 方法一：使用官方安装脚本（推荐）

```bash
# 适用于 Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 启动 Docker 服务
sudo systemctl start docker
sudo systemctl enable docker

# 将当前用户添加到 docker 组（无需 sudo）
sudo usermod -aG docker $USER
newgrp docker
```

### 方法二：手动安装

#### Ubuntu/Debian 系统：

```bash
# 1. 更新软件包索引
sudo apt-get update

# 2. 安装必要的软件包
sudo apt-get install apt-transport-https ca-certificates curl gnupg lsb-release

# 3. 添加 Docker 官方 GPG 密钥
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# 4. 设置稳定版仓库
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 5. 安装 Docker Engine
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

#### CentOS/RHEL 系统：

```bash
# 1. 安装 yum-utils
sudo yum install -y yum-utils

# 2. 添加 Docker 仓库
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 3. 安装 Docker
sudo yum install docker-ce docker-ce-cli containerd.io

# 4. 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker
```

### Docker 卸载

```bash
# 完全卸载 Docker
sudo apt-get remove -y docker docker-engine docker.io containerd runc

# 清理残留文件
sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/containerd

# Ubuntu/Debian 清理
sudo apt-get autoremove -y
sudo apt-get autoclean
```

## Docker 使用基础

### 验证安装

```bash
# 检查 Docker 版本
docker --version
# Docker version 24.0.7, build afdd53b

# 运行测试容器
docker run hello-world

# 查看 Docker 系统信息
docker info
```

### Docker Hello World

让我们从最简单的示例开始：

```bash
# 运行简单的 echo 命令
docker run ubuntu:20.04 /bin/echo "Hello Docker!"

# 输出
# Hello Docker!
```

**命令解析**：
- `docker`：Docker 客户端命令
- `run`：运行一个容器
- `ubuntu:20.04`：使用的镜像（格式：镜像名:标签）
- `/bin/echo "Hello Docker!"`：容器内执行的命令

### 运行交互式容器

```bash
# 启动交互式容器
docker run -it ubuntu:20.04 /bin/bash

# 进入容器后，您可以执行任意命令
root@container-id:/# cat /etc/os-release
root@container-id:/# ls -la
root@container-id:/# apt-get update

# 退出容器
root@container-id:/# exit
```

**参数说明**：
- `-i`：保持 STDIN 打开（交互模式）
- `-t`：分配一个伪终端（TTY）

**实用示例**：
```bash
# 使用 Alpine Linux（轻量级镜像）
docker run -it alpine:latest /bin/sh

# 在容器中安装软件
/ # apk add --no-cache curl
/ # curl --version

# 退出
/ # exit
```

### 启动后台容器（守护进程模式）

```bash
# 启动一个持续运行的容器
docker run -d ubuntu:20.04 /bin/sh -c "while true; do echo 'Docker is running...'; sleep 10; done"

# 查看容器日志
docker logs <container-id>

# 实时查看日志
docker logs -f <container-id>

# 查看容器状态
docker ps
```

**示例输出**：
```bash
$ docker ps
CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS     NAMES
a1b2c3d4e5f6   ubuntu:20.04   "/bin/sh -c 'while t…"   2 minutes ago   Up 2 minutes             peaceful_darwin

$ docker logs peaceful_darwin
Docker is running...
Docker is running...
Docker is running...
```

### 容器管理命令

```bash
# 查看运行中的容器
docker ps

# 查看所有容器（包括已停止的）
docker ps -a

# 查看最新创建的容器
docker ps -l

# 查看容器详细信息
docker inspect <container-id>

# 查看容器资源使用情况
docker stats <container-id>

# 停止运行中的容器
docker stop <container-id>

# 强制停止容器
docker kill <container-id>

# 启动已停止的容器
docker start <container-id>

# 重启容器
docker restart <container-id>

# 删除容器
docker rm <container-id>

# 强制删除运行中的容器
docker rm -f <container-id>

# 清理所有已停止的容器
docker container prune
```

### 容器状态说明

容器有以下 7 种状态：

| 状态 | 说明 |
|------|------|
| `created` | 已创建但未启动 |
| `restarting` | 正在重启中 |
| `running` / `Up` | 正在运行 |
| `removing` | 正在迁移到其他主机 |
| `paused` | 已暂停 |
| `exited` | 已停止 |
| `dead` | 容器尝试停止但失败 |

```bash
# 查看容器状态详细信息
docker inspect -f '{{.State.Status}}' <container-id>

# 查看容器启动时间
docker inspect -f '{{.State.StartedAt}}' <container-id>
```

### 容器命名和标记

```bash
# 为容器指定名称
docker run -d --name my-app ubuntu:20.04

# 自动生成名称（使用随机的有趣名称）
docker run -d ubuntu:20.04
# 例如：agitated_newton, suspicious_jones

# 查看容器名称
docker ps --format '{{.Names}}'

# 重命名容器
docker rename old-name new-name
```

### 端口映射

```bash
# 映射单个端口
docker run -d -p 8080:80 nginx

# 映射所有暴露的端口
docker run -d -P nginx

# 指定协议和 IP
docker run -d -p 127.0.0.1:8080:80/tcp nginx

# 查看端口映射
docker port <container-id>
```

### 数据卷挂载

```bash
# 挂载主机目录
docker run -d -v /host/path:/container/path nginx

# 只读挂载
docker run -d -v /host/path:/container/path:ro nginx

# 挂载命名卷
docker run -d -v my-volume:/data nginx

# 创建命名卷
docker volume create my-volume
```

## 实践示例

### 示例 1：运行 Nginx Web 服务器

```bash
# 1. 拉取 Nginx 镜像
docker pull nginx:latest

# 2. 运行 Nginx 容器
docker run -d --name my-nginx -p 80:80 nginx

# 3. 访问测试
curl http://localhost:80

# 4. 查看日志
docker logs my-nginx

# 5. 停止并删除
docker stop my-nginx
docker rm my-nginx
```

### 示例 2：运行 MySQL 数据库

```bash
# 1. 运行 MySQL 容器
docker run -d \
  --name mysql-server \
  -e MYSQL_ROOT_PASSWORD=my-secret-pw \
  -e MYSQL_DATABASE=testdb \
  -e MYSQL_USER=testuser \
  -e MYSQL_PASSWORD=testpass \
  -p 3306:3306 \
  mysql:8.0

# 2. 连接到数据库
docker exec -it mysql-server mysql -u root -p

# 3. 在容器内连接
docker exec -it mysql-server mysql -u testuser -ptestpass testdb
```

### 示例 3：运行 Python 应用

```bash
# 1. 创建简单的 Python 应用
mkdir my-python-app
cd my-python-app

cat > app.py << 'EOF'
from flask import Flask
import os

app = Flask(__name__)

@app.route('/')
def hello():
    return f"Hello from {os.environ.get('HOSTNAME', 'unknown')}!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
EOF

# 2. 创建 Dockerfile
cat > Dockerfile << 'EOF'
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "app.py"]
EOF

# 3. 创建 requirements.txt
echo "flask==2.3.3" > requirements.txt

# 4. 构建镜像
docker build -t my-python-app .

# 5. 运行容器
docker run -d -p 5000:5000 --name my-flask-app my-python-app

# 6. 测试
curl http://localhost:5000
```

## 最佳实践

### 1. 使用官方镜像
优先使用 Docker 官方维护的镜像，它们经过安全扫描和优化。

```bash
# 好的做法
docker pull nginx:latest

# 不推荐：使用未维护的第三方镜像
docker pull some-user/nginx-custom
```

### 2. 指定具体版本标签
避免使用 `latest` 标签，确保环境一致性。

```bash
# 推荐：指定具体版本
FROM node:18.16.0-alpine

# 避免：使用 latest
FROM node:latest
```

### 3. 及时清理资源

```bash
# 删除未使用的镜像
docker image prune -a

# 删除未使用的容器
docker container prune

# 删除未使用的网络
docker network prune

# 删除所有未使用资源（谨慎使用）
docker system prune -a

# 查看磁盘使用情况
docker system df
```

### 4. 使用 .dockerignore

```bash
# .dockerignore
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
```

### 5. 多阶段构建

```dockerfile
# 构建阶段
FROM node:18 as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# 生产阶段
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
CMD ["node", "app.js"]
```

## 故障排除

### 常见问题及解决方案

#### 1. 权限被拒绝

```bash
# 错误：Got permission denied while trying to connect
# 解决：将用户添加到 docker 组
sudo usermod -aG docker $USER
newgrp docker
```

#### 2. 端口已被占用

```bash
# 错误：端口冲突
# 解决：使用其他端口
docker run -d -p 8080:80 nginx

# 或者查找并停止占用端口的进程
sudo lsof -i :80
sudo kill -9 <PID>
```

#### 3. 容器无法启动

```bash
# 查看容器日志
docker logs <container-id>

# 查看详细错误信息
docker inspect <container-id>

# 以交互模式运行
docker run -it <image> /bin/bash
```

#### 4. 镜像拉取失败

```bash
# 配置镜像加速器（中国用户）
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
EOF

sudo systemctl restart docker
```

## 总结

本指南介绍了 Docker 的核心概念、应用场景和基本使用方法。通过本指南，您应该已经了解了：

- Docker 的主要优势和应用场景
- 如何在不同 Linux 发行版上安装 Docker
- Docker 的基本命令和容器管理
- 常用的 Docker 操作实践

在下一部分中，我们将深入探讨 Docker 镜像管理、数据持久化、网络配置等高级主题。

## 进阶学习

### 推荐资源
- [Docker 官方文档](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)

### 下一步
- 学习 Docker Compose 管理多容器应用
- 掌握 Dockerfile 编写技巧
- 了解 Docker 网络和数据卷管理
- 探索 Docker Swarm 或 Kubernetes 容器编排

通过持续实践，您将能够充分利用 Docker 的强大功能，提高开发效率和部署质量。

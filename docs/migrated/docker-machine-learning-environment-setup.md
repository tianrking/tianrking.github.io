---
legacy: true
id: docker-machine-learning-environment-setup
title: Docker 机器学习环境搭建完整指南
sidebar_label: Docker ML 环境搭建
description: 详细介绍如何使用 Docker 搭建机器学习环境，包括 Docker 安装、NVIDIA Docker 配置和 Deepo 镜像使用
date: 2022-03-03T17:21:04+08:00
tags: [Docker, 机器学习, Python, CUDA, PyTorch, TensorFlow]
authors: [w0x7ce]
---

# Docker 机器学习环境搭建完整指南

Docker 为机器学习项目提供了隔离、可重现的环境。本指南将详细介绍如何搭建一个完整的机器学习开发环境。

## 方法一：使用 Deepo 镜像（推荐）

Deepo 是一个预构建的深度学习 Docker 镜像集合，包含了大多数主流的机器学习框架。

### 项目信息

- **GitHub**: [https://github.com/ufoym/deepo](https://github.com/ufoym/deepo)
- **Docker Hub**: [https://hub.docker.com/r/ufoym/deepo](https://hub.docker.com/r/ufoym/deepo)

### 支持的框架

- TensorFlow
- PyTorch
- Caffe
- Caffe2
- Theano
- Keras
- CNTK
- MXNet
- Chainer
- Lasagne
- Torch

## 配置 Docker

### 步骤 1: 卸载旧版本

```bash
sudo apt-get remove docker docker-engine docker.io containerd runc
```

### 步骤 2: 安装 Docker

#### 更新包索引

```bash
sudo apt-get update
sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
```

#### 添加 Docker 官方 GPG 密钥

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

#### 设置稳定版仓库

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

#### 安装 Docker Engine

```bash
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

### 步骤 3: 安装 NVIDIA Docker

NVIDIA Docker 是 GPU 支持的关键组件。

#### 设置 NVIDIA Container Toolkit 仓库

```bash
distribution=$(. /etc/os-release;echo $ID$VERSION_ID) \
&& curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add - \
&& curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
```

#### 启用实验特性（可选）

如需访问实验特性（如 WSL 上的 CUDA 或 A100 上的 MIG 功能）：

```bash
curl -s -L https://nvidia.github.io/nvidia-container-runtime/experimental/$distribution/nvidia-container-runtime.list | sudo tee /etc/apt/sources.list.d/nvidia-container-runtime.list
```

#### 安装 nvidia-docker2

```bash
sudo apt update
sudo apt-get install -y nvidia-docker2
```

#### 重启 Docker 服务

```bash
sudo systemctl restart docker
```

### 步骤 4: 验证 Docker 安装

```bash
# 检查 Docker 版本
docker --version

# 运行 hello-world 容器
sudo docker run hello-world

# 检查 Docker 服务状态
sudo systemctl status docker
```

### 步骤 5: 配置用户权限

```bash
# 将当前用户添加到 docker 组
sudo usermod -aG docker $USER

# 注销并重新登录，或执行
newgrp docker

# 验证（无需 sudo）
docker run hello-world
```

## 选择合适的 Deepo 镜像版本

### 查看 CUDA 版本

```bash
nvidia-smi
```

### Deepo 镜像版本列表

| 镜像 | CUDA | PyTorch | TensorFlow | 备注 |
|------|------|---------|------------|------|
| `ufoym/deepo:pytorch-cu102` | 10.2 | 1.7.1 | - | CUDA 10.2 |
| `ufoym/deepo:tf2-cu102` | 10.2 | - | 2.4.0 | TensorFlow 2 |
| `ufoym/deepo:pytorch-cu110` | 11.0 | 1.7.1 | - | CUDA 11.0 |
| `ufoym/deepo:all-cu110` | 11.0 | 1.7.1 | 2.4.1 | 完整版 |
| `ufoym/deepo:py38-cu112` | 11.2 | 1.9.0 | 2.5.0 | Python 3.8 |

### 拉取镜像

```bash
# 根据 CUDA 版本选择
docker pull ufoym/deepo:pytorch-cu102
# 或
docker pull ufoym/deepo:tf2-cu102
# 或完整版
docker pull ufoym/deepo:all-cu110
```

## 运行 Deepo 容器

### 基本命令

```bash
# 运行容器（交互式）
nvidia-docker run --name my-ml-env -p 7789:22 -p 7791:7790 -it ufoym/deepo:pytorch-cu102

# 后台运行
nvidia-docker run -d --name my-ml-env -p 7789:22 -p 7791:7790 -v /storage:/data ufoym/deepo:pytorch-cu102
```

### 参数说明

- `--name my-ml-env`: 指定容器名称
- `-p 7789:22`: 映射 SSH 端口
- `-p 7791:7790`: 映射 Jupyter 端口
- `-it`: 交互式模式
- `-v /storage:/data`: 挂载数据卷
- `nvidia-docker`: GPU 支持（已集成到 Docker 中，使用 `--gpus all`）

### 现代 Docker GPU 支持

```bash
# 使用现代 GPU 支持
docker run --gpus all -p 8888:8888 -v $(pwd):/workspace ufoym/deepo:all-cu110

# 查看 GPU 设备
docker run --gpus all --rm nvidia/cuda:11.0-base-ubuntu20.04 nvidia-smi
```

## 容器管理

### 启动和停止

```bash
# 启动容器
docker start my-ml-env

# 停止容器
docker stop my-ml-env

# 重启容器
docker restart my-ml-env
```

### 进入容器

```bash
# 附加到运行中的容器
docker attach my-ml-env

# 在运行中的容器中执行命令
docker exec -it my-ml-env bash

# 新开一个 bash 会话
docker exec -it my-ml-env /bin/bash
```

### 退出容器

```bash
# 退出但不停止容器
Ctrl + P, Ctrl + Q

# 退出并停止容器
exit
```

### 查看容器状态

```bash
# 查看所有容器
docker ps -a

# 查看容器日志
docker logs my-ml-env

# 实时查看日志
docker logs -f my-ml-env

# 查看容器资源使用
docker stats my-ml-env
```

## 镜像加速配置

在中国内地使用 Docker 时，建议配置镜像加速器以提高下载速度。

### 检查现有配置

```bash
# 检查是否已配置镜像
systemctl cat docker | grep '\-\-registry-mirror'
```

### 配置加速器

创建或编辑 `/etc/docker/daemon.json`：

```bash
sudo nano /etc/docker/daemon.json
```

添加以下内容：

```json
{
  "registry-mirrors": [
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com",
    "https://mirror.baidubce.com",
    "https://docker.mirrors.ustc.edu.cn",
    "https://cr.console.aliyun.com"
  ]
}
```

重启 Docker 服务：

```bash
sudo systemctl restart docker
```

### 验证配置

```bash
# 查看 Docker 信息
docker info | grep "Registry Mirrors"
```

## Jupyter Notebook 配置

### 启动 Jupyter

```bash
# 在容器中启动 Jupyter
docker exec -it my-ml-env jupyter notebook --ip=0.0.0.0 --port=8888 --no-browser --allow-root
```

### 浏览器访问

打开浏览器访问：
- `http://localhost:8888`
- 或使用服务器 IP：`http://your-server-ip:8888`

### 配置 Jupyter

```bash
# 生成配置文件
docker exec -it my-ml-env jupyter notebook --generate-config

# 设置密码
docker exec -it my-ml-env jupyter notebook password
```

## 数据持久化

### 挂载数据卷

```bash
# 挂载本地目录
docker run -v /host/data:/workspace/data -v /host/models:/workspace/models ufoym/deepo:all-cu110

# 挂载多个卷
docker run \
  -v /host/data:/workspace/data \
  -v /host/models:/workspace/models \
  -v /host/config:/workspace/config \
  ufoym/deepo:all-cu110
```

### 创建数据卷

```bash
# 创建数据卷
docker volume create ml-data

# 使用数据卷
docker run -v ml-data:/workspace/data ufoym/deepo:all-cu110

# 查看数据卷
docker volume ls

# 删除数据卷
docker volume rm ml-data
```

## 环境变量配置

### 设置环境变量

```bash
# 运行容器时设置
docker run -e "ENV_VAR=value" ufoym/deepo:all-cu110

# 设置多个环境变量
docker run \
  -e "CUDA_VISIBLE_DEVICES=0" \
  -e "PYTHONPATH=/workspace" \
  ufoym/deepo:all-cu110

# 从文件加载环境变量
docker run --env-file .env ufoym/deepo:all-cu110
```

## 清理和优化

### 清理容器和镜像

```bash
# 删除容器
docker rm my-ml-env

# 强制删除运行中的容器
docker rm -f my-ml-env

# 删除镜像
docker rmi ufoym/deepo:all-cu110

# 删除未使用的容器
docker container prune

# 删除未使用的镜像
docker image prune -a

# 清理所有未使用资源
docker system prune -a
```

### 优化建议

1. **使用 .dockerignore 文件**

```bash
# 在项目根目录创建 .dockerignore
echo "data/
models/
*.pyc
__pycache__/" > .dockerignore
```

2. **多阶段构建**

```dockerfile
# Dockerfile 示例
FROM ufoym/deepo:all-cu110 as base

# 复制项目文件
COPY requirements.txt .
RUN pip install -r requirements.txt

# 设置工作目录
WORKDIR /workspace
```

## 故障排除

### 常见问题

#### 1. NVIDIA Docker 不工作

```bash
# 检查 NVIDIA 驱动
nvidia-smi

# 检查 Docker GPU 支持
docker run --gpus all nvidia/cuda:11.0-base-ubuntu20.04 nvidia-smi

# 重新安装 nvidia-docker
sudo apt-get remove --purge nvidia-docker2
sudo apt-get install nvidia-docker2
sudo systemctl restart docker
```

#### 2. 权限问题

```bash
# 确保用户在 docker 组中
groups $USER

# 如果不在，添加用户
sudo usermod -aG docker $USER
newgrp docker
```

#### 3. 端口冲突

```bash
# 使用不同端口
docker run -p 9999:8888 ufoym/deepo:all-cu110

# 查看端口占用
sudo netstat -tlnp | grep 8888
```

#### 4. GPU 内存不足

```bash
# 限制 GPU 内存使用
docker run --gpus '"device=0"' -e NVIDIA_VISIBLE_DEVICES=0 ufoym/deepo:all-cu110

# 设置 CUDA 内存增长
export NVIDIA_VISIBLE_DEVICES=0
export NVIDIA_DRIVER_CAPABILITIES=compute,utility
```

## 高级用法

### 自定义 Dockerfile

```dockerfile
# 基于 Deepo 创建自定义镜像
FROM ufoym/deepo:all-cu110

# 安装额外依赖
RUN pip install seaborn plotly

# 复制项目文件
COPY . /workspace
WORKDIR /workspace

# 设置默认命令
CMD ["jupyter", "notebook", "--ip=0.0.0.0", "--port=8888", "--no-browser", "--allow-root"]
```

### 使用 Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  ml-env:
    image: ufoym/deepo:all-cu110
    ports:
      - "8888:8888"
    volumes:
      - ./data:/workspace/data
      - ./models:/workspace/models
    environment:
      - CUDA_VISIBLE_DEVICES=0
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
```

### 训练脚本自动化

```bash
# 创建训练脚本
cat > train.sh << 'EOF'
#!/bin/bash
# 启动训练

nvidia-docker run --rm \
  -v $(pwd):/workspace \
  ufoym/deepo:all-cu110 \
  python train.py --epochs 100 --batch-size 32
EOF

chmod +x train.sh
```

## 最佳实践

### 1. 项目结构

```
ml-project/
├── data/           # 数据文件
├── models/         # 保存的模型
├── notebooks/      # Jupyter 笔记本
├── scripts/        # 训练脚本
├── config/         # 配置文件
├── requirements.txt
└── Dockerfile      # 自定义镜像
```

### 2. 版本控制

- 使用 Git 管理代码
- 记录依赖版本
- 保存训练配置文件

### 3. 实验管理

- 使用 TensorBoard
- 记录超参数
- 版本化模型

### 4. 安全性

- 不要在容器中存储敏感信息
- 使用环境变量管理配置
- 定期更新基础镜像

## 总结

使用 Docker 搭建机器学习环境具有以下优势：

- **环境一致性**：确保开发、测试、生产环境一致
- **快速部署**：减少环境配置时间
- **资源隔离**：避免依赖冲突
- **易于迁移**：在不同机器间轻松迁移
- **版本控制**：可以版本化整个环境

通过本指南，您可以快速搭建一个完整的机器学习开发环境，专注于模型开发而非环境配置。

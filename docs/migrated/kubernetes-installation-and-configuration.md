---
legacy: true
title: Kubernetes 安装与配置完整指南
description: 全面介绍Kubernetes集群安装与配置，包含kubeadm和Minikube两种安装方式，适合生产环境和开发测试
tags: [Kubernetes, 容器编排, DevOps, 云计算, 集群管理]
category: DevOps
author: w0x7ce
date: 2021-09-14
---

# Kubernetes 安装与配置完整指南

本指南详细介绍了两种主要的 Kubernetes 安装方法：kubeadm（生产级）和 Minikube（开发测试）。

## 主要内容

- **kubeadm**: 生产级集群安装工具
- **Minikube**: 单节点开发测试环境

## 使用 kubeadm 安装 Kubernetes

### 系统准备

#### 基本要求

- **操作系统**: 兼容的 Linux 主机（Debian、Red Hat 等）
- **内存**: 每台机器 2GB 或更多 RAM
- **CPU**: 2 CPU 核或更多
- **网络**: 集群中所有机器网络互通
- **交换分区**: 必须禁用

#### 禁用交换分区

```bash
# 临时禁用
sudo swapoff -a

# 永久禁用（编辑 /etc/fstab）
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
```

### 确保节点唯一性

#### 检查 MAC 地址

```bash
# 方法1: 使用 ip link
ip link

# 方法2: 使用 ifconfig
ifconfig -a
```

#### 检查 product_uuid

```bash
sudo cat /sys/class/dmi/id/product_uuid
```

### 配置网络

#### 加载 br_netfilter 模块

```bash
# 检查模块是否加载
lsmod | grep br_netfilter

# 显式加载模块
sudo modprobe br_netfilter
```

#### 配置 sysctl

```bash
# 创建配置文件
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
br_netfilter
EOF

cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF

# 重新加载配置
sudo sysctl --system
```

### 安装容器运行时

#### 支持的运行时

| 运行时 | 域套接字 |
|--------|----------|
| Docker | /var/run/dockershim.sock |
| containerd | /run/containerd/containerd.sock |
| CRI-O | /var/run/crio/crio.sock |

#### 安装 Docker

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io

# 启动并设置开机自启
sudo systemctl start docker
sudo systemctl enable docker
```

#### 配置 Docker 守护进程

```bash
# 创建 Docker 配置目录
sudo mkdir -p /etc/docker

# 创建 daemon.json
sudo tee /etc/docker/daemon.json <<EOF
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2"
}
EOF

# 重启 Docker
sudo systemctl restart docker
```

### 安装 kubectl

#### 使用 curl 安装

```bash
# 下载最新版本
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

# 下载校验文件
curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"

# 验证
echo "$(<kubectl.sha256) kubectl" | sha256sum --check

# 安装
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# 清理临时文件
rm kubectl kubectl.sha256

# 验证安装
kubectl version --client
```

#### 使用包管理器安装

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl

# 添加 Kubernetes 密钥
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.28/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

# 添加仓库
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.28/deb/ /" | sudo tee /etc/apt/sources.list.d/kubernetes.list

# 安装
sudo apt-get update
sudo apt-get install -y kubectl
```

#### 使用 snap 安装

```bash
snap install kubectl --classic
```

### 安装 kubeadm、kubelet 和 kubectl

```bash
# 更新包索引
sudo apt-get update

# 安装依赖
sudo apt-get install -y apt-transport-https ca-certificates curl

# 添加 Google 密钥
curl -fsSL https://dl.k8s.io/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

# 添加仓库
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://dl.k8s.io/apt/ /" | sudo tee /etc/apt/sources.list.d/kubernetes.list

# 安装
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl

# 锁定版本
sudo apt-mark hold kubelet kubeadm kubectl
```

### 初始化控制平面

```bash
# 在主节点执行
sudo kubeadm init

# 指定 pod 网络 CIDR（可选）
sudo kubeadm init --pod-network-cidr=192.168.0.0/16

# 保存 join 命令
sudo kubeadm token create --print-join-command
```

### 配置 kubectl

```bash
# 普通用户
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

# 验证配置
kubectl cluster-info

# 查看节点
kubectl get nodes
```

### 安装网络插件

#### 安装 Calico

```bash
kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.26.1/manifests/calico.yaml
```

#### 安装 Flannel

```bash
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml
```

#### 安装 Weave Net

```bash
kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
```

### 加入工作节点

```bash
# 在每个工作节点执行（使用之前保存的 join 命令）
sudo kubeadm join <master-ip>:<port> --token <token> --discovery-token-ca-cert-hash sha256:<hash>

# 示例
sudo kubeadm join 192.168.1.100:6443 --token abcdef.0123456789abcdef --discovery-token-ca-cert-hash sha256:a1b2c3...
```

## 使用 Minikube 安装

Minikube 是在本地机器上运行单节点 Kubernetes 集群的简单方法。

### 安装 Minikube

#### 下载并安装

```bash
# 下载最新版本
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64

# 安装
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# 清理
rm minikube-linux-amd64

# 验证安装
minikube version
```

#### 使用包管理器安装

```bash
# Ubuntu/Debian
curl -fsSL https://pkgs.k8s.io/addons/kubernetes/minikube/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-minikube-apt-keyring.gpg
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-minikube-apt-keyring.gpg] https://pkgs.k8s.io/addons/kubernetes/minikube/deb/ /" | sudo tee /etc/apt/sources.list.d/kubernetes-minikube.list
sudo apt-get update
sudo apt-get install -y minikube

# CentOS/RHEL
curl -fsSL https://pkgs.k8s.io/addons/kubernetes/minikube/rpm/Release.key | sudo gpg --dearmor -o /etc/pki/rpm-gpg/kubernetes-minikube-rpm-keyring.gpg
echo "deb [signed-by=/etc/pki/rpm-gpg/kubernetes-minikube-rpm-keyring.gpg] https://pkgs.k8s.io/addons/kubernetes/minikube/rpm/ /" | sudo tee /etc/yum.repos.d/kubernetes-minikube.repo
sudo yum install -y minikube
```

### 启动集群

#### 基本启动

```bash
minikube start
```

#### 指定驱动和资源

```bash
# 使用 Docker 驱动
minikube start --driver=docker

# 指定 CPU 和内存
minikube start --cpus=4 --memory=8192

# 使用 Kubernetes 版本
minikube start --kubernetes-version=v1.28.0

# 完整配置示例
minikube start \
  --driver=docker \
  --cpus=4 \
  --memory=8192mb \
  --disk-size=50g \
  --kubernetes-version=v1.28.0
```

#### 使用其他驱动

```bash
# Docker 驱动（推荐）
minikube start --driver=docker

# VirtualBox
minikube start --driver=virtualbox

# KVM2
minikube start --driver=kvm2

# 无头模式（无 UI）
minikube start --driver=none
```

### 与集群交互

#### 使用 kubectl

```bash
# 如果已安装 kubectl
kubectl get pods -A

# 使用 Minikube 自带 kubectl
minikube kubectl -- get pods -A
```

#### 访问集群

```bash
# 获取集群信息
kubectl cluster-info

# 查看节点
kubectl get nodes

# 查看所有命名空间的 Pod
kubectl get pods -A
```

#### 启动 Dashboard

```bash
# 启动 Web UI
minikube dashboard

# 仅显示 URL
minikube dashboard --url
```

#### 远程访问

```bash
# 启动代理（本地访问）
kubectl proxy --address='0.0.0.0' --disable-filter=true

# 访问地址
# http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/http:kubernetes-dashboard:/proxy/
```

### 常用 Minikube 命令

```bash
# 查看状态
minikube status

# 停止集群
minikube stop

# 删除集群
minikube delete

# 重新创建集群
minikube delete && minikube start

# 查看日志
minikube logs

# SSH 进入节点
minikube ssh

# 挂载主机目录
minikube mount /host/path:/mnt/host

# 设置配置
minikube config set memory 8192
minikube config set cpus 4

# 查看配置
minikube config view

# 获取服务 URL
minikube service <service-name> --url

# 使用 addon
minikube addons enable dashboard
minikube addons enable metrics-server
minikube addons list
```

### Minikube 插件

```bash
# 启用插件
minikube addons enable dashboard
minikube addons enable metrics-server
minikube addons enable ingress
minikube addons enable storage-provisioner-gluster

# 查看插件列表
minikube addons list

# 禁用插件
minikube addons disable dashboard
```

## 常见问题解决

### 1. 权限问题

#### Docker 权限问题

```bash
# 问题：Got permission denied while trying to connect to the Docker daemon socket
# 解决：添加用户到 docker 组
sudo usermod -aG docker $USER

# 重新登录或执行
newgrp docker

# 验证
groups $USER
```

### 2. 网络问题

#### 端口冲突

```bash
# 检查端口占用
sudo netstat -tlnp | grep 8080

# 使用不同端口
minikube start --apiserver-port=8443
```

#### 网络插件问题

```bash
# 删除网络插件
kubectl delete -f <plugin-manifest>.yaml

# 重新安装
kubectl apply -f <plugin-manifest>.yaml

# 重置网络
minikube delete
minikube start --driver=docker
```

### 3. 资源不足

```bash
# 增加资源
minikube config set memory 8192
minikube config set cpus 4

# 重新启动
minikube delete
minikube start
```

### 4. 集群重置

```bash
# 完全重置
sudo kubeadm reset
sudo iptables -F && sudo iptables -t nat -F && sudo iptables -t mangle -F && sudo iptables -X

# 清理配置文件
rm -rf $HOME/.kube

# 重新安装
sudo kubeadm init
```

## 生产环境部署建议

### 高可用配置

#### 多主节点集群

```bash
# 初始化主节点（带高可用配置）
sudo kubeadm init --control-plane-endpoint "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT"

# 在其他主节点执行
sudo kubeadm join <master-ip>:<port> --token <token> --discovery-token-ca-cert-hash sha256:<hash> --control-plane

# 复制配置文件
sudo mkdir -p /etc/kubernetes/pki/etcd
sudo scp master-node:/etc/kubernetes/admin.conf /etc/kubernetes/admin.conf
```

#### 外部 etcd

```bash
# 使用外部 etcd 集群
sudo kubeadm init --config=kubeadm-config.yaml
```

### 节点标签和污点

```bash
# 添加节点标签
kubectl label nodes <node-name> node-role.kubernetes.io/worker=true

# 添加节点污点
kubectl taint nodes <node-name> dedicated=worker:NoSchedule
```

### 网络策略

```bash
# 创建网络策略
kubectl apply -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
EOF
```

## 最佳实践

### 1. 版本管理

- 使用一致的 Kubernetes 版本
- 定期升级组件
- 测试升级过程

### 2. 安全配置

- 启用 RBAC
- 使用网络策略
- 定期更新密钥

### 3. 监控和日志

```bash
# 安装监控
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.6.1/components.yaml

# 安装日志系统
kubectl apply -f https://raw.githubusercontent.com/fluent/fluent-bit-kubernetes-logging/master/fluent-bit-service.yaml
kubectl apply -f https://raw.githubusercontent.com/fluent/fluent-bit-kubernetes-logging/master/fluent-bit-configmap.yaml
kubectl apply -f https://raw.githubusercontent.com/fluent/fluent-bit-kubernetes-logging/master/fluent-bit-ds.yaml
```

### 4. 备份策略

```bash
# 备份 etcd
ETCDCTL_API=3 etcdctl --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key \
  snapshot save /backup/etcd-snapshot-$(date +%Y%m%d).db

# 恢复 etcd
ETCDCTL_API=3 etcdctl snapshot restore /backup/etcd-snapshot-20231201.db --name etcd-0 --data-dir=/var/lib/etcd
```

## 验证安装

### 检查集群状态

```bash
# 检查节点
kubectl get nodes

# 检查系统组件
kubectl get pods -n kube-system

# 检查集群信息
kubectl cluster-info

# 检查证书
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -text -noout

# 检查网络
kubectl run test-nginx --image=nginx --port=80 --expose
kubectl get pods
```

### 性能测试

```bash
# 安装性能测试工具
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/scheduler-perf/master/manifests/100-nodes.yaml

# 运行测试
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/scheduler-perf/master/manifests/stress.yaml
```

## 总结

- **kubeadm**: 适合生产环境，支持多节点集群
- **Minikube**: 适合开发和测试，单节点环境

选择适合的工具取决于您的需求和场景。

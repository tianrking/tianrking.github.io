---
title: "K8s安裝與配置"
date: 2022-03-04T10:37:09+08:00
draft: false

tags: ["Linux","Docker","k8s"]
categories: ["云计算","DevOps"]
author: "w0x7ce"

---

## 主要内容

- kubeadm
- Minikube

## 安装 kubeadm

### 准备开始

- 一台兼容的 Linux 主机。Kubernetes 项目为基于 Debian 和 Red Hat 的 Linux 发行版以及一些不提供包管理器的发行版提供通用的指令
- 每台机器 2 GB 或更多的 RAM （如果少于这个数字将会影响你应用的运行内存)
- 2 CPU 核或更多
- 集群中的所有机器的网络彼此均能相互连接(公网和内网都可以)
- [节点之中不可以有重复的主机名、MAC 地址或 product_uuid。](https://kubernetes.io/zh/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#verify-mac-address)
- 开启机器上的某些端口。请参见这里 了解更多详细信息。
禁用交换分区。为了保证 kubelet 正常工作，必须 禁用交换分区

### 确保每个节点上 MAC 地址和 product_uuid 的唯一性 

- 可以使用命令 ip link 或 ifconfig -a 来获取网络接口的 MAC 地址
- 可以使用 sudo cat /sys/class/dmi/id/product_uuid 命令对 product_uuid 校验

一般来讲，硬件设备会拥有唯一的地址，但是有些虚拟机的地址可能会重复。 Kubernetes 使用这些值来唯一确定集群中的节点。 如果这些值在每个节点上不唯一，可能会导致安装 失败

### 检查网络适配器

### 允许 iptables 检查桥接流量

- 确保 br_netfilter 模块被加载。通过运行 lsmod | grep br_netfilter 来完成。若要显式加载该模块，可执行 sudo modprobe br_netfilter。

为了 Linux 节点上的 iptables 能够正确地查看桥接流量，需要确保在 sysctl 配置中将 net.bridge.bridge-nf-call-iptables 设置为 1。例如：

```bash
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
br_netfilter
EOF

cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sudo sysctl --system
```

### 检查所需端口

### 安装 runtime

|||
|---|--- |
|运行时|域套接字|
|Docker|/var/run/dockershim.sock|
|containerd|/run/containerd/containerd.sock|
|CRI-O|/var/run/crio/crio.sock|

### 在 Linux 系统中安装并设置 kubectl

#### 使用Curl

1. 下載

    ```bash
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
    ```

2. 驗證

    ```bash
    curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
    ```

    ```bash
    echo "$(<kubectl.sha256) kubectl" | sha256sum --check
    ```

3. 安裝

    ```bash
    sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
    ```

4. 測試

    ```bash
    kubectl version --client
    ```

#### 使用包管理器

1. snap

    ```bash
    snap install kubectl --classic
    kubectl version --client
    ```

### 验证 kubectl 配置

通过获取集群状态的方法，检查是否已恰当的配置了 kubectl：

```bash
    kubectl cluster-info
```

如果返回一个 URL，则意味着 kubectl 成功的访问到了你的集群, 反之使用，來檢測配置

```bash
kubectl cluster-info dump
```

## 安裝 Minikube

[https://minikube.sigs.k8s.io/docs/start/](https://minikube.sigs.k8s.io/docs/start/)

### Installation 安裝

```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

### Start your cluster 開始

```bash
minikube start
```

### Interact with your cluster 交互

If you already have kubectl installed, you can now use it to access your shiny new cluster:

```bash
kubectl get po -A
```

Alternatively, minikube can download the appropriate version of kubectl and you should be able to use it like this:

```bash
minikube kubectl -- get po -A
```

```bash
minikube dashboard
minikube dashboard --url
```

远程连接可以通过使用kubectl 需要与 minikue 相同用户

```bash
kubectl proxy --address='0.0.0.0' --disable-filter=true
```

## Misc

- 新建測試用戶時候 發現 該用戶無法使用docker

    ```bash
    Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get "http://%2Fvar%2Frun%2Fdocker.sock/v1.24/version": dial unix /var/run/docker.sock: connect: permission denied
    ```

    加入docker用戶組即可

    ```bash
    cat /etc/group |grep docker
    addgroup abc docker
    groups abc
    ```

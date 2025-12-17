---
legacy: true
id: ubuntu-kvm-virtualization-guide
title: Ubuntu KVM 虚拟化完全指南
sidebar_label: Ubuntu KVM 指南
description: 详细介绍在 Ubuntu 系统中安装、配置和使用 KVM 虚拟化，包括虚拟机创建、管理、网络配置和性能优化
date: 2022-05-22T20:02:34+08:00
tags: [Ubuntu, KVM, 虚拟化, 虚拟机, Linux]
authors: [w0x7ce]
---

# Ubuntu KVM 虚拟化完全指南

KVM（Kernel-based Virtual Machine）是 Linux 平台上的开源虚拟化解决方案。本指南将详细介绍在 Ubuntu 系统中安装、配置和使用 KVM 虚拟化的完整流程。

## KVM 简介

### 什么是 KVM

KVM 是一个基于 Linux 内核的虚拟化技术：
- **类型 1 管理程序**：直接运行在硬件上
- **开源免费**：无需商业许可
- **高性能**：接近物理机性能
- **安全隔离**：虚拟机完全隔离
- **灵活管理**：支持命令行和图形界面

### KVM 的优势

- **接近原生性能**：硬件辅助虚拟化
- **低开销**：轻量级架构
- **扩展性强**：支持大规模部署
- **灵活配置**：可动态调整资源
- **丰富功能**：快照、克隆、迁移等

### 应用场景

- **测试环境**：多系统测试
- **开发环境**：隔离开发环境
- **服务器整合**：提高硬件利用率
- **云平台**：IaaS 云服务基础
- **安全隔离**：运行不可信应用

## 系统要求

### 硬件要求

- **CPU**：支持硬件虚拟化（Intel VT-x 或 AMD-V）
- **内存**：至少 4GB（推荐 8GB+）
- **磁盘**：足够的存储空间（根据需求）
- **网络**：支持的网络接口

### 软件要求

- **操作系统**：Ubuntu 18.04+（推荐 20.04/22.04 LTS）
- **内核**：Linux 2.6.20+（默认满足）
- **权限**：root 或 sudo 权限

### 检查硬件虚拟化支持

```bash
# 检查 CPU 是否支持虚拟化
grep -E "vmx|svm" /proc/cpuinfo

# 如果有输出说明支持，否则需要开启 BIOS 中的虚拟化选项

# 检查系统信息
lscpu | grep Virtualization
```

## 安装 KVM

### 步骤 1：安装必要软件包

```bash
# 更新软件包列表
sudo apt update

# 安装 KVM 核心组件
sudo apt install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils

# 安装管理工具
sudo apt install virt-manager virt-viewer

# 安装额外工具
sudo apt install cloud-image-utils genisoimage ovmf
```

### 步骤 2：添加用户到组

```bash
# 将用户添加到 libvirt 组
sudo adduser $USER libvirt

# 将用户添加到 kvm 组
sudo adduser $USER kvm

# 重新登录或使用 newgrp 使组权限生效
newgrp libvirt
newgrp kvm
```

### 步骤 3：检查服务状态

```bash
# 查看 libvirtd 服务状态
sudo systemctl status libvirtd

# 如果服务未运行，启动并设置为开机自启
sudo systemctl enable --now libvirtd

# 验证安装
virsh list --all

# 查看虚拟化支持
kvm-ok
```

## 验证安装

### 检查虚拟化功能

```bash
# 检查 KVM 模块
lsmod | grep kvm

# 应该看到类似输出：
# kvm_intel             282624  0
# kvm                   663552  1 kvm_intel

# 检查虚拟化接口
ip link show

# 查看桥接接口
brctl show
```

### 测试基本功能

```bash
# 列出所有虚拟机
virsh list --all

# 查看连接信息
virsh version

# 查看节点信息
virsh nodeinfo
```

## 图形化管理

### 使用 Virt-Manager

```bash
# 启动 Virt-Manager
virt-manager

# 或者从应用菜单启动
# Applications -> System Tools -> Virtual Machine Manager
```

### Virt-Manager 功能

- **创建虚拟机**：图形化向导
- **管理虚拟机**：启动、停止、删除
- **监控资源**：CPU、内存、磁盘使用
- **配置硬件**：添加、修改设备
- **快照管理**：创建、恢复快照

## 命令行管理

### 基础命令

```bash
# 列出运行中的虚拟机
virsh list

# 列出所有虚拟机（包括关机）
virsh list --all

# 查看虚拟机信息
virsh dominfo vm-name

# 查看虚拟机配置文件
virsh dumpxml vm-name
```

### 虚拟机生命周期管理

```bash
# 启动虚拟机
virsh start vm-name

# 关机（优雅关闭）
virsh shutdown vm-name

# 强制关机
virsh destroy vm-name

# 重启虚拟机
virsh reboot vm-name

# 暂停虚拟机
virsh suspend vm-name

# 恢复虚拟机
virsh resume vm-name

# 删除虚拟机（谨慎操作）
virsh undefine vm-name
```

### 远程管理

```bash
# 连接到远程服务器
virsh -c qemu+ssh://user@remote-host/system list

# 使用 TLS 连接
virsh -c qemu+tls://remote-host/system list

# 使用 TCP 连接（不推荐用于生产）
virsh -c qemu+tcp://remote-host/system list
```

## 创建虚拟机

### 方法 1：使用 virt-install 命令

```bash
# 基本安装（使用 ISO）
virt-install \
  --name ubuntu-vm \
  --memory 2048 \
  --vcpus 2 \
  --disk size=20 \
  --os-variant ubuntu20.04 \
  --cdrom /path/to/ubuntu-20.04.iso \
  --graphics vnc

# 使用网络安装
virt-install \
  --name centos-vm \
  --memory 4096 \
  --vcpus 4 \
  --disk size=50 \
  --os-variant centos7 \
  --location http://mirror.centos.org/centos/7/os/x86_64/ \
  --graphics vnc

# 使用 cloud-init 自动化安装
virt-install \
  --name cloud-vm \
  --memory 2048 \
  --vcpus 2 \
  --disk size=10 \
  --os-variant ubuntu20.04 \
  --cloud-init user-data=/path/to/user-data.yaml \
  --graphics none \
  --console pty,target_type=serial
```

### 方法 2：从现有镜像安装

```bash
# 使用预制镜像
virt-install \
  --name fedora-vm \
  --memory 2048 \
  --vcpus 2 \
  --disk /path/to/fedora.qcow2 \
  --os-variant fedora33 \
  --import \
  --graphics vnc

# 克隆现有虚拟机
virt-clone --original vm-name --name new-vm-name --auto-clone
```

### 方法 3：使用 virt-manager GUI

1. 启动 `virt-manager`
2. 点击"创建新虚拟机"按钮
3. 选择安装方式（ISO、网络、导入）
4. 配置虚拟机参数
5. 配置存储和网络
6. 完成安装

## 网络配置

### 网络模式

#### 1. NAT 模式（默认）

```bash
# 虚拟机可以访问外部网络，但外部无法访问虚拟机
# 适合大多数使用场景
```

#### 2. 桥接模式

```bash
# 创建桥接接口
sudo brctl addbr br0
sudo brctl addif br0 eth0

# 配置桥接（临时）
sudo ip addr del 192.168.1.100/24 dev eth0
sudo ip addr add 192.168.1.100/24 dev br0
sudo ip link set br0 up
sudo ip route add default via 192.168.1.1 dev br0

# 配置桥接（永久）
sudo cat > /etc/netplan/01-bridge.yaml << 'EOF'
network:
  version: 2
  ethernets:
    enp0s3:
      dhcp4: no
  bridges:
    br0:
      dhcp4: yes
      interfaces:
        - enp0s3
EOF

sudo netplan apply
```

#### 3. 主机模式

```bash
# 虚拟机只能与主机通信
# 适合测试和隔离环境
```

### 配置虚拟机网络

```bash
# 使用 virsh 编辑网络配置
virsh net-edit default

# 示例 NAT 网络配置
<network>
  <name>default</name>
  <uuid>xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</uuid>
  <forward mode='nat'/>
  <bridge name='virbr0' stp='on' delay='0'/>
  <ip address='192.168.122.1' netmask='255.255.255.0'>
    <dhcp>
      <range start='192.168.122.2' end='192.168.122.254'/>
    </dhcp>
  </ip>
</network>

# 重启网络
virsh net-destroy default
virsh net-start default
```

## 存储管理

### 磁盘格式

| 格式 | 特点 | 优势 | 劣势 |
|------|------|------|------|
| **qcow2** | 动态分配 | 支持快照、压缩 | 性能略低 |
| **raw** | 原始格式 | 性能最好 | 不支持快照 |
| **vmdk** | VMware 格式 | 兼容性好 | 特定环境 |
| **vdi** | VirtualBox 格式 | 兼容性好 | 特定环境 |

### 创建磁盘镜像

```bash
# 创建 qcow2 格式镜像
qemu-img create -f qcow2 /var/lib/libvirt/images/vm-disk.qcow2 20G

# 创建带预分配的镜像
qemu-img create -f qcow2 -o preallocation=metadata /var/lib/libvirt/images/vm-disk.qcow2 20G

# 从现有文件创建
qemu-img create -f qcow2 -b /path/to/base.qcow2 /var/lib/libvirt/images/vm-disk.qcow2

# 调整镜像大小
qemu-img resize /var/lib/libvirt/images/vm-disk.qcow2 +10G

# 检查镜像信息
qemu-img info /var/lib/libvirt/images/vm-disk.qcow2
```

### 磁盘管理操作

```bash
# 添加磁盘到虚拟机
virsh attach-disk vm-name /path/to/disk.qcow2 vdb --cache none

# 分离磁盘
virsh detach-disk vm-name vdb

# 快照管理
virsh snapshot-create-as vm-name snapshot-name "description"
virsh snapshot-list vm-name
virsh snapshot-revert vm-name snapshot-name
virsh snapshot-delete vm-name snapshot-name
```

## 资源管理

### 内存管理

```bash
# 动态调整内存（需要动态内存支持）
virsh setmem vm-name 2048M

# 设置最大内存
virsh setmaxmem vm-name 4096M

# 内存ballooning驱动
# 在虚拟机中需要安装 virtio-balloon
```

### CPU 管理

```bash# 设置虚拟CPU数量
virsh setvcpus vm-name 4

# 设置CPU亲和性
virsh vcpuinfo vm-name

# 绑定CPU
virsh vcpupin vm-name 0 0
virsh vcpupin vm-name 1 1
```

### 资源限制

```bash
# 使用 cgroups 限制资源
# 编辑虚拟机配置
virsh edit vm-name

# 添加资源限制
<cgroup tunables='optional'>
  <controller cgroup='memory'>
    <limit memory='2147483648'/>  # 2GB
  </controller>
  <controller cgroup='cpu'>
    <period period='100000'/>     # 100ms
    <quota quota='50000'/>        # 50%
  </controller>
</cgroup>
```

## 高级配置

### GPU 直通

```bash
# 查找GPU设备
lspci | grep VGA

# 编辑 grub 配置
sudo nano /etc/default/grub

# 添加 intel_iommu=on 或 amd_iommu=on
GRUB_CMDLINE_LINUX="intel_iommu=on"

# 更新 grub
sudo update-grub
sudo reboot

# 配置虚拟机
virsh edit vm-name

# 添加设备
<hostdev mode='subsystem' type='pci' managed='yes'>
  <source>
    <address domain='0x0000' bus='0x01' slot='0x00' function='0x0'/>
  </source>
</hostdev>
```

### 多节点集群

```bash
# 配置共享存储（NFS）
sudo apt install nfs-kernel-server
sudo mkdir -p /var/lib/libvirt/images/shared
sudo chown libvirt-qemu:kvm /var/lib/libvirt/images/shared
echo "/var/lib/libvirt/images/shared *(rw,sync,no_subtree_check)" | sudo tee -a /etc/exports
sudo exportfs -a

# 在所有节点上挂载
sudo mount -t nfs server:/var/lib/libvirt/images/shared /var/lib/libvirt/images/shared

# 配置集群网络
# 需要额外的集群管理工具如 pacemaker 或 vagrant
```

## 监控与故障排除

### 监控工具

```bash
# 查看虚拟机资源使用
virsh dominfo vm-name
virsh vcpuinfo vm-name

# 使用 virt-top
virt-top

# 查看日志
virsh console vm-name
journalctl -u libvirtd
```

### 常见问题

#### 1. 虚拟机无法启动

```bash
# 检查虚拟化支持
grep -E "vmx|svm" /proc/cpuinfo

# 检查 KVM 模块
lsmod | grep kvm

# 查看错误日志
virsh start vm-name --trace
journalctl -u libvirtd -f
```

#### 2. 网络连接问题

```bash
# 检查网络配置
virsh net-list
virsh net-info default

# 重启网络
virsh net-destroy default
virsh net-start default

# 检查防火墙
sudo iptables -L -n
```

#### 3. 性能问题

```bash
# 检查主机资源
top
htop
free -h
df -h

# 检查虚拟化性能
virsh dominfo vm-name

# 优化建议
# 1. 分配足够内存
# 2. 使用半虚拟化驱动
# 3. 开启硬件辅助虚拟化
# 4. 使用 SSD 存储
```

### 性能优化

```bash
# 使用半虚拟化驱动
# 在虚拟机中安装 virtio 驱动
# 编辑虚拟机配置添加：
<disk type='file' device='disk'>
  <driver name='qemu' type='qcow2' cache='none' io='native'/>
  <source file='/path/to/disk.qcow2'/>
  <target dev='vda' bus='virtio'/>
</disk>

# 网络优化
<interface type='network'>
  <model type='virtio'/>
</interface>

# 启用多队列
<interface type='network'>
  <model type='virtio'/>
  <driver name='vhost' queues='4'/>
</interface>
```

## 自动化管理

### 使用 cloud-init

```bash
# 创建 user-data 文件
cat > user-data << 'EOF'
#cloud-config
users:
  - name: ubuntu
    groups: sudo
    shell: /bin/bash
    ssh_authorized_keys:
      - ssh-rsa AAAAB3NzaC1yc2E...
packages:
  - vim
  - curl
  - git
runcmd:
  - echo "Hello World" > /tmp/hello.txt
  - apt update
  - apt install -y nginx
EOF

# 创建 meta-data 文件
cat > meta-data << 'EOF'
instance-id: iid-local01
local-hostname: cloud-vm
EOF

# 生成 seed 镜像
cloud-localds seed.img user-data meta-data

# 使用 seed 镜像安装虚拟机
virt-install \
  --name cloud-vm \
  --memory 2048 \
  --vcpus 2 \
  --disk seed.img \
  --disk /path/to/disk.qcow2 \
  --os-variant ubuntu20.04 \
  --import \
  --graphics none
```

### 使用脚本自动化

```bash
#!/bin/bash
# create-vm.sh - 自动创建虚拟机

VM_NAME="$1"
MEMORY="$2"
VCPU="$3"
DISK_SIZE="$4"
OS_VARIANT="$5"

if [ $# -ne 5 ]; then
    echo "用法: $0 <vm-name> <memory-MB> <vcpus> <disk-size-GB> <os-variant>"
    exit 1
fi

virt-install \
  --name "$VM_NAME" \
  --memory "$MEMORY" \
  --vcpus "$VCPU" \
  --disk size="$DISK_SIZE" \
  --os-variant "$OS_VARIANT" \
  --graphics vnc \
  --console pty,target_type=serial \
  --location http://archive.ubuntu.com/ubuntu/dists/focal/main/installer-amd64/
```

## 安全最佳实践

### 1. 访问控制

```bash
# 限制 libvirt 访问
sudo usermod -a -G libvirt $USER
sudo usermod -a -G kvm $USER

# 配置 PAM
# 编辑 /etc/pam.d/libvirt
```

### 2. 网络隔离

```bash
# 使用私有网络
virsh net-define /dev/stdin << 'EOF'
<network>
  <name>private</name>
  <bridge name='virbr1' stp='on' delay='0'/>
  <ip address='192.168.100.1' netmask='255.255.255.0'>
    <dhcp>
      <range start='192.168.100.2' end='192.168.100.254'/>
    </dhcp>
  </ip>
</network>
EOF

virsh net-start private
virsh net-autostart private
```

### 3. 审计和日志

```bash
# 启用审计
sudo auditctl -w /etc/libvirt -p wa -k libvirt-config

# 监控虚拟机操作
virsh event --domain vm-name --loop
```

## 备份和恢复

### 备份虚拟机

```bash
# 导出虚拟机配置
virsh dumpxml vm-name > vm-backup.xml

# 备份磁盘镜像
cp /var/lib/libvirt/images/vm-disk.qcow2 /backup/vm-disk-backup.qcow2

# 创建快照（推荐）
virsh snapshot-create-as vm-name backup-$(date +%Y%m%d) "Backup snapshot"
```

### 恢复虚拟机

```bash
# 重新定义虚拟机
virsh define vm-backup.xml

# 恢复磁盘镜像
cp /backup/vm-disk-backup.qcow2 /var/lib/libvirt/images/

# 启动虚拟机
virsh start vm-name
```

## 迁移

### 在线迁移

```bash
# 前提条件：
# 1. 共享存储
# 2. 网络连通性
# 3. 相同 CPU 特性

# 迁移虚拟机
virsh migrate --live vm-name qemu+ssh://destination-host/system

# 带选项迁移
virsh migrate --live --persistent --undefinish-source vm-name qemu+ssh://destination-host/system
```

### 离线迁移

```bash
# 关闭虚拟机
virsh shutdown vm-name

# 迁移配置
virsh dumpxml vm-name > vm.xml
scp vm.xml destination:/tmp/

# 迁移磁盘
rsync -avz /var/lib/libvirt/images/vm-disk.qcow2 destination:/var/lib/libvirt/images/

# 在目标主机上重新定义
virsh define /tmp/vm.xml

# 启动虚拟机
virsh start vm-name
```

## 总结

本指南全面介绍了在 Ubuntu 系统中使用 KVM 虚拟化的各个方面：

- **基础安装**：KVM 组件和工具安装
- **虚拟化管理**：命令行和图形界面管理
- **网络配置**：NAT、桥接、主机模式
- **存储管理**：磁盘格式、创建和管理
- **资源管理**：内存、CPU 限制和优化
- **高级配置**：GPU 直通、集群配置
- **监控故障**：性能监控和问题排查
- **自动化**：cloud-init 和脚本自动化
- **安全备份**：访问控制、备份恢复、迁移

掌握这些技能将帮助您：
- 构建高效的虚拟化环境
- 管理虚拟机资源
- 解决虚拟化问题
- 优化系统性能

## 进阶学习

### 相关主题

- **OpenStack**：云平台管理
- **oVirt**：企业虚拟化管理
- **Proxmox**：完整虚拟化解决方案
- **Docker**：容器化技术
- **Kubernetes**：容器编排

### 推荐资源

- [KVM 官方文档](https://www.linux-kvm.org/)
- [Libvirt 文档](https://libvirt.org/)
- [Virt-Manager 文档](https://virt-manager.org/)
- [QEMU 文档](https://www.qemu.org/)

持续实践这些概念和技术，您将成为 KVM 虚拟化专家！

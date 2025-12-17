---
legacy: true
id: linux-firewall-management-guide
title: Linux 防火墙完全指南 - iptables 与端口管理
sidebar_label: Linux 防火墙管理
description: 详细介绍 Linux 防火墙管理，包括 iptables 基础、端口转发、连接过滤、NAT 配置和安全策略实施
date: 2021-11-22T09:04:05+08:00
tags: [Linux, 防火墙, iptables, 网络安全, 端口管理]
authors: [w0x7ce]
---

# Linux 防火墙完全指南 - iptables 与端口管理

iptables 是 Linux 系统中强大的防火墙工具，用于配置网络包过滤规则。本指南将详细介绍 iptables 的使用方法、端口转发配置、连接过滤和安全管理策略。

## 防火墙简介

### 什么是防火墙

防火墙是网络安全的第一道防线，用于：
- **访问控制**：允许或阻止网络连接
- **流量过滤**：过滤恶意流量和数据包
- **网络地址转换（NAT）**：修改数据包源地址和目的地址
- **端口转发**：将流量重定向到其他端口或主机
- **日志记录**：记录网络活动和安全事件

### iptables 概述

iptables 是基于 netfilter 框架的包过滤工具：
- **内核级**：运行在内核空间，效率高
- **表和链**：使用表（tables）和链（chains）组织规则
- **状态检测**：支持连接状态跟踪
- **灵活配置**：支持复杂的网络策略

### iptables 工作原理

```
数据包流向：
[接收] -> [PREROUTING] -> [路由] -> [FORWARD] -> [POSTROUTING] -> [发送]
                |                       |
           [INPUT 链]            [OUTPUT 链]
                |                       |
            应用层                应用层
```

## iptables 基础

### 基本概念

#### 表（Tables）

| 表名 | 功能 | 链 |
|------|------|------|
| **filter** | 包过滤（默认） | INPUT, FORWARD, OUTPUT |
| **nat** | 网络地址转换 | PREROUTING, POSTROUTING, OUTPUT |
| **mangle** | 数据包修改 | PREROUTING, INPUT, FORWARD, OUTPUT, POSTROUTING |
| **raw** | 原始数据包处理 | PREROUTING, OUTPUT |
| **security** | 安全策略 | INPUT, FORWARD, OUTPUT |

#### 链（Chains）

- **INPUT**：进入本机的数据包
- **OUTPUT**：本机发出的数据包
- **FORWARD**：本机转发的数据包
- **PREROUTING**：路由前处理
- **POSTROUTING**：路由后处理

### 基本命令

```bash
# 查看所有表的所有链
iptables -L -n -v

# 查看指定表
iptables -t filter -L -n
iptables -t nat -L -n
iptables -t mangle -L -n

# 查看规则行号
iptables -L -n --line-numbers

# 查看特定链
iptables -L INPUT -n
iptables -L OUTPUT -n
iptables -L FORWARD -n

# 查看详细统计
iptables -L -n -v --line-numbers

# 清空所有规则
iptables -F
iptables -X  # 删除自定义链
iptables -Z  # 清零计数器
```

### 规则匹配条件

#### 基本匹配

```bash
# 协议匹配
-p tcp
-p udp
-p icmp
-p all

# 源地址匹配
-s 192.168.1.0/24
-s 192.168.1.100

# 目的地址匹配
-d 10.0.0.1
-d 192.168.1.0/24

# 接口匹配
-i eth0        # 输入接口
-o eth1        # 输出接口

# 端口匹配
--dport 80     # 目标端口
--sport 1024   # 源端口
-p tcp --dport 22
-p udp --dport 53
```

#### 高级匹配

```bash
# IP 范围匹配
-m iprange --src-range 192.168.1.1-192.168.1.100
-m iprange --dst-range 10.0.0.1-10.0.0.254

# MAC 地址匹配
-m mac --mac-source 00:11:22:33:44:55

# 连接状态匹配
-m state --state NEW,ESTABLISHED,RELATED
-m conntrack --ctstate NEW,ESTABLISHED,RELATED

# 端口范围匹配
-p tcp --dport 1000:2000
-p udp --sport 1:1024

# 包长度匹配
-m length --length 1000
-m length --length 1000:1500
```

### 目标动作

```bash
# 接受数据包
-j ACCEPT

# 丢弃数据包
-j DROP

# 拒绝数据包（返回错误）
-j REJECT --reject-with tcp-reset
-j REJECT --reject-with icmp-port-unreachable

# 跳转到其他链
-j my-custom-chain

# 记录日志
-j LOG --log-prefix "IPTables: "

# 转换地址（NAT）
-j DNAT --to-destination 192.168.1.100:8080
-j SNAT --to-source 203.0.113.1
-j MASQUERADE

# 修改数据包
-j MARK --set-mark 1
-j TOS --set-tos 0x10

# 跳转到用户自定义链
-j ULOG --ulog-prefix "FIREWALL: "
```

## 端口转发配置

### 单端口端口转发

#### 同端口转发

```bash
# TCP 端口转发（80 -> 192.168.1.100:80）
iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 192.168.1.100
iptables -t nat -A POSTROUTING -p tcp -d 192.168.1.100 --dport 80 -j SNAT --to-source 192.168.1.1

# UDP 端口转发
iptables -t nat -A PREROUTING -p udp --dport 53 -j DNAT --to-destination 192.168.1.100
iptables -t nat -A POSTROUTING -p udp -d 192.168.1.100 --dport 53 -j SNAT --to-source 192.168.1.1
```

#### 不同端口转发

```bash
# 将外部 8080 端口转发到内部 192.168.1.100:80
iptables -t nat -A PREROUTING -p tcp --dport 8080 -j DNAT --to-destination 192.168.1.100:80
iptables -t nat -A POSTROUTING -p tcp -d 192.168.1.100 --dport 80 -j SNAT --to-source 192.168.1.1

# 将外部 443 端口转发到内部 192.168.1.100:8443
iptables -t nat -A PREROUTING -p tcp --dport 443 -j DNAT --to-destination 192.168.1.100:8443
iptables -t nat -A POSTROUTING -p tcp -d 192.168.1.100 --dport 8443 -j SNAT --to-source 192.168.1.1
```

### 多端口端口转发

#### 连续端口范围转发

```bash
# 转发 10000-30000 端口到 192.168.1.100
iptables -t nat -A PREROUTING -p tcp --dport 10000:30000 -j DNAT --to-destination 192.168.1.100:10000-30000
iptables -t nat -A POSTROUTING -p tcp -d 192.168.1.100 --dport 10000:30000 -j SNAT --to-source 192.168.1.1

# UDP 端口范围转发
iptables -t nat -A PREROUTING -p udp --dport 10000:30000 -j DNAT --to-destination 192.168.1.100:10000-30000
iptables -t nat -A POSTROUTING -p udp -d 192.168.1.100 --dport 10000:30000 -j SNAT --to-source 192.168.1.1
```

#### 非连续端口转发

```bash
# 转发多个不连续端口
for port in 80 443 8080 8443; do
    iptables -t nat -A PREROUTING -p tcp --dport $port -j DNAT --to-destination 192.168.1.100
    iptables -t nat -A POSTROUTING -p tcp -d 192.168.1.100 --dport $port -j SNAT --to-source 192.168.1.1
done
```

### 端口重定向（本地）

```bash
# 将外部 12000-40000 端口重定向到本地 81 端口
iptables -t nat -A PREROUTING -p tcp --dport 12000:40000 -j REDIRECT --to-port 81
iptables -t nat -A PREROUTING -p udp --dport 12000:40000 -j REDIRECT --to-port 81

# 将外部连接重定向到本地应用
iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
```

### 完整配置示例

#### Web 服务器端口转发

```bash
#!/bin/bash
# Web 服务器端口转发配置

# 清空现有规则
iptables -F
iptables -t nat -F
iptables -Z

# 允许回环接口
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# 允许已建立的连接
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A OUTPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# 允许 SSH
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# 端口转发：外部 80 -> 内部 192.168.1.100:80
iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 192.168.1.100:80
iptables -t nat -A POSTROUTING -p tcp -d 192.168.1.100 --dport 80 -j SNAT --to-source 192.168.1.1

# 端口转发：外部 443 -> 内部 192.168.1.100:443
iptables -t nat -A PREROUTING -p tcp --dport 443 -j DNAT --to-destination 192.168.1.100:443
iptables -t nat -A POSTROUTING -p tcp -d 192.168.1.100 --dport 443 -j SNAT --to-source 192.168.1.1

# 允许转发到目标主机
iptables -A FORWARD -p tcp -d 192.168.1.100 --dport 80 -j ACCEPT
iptables -A FORWARD -p tcp -d 192.168.1.100 --dport 443 -j ACCEPT

# 保存规则
iptables-save > /etc/iptables/rules.v4
```

## 连接过滤与安全管理

### 基本访问控制

#### 允许特定 IP 地址

```bash
# 允许单个 IP
iptables -A INPUT -s 192.168.1.100 -j ACCEPT

# 允许 IP 范围
iptables -A INPUT -s 192.168.1.0/24 -j ACCEPT
iptables -A INPUT -s 192.168.1.0/255.255.255.0 -j ACCEPT

# 允许特定子网
iptables -A INPUT -s 10.0.0.0/8 -j ACCEPT
```

#### 阻止特定 IP 地址

```bash
# 阻止单个 IP
iptables -A INPUT -s 10.10.10.10 -j DROP

# 阻止 IP 范围
iptables -A INPUT -s 10.10.10.0/24 -j DROP
iptables -A INPUT -s 10.10.10.0/255.255.255.0 -j DROP

# 阻止恶意 IP 段
iptables -A INPUT -s 203.0.113.0/24 -j DROP
```

#### 端口访问控制

```bash
# 允许特定端口
iptables -A INPUT -p tcp --dport 22 -j ACCEPT      # SSH
iptables -A INPUT -p tcp --dport 80 -j ACCEPT      # HTTP
iptables -A INPUT -p tcp --dport 443 -j ACCEPT     # HTTPS
iptables -A INPUT -p tcp --dport 3306 -j ACCEPT    # MySQL
iptables -A INPUT -p tcp --dport 5432 -j ACCEPT    # PostgreSQL

# 阻止特定端口
iptables -A INPUT -p tcp --dport 23 -j DROP        # Telnet
iptables -A INPUT -p tcp --dport 135 -j DROP       # RPC
iptables -A INPUT -p tcp --dport 445 -j DROP       # SMB

# 阻止 UDP 端口
iptables -A INPUT -p udp --dport 53 -j DROP        # 阻止 DNS（除非需要）
```

### 协议特定过滤

```bash
# 允许 ICMP（ping）
iptables -A INPUT -p icmp --icmp-type echo-request -j ACCEPT

# 允许特定 ICMP 类型
iptables -A INPUT -p icmp --icmp-type echo-reply -j ACCEPT
iptables -A INPUT -p icmp --icmp-type destination-unreachable -j ACCEPT

# 允许 FTP
iptables -A INPUT -p tcp --dport 21 -j ACCEPT
iptables -A INPUT -p tcp --dport 20 -j ACCEPT
iptables -A INPUT -p tcp --dport 1024:65535 --sport 21 -j ACCEPT

# 允许被动 FTP
iptables -A INPUT -p tcp --dport 1024:65535 -j ACCEPT
```

### 连接状态管理

#### 状态跟踪

```bash
# NEW：新连接的第一个包
# ESTABLISHED：已建立连接的后续包
# RELATED：相关连接（如 FTP 数据连接）
# INVALID：无效包

# 允许已建立的连接
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# 允许新连接（仅 TCP）
iptables -A INPUT -p tcp -m state --state NEW -j ACCEPT

# 阻止无效连接
iptables -A INPUT -m state --state INVALID -j DROP
```

#### 双向通信示例

```bash
# 允许从 10.10.10.10 的 SSH 入站
iptables -A INPUT -p tcp --dport ssh -s 10.10.10.10 -m state --state NEW,ESTABLISHED -j ACCEPT

# 允许 SSH 出站响应
iptables -A OUTPUT -p tcp --sport ssh -d 10.10.10.10 -m state --state ESTABLISHED -j ACCEPT

# 允许 HTTP 访问
iptables -A INPUT -p tcp --dport 80 -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT -p tcp --sport 80 -m state --state ESTABLISHED -j ACCEPT
```

### 高级过滤规则

#### 基于时间的过滤

```bash
# 允许工作时间访问 SSH（9:00-18:00）
iptables -A INPUT -p tcp --dport ssh -m time --timestart 09:00 --timestop 18:00 --weekdays Mon,Tue,Wed,Thu,Fri -j ACCEPT

# 阻止非工作时间访问
iptables -A INPUT -p tcp --dport ssh -m time --timestart 18:01 --timestop 08:59 -j DROP
```

#### 连接数限制

```bash
# 限制单个 IP 的并发连接数（最多 10 个）
iptables -A INPUT -p tcp --dport 80 -m connlimit --connlimit-above 10 -j DROP

# 限制连接速率（每分钟最多 10 个新连接）
iptables -A INPUT -p tcp --dport 80 -m state --state NEW -m recent --set --name HTTP
iptables -A INPUT -p tcp --dport 80 -m state --state NEW -m recent --update --seconds 60 --hitcount 10 --name HTTP -j DROP
```

#### DDoS 防护

```bash
# 限制 SYN 包频率
iptables -A INPUT -p tcp --syn -m limit --limit 2/s --limit-burst 30 -j ACCEPT
iptables -A INPUT -p tcp --syn -j DROP

# 限制 ICMP 频率
iptables -A INPUT -p icmp --icmp-type echo-request -m limit --limit 1/s -j ACCEPT
iptables -A INPUT -p icmp --icmp-type echo-request -j DROP

# 限制新连接速率
iptables -A INPUT -p tcp -m state --state NEW -m recent --set --name SCAN
iptables -A INPUT -p tcp -m state --state NEW -m recent --update --seconds 60 --hitcount 20 --name SCAN -j DROP
```

## NAT 配置

### SNAT（源地址转换）

```bash
# 将内网 192.168.1.0/24 转换为公网 IP 203.0.113.1
iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -o eth0 -j SNAT --to-source 203.0.113.1

# 使用 IP 范围
iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -o eth0 -j SNAT --to-source 203.0.113.1-203.0.113.10

# 动态 IP 使用 MASQUERADE
iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -o ppp0 -j MASQUERADE
```

### DNAT（目的地址转换）

```bash
# 将外部访问 203.0.113.1:80 转发到内网 192.168.1.100:8080
iptables -t nat -A PREROUTING -d 203.0.113.1 -p tcp --dport 80 -j DNAT --to-destination 192.168.1.100:8080
iptables -t nat -A POSTROUTING -d 192.168.1.100 -p tcp --dport 8080 -j SNAT --to-source 192.168.1.1

# 端口范围 DNAT
iptables -t nat -A PREROUTING -p tcp --dport 2000:3000 -j DNAT --to-destination 192.168.1.100:2000-3000
```

### 端口映射

```bash
# 将内部服务映射到外部端口
iptables -t nat -A PREROUTING -p tcp --dport 8080 -j DNAT --to-destination 192.168.1.100:80
iptables -t nat -A POSTROUTING -d 192.168.1.100 -p tcp --dport 80 -j SNAT --to-source 192.168.1.1

# 数据库端口映射
iptables -t nat -A PREROUTING -p tcp --dport 3306 -j DNAT --to-destination 192.168.1.100:3306
iptables -t nat -A POSTROUTING -d 192.168.1.100 -p tcp --dport 3306 -j SNAT --to-source 192.168.1.1
```

## 日志记录

### 基本日志记录

```bash
# 记录被丢弃的数据包
iptables -A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables denied: " --log-level 7

# 记录所有 DROP 操作
iptables -A INPUT -j LOG --log-prefix "INPUT-DROP: " --log-level 4
iptables -A FORWARD -j LOG --log-prefix "FORWARD-DROP: " --log-level 4
iptables -A OUTPUT -j LOG --log-prefix "OUTPUT-DROP: " --log-level 4

# 记录特定端口的访问
iptables -A INPUT -p tcp --dport 22 -j LOG --log-prefix "SSH Access: " --log-level 4
iptables -A INPUT -p tcp --dport 80 -j LOG --log-prefix "HTTP Access: " --log-level 4
```

### 高级日志配置

```bash
# 自定义日志前缀和级别
iptables -A INPUT -j LOG --log-prefix "[IPTABLES-INPUT] " --log-level 6
iptables -A OUTPUT -j LOG --log-prefix "[IPTABLES-OUTPUT] " --log-level 6
iptables -A FORWARD -j LOG --log-prefix "[IPTABLES-FORWARD] " --log-level 6

# 记录特定 IP 的访问
iptables -A INPUT -s 10.10.10.10 -j LOG --log-prefix "Blocked IP: " --log-level 4

# 记录端口扫描
iptables -A INPUT -m state --state NEW -j LOG --log-prefix "New Connection: " --log-level 4
```

### 查看日志

```bash
# 查看内核日志
tail -f /var/log/kern.log | grep iptables

# Ubuntu/Debian
tail -f /var/log/syslog | grep iptables

# CentOS/RHEL
tail -f /var/log/messages | grep iptables

# 使用 journalctl（systemd）
journalctl -k | grep iptables
journalctl -f -k | grep iptables
```

## 规则管理

### 查看规则

```bash
# 查看所有规则
iptables -L -n -v --line-numbers

# 查看特定表
iptables -t filter -L -n -v
iptables -t nat -L -n -v
iptables -t mangle -L -n -v

# 查看规则并解析主机名和端口名
iptables -L -n --line-numbers

# 保存规则
iptables-save > /etc/iptables/rules.v4

# 从文件加载规则
iptables-restore < /etc/iptables/rules.v4
```

### 添加规则

```bash
# 在链末尾添加规则（默认）
iptables -A INPUT -p tcp --dport 80 -j ACCEPT

# 在链开头插入规则
iptables -I INPUT 1 -p tcp --dport 22 -j ACCEPT

# 在指定位置插入规则
iptables -I INPUT 3 -s 192.168.1.100 -j ACCEPT
```

### 删除规则

```bash
# 根据规则内容删除
iptables -D INPUT -p tcp --dport 80 -j ACCEPT

# 根据行号删除
iptables -D INPUT 3

# 清空指定链
iptables -F INPUT
iptables -t nat -F PREROUTING

# 删除所有用户自定义链
iptables -X
```

### 修改规则

```bash
# 修改现有规则（替换）
iptables -R INPUT 5 -p tcp --dport 8080 -j ACCEPT

# 修改规则序号
# 先删除旧规则，再添加新规则
```

## 保存与恢复规则

### Ubuntu/Debian

```bash
# 保存规则
iptables-save > /etc/iptables/rules.v4

# 恢复规则
iptables-restore < /etc/iptables/rules.v4

# 自动保存（安装 iptables-persistent）
apt-get install iptables-persistent

# 保存当前规则
netfilter-persistent save

# 恢复规则
netfilter-persistent reload
```

### CentOS/RHEL

```bash
# 保存规则
service iptables save

# 恢复规则
service iptables restart

# 使用 iptables-save
iptables-save > /etc/sysconfig/iptables
iptables-restore < /etc/sysconfig/iptables
```

### 自动化脚本

```bash
#!/bin/bash
# /etc/iptables/rules.sh

# 清空所有规则
iptables -F
iptables -X
iptables -t nat -F
iptables -t mangle -F
iptables -Z

# 默认策略
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# 允许回环
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# 允许已建立连接
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# 允许 SSH
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# 允许 HTTP/HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# 保存规则
iptables-save > /etc/iptables/rules.v4

echo "防火墙规则已更新"
```

## 最佳实践

### 安全策略

1. **默认拒绝**：将默认策略设置为 DROP
2. **最小权限**：只允许必要的服务和端口
3. **状态跟踪**：使用连接状态跟踪
4. **日志记录**：记录重要的安全事件
5. **定期审计**：检查和更新防火墙规则

### 性能优化

```bash
# 使用连接跟踪优化
echo 1000000 > /proc/sys/net/netfilter/nf_conntrack_max

# 优化 TCP 连接跟踪
echo 30 > /proc/sys/net/netfilter/nf_conntrack_tcp_timeout_established

# 启用连接跟踪日志
echo 1 > /proc/sys/net/netfilter/nf_log/2
```

### 故障排除

#### 常见问题

1. **无法连接**：
   ```bash
   # 检查防火墙规则
   iptables -L -n -v

   # 检查目标主机是否可达
   ping 192.168.1.100
   telnet 192.168.1.100 80
   ```

2. **端口转发不工作**：
   ```bash
   # 检查 IP 转发是否启用
   cat /proc/sys/net/ipv4/ip_forward

   # 启用 IP 转发
   echo 1 > /proc/sys/net/ipv4/ip_forward

   # 检查 NAT 规则
   iptables -t nat -L -n
   ```

3. **性能问题**：
   ```bash
   # 检查连接跟踪表
   cat /proc/net/nf_conntrack

   # 优化连接跟踪参数
   echo 1000000 > /proc/sys/net/netfilter/nf_conntrack_max
   ```

### 监控和诊断

```bash
# 实时查看数据包统计
watch -n 1 'iptables -L -n -v'

# 查看连接状态
cat /proc/net/nf_conntrack

# 监控特定端口
tcpdump -i eth0 port 80

# 查看系统连接
netstat -tuln
ss -tuln
```

## 总结

本指南详细介绍了 Linux 防火墙管理的各个方面：

- **基础概念**：iptables 表、链、规则匹配
- **端口转发**：单端口、多端口、本地重定向
- **连接过滤**：IP 过滤、端口过滤、协议过滤
- **安全管理**：访问控制、状态跟踪、DDoS 防护
- **NAT 配置**：SNAT、DNAT、端口映射
- **日志记录**：基本日志、高级配置
- **规则管理**：查看、添加、删除、修改
- **保存恢复**：自动保存和恢复规则

掌握这些技能将帮助您：
- 构建安全的网络环境
- 防范网络攻击
- 管理网络流量
- 解决网络问题

## 进阶主题

### 相关技术

- **nftables**：新一代防火墙工具
- **ufw**：简化的防火墙配置工具
- **firewalld**：动态防火墙管理工具
- **fail2ban**：自动阻止恶意 IP
- **Suricata**：入侵检测系统（IDS）

### 推荐资源

- [iptables 官方文档](https://www.netfilter.org/documentation/)
- [Linux 防火墙配置指南](https://www.linux.com/training-tutorials/linux-iptables-how-set-custom-firewall-rules/)
- [防火墙最佳实践](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-using-iptables-on-ubuntu)

持续实践和优化您的防火墙配置，确保网络安全！

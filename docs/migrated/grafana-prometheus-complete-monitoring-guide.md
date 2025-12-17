---
legacy: true
id: grafana-prometheus-complete-monitoring-guide
title: Grafana + Prometheus 监控完整指南
sidebar_label: Grafana Prometheus 监控
description: 详细介绍如何搭建完整的监控解决方案，包括 Prometheus 数据收集、Grafana 可视化、告警规则配置、多节点监控和最佳实践
date: 2022-03-21T20:15:19+08:00
tags: [Grafana, Prometheus, 监控, 可视化, 运维, 告警]
authors: [w0x7ce]
---

# Grafana + Prometheus 监控完整指南

监控是现代系统运维的核心组件。Grafana 和 Prometheus 是当前最流行的开源监控解决方案组合，提供强大的数据收集、存储、可视化和告警功能。

## 目录

- [监控基础概念](#监控基础概念)
- [Prometheus 简介](#prometheus-简介)
- [Grafana 简介](#grafana-简介)
- [系统架构](#系统架构)
- [安装 Prometheus](#安装-prometheus)
- [安装 Node Exporter](#安装-node-exporter)
- [配置 Prometheus](#配置-prometheus)
- [安装 Grafana](#安装-grafana)
- [创建监控面板](#创建监控面板)
- [告警配置](#告警配置)
- [多节点监控](#多节点监控)
- [监控指标详解](#监控指标详解)
- [高级配置](#高级配置)
- [最佳实践](#最佳实践)
- [故障排除](#故障排除)
- [总结](#总结)

## 监控基础概念

### 为什么需要监控

- **提前发现问题**：在用户注意到之前发现系统异常
- **性能优化**：识别性能瓶颈，优化系统资源使用
- **容量规划**：基于历史数据预测资源需求
- **故障分析**：快速定位问题根本原因
- **SLA 合规**：确保服务满足服务水平协议

### 监控的四个黄金信号

1. **延迟（Latency）**：请求响应时间
2. **流量（Traffic）**：系统负载情况
3. **错误（Errors）**：错误率和失败率
4. **饱和度（Saturation）**：资源使用情况（CPU、内存、磁盘）

### 监控层级

```
基础设施层（Infrastructure）
    ↓
应用层（Application）
    ↓
业务层（Business）
```

## Prometheus 简介

### 什么是 Prometheus

Prometheus 是由 SoundCloud 开发的开源监控系统，具有以下特点：

- **多维度数据模型**：时间序列数据通过指标名和键值对标识
- **灵活的查询语言**：PromQL 支持复杂的查询和聚合
- **不依赖分布式存储**：单个服务器节点即可工作
- **时间序列收集**：通过 HTTP 拉取模型进行数据收集
- **支持多种编程语言**：提供客户端库支持多种语言

### Prometheus 核心组件

| 组件 | 功能 |
|------|------|
| Prometheus Server | 核心服务，负责数据收集和存储 |
| Exporters | 导出器，暴露指标数据的工具 |
| Service Discovery | 服务发现，自动发现监控目标 |
| Alertmanager | 告警管理器，处理和路由告警 |
| Pushgateway | 推送网关，支持短期作业推送指标 |
| Client Libraries | 客户端库，多语言支持 |

### 数据模型

```
指标格式：<metric name>{<label name>=<label value>, ...}
示例：
  http_requests_total{method="GET", endpoint="/api/users", status="200"}
```

## Grafana 简介

### 什么是 Grafana

Grafana 是开源的可视化和监控平台，支持多种数据源：

- **丰富的可视化选项**：图表、表格、地图、仪表盘等
- **多数据源支持**：Prometheus、InfluxDB、Elasticsearch 等
- **告警功能**：内置告警引擎，支持多种通知渠道
- **用户权限管理**：细粒度的访问控制
- **插件生态**：丰富的插件和面板

## 系统架构

### 基本架构图

```
┌─────────────┐
│   Grafana   │
│  (Port 3000)│
└──────┬──────┘
       │
┌──────▼──────────────────────┐
│      Prometheus Server      │
│      (Port 9090)            │
└──────┬──────────────────────┘
       │
┌──────┴──────────────────┬────┬──────┐
│                        │    │      │
│   ┌─────────────┐      │    │  ┌───▼─────┐
│   │   Exporters │      │    │  │Pushgate │
│   │             │      │    │  │way      │
│   └─────────────┘      │    │  └────────┘
│                        │    │
│   Node Exporter        │    │
│   (Port 9100)          │    │
│                        │    │
│   App Exporter         │    │
│   (Custom Port)        │    │
└────────────────────────┴────┘
```

### 多节点架构

```
                    ┌─────────────────┐
                    │   Load Balancer │
                    │   (Nginx/HAProxy)│
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
    ┌───────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
    │  Prometheus  │ │ Prometheus  │ │ Prometheus  │
    │   Server 1   │ │   Server 2  │ │   Server 3  │
    │  (Primary)   │ │(Secondary)  │ │(Tertiary)   │
    └──────┬───────┘ └──────┬──────┘ └──────┬──────┘
           │                │                │
           └────────────────┼────────────────┘
                            │
                   ┌────────▼────────┐
                   │     Grafana     │
                   │   (HA Cluster)  │
                   └─────────────────┘
```

## 安装 Prometheus

### 系统要求

- **操作系统**：Linux（Ubuntu/CentOS/Debian）
- **内存**：至少 2GB（推荐 4GB+）
- **磁盘**：根据数据保留期，1GB/天（默认配置）
- **CPU**：2 核（推荐 4 核+）

### Ubuntu/Debian 安装

```bash
# 下载 Prometheus
wget https://github.com/prometheus/prometheus/releases/download/v2.45.0/prometheus-2.45.0.linux-amd64.tar.gz

# 解压
tar -xzf prometheus-2.45.0.linux-amd64.tar.gz

# 移动到 /usr/local/bin
sudo mv prometheus-2.45.0.linux-amd64/prometheus /usr/local/bin/
sudo mv prometheus-2.45.0.linux-amd64/promtool /usr/local/bin/

# 创建配置和存储目录
sudo mkdir -p /etc/prometheus /var/lib/prometheus

# 复制控制台文件
sudo mv prometheus-2.45.0.linux-amd64/consoles /etc/prometheus/
sudo mv prometheus-2.45.0.linux-amd64/console_libraries /etc/prometheus/

# 清理临时文件
rm -rf prometheus-2.45.0.linux-amd64*
```

### CentOS/RHEL 安装

```bash
# 使用 yum 安装（可选）
sudo yum install wget
wget https://github.com/prometheus/prometheus/releases/download/v2.45.0/prometheus-2.45.0.linux-amd64.tar.gz

# 其他步骤与 Ubuntu 相同
```

### 使用 APT 安装（推荐）

```bash
# 安装依赖
sudo apt-get install -y gnupg2 software-properties-common

# 添加 Prometheus 仓库
echo "deb https://repo.grafana.com/deb stable main" | sudo tee /etc/apt/sources.list.d/grafana.list

# 更新并安装
sudo apt-get update
sudo apt-get install -y prometheus
```

### 验证安装

```bash
# 检查版本
prometheus --version
# 输出示例：
# prometheus, version 2.45.0 (branch: HEAD, revision: 8a4e2f90e4)
#   build user:       root@9b9383f4c9b4
#   build date:       2024-01-15T12:15:28Z
#   go version:       go1.21.5
#   platform:         linux/amd64
```

## 安装 Node Exporter

### 什么是 Node Exporter

Node Exporter 是 Prometheus 的官方导出器，用于收集 Linux 系统指标：

- CPU 使用率
- 内存使用情况
- 磁盘 I/O
- 网络流量
- 文件系统空间
- 系统运行时间

### 安装步骤

```bash
# 下载 Node Exporter
wget https://github.com/prometheus/node_exporter/releases/download/v1.6.1/node_exporter-1.6.1.linux-amd64.tar.gz

# 解压
tar -xzf node_exporter-1.6.1.linux-amd64.tar.gz

# 移动到 /usr/local/bin
sudo mv node_exporter-1.6.1.linux-amd64/node_exporter /usr/local/bin/

# 清理
rm -rf node_exporter-1.6.1.linux-amd64*

# 创建专用用户
sudo useradd -rs /bin/false node_exporter
```

### 配置 Systemd 服务

创建服务文件 `/etc/systemd/system/node_exporter.service`：

```ini
[Unit]
Description=Node Exporter
After=network.target

[Service]
User=node_exporter
Group=node_exporter
Type=simple
ExecStart=/usr/local/bin/node_exporter \
    --web.listen-address=:9100 \
    --collector.textfile.directory=/var/lib/node_exporter/textfile_collector

[Install]
WantedBy=multi-user.target
```

### 启动服务

```bash
# 重新加载 systemd
sudo systemctl daemon-reload

# 启用开机自启
sudo systemctl enable node_exporter

# 启动服务
sudo systemctl start node_exporter

# 查看状态
sudo systemctl status node_exporter

# 查看日志
sudo journalctl -u node_exporter -f
```

### 测试收集

```bash
# 本地测试
curl http://localhost:9100/metrics

# 查看关键指标
curl -s http://localhost:9100/metrics | grep -E "node_cpu|node_memory|node_disk"
```

## 配置 Prometheus

### 基本配置

创建 `/etc/prometheus/prometheus.yml`：

```yaml
# 全局配置
global:
  scrape_interval: 15s       # 默认抓取间隔
  evaluation_interval: 15s   # 告警规则评估间隔
  external_labels:
    cluster: 'production'    # 集群标签
    replica: 'prometheus-1'  # 副本标签

# 告警规则文件
rule_files:
  - "alert_rules.yml"
  - "recording_rules.yml"

# 告警管理器配置
alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - localhost:9093

# 抓取配置
scrape_configs:
  # Prometheus 自身监控
  - job_name: 'prometheus'
    scrape_interval: 5s
    static_configs:
      - targets: ['localhost:9090']
    metrics_path: /metrics

  # Node Exporter 监控
  - job_name: 'node-exporter'
    scrape_interval: 10s
    static_configs:
      - targets:
          - 'localhost:9100'
          - '192.168.1.100:9100'
          - '192.168.1.101:9100'
    relabel_configs:
      - source_labels: [__address__]
        target_label: instance
        replacement: 'node-1'

  # 自定义应用监控
  - job_name: 'my-application'
    scrape_interval: 30s
    static_configs:
      - targets: ['app-server:8080']
    metrics_path: /metrics
    params:
      format: ['prometheus']
```

### 高级配置

#### 文件发现（File Discovery）

```yaml
# 使用文件进行服务发现
scrape_configs:
  - job_name: 'file-dsd'
    file_sd_configs:
      - files:
          - '/etc/prometheus/targets/*.yml'
    refresh_interval: 30s
```

创建目标文件 `/etc/prometheus/targets/web-servers.yml`：

```yaml
- targets:
  - 'web1.example.com:9100'
  - 'web2.example.com:9100'
  labels:
    group: 'web-servers'
    environment: 'production'
```

#### DNS 发现

```yaml
scrape_configs:
  - job_name: 'dns-discovery'
    dns_sd_configs:
      - names:
          - 'frontend.example.com'
          - 'backend.example.com'
        type: 'A'
        port: 9100
```

#### HTTP 服务发现

```yaml
scrape_configs:
  - job_name: 'http-sd'
    http_sd_configs:
      - url: 'http://consul-server:8500/v1/catalog/services'
        refresh_interval: 30s
```

### 配置 Prometheus 服务

创建 `/etc/systemd/system/prometheus.service`：

```ini
[Unit]
Description=Prometheus
After=network.target

[Service]
User=prometheus
Group=prometheus
Type=simple
ExecStart=/usr/local/bin/prometheus \
    --config.file /etc/prometheus/prometheus.yml \
    --storage.tsdb.path /var/lib/prometheus/ \
    --storage.tsdb.retention.time=30d \
    --web.console.templates=/etc/prometheus/consoles \
    --web.console.libraries=/etc/prometheus/console_libraries \
    --web.listen-address=0.0.0.0:9090 \
    --web.enable-lifecycle \
    --web.enable-admin-api \
    --log.level=info

[Install]
WantedBy=multi-user.target
```

### 创建 Prometheus 用户

```bash
# 创建用户
sudo useradd -rs /bin/false prometheus

# 设置权限
sudo chown -R prometheus:prometheus /etc/prometheus
sudo chown -R prometheus:prometheus /var/lib/prometheus

# 启动服务
sudo systemctl daemon-reload
sudo systemctl enable prometheus
sudo systemctl start prometheus
```

### 验证配置

```bash
# 检查配置文件语法
promtool check config /etc/prometheus/prometheus.yml

# 重新加载配置（无需重启）
curl -X POST http://localhost:9090/-/reload

# 检查目标状态
curl http://localhost:9090/api/v1/targets

# 检查 Prometheus 状态
curl http://localhost:9090/api/v1/status
```

## 安装 Grafana

### Ubuntu/Debian 安装

```bash
# 安装依赖
sudo apt-get install -y software-properties-common apt-transport-https

# 添加 Grafana 仓库
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
echo "deb https://packages.grafana.com/oss/deb stable main" | sudo tee /etc/apt/sources.list.d/grafana.list

# 更新并安装
sudo apt-get update
sudo apt-get install -y grafana

# 启动服务
sudo systemctl start grafana-server
sudo systemctl enable grafana-server
```

### 使用 Docker 安装

```bash
# 启动 Grafana
docker run -d \
  --name=grafana \
  -p 3000:3000 \
  -e "GF_SECURITY_ADMIN_PASSWORD=admin123" \
  grafana/grafana

# 持久化存储
docker run -d \
  --name=grafana \
  -p 3000:3000 \
  -v grafana-storage:/var/lib/grafana \
  -e "GF_SECURITY_ADMIN_PASSWORD=admin123" \
  grafana/grafana
```

### 访问 Grafana

- **URL**：http://localhost:3000
- **默认用户名**：admin
- **默认密码**：admin（首次登录会要求修改）

### 配置数据源

登录后，按照以下步骤添加 Prometheus 数据源：

1. 点击左侧菜单 **Configuration** > **Data sources**
2. 点击 **Add data source**
3. 选择 **Prometheus**
4. 配置参数：
   - **Name**：Prometheus
   - **URL**：http://localhost:9090
   - **Access**：Server (default)
5. 点击 **Save & Test**

## 创建监控面板

### 创建第一个面板

1. 点击 **+** > **Dashboard**
2. 点击 **Add new panel**
3. 选择可视化类型（如 Graph、Stat、Table 等）
4. 输入 PromQL 查询

### 常用查询示例

#### CPU 使用率

```promql
# 1 - CPU 空闲率
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# 按模式分组
sum(rate(node_cpu_seconds_total{mode!="idle"}[5m])) by (mode) * 100
```

#### 内存使用率

```promql
# 已用内存百分比
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100

# 内存使用量（字节）
node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes
```

#### 磁盘使用率

```promql
# 磁盘使用百分比
100 - ((node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100)

# 磁盘 I/O
rate(node_disk_read_bytes_total[5m])
rate(node_disk_written_bytes_total[5m])
```

#### 网络流量

```promql
# 网络接收速率
rate(node_network_receive_bytes_total[5m])

# 网络发送速率
rate(node_network_transmit_bytes_total[5m])

# 按设备分组
sum(rate(node_network_receive_bytes_total[5m])) by (device)
sum(rate(node_network_transmit_bytes_total[5m])) by (device)
```

### 仪表盘变量

创建可复用的仪表盘：

1. 点击仪表盘设置（齿轮图标）
2. 选择 **Variables** > **Add variable**
3. 配置变量：

```yaml
Name: instance
Type: Query
Query: label_values(node_cpu_seconds_total, instance)
```

### 导入官方仪表盘

```bash
# Node Exporter 官方仪表盘 ID：1860
# 进入 Grafana > Dashboard > Import
# 输入 ID：1860
# 选择数据源：Prometheus
# 点击 Import
```

### 自定义仪表盘模板

创建 `/etc/grafana/provisioning/dashboards/dashboard.yml`：

```yaml
apiVersion: 1

providers:
  - name: 'default'
    orgId: 1
    folder: ''
    type: file
    disableDeletion: false
    updateIntervalSeconds: 10
    allowUiUpdates: true
    options:
      path: /etc/grafana/dashboards
```

## 告警配置

### Alertmanager 安装

```bash
# 下载 Alertmanager
wget https://github.com/prometheus/alertmanager/releases/download/v0.26.0/alertmanager-0.26.0.linux-amd64.tar.gz

# 解压
tar -xzf alertmanager-0.26.0.linux-amd64.tar.gz

# 移动
sudo mv alertmanager-0.26.0.linux-amd64/alertmanager /usr/local/bin/
sudo mv alertmanager-0.26.0.linux-amd64/amtool /usr/local/bin/

# 创建配置目录
sudo mkdir -p /etc/alertmanager

# 创建用户
sudo useradd -rs /bin/false alertmanager
```

### 配置 Alertmanager

创建 `/etc/alertmanager/alertmanager.yml`：

```yaml
global:
  smtp_smarthost: 'smtp.gmail.com:587'
  smtp_from: 'alerts@yourcompany.com'
  smtp_auth_username: 'alerts@yourcompany.com'
  smtp_auth_password: 'your-app-password'

# 路由配置
route:
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'default'
  routes:
    - match:
        severity: critical
      receiver: 'critical-alerts'
    - match:
        service: web
      receiver: 'web-team'

# 接收器配置
receivers:
  - name: 'default'
    email_configs:
      - to: 'ops@yourcompany.com'
        subject: '[{{ .GroupLabels.alertname }}] {{ .GroupLabels.instance }}'

  - name: 'critical-alerts'
    email_configs:
      - to: 'ops-oncall@yourcompany.com'
        subject: '🚨 CRITICAL: {{ .GroupLabels.alertname }}'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK'
        channel: '#alerts'
        title: 'Critical Alert'
        text: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'

  - name: 'web-team'
    email_configs:
      - to: 'web-team@yourcompany.com'
    webhook_configs:
      - url: 'http://webhook-service:8080/alerts'
```

### 配置 Alertmanager 服务

创建 `/etc/systemd/system/alertmanager.service`：

```ini
[Unit]
Description=Alertmanager
After=network.target

[Service]
User=alertmanager
Group=alertmanager
Type=simple
ExecStart=/usr/local/bin/alertmanager \
    --config.file=/etc/alertmanager/alertmanager.yml \
    --storage.path=/var/lib/alertmanager \
    --web.external-url=http://alertmanager.example.com \
    --cluster.advertise-address=0.0.0.0:9093

[Install]
WantedBy=multi-user.target
```

### 告警规则

创建 `/etc/prometheus/alert_rules.yml`：

```yaml
groups:
  - name: node.rules
    rules:
      # 实例宕机告警
      - alert: InstanceDown
        expr: up == 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Instance {{ $labels.instance }} is down"
          description: "{{ $labels.instance }} has been down for more than 5 minutes."

      # CPU 使用率告警
      - alert: HighCPUUsage
        expr: 100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage on {{ $labels.instance }}"
          description: "CPU usage is above 80% for more than 10 minutes."

      # 内存使用率告警
      - alert: HighMemoryUsage
        expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 85
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage on {{ $labels.instance }}"
          description: "Memory usage is above 85% for more than 10 minutes."

      # 磁盘使用率告警
      - alert: HighDiskUsage
        expr: |
          (
            node_filesystem_size_bytes{fstype!="tmpfs"} -
            node_filesystem_avail_bytes{fstype!="tmpfs"}
          ) / node_filesystem_size_bytes{fstype!="tmpfs"} * 100 > 85
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High disk usage on {{ $labels.instance }}"
          description: "Disk usage is above 85% on {{ $labels.mountpoint }}."

      # 磁盘只读告警
      - alert: DiskWillFillIn4Hours
        expr: |
          predict_linear(
            node_filesystem_avail_bytes[1h],
            4*60*60
          ) < 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Disk will fill in 4 hours on {{ $labels.instance }}"
          description: "Disk {{ $labels.mountpoint }} on {{ $labels.instance }} is predicted to fill within 4 hours."
```

### 验证告警

```bash
# 检查规则语法
promtool check rules /etc/prometheus/alert_rules.yml

# 查看激活的告警
curl http://localhost:9090/api/v1/alerts

# 查看告警历史
curl http://localhost:9090/api/v1/alerts?active=true
```

## 多节点监控

### 部署架构

```
Monitoring Server (Prometheus + Grafana)
├── Node Exporter (每个节点)
├── Application Exporter (按需)
└── Pushgateway (可选)
```

### 远程写入（Remote Write）

修改 `prometheus.yml` 添加远程存储：

```yaml
remote_write:
  - url: "https://remote-storage.example.com/api/v1/write"
    queue_config:
      max_samples_per_send: 1000
      max_shards: 200
      capacity: 2500
    write_relabel_configs:
      - source_labels: [__name__]
        regex: "node_.*"
        target_label: cluster
        replacement: "production"
```

### 高可用 Prometheus

使用两个 Prometheus 实例：

```yaml
# prometheus.yml (主节点)
global:
  external_labels:
    cluster: 'production'
    replica: 'primary'

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets:
          - 'localhost:9090'
          - 'prometheus-2:9090'
```

### 联邦（Federation）

从其他 Prometheus 实例获取特定指标：

```yaml
scrape_configs:
  - job_name: 'federate'
    honor_labels: true
    metrics_path: '/federate'
    params:
      'match[]':
        - '{__name__=~"node_.*"}'
    static_configs:
      - targets:
          - 'prometheus-remote-1:9090'
          - 'prometheus-remote-2:9090'
```

## 监控指标详解

### Node Exporter 核心指标

#### CPU 指标

| 指标名 | 描述 | 示例 |
|--------|------|------|
| `node_cpu_seconds_total` | CPU 时间（秒） | `node_cpu_seconds_total{cpu="0",mode="idle"}` |
| `rate(node_cpu_seconds_total[5m])` | CPU 使用率 | 0.85 = 85% |

#### 内存指标

| 指标名 | 描述 | 示例 |
|--------|------|------|
| `node_memory_MemTotal_bytes` | 总内存 | 8,589,934,592 (8GB) |
| `node_memory_MemAvailable_bytes` | 可用内存 | 4,294,967,296 (4GB) |
| `node_memory_MemFree_bytes` | 空闲内存 | 2,147,483,648 (2GB) |
| `node_memory_Buffers_bytes` | 缓冲区 | 536,870,912 (512MB) |

#### 磁盘指标

| 指标名 | 描述 | 示例 |
|--------|------|------|
| `node_filesystem_size_bytes` | 文件系统总大小 | 1,099,511,627,776 (1TB) |
| `node_filesystem_avail_bytes` | 文件系统可用空间 | 879,609,302,220 (800GB) |
| `node_disk_read_bytes_total` | 磁盘读取字节 | 1,073,741,824 (1GB) |
| `node_disk_written_bytes_total` | 磁盘写入字节 | 2,147,483,648 (2GB) |

#### 网络指标

| 指标名 | 描述 | 示例 |
|--------|------|------|
| `node_network_receive_bytes_total` | 网络接收字节 | 1,073,741,824 |
| `node_network_transmit_bytes_total` | 网络发送字节 | 2,147,483,648 |

### 自定义指标

#### 应用级指标

```go
// Go 应用示例
package main

import (
    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promhttp"
    "net/http"
)

var (
    httpRequestsTotal = prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "http_requests_total",
            Help: "Total HTTP requests",
        },
        []string{"method", "endpoint", "status"},
    )
)

func init() {
    prometheus.MustRegister(httpRequestsTotal)
}

func handler(w http.ResponseWriter, r *http.Request) {
    httpRequestsTotal.WithLabelValues(r.Method, r.URL.Path, "200").Inc()
    w.Write([]byte("Hello"))
}

func main() {
    http.Handle("/metrics", promhttp.Handler())
    http.HandleFunc("/", handler)
    http.ListenAndServe(":8080", nil)
}
```

## 高级配置

### 性能调优

#### Prometheus 配置优化

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  scrape_timeout: 10s
  evaluation_interval: 15s

# 针对高基数指标优化
scrape_configs:
  - job_name: 'high-cardinality'
    scrape_interval: 30s  # 降低抓取频率
    scrape_timeout: 15s

# 限制标签数量
metric_relabel_configs:
  - source_labels: [__name__]
    regex: 'debug_.*'
    action: drop

# 记录规则优化
recording_rules.yml:
  groups:
    - name: performance
      interval: 30s
      rules:
        - record: instance:cpu_usage:5m
          expr: 100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

#### 存储优化

```yaml
# 增加数据保留期
storage:
  tsdb:
    retention.time: 90d        # 保留 90 天
    retention.size: 50GB       # 保留 50GB
    wal-compression: true      # 压缩 WAL
```

### 安全配置

#### 启用 TLS

```bash
# 生成自签名证书
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# 配置 Prometheus 使用 TLS
ExecStart=/usr/local/bin/prometheus \
    --web.tls-cert-file=/etc/ssl/certs/prometheus.crt \
    --web.tls-key-file=/etc/ssl/private/prometheus.key
```

#### 启用身份验证

```bash
# 安装工具
sudo apt-get install apache2-utils

# 创建密码文件
htpasswd -c /etc/prometheus/.htpasswd admin

# 配置 Prometheus
ExecStart=/usr/local/bin/prometheus \
    --web.auth.config=/etc/prometheus/.htpasswd
```

### Kubernetes 集成

#### 使用 Prometheus Operator

```bash
# 安装 Prometheus Operator
kubectl apply -f https://raw.githubusercontent.com/prometheus-operator/prometheus-operator/main/bundle.yaml

# 创建 Prometheus 实例
kubectl apply -f - <<EOF
apiVersion: monitoring.coreos.com/v1
kind: Prometheus
metadata:
  name: prometheus
spec:
  serviceAccountName: prometheus
  serviceMonitorSelector:
    matchLabels:
      team: platform
  resources:
    requests:
      memory: 400Mi
      cpu: 200m
    limits:
      memory: 2Gi
      cpu: 1000m
EOF
```

#### ServiceMonitor

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: node-exporter
  labels:
    team: platform
spec:
  selector:
    matchLabels:
      app: node-exporter
  endpoints:
    - port: metrics
      interval: 30s
```

## 最佳实践

### 1. 命名规范

- **指标名使用下划线**：`http_requests_total`
- **标签值使用小写**：`instance="web-01"`
- **避免动态标签**：不要使用时间戳或用户 ID 作为标签
- **描述指标**：使用 HELP 注释说明指标含义

### 2. 标签管理

```yaml
# 推荐：固定标签
job: 'web-server'
env: 'production'
region: 'us-east-1'

# 避免：动态标签（高基数问题）
user_id: '12345'  # 避免：高基数
timestamp: '2024-01-01'  # 避免：唯一值太多
```

### 3. 告警设计

```yaml
# 好的告警规则
- alert: HighErrorRate
  expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
  for: 10m
  labels:
    severity: critical
  annotations:
    summary: "High error rate detected"
    description: "Error rate is {{ $value | humanizePercentage }} for {{ $labels.service }}"
```

### 4. 仪表盘设计

- **使用模板变量**：让仪表盘可复用
- **颜色编码**：绿色（正常）、黄色（警告）、红色（严重）
- **合理布局**：重要指标放在顶部
- **添加单位**：确保数据有明确的单位（%、MB、MB/s 等）

### 5. 监控覆盖率

```
基础设施监控 (100%)
├── 服务器资源 (CPU/内存/磁盘/网络)
├── 服务状态 (端口可达性)
└── 日志错误 (错误率)

应用监控 (90%)
├── 响应时间
├── 吞吐量
├── 错误率
└── 业务指标

用户体验监控 (70%)
├── 页面加载时间
├── API 响应时间
└── 可用性检查
```

### 6. 数据保留策略

```yaml
# 短期存储（高频）
storage:
  tsdb:
    retention.time: 15d
    retention.size: 10GB

# 长期存储（低频）
remote_write:
  - url: "https://long-term-storage/api/v1/write"
    queue_config:
      max_samples_per_send: 1000
    write_relabel_configs:
      - source_labels: [__name__]
        regex: "node_.*"
        target_label: __scheme__
        replacement: "v2"
```

### 7. 测试监控

```bash
# 生成测试负载
yes "GET /test" | nc -w 1 web-server 8080

# 模拟错误
for i in {1..10}; do curl http://localhost:8080/error; done

# 验证告警
curl -X POST http://localhost:9093/api/v1/alerts
```

## 故障排除

### 常见问题

#### 1. Prometheus 无法抓取指标

```bash
# 检查网络连通性
curl -v http://target-host:9100/metrics

# 检查防火墙
sudo ufw status
sudo ufw allow 9090/tcp

# 检查服务状态
sudo systemctl status node_exporter

# 查看日志
sudo journalctl -u prometheus -f
```

#### 2. 告警未触发

```bash
# 检查告警规则
promtool check rules /etc/prometheus/alert_rules.yml

# 查看当前告警
curl http://localhost:9090/api/v1/alerts

# 检查 Alertmanager 连接
curl http://localhost:9093/api/v1/status
```

#### 3. Grafana 面板无数据

```bash
# 验证数据源配置
curl http://localhost:3000/api/datasources/proxy/1/api/v1/targets

# 检查查询语法
curl 'http://localhost:9090/api/v1/query?query=up'

# 查看 Grafana 日志
sudo tail -f /var/log/grafana/grafana.log
```

#### 4. 性能问题

```bash
# 检查 Prometheus 资源使用
curl http://localhost:9090/api/v1/status/config

# 查看样本数量
curl http://localhost:9090/api/v1/label/__name__/values | wc -l

# 分析慢查询
curl http://localhost:9090/api/v1/query?query=rate(http_requests_total[5m])&time=$(date +%s)
```

#### 5. 存储问题

```bash
# 检查磁盘使用
df -h /var/lib/prometheus

# 查看数据块大小
ls -lh /var/lib/prometheus/wal

# 清理旧数据（谨慎操作）
promtool tsdb compact /var/lib/prometheus
```

### 调试技巧

```bash
# 1. 使用 PromQL 查询
curl 'http://localhost:9090/api/v1/query?query=up'

# 2. 查看实时日志
sudo journalctl -u prometheus -f

# 3. 检查配置
cat /etc/prometheus/prometheus.yml | grep -A 5 job_name

# 4. 验证网络
nc -zv target-host 9100

# 5. 分析性能
curl http://localhost:9090/api/v1/status/flags
```

## 总结

本指南详细介绍了 Grafana + Prometheus 监控解决方案的完整搭建过程：

- **核心组件**：Prometheus 数据收集、Grafana 可视化、Alertmanager 告警
- **安装部署**：详细的安装步骤和配置方法
- **监控指标**：系统、应用、业务级指标监控
- **告警配置**：多渠道告警通知
- **高级功能**：多节点监控、高可用、安全配置
- **最佳实践**：命名规范、性能优化、故障排除

通过这套监控解决方案，您可以：

- **实时掌握系统健康状况**：CPU、内存、磁盘、网络
- **快速发现和定位问题**：自动告警通知
- **优化系统性能**：基于数据的容量规划
- **提升运维效率**：自动化监控和告警

## 相关资源

- [Prometheus 官方文档](https://prometheus.io/docs/)
- [Grafana 官方文档](https://grafana.com/docs/)
- [Node Exporter 指标参考](https://prometheus.io/docs/instrumenting/exporters/)
- [PromQL 查询语言](https://prometheus.io/docs/prometheus/latest/querying/basics/)

持续学习和实践，您将成为监控专家！

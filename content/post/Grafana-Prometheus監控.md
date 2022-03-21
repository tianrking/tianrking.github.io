---
title: "Grafana Prometheus監控"
date: 2022-03-21T20:15:19+08:00
draft: false

tags: ["Grafana","Prometheus"]
categories: ["運維","可視化"]
author: "w0x7ce"

---

## Unfinished

## Installing node_exporter

```bash
wget https://github.com/prometheus/node_exporter/releases/download/v0.15.2/node_exporter-0.15.2.linux-amd64.tar.gz
```

```bash
tar -xf node_exporter-0.15.2.linux-amd64.tar.gz
```

```bash
sudo mv node_exporter-0.15.2.linux-amd64/node_exporter /usr/local/bin
```

```bash
rm -r node_exporter-0.15.2.linux-amd64*
```

```bash
sudo useradd -rs /bin/false node_exporter
```

```bash
sudo nano /etc/systemd/system/node_exporter.service
```

```txt
[Unit]
Description=Node Exporter
After=network.target

[Service]
User=node_exporter
Group=node_exporter
Type=simple
ExecStart=/usr/local/bin/node_exporter

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable node_exporter
sudo systemctl start node_exporter
```

## Installing Prometheus

```bash
wget https://github.com/prometheus/prometheus/releases/download/v2.1.0/prometheus-2.1.0.linux-amd64.tar.gz
```

```bash
tar -xf prometheus-2.1.0.linux-amd64.tar.gz
```

```bash
sudo mv prometheus-2.1.0.linux-amd64/prometheus prometheus-2.1.0.linux-amd64/promtool /usr/local/bin
```

```bash
sudo mkdir /etc/prometheus /var/lib/prometheus
```

```bash
sudo mv prometheus-2.1.0.linux-amd64/consoles prometheus-2.1.0.linux-amd64/console_libraries /etc/prometheus
```

```bash
rm -r prometheus-2.1.0.linux-amd64*
```

Go to /etc/hosts and add the following lines, replace x.x.x.x with the machine’s corresponding IP address

```bash
x.x.x.x prometheus-target-1
x.x.x.x prometheus-target-2
```

We will use /etc/prometheus/prometheus.yml as our configuration file

```yml
global:
  scrape_interval: 10s

scrape_configs:
  - job_name: 'prometheus_metrics'
    scrape_interval: 5s
    static_configs:
      - targets: ['localhost:9090']
  - job_name: 'node_exporter_metrics'
    scrape_interval: 5s
    static_configs:
      - targets: ['localhost:9100','prometheus-target-1:9100','prometheus-target-2:9100']
```

```bash
sudo useradd -rs /bin/false prometheus
sudo chown -R prometheus: /etc/prometheus /var/lib/prometheus
```

Then, we will create a systemd unit file in /etc/systemd/system/prometheus.service with the following contents :

```config
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
    --web.console.templates=/etc/prometheus/consoles \
    --web.console.libraries=/etc/prometheus/console_libraries

[Install]
WantedBy=multi-user.target
```


---
legacy: true
id: linux-disk-space-cleanup
title: Linux 磁盘空间清理完整指南
sidebar_label: 磁盘空间清理
description: 详细介绍Linux系统磁盘空间管理，包括df、du、tune2fs命令的使用，以及实际案例分析（Docker容器空间清理）
date: 2022-08-12T10:37:09+08:00
tags: [Linux, Docker, DevOps, 系统管理]
authors: [w0x7ce]
---

# Linux 磁盘空间清理完整指南

当Linux系统磁盘空间不足时，如何快速定位并清理无用文件是每个系统管理员必备的技能。本指南将详细介绍各种磁盘空间分析工具和实际清理案例。

## 基础磁盘空间分析工具

### 1. df 命令 - 磁盘空间使用情况

`df` 命令用于获取硬盘被占用了多少空间，目前还剩下多少空间等信息。它也可以显示所有文件系统对 i 节点和磁盘块的使用情况。

#### 语法和选项

```bash
df [选项] [文件系统...]
```

#### 常用选项

| 选项 | 说明 | 示例 |
|------|------|------|
| `-a` | 显示所有文件系统的磁盘使用情况，包括0块的文件系统 | ` |
| `-kdf -a`` | 以KB字节为单位显示 | `df -k` |
| `-h` | 以人类可读的格式显示（自动选择单位） | `df -h` |
| `-i` | 显示i节点信息，而不是磁盘块 | `df -i` |
| `-T` | 显示文件系统类型 | `df -T` |
| `-t <type>` | 显示指定类型的文件系统 | `df -t ext4` |
| `-x <type>` | 排除指定类型的文件系统 | `df -x tmpfs` |

#### 使用示例

```bash
# 基本用法 - 以人类可读格式显示
df -h

# 输出示例
Filesystem     1K-blocks    Used Available Use% Mounted on
tmpfs             202488     968    201520   1% /run
/dev/vda2       51538380 6022796  45499200  12% /
tmpfs            1012440      24   1012416   1% /dev/shm
tmpfs               5120       0      5120   0% /run/lock
```

#### 输出说明

- **Filesystem**: 文件系统对应的设备文件路径
- **1K-blocks**: 分区的数据块总数（1024字节为单位）
- **Used**: 已使用的磁盘块数
- **Available**: 可用的磁盘块数
- **Use%**: 磁盘空间使用百分比
- **Mounted on**: 文件系统的挂载点

:::note
注意：第3、4列块数之和不一定等于第2列。这是因为每个分区都预留了少量空间供系统管理员使用。即使普通用户空间已满，管理员仍能登录和解决问题。
:::

### 2. du 命令 - 目录空间使用统计

`du` (disk usage) 命令用于显示磁盘空间的使用情况，统计目录（或文件）所占磁盘空间的大小。

#### 语法和选项

```bash
du [选项] [目录或文件...]
```

#### 常用选项

| 选项 | 说明 | 示例 |
|------|------|------|
| `-s` | 只显示总计，不显示子目录 | `du -sh /var/log` |
| `-a` | 显示所有文件和目录的大小 | `du -a /home` |
| `-h` | 以人类可读的格式显示 | `du -h /etc/apt` |
| `-k` | 以KB字节为单位显示 | `du -k /home` |
| `-m` | 以MB字节为单位显示 | `du -m /tmp` |
| `-c` | 最后加上总计 | `du -c /var/log` |
| `--max-depth=N` | 指定目录深度 | `du -h --max-depth=1 /var` |
| `-x` | 跳过不同文件系统上的目录 | `du -x /` |

#### 使用示例

```bash
# 查看目录总大小
du -sh /etc/apt

# 输出示例
104K    /etc/apt

# 查看目录详细占用
du -h /etc/apt

# 输出示例
12K     ./apt/trusted.gpg.d
4.0K    ./apt/keyrings
64K     ./apt/apt.conf.d
4.0K    ./apt/auth.conf.d
4.0K    ./apt/preferences.d
4.0K    ./apt/sources
4.0K    ./apt/sources.list.d
104K    ./apt
```

#### 查找大文件

```bash
# 查找根目录下大于500MB的文件
find / -size +500M -type f -exec du -h {} \; | sort -hr

# 查找当前目录下最大的10个文件
du -ah . | sort -hr | head -n 10
```

### 3. tune2fs 命令 - 文件系统参数调整

`tune2fs` 命令用于调整 ext2、ext3、ext4 文件系统的参数。

#### 常用选项

| 选项 | 说明 | 示例 |
|------|------|------|
| `-l` | 显示文件系统信息 | `tune2fs -l /dev/sda1` |
| `-L <label>` | 设置文件系统标签 | `tune2fs -L mydisk /dev/sda1` |
| `-m <percent>` | 设置保留空间百分比 | `tune2fs -m 1 /dev/sda1` |
| `-c <count>` | 设置挂载次数检查 | `tune2fs -c 30 /dev/sda1` |
| `-i <interval>` | 设置检查间隔 | `tune2fs -i 6m /dev/sda1` |
| `-j` | 添加日志功能（转ext3） | `tune2fs -j /dev/sda1` |

#### 使用示例

```bash
# 查看文件系统详细信息
tune2fs -l /dev/vda2

# 部分输出示例
Filesystem volume name:   Disk_One
Last mounted on:          /
Filesystem UUID:          7bccaefa-b039-4ff6-bd32-22dde0066c0b
Filesystem magic number:  0xEF53
Filesystem revision #:    1 (dynamic)
Inode count:              3276800
Block count:              13106683
Reserved block count:     0
Free blocks:              12042633
Free inodes:              3179795
Block size:               4096
Inode size:               256
Journal inode:            8
```

#### 常用操作

```bash
# 1. 修改文件系统标签
tune2fs -L myserver_disk /dev/sda1

# 2. 减少保留空间比例（从5%降到1%）
tune2fs -m 1 /dev/sda1

# 3. 设置挂载次数检查（每30次挂载检查一次）
tune2fs -c 30 /dev/sda1

# 4. 设置时间间隔检查（每6个月检查一次）
tune2fs -i 6m /dev/sda1
```

:::tip
**保留空间说明**
默认情况下，ext2/3/4文件系统会保留5%的空间给root用户。减少这个比例可以释放更多空间给普通用户使用。
:::

## 实际案例分析：Docker 容器空间清理

### 问题场景

服务器磁盘空间告急，需要紧急清理：

```bash
# 初始状态 - 磁盘使用100%
root@slave01:~# df -h
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda4       221G  217G  4.8G  100% /
```

### 解决步骤

#### 步骤1: 定位大文件

```bash
# 在根目录下查找大于500MB的文件
find / -size +500M -type f -exec du -h {} \; | sort -hr > /root/large_files.log

# 查看结果
cat /root/large_files.log
```

#### 步骤2: 分析可疑文件系统

```bash
# 检查文件系统类型和挂载点
df -h -T

# 关注可疑的文件系统（如overlay、Docker相关）
mount -t overlay
```

#### 步骤3: 检查 Docker 容器空间

```bash
# 进入Docker目录
cd /var/lib/docker/overlay2

# 查看各目录占用情况
du -h --max-depth=1 | sort -hr

# 输出示例
244G    .
70G     ./28bbbb41fef8d50f3ecf916b6134e73ba7e7348120fa78314df5ffdbe1dc7d797
18G     ./f187076c8cc73e4212e7b59944af7665800961898f345c54d7210adddacdc0fe
14G     ./84b5916793a1773e5835462fdd0467acb3576e94743cdc79c9e08504ac52ca31
11G     ./3ab0a88edd37a7e5df24d68b4e5f59f0aee2f01419b9a6f82b982e3f7e89ef79
```

#### 步骤4: 识别孤儿容器

```bash
# 检查容器对应的overlay目录
docker ps -q | xargs docker inspect \
  --format '{{.State.Pid}}, {{.Name}}, {{.GraphDriver.Data.WorkDir}}'

# 如果找不到对应容器，这些是残留文件，可以安全删除
```

#### 步骤5: 清理 Docker 空间

```bash
# 删除所有停止的容器
docker container prune

# 删除所有未使用的镜像
docker image prune -a

# 删除所有未使用的数据卷
docker volume prune

# 删除所有未使用的网络
docker network prune

# 完全清理（包含所有未使用对象）
docker system prune -a

# 强制删除特定目录（如果确认是孤儿文件）
rm -rf /var/lib/docker/overlay2/28bbbb41fef8d50f3ecf916b6134e73ba7e7348120fa78314df5ffdbe1dc7d797
```

#### 步骤6: 调整文件系统保留空间

```bash
# 将保留空间比例从5%降到1%
tune2fs -m 1 /dev/sda4
```

#### 步骤7: 验证结果

```bash
# 重新检查磁盘使用情况
df -h

# 结果对比
# 之前: /dev/sda4  221G  217G  4.8G  100% /
# 之后: /dev/sda4  221G  214G  4.8G   98% /
```

## 自动化清理脚本

### 脚本1: 系统垃圾清理

```bash
#!/bin/bash
# system-cleanup.sh

echo "开始系统清理..."

# 1. 清理包管理器缓存
echo "清理包管理器缓存..."
apt-get clean
apt-get autoclean
yum clean all

# 2. 清理临时文件
echo "清理临时文件..."
rm -rf /tmp/*
rm -rf /var/tmp/*
rm -rf /var/log/*.log
rm -rf ~/.cache/*

# 3. 清理旧内核
echo "清理旧内核..."
apt-get autoremove --purge
yum autoremove

# 4. 清理Docker（如果需要）
echo "清理Docker..."
docker system prune -a -f

# 5. 清理大文件
echo "查找并删除大于1GB的临时文件..."
find / -size +1G -type f -name "*.log" -o -name "*.tmp" 2>/dev/null | xargs rm -f

echo "系统清理完成"
df -h
```

### 脚本2: Docker 空间监控

```bash
#!/bin/bash
# docker-space-monitor.sh

echo "=== Docker 空间使用情况 ==="

# Docker 目录大小
echo "Docker 根目录:"
du -sh /var/lib/docker 2>/dev/null

# 各子目录大小
echo -e "\nDocker 子目录:"
du -h --max-depth=1 /var/lib/docker 2>/dev/null | sort -hr

# 镜像、容器、数据卷大小
echo -e "\nDocker 资源使用:"
docker system df

# Top 10 最大的overlay目录
echo -e "\n最大的10个Overlay目录:"
cd /var/lib/docker/overlay2 2>/dev/null && \
du -h --max-depth=1 | sort -hr | head -10

# 建议清理操作
echo -e "\n=== 建议的清理操作 ==="
echo "1. 删除未使用的镜像: docker image prune -a"
echo "2. 删除停止的容器: docker container prune"
echo "3. 删除未使用的数据卷: docker volume prune"
echo "4. 完全清理: docker system prune -a"
```

## 常用清理命令速查表

### 系统级清理

```bash
# 清理包管理器
apt-get clean && apt-get autoclean      # Debian/Ubuntu
yum clean all && yum autoremove         # CentOS/RHEL

# 清理临时文件
rm -rf /tmp/* /var/tmp/*                # 清理临时目录
find /var/log -type f -name "*.log" -delete  # 清理日志

# 清理旧内核
apt-get autoremove --purge              # Ubuntu
package-cleanup --oldkernels --count=2  # CentOS

# 清理用户缓存
rm -rf ~/.cache/* ~/.thumbnails/*       # 用户缓存

# 清理旧版本的snap包
snap list --all | awk '/disabled/{print $1, $3}' | while read snap ver; do snap remove "$snap" --revision="$ver"; done
```

### Docker 清理

```bash
# 基本清理
docker system df                        # 查看使用情况
docker system prune                     # 清理未使用的资源
docker system prune -a                  # 清理所有未使用的资源
docker system prune --volumes           # 包含数据卷

# 镜像清理
docker image prune -a                   # 删除未使用镜像
docker image prune -f                   # 强制删除

# 容器清理
docker container prune                  # 删除停止的容器
docker container prune -f               # 强制删除

# 数据卷清理
docker volume prune                     # 删除未使用的数据卷
docker volume prune -f                  # 强制删除

# 网络清理
docker network prune                    # 删除未使用的网络
docker network prune -f                 # 强制删除
```

## 监控和预警

### 磁盘使用监控脚本

```bash
#!/bin/bash
# disk-monitor.sh

# 设置阈值（百分比）
THRESHOLD=80

# 获取磁盘使用率
USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')

if [ $USAGE -gt $THRESHOLD ]; then
    echo "警告：磁盘使用率已超过${THRESHOLD}%！"
    echo "当前使用率：${USAGE}%"
    echo -e "\n磁盘使用情况："
    df -h
    echo -e "\n最大的10个目录："
    du -hx / --max-depth=1 2>/dev/null | sort -hr | head -10
    echo -e "\n最近5个修改的大文件："
    find / -size +100M -type f -printf '%T@ %p\n' 2>/dev/null | sort -nr | head -5 | awk '{print $2}'
fi
```

### 设置定时任务

```bash
# 编辑crontab
crontab -e

# 每天凌晨2点执行清理
0 2 * * * /path/to/system-cleanup.sh

# 每周检查磁盘使用情况
0 0 * * 0 /path/to/disk-monitor.sh

# Docker每周清理
0 3 * * 0 docker system prune -a -f
```

## 最佳实践建议

### 1. 预防措施

- 定期监控系统磁盘使用情况
- 设置合适的预警阈值（建议80%）
- 定期清理临时文件和日志
- 合理配置日志轮转（logrotate）
- 限制Docker容器和镜像的大小

### 2. 清理策略

- 优先清理可重建的临时文件
- 谨慎删除系统文件，确保了解其作用
- 清理前先确认文件是否被使用
- 重要数据操作前先备份
- 自动化常用清理操作

### 3. 监控工具

- 使用 `ncdu` 交互式磁盘使用分析器
- 配置系统监控（如Nagios、Zabbix）
- 设置磁盘使用率告警
- 定期生成磁盘使用报告

### 4. 长期优化

- 合理规划磁盘分区
- 使用日志管理工具
- 实施数据生命周期管理
- 考虑使用外部存储
- 优化应用程序日志输出

## 常见问题解答

### Q1: 如何安全地清理 /var/log 目录？

**A1**: 不要直接删除整个目录，应该：
```bash
# 1. 查看日志文件大小
du -h /var/log/*

# 2. 清空特定日志文件
truncate -s 0 /var/log/syslog

# 3. 使用logrotate管理日志
logrotate -f /etc/logrotate.conf
```

### Q2: Docker容器删除后空间没有释放？

**A2**:
```bash
# 1. 查看Docker系统使用情况
docker system df

# 2. 清理未使用的镜像和数据
docker system prune -a

# 3. 清理特定镜像的残留层
docker rmi $(docker images -q)
```

### Q3: tune2fs 修改失败怎么办？

**A3**:
```bash
# 1. 确保文件系统未在使用
umount /dev/sda1

# 2. 修改参数
tune2fs -m 1 /dev/sda1

# 3. 重新挂载
mount /dev/sda1
```

### Q4: 如何快速定位占用空间最多的文件？

**A4**:
```bash
# 方法1: 使用ncdu（交互式）
ncdu /

# 方法2: 命令行查找
du -hx / --max-depth=1 | sort -hr | head -20

# 方法3: 查找大文件
find / -size +100M -type f -exec du -h {} \; | sort -hr
```

## 总结

Linux磁盘空间管理是系统运维的重要技能。通过掌握 `df`、`du`、`tune2fs` 等工具，结合实际案例（如Docker容器清理），可以快速定位和解决磁盘空间问题。

记住：
- **定期监控**比紧急清理更重要
- **自动化**清理脚本可以节省大量时间
- **备份**是所有操作前的必要步骤
- **文档化**清理过程和决策依据

通过本指南的方法和工具，您可以有效地管理和维护Linux系统的磁盘空间，确保系统稳定运行。

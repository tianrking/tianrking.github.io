---
legacy: true
id: linux-commands-complete-guide
title: Linux 命令大全完整指南
sidebar_label: Linux 命令大全
description: 涵盖 Linux 常用命令的完整指南，包括文件管理、文档编辑、磁盘管理、网络通讯、系统管理等10大类别
date: 2021-09-13T13:52:02+08:00
tags: [Linux, 命令行, 系统管理, Shell, 运维]
authors: [w0x7ce]
---

# Linux 命令大全完整指南

Linux 命令行是每个开发者、系统管理员和运维工程师的必备技能。本指南整理了最常用的 Linux 命令，按功能分类，帮助您快速查找和使用。

## 1. 文件管理

文件管理命令用于创建、删除、复制、移动和查看文件及目录。

### 基础文件操作

| 命令 | 描述 | 示例 |
|------|------|------|
| `ls` | 列出目录内容 | `ls -la /home` |
| `cp` | 复制文件/目录 | `cp file.txt backup.txt` |
| `mv` | 移动/重命名文件 | `mv old.txt new.txt` |
| `rm` | 删除文件/目录 | `rm file.txt` |
| `rmdir` | 删除空目录 | `rmdir empty_dir` |
| `mkdir` | 创建目录 | `mkdir new_folder` |
| `pwd` | 显示当前路径 | `pwd` |
| `cd` | 切换目录 | `cd /home/user` |

### 详细文件信息

| 命令 | 描述 | 示例 |
|------|------|------|
| `ls -l` | 长格式显示 | `ls -l` |
| `ls -a` | 显示隐藏文件 | `ls -a` |
| `ls -h` | 人性化显示大小 | `ls -lh` |
| `ls -R` | 递归显示子目录 | `ls -R` |
| `file` | 查看文件类型 | `file document.pdf` |
| `stat` | 显示文件详细信息 | `stat file.txt` |
| `tree` | 以树形结构显示目录 | `tree /home` |

### 文件查看命令

| 命令 | 描述 | 示例 |
|------|------|------|
| `cat` | 查看文件内容 | `cat file.txt` |
| `less` | 分页查看大文件 | `less largefile.log` |
| `more` | 分页显示 | `more file.txt` |
| `head` | 查看文件开头 | `head -n 20 file.txt` |
| `tail` | 查看文件结尾 | `tail -f logfile.log` |
| `nl` | 带行号显示 | `nl file.txt` |

### 文件查找

| 命令 | 描述 | 示例 |
|------|------|------|
| `find` | 查找文件 | `find /home -name "*.txt"` |
| `locate` | 快速查找文件 | `locate filename` |
| `which` | 查找命令位置 | `which python` |
| `whereis` | 查找二进制/源码/手册 | `whereis ls` |

### 文件权限

| 命令 | 描述 | 示例 |
|------|------|------|
| `chmod` | 修改文件权限 | `chmod 755 script.sh` |
| `chown` | 修改文件所有者 | `chown user:group file.txt` |
| `chgrp` | 修改文件组 | `chgrp developers file.txt` |
| `umask` | 设置默认权限掩码 | `umask 022` |

### 文件比较与差异

| 命令 | 描述 | 示例 |
|------|------|------|
| `diff` | 比较文件差异 | `diff file1.txt file2.txt` |
| `cmp` | 比较两个文件 | `cmp file1.txt file2.txt` |
| `comm` | 比较两个已排序文件 | `comm file1.txt file2.txt` |

### 链接文件

| 命令 | 描述 | 示例 |
|------|------|------|
| `ln` | 创建硬链接 | `ln source.txt link.txt` |
| `ln -s` | 创建软链接 | `ln -s /path/to/file link_name` |

### 文本处理

| 命令 | 描述 | 示例 |
|------|------|------|
| `grep` | 文本搜索 | `grep "pattern" file.txt` |
| `awk` | 文本处理和分析 | `awk '{print $1}' file.txt` |
| `sed` | 流编辑器 | `sed 's/old/new/g' file.txt` |
| `sort` | 排序文本 | `sort file.txt` |
| `uniq` | 去重 | `uniq file.txt` |
| `cut` | 提取字段 | `cut -d',' -f1 data.csv` |
| `wc` | 统计行/字/字符 | `wc -l file.txt` |

## 2. 文档编辑

文本编辑和处理命令用于编辑和格式化文档。

### 基础编辑命令

| 命令 | 描述 | 示例 |
|------|------|------|
| `vi/vim` | 文本编辑器 | `vim file.txt` |
| `nano` | 简单文本编辑器 | `nano file.txt` |
| `emacs` | 全屏编辑器 | `emacs file.txt` |
| `ed` | 行编辑器 | `ed file.txt` |

### 文本处理

| 命令 | 描述 | 示例 |
|------|------|------|
| `tr` | 字符转换 | `tr 'a-z' 'A-Z' < file.txt` |
| `colrm` | 删除列 | `colrm 1 3 file.txt` |
| `join` | 合并文件 | `join file1.txt file2.txt` |
| `paste` | 合并文件行 | `paste file1.txt file2.txt` |
| `split` | 分割文件 | `split -l 100 file.txt part_` |
| `uniq` | 去除重复行 | `uniq file.txt` |
| `sort` | 排序文本 | `sort file.txt` |
| `tee` | 输出到文件和屏幕 | `echo "text" \| tee output.txt` |

### 格式化

| 命令 | 描述 | 示例 |
|------|------|------|
| `fmt` | 格式化文本 | `fmt -w 80 file.txt` |
| `fold` | 折叠长行 | `fold -w 50 file.txt` |
| `expand` | 将制表符转成空格 | `expand file.txt` |
| `unexpand` | 将空格转成制表符 | `unexpand file.txt` |

### 正则表达式

| 命令 | 描述 | 示例 |
|------|------|------|
| `grep` | 使用正则表达式搜索 | `grep -E "pattern" file.txt` |
| `egrep` | 扩展正则表达式 | `egrep "pattern" file.txt` |
| `fgrep` | 固定字符串搜索 | `fgrep "literal" file.txt` |

## 3. 文件传输

用于在不同系统间传输文件。

### FTP 传输

| 命令 | 描述 | 示例 |
|------|------|------|
| `ftp` | FTP 客户端 | `ftp ftp.example.com` |
| `sftp` | 安全 FTP | `sftp user@host` |
| `lftp` | 高级 FTP 客户端 | `lftp ftp://user@host` |
| `ncftp` | 增强 FTP 客户端 | `ncftp ftp.example.com` |

### 远程复制

| 命令 | 描述 | 示例 |
|------|------|------|
| `scp` | 安全复制 | `scp file.txt user@host:/path/` |
| `rsync` | 同步文件和目录 | `rsync -avz /source/ user@host:/dest/` |
| `wget` | 下载文件 | `wget https://example.com/file.zip` |
| `curl` | 传输数据 | `curl -O https://example.com/file.zip` |

### 其他传输

| 命令 | 描述 | 示例 |
|------|------|------|
| `uucp` | Unix 到 Unix 复制 | `uucp source destination` |
| `uuto` | 发送文件 | `uuto file remote!user` |
| `tftp` | TFTP 客户端 | `tftp host` |

## 4. 磁盘管理

磁盘和目录空间管理命令。

### 目录操作

| 命令 | 描述 | 示例 |
|------|------|------|
| `cd` | 切换目录 | `cd /home/user` |
| `pwd` | 显示当前目录 | `pwd` |
| `ls` | 列出目录内容 | `ls -la` |
| `dirs` | 显示目录栈 | `dirs -p` |
| `pushd` | 切换目录并入栈 | `pushd /var/log` |
| `popd` | 从栈中弹出目录 | `popd` |

### 磁盘使用

| 命令 | 描述 | 示例 |
|------|------|------|
| `df` | 显示磁盘空间使用情况 | `df -h` |
| `du` | 显示目录空间使用情况 | `du -sh /home` |
| `lsblk` | 列出块设备 | `lsblk` |
| `fdisk` | 磁盘分区工具 | `sudo fdisk /dev/sda` |

### 挂载和卸载

| 命令 | 描述 | 示例 |
|------|------|------|
| `mount` | 挂载文件系统 | `mount /dev/sdb1 /mnt/usb` |
| `umount` | 卸载文件系统 | `umount /mnt/usb` |
| `eject` | 弹出介质 | `eject /dev/cdrom` |

### 磁盘配额

| 命令 | 描述 | 示例 |
|------|------|------|
| `quota` | 显示磁盘配额 | `quota -v` |
| `quotacheck` | 检查磁盘配额 | `sudo quotacheck -av` |
| `quotaon` | 启用配额 | `sudo quotaon -av` |
| `quotaoff` | 禁用配额 | `sudo quotaoff -av` |
| `edquota` | 编辑配额 | `sudo edquota username` |

## 5. 磁盘维护

磁盘检查、修复和格式化工具。

### 文件系统检查

| 命令 | 描述 | 示例 |
|------|------|------|
| `fsck` | 检查文件系统 | `sudo fsck /dev/sda1` |
| `e2fsck` | ext2/ext3/ext4 文件系统检查 | `sudo e2fsck /dev/sda1` |
| `badblocks` | 检查坏块 | `sudo badblocks /dev/sda` |
| `fsck.minix` | MINIX 文件系统检查 | `sudo fsck /dev/fd0` |

### 文件系统管理

| 命令 | 描述 | 示例 |
|------|------|------|
| `mkfs` | 创建文件系统 | `sudo mkfs.ext4 /dev/sdb1` |
| `mkfs.ext2` | 创建 ext2 文件系统 | `sudo mkfs.ext2 /dev/sdb1` |
| `mkfs.ext4` | 创建 ext4 文件系统 | `sudo mkfs.ext4 /dev/sdb1` |
| `mkfs.ntfs` | 创建 NTFS 文件系统 | `sudo mkfs.ntfs /dev/sdb1` |

### 磁盘格式化

| 命令 | 描述 | 示例 |
|------|------|------|
| `mkbootdisk` | 创建启动盘 | `sudo mkbootdisk --device /dev/fd0 $(uname -r)` |
| `mformat` | 格式化 DOS 文件系统 | `mformat A:` |
| `fdformat` | 格式化软盘 | `fdformat /dev/fd0` |
| `mkdosfs` | 创建 FAT 文件系统 | `sudo mkdosfs /dev/sdb1` |

### 交换空间

| 命令 | 描述 | 示例 |
|------|------|------|
| `mkswap` | 创建交换空间 | `sudo mkswap /dev/sdb2` |
| `swapon` | 启用交换空间 | `sudo swapon /dev/sdb2` |
| `swapoff` | 禁用交换空间 | `sudo swapoff /dev/sdb2` |

### 其他维护

| 命令 | 描述 | 示例 |
|------|------|------|
| `dd` | 复制和转换文件 | `dd if=/dev/zero of=file.img bs=1M count=100` |
| `cfdisk` | 磁盘分区工具 | `sudo cfdisk /dev/sda` |
| `hdparm` | 硬盘参数工具 | `sudo hdparm -t /dev/sda` |
| `sync` | 强制写入磁盘 | `sync` |

## 6. 网络通讯

网络配置和通信命令。

### 网络配置

| 命令 | 描述 | 示例 |
|------|------|------|
| `ifconfig` | 配置网络接口 | `ifconfig eth0 192.168.1.100` |
| `ip` | IP 地址和路由管理 | `ip addr add 192.168.1.100/24 dev eth0` |
| `netstat` | 显示网络连接 | `netstat -tuln` |
| `ss` | 显示网络套接字 | `ss -tuln` |

### 网络测试

| 命令 | 描述 | 示例 |
|------|------|------|
| `ping` | 测试连通性 | `ping google.com` |
| `traceroute` | 路由跟踪 | `traceroute google.com` |
| `tracepath` | 跟踪路径 | `tracepath google.com` |
| `telnet` | 远程登录 | `telnet host port` |
| `nc` | 网络瑞士军刀 | `nc -zv host port` |

### HTTP 工具

| 命令 | 描述 | 示例 |
|------|------|------|
| `wget` | 下载文件 | `wget https://example.com/file.zip` |
| `curl` | 传输数据 | `curl https://api.example.com/data` |
| `httpd` | HTTP 服务器 | `httpd -k start` |
| `apachectl` | Apache 控制 | `apachectl start` |

### 网络监控

| 命令 | 描述 | 示例 |
|------|------|------|
| `tcpdump` | 捕获网络包 | `sudo tcpdump -i eth0` |
| `ngrep` | 网络包搜索 | `ngrep pattern` |
| `nmap` | 端口扫描 | `nmap -sS host` |
| `netstat` | 网络统计 | `netstat -i` |

### 其他网络工具

| 命令 | 描述 | 示例 |
|------|------|------|
| `hostname` | 显示/设置主机名 | `hostname` |
| `dnsconf` | DNS 配置 | `dnsconf` |
| `wall` | 发送消息到所有终端 | `wall "System maintenance"` |
| `write` | 发送消息到用户终端 | `write username` |
| `talk` | 与用户对话 | `talk username` |
| `mesg` | 设置消息接收 | `mesg n` |

## 7. 系统管理

用户、进程和系统管理命令。

### 用户管理

| 命令 | 描述 | 示例 |
|------|------|------|
| `adduser` | 添加用户 | `sudo adduser newuser` |
| `useradd` | 添加用户 | `sudo useradd -m username` |
| `usermod` | 修改用户 | `sudo usermod -aG group username` |
| `userdel` | 删除用户 | `sudo userdel username` |
| `passwd` | 修改密码 | `passwd username` |

### 组管理

| 命令 | 描述 | 示例 |
|------|------|------|
| `groupadd` | 添加组 | `sudo groupadd developers` |
| `groupmod` | 修改组 | `sudo groupmod -n newname oldname` |
| `groupdel` | 删除组 | `sudo groupdel groupname` |
| `groups` | 显示用户组 | `groups username` |

### 进程管理

| 命令 | 描述 | 示例 |
|------|------|------|
| `ps` | 显示进程 | `ps aux` |
| `top` | 实时显示进程 | `top` |
| `htop` | 交互式进程查看 | `htop` |
| `pstree` | 进程树 | `pstree -p` |
| `pgrep` | 查找进程 | `pgrep firefox` |
| `pkill` | 终止进程 | `pkill firefox` |
| `kill` | 发送信号到进程 | `kill 1234` |
| `killall` | 按名称终止进程 | `killall firefox` |

### 系统信息

| 命令 | 描述 | 示例 |
|------|------|------|
| `uname` | 显示系统信息 | `uname -a` |
| `whoami` | 显示当前用户 | `whoami` |
| `id` | 显示用户 ID 和组 ID | `id username` |
| `who` | 显示登录用户 | `who` |
| `w` | 显示登录用户及活动 | `w` |
| `last` | 显示登录历史 | `last` |
| `free` | 显示内存使用 | `free -h` |
| `uptime` | 显示运行时间 | `uptime` |

### 系统控制

| 命令 | 描述 | 示例 |
|------|------|------|
| `reboot` | 重启系统 | `sudo reboot` |
| `shutdown` | 关闭系统 | `sudo shutdown -h now` |
| `halt` | 停止系统 | `sudo halt` |
| `poweroff` | 关闭电源 | `sudo poweroff` |
| `init` | 改变运行级别 | `init 0` (关机) |

## 8. 系统设置

系统配置和环境设置命令。

### 环境变量

| 命令 | 描述 | 示例 |
|------|------|------|
| `export` | 设置环境变量 | `export PATH=$PATH:/new/path` |
| `env` | 显示环境变量 | `env` |
| `printenv` | 打印环境变量 | `printenv HOME` |
| `unset` | 删除环境变量 | `unset VARIABLE` |
| `alias` | 设置命令别名 | `alias ll='ls -la'` |
| `unalias` | 删除别名 | `unalias ll` |

### 系统配置

| 命令 | 描述 | 示例 |
|------|------|------|
| `set` | 显示变量设置 | `set` |
| `declare` | 声明变量 | `declare -i count=0` |
| `ulimit` | 设置资源限制 | `ulimit -n 4096` |
| `timeconfig` | 设置时区 | `sudo timeconfig` |
| `clock` | 设置系统时钟 | `sudo clock -w` |

### 模块管理

| 命令 | 描述 | 示例 |
|------|------|------|
| `lsmod` | 显示已加载模块 | `lsmod` |
| `modinfo` | 显示模块信息 | `modinfo module_name` |
| `modprobe` | 加载模块 | `sudo modprobe module_name` |
| `rmmod` | 卸载模块 | `sudo rmmod module_name` |
| `depmod` | 生成模块依赖 | `sudo depmod` |

### 服务管理

| 命令 | 描述 | 示例 |
|------|------|------|
| `systemctl` | 系统服务管理 | `sudo systemctl start service` |
| `service` | 服务管理 | `sudo service apache2 start` |
| `chkconfig` | 设置服务自动启动 | `sudo chkconfig service on` |
| `update-rc.d` | 设置启动链接 | `sudo update-rc.d service defaults` |

### 计划任务

| 命令 | 描述 | 示例 |
|------|------|------|
| `crontab` | 编辑计划任务 | `crontab -e` |
| `at` | 在指定时间执行命令 | `at now + 5 minutes` |
| `batch` | 在系统负载低时执行 | `batch` |

### 系统信息

| 命令 | 描述 | 示例 |
|------|------|------|
| `dmesg` | 显示内核消息 | `dmesg | tail` |
| `lspci` | 显示 PCI 设备 | `lspci` |
| `lsusb` | 显示 USB 设备 | `lsusb` |
| `lscpu` | 显示 CPU 信息 | `lscpu` |
| `lsblk` | 显示块设备 | `lsblk` |

## 9. 备份压缩

文件压缩、备份和归档命令。

### 压缩工具

| 命令 | 描述 | 示例 |
|------|------|------|
| `gzip` | GNU 压缩 | `gzip file.txt` |
| `gunzip` | 解压 gzip | `gunzip file.txt.gz` |
| `bzip2` | bzip2 压缩 | `bzip2 file.txt` |
| `bunzip2` | 解压 bzip2 | `bunzip2 file.txt.bz2` |
| `xz` | xz 压缩 | `xz file.txt` |
| `unxz` | 解压 xz | `unxz file.txt.xz` |

### 归档工具

| 命令 | 描述 | 示例 |
|------|------|------|
| `tar` | 归档工具 | `tar -czvf archive.tar.gz directory/` |
| `zip` | 创建 zip 压缩包 | `zip -r archive.zip directory/` |
| `unzip` | 解压 zip 压缩包 | `unzip archive.zip` |
| `rar` | 创建 rar 压缩包 | `rar a archive.rar directory/` |
| `unrar` | 解压 rar 压缩包 | `unrar x archive.rar` |

### 备份工具

| 命令 | 描述 | 示例 |
|------|------|------|
| `dump` | 文件系统备份 | `sudo dump -0uf /dev/st0 /home` |
| `restore` | 恢复备份 | `sudo restore -rf /dev/st0` |
| `cpio` | 复制文件到归档 | `find . -print \| cpio -ov > archive.cpio` |

### 编码解码

| 命令 | 描述 | 示例 |
|------|------|------|
| `uuencode` | 编码二进制文件 | `uuencode file.txt file.txt > encoded.txt` |
| `uudecode` | 解码文件 | `uudecode encoded.txt` |

## 10. 设备管理

硬件设备管理命令。

### 键盘设置

| 命令 | 描述 | 示例 |
|------|------|------|
| `loadkeys` | 加载键盘布局 | `sudo loadkeys us` |
| `dumpkeys` | 显示键盘映射 | `dumpkeys` |
| `setleds` | 设置键盘 LED | `setleds +num` |

### 显示设置

| 命令 | 描述 | 示例 |
|------|------|------|
| `fbset` | 帧缓冲设置 | `sudo fbset -i` |
| `SVGATextMode` | SVGAText 模式 | `SVGATextMode 132x60` |

### 电源管理

| 命令 | 描述 | 示例 |
|------|------|------|
| `poweroff` | 关闭系统 | `sudo poweroff` |
| `halt` | 停止系统 | `sudo halt` |
| `shutdown` | 关闭系统 | `sudo shutdown -h now` |
| `apmd` | APM 守护进程 | `apmd` |

### 设备创建

| 命令 | 描述 | 示例 |
|------|------|------|
| `MAKEDEV` | 创建设备文件 | `sudo MAKEDEV hd` |

## 其他重要命令

### 实用工具

| 命令 | 描述 | 示例 |
|------|------|------|
| `bc` | 计算器 | `echo "10 + 5" \| bc` |
| `xargs` | 构建参数列表 | `find . -name "*.txt" \| xargs rm` |
| `nohup` | 不挂断地运行命令 | `nohup ./script.sh &` |
| `jobs` | 显示后台任务 | `jobs` |
| `bg` | 后台运行作业 | `bg %1` |
| `fg` | 前台运行作业 | `fg %1` |

### IP 和网络

| 命令 | 描述 | 示例 |
|------|------|------|
| `ip` | IP 地址管理 | `ip addr show` |
| `ss` | 套接字统计 | `ss -tuln` |

### 进程管理

| 命令 | 描述 | 示例 |
|------|------|------|
| `killall` | 按名称终止进程 | `killall process_name` |
| `pkill` | 模式匹配终止进程 | `pkill pattern` |

### 文件查找

| 命令 | 描述 | 示例 |
|------|------|------|
| `locate` | 快速文件查找 | `locate filename` |
| `which` | 查找命令路径 | `which python` |

## 命令行快捷键

### Bash 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl + A` | 移动到行首 |
| `Ctrl + E` | 移动到行末 |
| `Ctrl + U` | 删除光标前内容 |
| `Ctrl + K` | 删除光标后内容 |
| `Ctrl + L` | 清屏（等价于 `clear`） |
| `Ctrl + R` | 搜索历史命令 |
| `Tab` | 自动补全 |
| `Tab + Tab` | 显示所有可能选项 |
| `!!` | 执行上一条命令 |
| `!$` | 上一条命令的最后一个参数 |

## 常用组合命令

### 实用脚本片段

```bash
# 查找并删除大于 100MB 的文件
find / -size +100M -type f -exec rm -rf {} \;

# 统计当前目录文件数量
ls -1 | wc -l

# 查看系统负载
uptime

# 查看磁盘使用情况
df -h

# 查看内存使用情况
free -h

# 查找特定进程
ps aux | grep process_name

# 监控网络连接
netstat -tuln

# 查看最近的登录记录
last | head -20

# 查找文件
find /path -name "*.txt"

# 批量重命名
for file in *.txt; do mv "$file" "${file%.txt}.log"; done

# 查看日志文件的最后 100 行
tail -100 /var/log/syslog
```

## 命令行最佳实践

### 1. 使用手册页

```bash
# 查看命令手册
man command_name

# 查看简化说明
command_name --help

# 查看简短描述
whatis command_name
```

### 2. 输出重定向

```bash
# 重定向到文件
command > output.txt

# 追加到文件
command >> output.txt

# 重定向错误
command 2> error.txt

# 同时重定向标准和错误
command > output.txt 2>&1

# 丢弃输出
command > /dev/null 2>&1
```

### 3. 管道操作

```bash
# 组合多个命令
command1 | command2 | command3

# 示例：查看最大的 10 个文件
du -ah / | sort -rh | head -10

# 示例：统计行数
cat file.txt | wc -l
```

### 4. 环境变量和别名

```bash
# 创建永久别名
echo "alias ll='ls -la'" >> ~/.bashrc
source ~/.bashrc

# 设置环境变量
export PATH=$PATH:/new/directory
echo "export PATH=\$PATH:/new/directory" >> ~/.bashrc
```

### 5. 错误处理

```bash
# 检查命令是否成功
command && echo "Success" || echo "Failed"

# 使用 exit code
command
if [ $? -eq 0 ]; then
    echo "Command succeeded"
fi
```

## 总结

掌握这些 Linux 命令可以大大提高工作效率。建议：

1. **从基础命令开始**：先熟练掌握 `ls`, `cd`, `cp`, `mv`, `rm`, `cat` 等基本命令
2. **练习管道和重定向**：这是命令行强大的核心功能
3. **学习正则表达式**：配合 `grep`, `sed`, `awk` 使用效果更佳
4. **查看手册页**：`man` 命令是最好的学习资源
5. **实践出真知**：在实际工作中多使用命令行解决问题

通过不断练习和使用，这些命令会成为您日常工作中的得力助手。

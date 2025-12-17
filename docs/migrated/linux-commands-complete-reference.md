---
legacy: true
title: Linux命令完全参考指南
description: 完整的Linux命令参考手册，涵盖文件管理、文档编辑、网络通讯、系统管理等10大类别的常用命令，包含详细语法、参数说明和实际示例
tags: [Linux, 命令行, 系统管理, Shell, 运维]
category: System Administration
author: w0x7ce
date: 2021-09-13
---

# Linux命令完全参考指南

## 目录

- [1. 文件管理](#1-文件管理)
- [2. 文档编辑](#2-文档编辑)
- [3. 文件传输](#3-文件传输)
- [4. 磁盘管理](#4-磁盘管理)
- [5. 磁盘维护](#5-磁盘维护)
- [6. 网络通讯](#6-网络通讯)
- [7. 系统管理](#7-系统管理)
- [8. 系统设置](#8-系统设置)
- [9. 备份压缩](#9-备份压缩)
- [10. 设备管理](#10-设备管理)
- [11. 其他重要命令](#11-其他重要命令)
- [12. 命令组合技巧](#12-命令组合技巧)

---

## 1. 文件管理

文件管理是Linux系统中最常用的功能之一，涵盖文件的创建、查看、复制、移动、删除等操作。

### 1.1 查看和显示文件

#### `cat` - 连接文件并打印
```bash
# 显示文件内容
cat filename.txt

# 连接多个文件
cat file1.txt file2.txt

# 显示行号
cat -n filename.txt

# 显示所有字符（包括特殊字符）
cat -A filename.txt
```

#### `less` - 分页查看文件
```bash
# 分页查看大文件
less largefile.log

# 搜索模式（按/后输入搜索词）
less largefile.log
/搜索关键词

# 快捷键
# 空格键：下一页
# b：上一页
# q：退出
# g：跳到第一行
# G：跳到最后一行
```

#### `more` - 分页显示文本
```bash
# 分页显示文件
more filename.txt

# 从第10行开始显示
more +10 filename.txt

# 每次显示30行
more -30 filename.txt
```

#### `head` - 显示文件开头
```bash
# 显示前10行（默认）
head filename.txt

# 显示前20行
head -n 20 filename.txt

# 显示前100字节
head -c 100 filename.txt
```

#### `tail` - 显示文件结尾
```bash
# 显示后10行（默认）
tail filename.txt

# 显示后20行
tail -n 20 filename.txt

# 实时监控文件变化
tail -f logfile.log

# 实时监控并显示后10行
tail -f -n 10 logfile.log
```

### 1.2 文件操作

#### `cp` - 复制文件
```bash
# 复制文件
cp source.txt destination.txt

# 复制到目录
cp source.txt /path/to/directory/

# 递归复制目录
cp -r source_directory/ destination_directory/

# 交互式复制（覆盖前询问）
cp -i source.txt destination.txt

# 保留文件属性
cp -p source.txt destination.txt

# 详细模式（显示操作过程）
cp -v source.txt destination.txt
```

#### `mv` - 移动或重命名文件
```bash
# 重命名文件
mv oldname.txt newname.txt

# 移动文件到目录
mv file.txt /path/to/directory/

# 移动多个文件
mv file1.txt file2.txt /path/to/directory/

# 交互式移动（覆盖前询问）
mv -i file.txt destination.txt
```

#### `rm` - 删除文件
```bash
# 删除文件
rm filename.txt

# 删除目录及其内容
rm -r directory/

# 强制删除（不询问）
rm -f filename.txt

# 交互式删除
rm -i filename.txt

# 删除空目录
rmdir empty_directory/
```

#### `mkdir` - 创建目录
```bash
# 创建目录
mkdir new_directory

# 创建多级目录
mkdir -p path/to/nested/directory

# 设置权限
mkdir -m 755 new_directory
```

### 1.3 文件搜索

#### `find` - 搜索文件
```bash
# 在当前目录搜索文件
find . -name "*.txt"

# 按类型搜索
find . -type f          # 文件
find . -type d          # 目录
find . -type l          # 符号链接

# 按大小搜索
find . -size +100M      # 大于100MB
find . -size -1M        # 小于1MB

# 按修改时间搜索
find . -mtime -7        # 7天内修改的文件
find . -mtime +30       # 30天前修改的文件

# 执行操作
find . -name "*.log" -delete
find . -name "*.txt" -exec rm {} \;
```

#### `locate` - 快速文件搜索
```bash
# 搜索文件（需要先更新数据库）
locate filename

# 更新文件数据库
sudo updatedb

# 只显示存在的文件
locate -e filename
```

#### `which` - 查找命令位置
```bash
# 查找命令的完整路径
which ls
which python
which node
```

#### `whereis` - 查找二进制、源文件和手册
```bash
# 查找命令的所有位置
whereis ls
whereis python
```

### 1.4 文件权限和属性

#### `chmod` - 修改文件权限
```bash
# 使用数字设置权限（r=4, w=2, x=1）
chmod 755 filename      # rwxr-xr-x
chmod 644 filename      # rw-r--r--
chmod 600 filename      # rw-------

# 使用符号设置权限
chmod u+x filename      # 给所有者添加执行权限
chmod g-w filename      # 移除组的写权限
chmod o=r filename      # 设置其他用户只有读权限
chmod a+r filename      # 给所有用户添加读权限

# 递归设置目录权限
chmod -R 755 directory/
```

#### `chown` - 改变文件所有者
```bash
# 改变所有者
sudo chown user filename

# 改变所有者和组
sudo chown user:group filename

# 递归改变
sudo chown -R user:group directory/
```

#### `ls` - 列出目录内容
```bash
# 列出文件
ls

# 详细信息
ls -l

# 包含隐藏文件
ls -a

# 详细信息 + 隐藏文件
ls -la

# 按大小排序
ls -lhS

# 按时间排序
ls -lt

# 目录后面加斜杠
ls -F
```

---

## 2. 文档编辑

### 2.1 文本处理

#### `grep` - 文本搜索
```bash
# 基本搜索
grep "pattern" filename

# 忽略大小写
grep -i "pattern" filename

# 显示行号
grep -n "pattern" filename

# 显示匹配的行和上下3行
grep -C 3 "pattern" filename

# 递归搜索目录
grep -r "pattern" directory/

# 只显示文件名
grep -l "pattern" *.txt

# 统计匹配行数
grep -c "pattern" filename

# 使用正则表达式
grep -E "^[0-9]+" filename
```

#### `sed` - 流编辑器
```bash
# 替换文本
sed 's/old/new/g' filename

# 替换并保存到文件
sed 's/old/new/g' filename > newfile.txt

# 删除行
sed '/pattern/d' filename

# 显示特定行
sed -n '10,20p' filename

# 替换并保存到原文件
sed -i 's/old/new/g' filename
```

#### `awk` - 文本处理工具
```bash
# 显示特定列
awk '{print $1}' filename

# 使用分隔符
awk -F',' '{print $2}' filename

# 条件过滤
awk '$3 > 100' filename

# 格式化输出
awk '{printf "%-10s %s\n", $1, $2}' filename

# 计算总和
awk '{sum += $1} END {print sum}' filename
```

### 2.2 文本排序

#### `sort` - 排序文本
```bash
# 按字典序排序
sort filename

# 按数字排序
sort -n filename

# 按逆序排序
sort -r filename

# 去重排序
sort -u filename

# 按特定列排序
sort -k2 filename

# 指定分隔符
sort -t',' -k1 filename
```

#### `uniq` - 去重相邻行
```bash
# 删除相邻重复行
uniq filename

# 统计重复行出现次数
uniq -c filename

# 只显示重复行
uniq -d filename

# 只显示不重复的行
uniq -u filename
```

### 2.3 其他编辑命令

#### `cut` - 提取文本列
```bash
# 提取第1、2列
cut -d',' -f1,2 filename

# 提取字节范围
cut -c1-10 filename

# 使用制表符分隔
cut -f1-3 filename
```

#### `paste` - 合并文本
```bash
# 合并两个文件
paste file1.txt file2.txt

# 使用逗号分隔
paste -d',' file1.txt file2.txt
```

---

## 3. 文件传输

### 3.1 网络传输

#### `scp` - 安全复制
```bash
# 复制到远程服务器
scp localfile.txt user@remote:/path/to/destination/

# 从远程服务器复制
scp user@remote:/path/to/file.txt ./

# 复制目录
scp -r local_directory/ user@remote:/path/to/destination/

# 使用指定端口
scp -P 2222 localfile.txt user@remote:/path/
```

#### `rsync` - 同步文件
```bash
# 同步目录
rsync -av source/ destination/

# 远程同步
rsync -av source/ user@remote:/destination/

# 删除destination中没有的文件
rsync -av --delete source/ destination/

# 压缩传输
rsync -avz source/ destination/

# 显示进度
rsync -av --progress source/ destination/
```

### 3.2 FTP客户端

#### `ftp` - FTP客户端
```bash
# 连接FTP服务器
ftp ftp.example.com

# FTP命令
# get filename     - 下载文件
# put filename     - 上传文件
# mget *.txt       - 下载多个文件
# mput *.txt       - 上传多个文件
# ls               - 列出文件
# cd directory     - 切换目录
# quit             - 退出
```

#### `wget` - 非交互式下载
```bash
# 下载文件
wget http://example.com/file.txt

# 下载整个网站
wget -r http://example.com/

# 后台下载
wget -b http://example.com/file.txt

# 断点续传
wget -c http://example.com/file.txt

# 下载并保存为指定文件名
wget -O output.txt http://example.com/file.txt
```

---

## 4. 磁盘管理

### 4.1 目录操作

#### `cd` - 切换目录
```bash
# 切换到目录
cd /path/to/directory

# 切换到家目录
cd ~
cd

# 切换到上一级目录
cd ..

# 切换到上一个工作目录
cd -

# 显示当前目录
pwd
```

#### `du` - 磁盘使用量
```bash
# 显示目录大小
du -h directory/

# 显示文件大小
du -h filename

# 只显示总计
du -sh directory/

# 深度级别限制
du -h --max-depth=1 directory/

# 排序显示
du -h directory/ | sort -hr
```

#### `df` - 磁盘空间
```bash
# 显示磁盘空间
df -h

# 显示特定文件系统
df -h /home

# 显示所有文件系统
df -a
```

#### `lsblk` - 列出块设备
```bash
# 列出所有块设备
lsblk

# 显示设备信息
lsblk -f
```

---

## 5. 磁盘维护

### 5.1 文件系统检查

#### `fsck` - 文件系统检查
```bash
# 检查文件系统
sudo fsck /dev/sda1

# 自动修复
sudo fsck -y /dev/sda1

# 检查时跳过挂载检查
sudo fsck -f /dev/sda1
```

#### `mkfs` - 创建文件系统
```bash
# 创建ext4文件系统
sudo mkfs.ext4 /dev/sdb1

# 创建FAT32文件系统
sudo mkfs.vfat /dev/sdb1

# 创建XFS文件系统
sudo mkfs.xfs /dev/sdb1
```

### 5.2 分区管理

#### `fdisk` - 分区操作
```bash
# 列出分区
sudo fdisk -l

# 进入交互模式
sudo fdisk /dev/sdb

# 在fdisk中：
# m - 显示帮助
# p - 显示分区表
# n - 新建分区
# d - 删除分区
# w - 写入并退出
# q - 不保存退出
```

#### `parted` - 高级分区操作
```bash
# 进入交互模式
sudo parted /dev/sdb

# 在parted中：
# print - 显示分区表
# mkpart primary ext4 1GB 10GB
# rm 1 - 删除分区1
# quit - 退出
```

---

## 6. 网络通讯

### 6.1 网络配置

#### `ifconfig` - 网络接口配置
```bash
# 显示所有网络接口
ifconfig

# 显示特定接口
ifconfig eth0

# 配置IP地址
sudo ifconfig eth0 192.168.1.100 netmask 255.255.255.0

# 启用/禁用接口
sudo ifconfig eth0 up
sudo ifconfig eth0 down
```

#### `ip` - 现代网络配置
```bash
# 显示所有网络信息
ip addr show

# 显示路由表
ip route show

# 添加默认网关
ip route add default via 192.168.1.1

# 启用/禁用接口
ip link set eth0 up
ip link set eth0 down
```

### 6.2 网络诊断

#### `ping` - 测试网络连通性
```bash
# 测试连通性
ping google.com

# 指定次数
ping -c 4 google.com

# 指定间隔
ping -i 2 google.com
```

#### `netstat` - 网络统计
```bash
# 显示网络连接
netstat -tuln

# 显示路由表
netstat -r

# 显示进程和端口
netstat -tulnp

# 显示所有连接
netstat -an
```

#### `ss` - 现代网络诊断
```bash
# 显示TCP连接
ss -t

# 显示监听端口
ss -ltn

# 显示UDP连接
ss -u

# 显示进程
ss -tlnp
```

#### `traceroute` - 路由跟踪
```bash
# 跟踪路由
traceroute google.com

# 使用UDP协议
traceroute -U google.com

# 设置最大跳数
traceroute -m 20 google.com
```

---

## 7. 系统管理

### 7.1 进程管理

#### `ps` - 进程状态
```bash
# 显示当前用户进程
ps aux

# 显示进程树
ps -ef

# 查找特定进程
ps aux | grep python

# 显示用户进程
ps -u username
```

#### `top` - 实时进程监控
```bash
# 启动top
top

# 在top中：
# q - 退出
# k - 终止进程
# r - 调整优先级
# P - 按CPU排序
# M - 按内存排序
# f - 选择显示字段
```

#### `htop` - 增强版top
```bash
# 安装
sudo apt install htop

# 启动
htop

# 交互式操作
# 方向键 - 导航
# F9 - 终止进程
# F2 - 设置
```

#### `kill` - 终止进程
```bash
# 使用进程ID终止进程
kill 1234

# 强制终止
kill -9 1234

# 重新加载
kill -HUP 1234

# 优雅终止
kill -TERM 1234
```

#### `killall` - 按名称终止进程
```bash
# 终止所有python进程
killall python

# 指定信号
killall -9 python
```

### 7.2 系统信息

#### `uname` - 系统信息
```bash
# 内核版本
uname -r

# 所有信息
uname -a

# 系统名称
uname -s

# 机器类型
uname -m
```

#### `whoami` - 当前用户名
```bash
whoami
```

#### `id` - 用户ID信息
```bash
# 当前用户ID
id

# 指定用户ID
id username
```

#### `w` - 显示登录用户
```bash
# 显示所有登录用户
w

# 显示简洁信息
w -h
```

#### `last` - 显示登录历史
```bash
# 显示所有登录记录
last

# 显示重启记录
last reboot

# 指定用户
last username

# 显示前10条
last -n 10
```

---

## 8. 系统设置

### 8.1 系统服务

#### `systemctl` - 系统服务管理
```bash
# 启动服务
sudo systemctl start servicename

# 停止服务
sudo systemctl stop servicename

# 重启服务
sudo systemctl restart servicename

# 重新加载配置
sudo systemctl reload servicename

# 启用服务（开机自启）
sudo systemctl enable servicename

# 禁用服务
sudo systemctl disable servicename

# 查看服务状态
systemctl status servicename

# 查看所有服务
systemctl list-units --type=service
```

#### `service` - 传统服务管理
```bash
# 启动服务
sudo service servicename start

# 停止服务
sudo service servicename stop

# 重启服务
sudo service servicename restart
```

### 8.2 计划任务

#### `crontab` - 定时任务
```bash
# 编辑当前用户crontab
crontab -e

# 查看crontab
crontab -l

# 删除crontab
crontab -r

# 查看其他用户crontab
sudo crontab -u username -l

# crontab格式：
# * * * * * command
# 分 时 日 月 星期
# 每分钟: * * * * *
# 每小时: 0 * * * *
# 每天: 0 0 * * *
# 每周: 0 0 * * 0
# 每月: 0 0 1 * *
```

---

## 9. 备份压缩

### 9.1 压缩和解压

#### `tar` - 归档工具
```bash
# 创建tar归档
tar -cvf archive.tar file1 file2 directory/

# 创建gzip压缩归档
tar -czvf archive.tar.gz file1 file2 directory/

# 解压tar文件
tar -xvf archive.tar

# 解压gzip压缩文件
tar -xzvf archive.tar.gz

# 解压到指定目录
tar -xzvf archive.tar.gz -C /target/directory/

# 列出归档内容
tar -tzf archive.tar.gz

# 追加文件到归档
tar -rvf archive.tar newfile.txt
```

#### `gzip` - GNU压缩
```bash
# 压缩文件
gzip filename

# 解压文件
gunzip filename.gz

# 压缩并保留原文件
gzip -k filename

# 显示压缩比
gzip -l filename.gz
```

#### `zip` - ZIP压缩
```bash
# 创建ZIP文件
zip archive.zip file1 file2 directory/

# 递归压缩目录
zip -r archive.zip directory/

# 排除文件
zip -r archive.zip directory/ -x "*.tmp" "*.log"

# 解压ZIP文件
unzip archive.zip

# 解压到指定目录
unzip archive.zip -d /target/directory/

# 列出ZIP内容
unzip -l archive.zip
```

### 9.2 备份工具

#### `rsync` - 同步备份
```bash
# 备份到远程服务器
rsync -avz --progress /local/path/ user@remote:/backup/path/

# 排除特定文件
rsync -avz --exclude='*.log' --exclude='tmp/' source/ destination/

# 使用SSH
rsync -avz -e ssh source/ user@remote:/backup/

# 创建增量备份
rsync -avz --link-dest=/backup/previous/ /source/ /backup/current/
```

---

## 10. 设备管理

### 10.1 USB和设备

#### `lsusb` - USB设备
```bash
# 列出所有USB设备
lsusb

# 详细显示
lsusb -v

# 显示设备树
lsusb -t
```

#### `lspci` - PCI设备
```bash
# 列出所有PCI设备
lspci

# 详细显示
lspci -v

# 显示设备信息
lspci -vvv
```

#### `lsblk` - 块设备
```bash
# 列出所有块设备
lsblk

# 显示文件系统
lsblk -f

# 显示大小
lsblk -b
```

---

## 11. 其他重要命令

### 11.1 文本输出

#### `echo` - 显示文本
```bash
# 显示文本
echo "Hello World"

# 显示变量
echo $PATH

# 换行输出
echo -e "Line1\nLine2"

# 不换行输出
echo -n "No newline"

# 使用颜色
echo -e "\033[31mRed Text\033[0m"
```

#### `printf` - 格式化输出
```bash
# 基本输出
printf "Hello %s\n" "World"

# 数字格式化
printf "%d + %d = %d\n" 5 3 8

# 浮点数格式化
printf "%.2f\n" 3.14159
```

### 11.2 数据处理

#### `wc` - 统计字符数、词数、行数
```bash
# 统计行数
wc -l filename

# 统计词数
wc -w filename

# 统计字节数
wc -c filename

# 统计所有信息
wc filename

# 多个文件
wc file1.txt file2.txt
```

#### `date` - 显示或设置日期时间
```bash
# 显示当前日期时间
date

# 格式化输出
date "+%Y-%m-%d %H:%M:%S"

# 显示时区
date +%Z

# 显示UNIX时间戳
date +%s

# 设置时间（需要root权限）
sudo date -s "2021-09-13 10:00:00"
```

#### `cal` - 显示日历
```bash
# 显示当前月日历
cal

# 显示整年日历
cal 2021

# 显示上个月、本月、下个月
cal -3

# 显示指定月份
cal 9 2021
```

### 11.3 网络工具

#### `curl` - 数据传输
```bash
# 下载文件
curl -O http://example.com/file.txt

# 显示响应头
curl -I http://example.com

# 发送POST请求
curl -X POST -d "param1=value1&param2=value2" http://example.com/api

# 设置Header
curl -H "Content-Type: application/json" http://example.com/api

# 跟随重定向
curl -L http://example.com
```

#### `ssh` - 远程登录
```bash
# 连接到远程服务器
ssh user@remotehost

# 指定端口
ssh -p 2222 user@remotehost

# 使用密钥登录
ssh -i ~/.ssh/id_rsa user@remotehost

# 执行远程命令
ssh user@remotehost "ls -la"
```

---

## 12. 命令组合技巧

### 12.1 管道操作

管道`|`是Linux的强大特性，允许将一个命令的输出作为另一个命令的输入。

```bash
# 查找文件并显示详细信息
find . -name "*.txt" | xargs ls -l

# 搜索日志并统计
grep "ERROR" logfile.log | wc -l

# 查看大文件的前10行
ls -lh | head -10

# 排序后去重
cat file.txt | sort | uniq

# 查找进程并终止
ps aux | grep python | grep -v grep | awk '{print $2}' | xargs kill
```

### 12.2 重定向操作

```bash
# 输出重定向到文件
echo "Hello" > output.txt

# 追加到文件
echo "World" >> output.txt

# 错误输出重定向
command 2> error.log

# 标准输出和错误都重定向
command > output.log 2>&1

# 丢弃输出
command > /dev/null 2>&1

# 使用文件作为输入
command < input.txt

# Here文档
cat << EOF > file.txt
Line 1
Line 2
Line 3
EOF
```

### 12.3 常用组合命令

```bash
# 查看系统负载
uptime

# 查看内存使用
free -h

# 查看磁盘使用
df -h

# 查看当前目录大小
du -sh .

# 查找并删除大文件
find / -size +100M -type f -exec ls -lh {} \; 2>/dev/null

# 统计代码行数
find . -name "*.py" -exec wc -l {} + | tail -1

# 批量重命名文件
ls *.jpg | while read file; do mv "$file" "new_${file}"; done

# 监控日志文件
tail -f /var/log/syslog | grep ERROR

# 检查端口占用
netstat -tuln | grep :80
```

---

## 总结

Linux命令是系统管理和开发的强大工具。掌握这些常用命令能够显著提高工作效率。建议：

1. **循序渐进**：从基础命令开始，逐步学习高级功能
2. **实践为主**：多在实际环境中使用命令
3. **查看帮助**：使用`man command`查看详细手册
4. **安全意识**：谨慎使用删除和覆盖命令，特别是root权限下
5. **组合使用**：掌握管道和重定向，实现复杂操作

熟练掌握这些命令，将使你在Linux环境中如鱼得水，提高工作效率和系统管理能力。

## 扩展阅读

- `man command` - 查看命令详细手册
- `command --help` - 查看命令帮助信息
- `info command` - 查看命令详细信息
- [Linux命令大全](https://www.linuxcommand.org/) - 在线学习资源
- [Bash参考手册](https://www.gnu.org/software/bash/manual/) - Bash官方文档

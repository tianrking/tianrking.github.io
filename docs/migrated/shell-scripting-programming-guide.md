---
legacy: true
id: shell-scripting-programming-guide
title: Shell 脚本编程完全指南
sidebar_label: Shell 脚本编程
description: 从零开始学习 Shell 脚本编程，详细介绍 Shell 变量的定义、使用、字符串操作等核心概念，包含丰富的实际应用示例
date: 2021-09-12T15:33:23+08:00
tags: [Shell, Bash, Linux, 脚本编程, 自动化]
authors: [w0x7ce]
---

# Shell 脚本编程完全指南

Shell 脚本编程是 Linux 系统管理员和开发者的必备技能。通过编写 Shell 脚本，您可以自动化重复性任务、简化复杂操作并提高工作效率。本指南将详细介绍 Shell 脚本编程的核心概念，从变量开始逐步深入。

## Shell 脚本简介

### 什么是 Shell 脚本

Shell 脚本是一种解释型编程语言，通过 Shell 命令的序列来完成特定任务。它是实现自动化运维、批处理任务和系统管理的强大工具。

**主要 Shell 类型**：
- **Bash (Bourne Again Shell)**：Linux 默认 Shell，功能强大
- **Sh (Bourne Shell)**：最原始的 Shell
- **Zsh**：功能丰富的交互式 Shell
- **Fish**：用户友好的现代 Shell

### Shell 脚本的优势

- **自动化**：批量处理重复性任务
- **简化操作**：将复杂命令组合成简单脚本
- **可移植性**：Shell 脚本在类 Unix 系统中广泛支持
- **易于学习**：语法简单，上手容易
- **高效开发**：快速编写和测试脚本

## Shell 变量详解

### 变量命名规则

Shell 变量的命名必须遵循以下规则：

**有效命名**：
- ✅ 只能使用英文字母、数字和下划线
- ✅ 首个字符不能以数字开头
- ✅ 可以使用下划线 `_`
- ✅ 大小写敏感

**无效命名**：
- ❌ 不能包含空格
- ❌ 不能使用标点符号（如 `?`、`*`、`&` 等）
- ❌ 不能使用 Shell 关键字（如 `if`、`for`、`while` 等）

### 有效变量名示例

```bash
# 标准命名
RUNOOB
LD_LIBRARY_PATH
_var
var2
my_variable_name
USER_NAME
PI=3.14159
```

### 无效变量名示例

```bash
# 错误示例
?var=123          # 以特殊字符开头
user*name=runoob  # 包含特殊字符
my var=123        # 包含空格
2var=456          # 以数字开头
```

### 变量赋值

#### 1. 直接赋值

```bash
# 基本赋值
name="张三"
age=25
salary=5000.50
is_student=true

# 空变量
empty_var=""
null_var=
```

#### 2. 从命令赋值

```bash
# 使用反引号（推荐使用 $() 替代）
current_user=`whoami`
current_date=`date +%Y-%m-%d`
file_count=`ls -1 | wc -l`

# 使用 $()（现代写法）
current_time=$(date +%H:%M:%S)
home_directory=$(echo ~)
disk_usage=$(df -h / | awk 'NR==2 {print $5}')
```

#### 3. 循环赋值

```bash
# 遍历目录
for file in `ls /etc`; do
    echo "文件: $file"
done

# 现代写法
for dir in $(ls /home); do
    echo "用户目录: $dir"
done

# 遍历数字序列
for i in {1..5}; do
    echo "数字: $i"
done

# 遍历数组元素
colors=("红" "绿" "蓝")
for color in "${colors[@]}"; do
    echo "颜色: $color"
done
```

## 使用变量

### 基本使用

```bash
# 定义变量
your_name="qinjx"

# 使用变量（两种方式）
echo $your_name
echo ${your_name}

# 推荐：使用花括号明确边界
for skill in Ada Coffe Action Java; do
    echo "I am good at ${skill}Script"
done
```

**为什么要使用花括号**？

```bash
# 正确：使用花括号
echo "我擅长 ${skill}Script"
# 输出：我擅长 JavaScript

# 错误：不使用花括号
echo "我擅长 $skillScript"
# 输出：我擅长 （$skillScript 被当作一个空变量）
```

### 变量重新定义

```bash
# 第一次赋值
your_name="tom"
echo $your_name
# 输出：tom

# 重新赋值
your_name="alibaba"
echo $your_name
# 输出：alibaba

# 注意：赋值时不要使用 $
your_name="alibaba"  # 正确
# $your_name="alibaba"  # 错误
```

### 只读变量

使用 `readonly` 命令创建只读变量，其值不能被修改：

```bash
#!/bin/bash

# 定义只读变量
myUrl="https://www.google.com"
readonly myUrl

# 尝试修改只读变量（会报错）
myUrl="https://www.runoob.com"
# 输出：/bin/sh: myUrl: This variable is read only.
```

**实际应用场景**：

```bash
#!/bin/bash

# 定义系统常量
readonly OS_NAME=$(uname)
readonly SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
readonly LOG_FILE="/var/log/myscript.log"
readonly MAX_RETRIES=3
readonly TIMEOUT=30

# 只读环境变量
export readonly API_KEY="your-secret-api-key"
```

### 删除变量

使用 `unset` 命令删除变量：

```bash
#!/bin/sh

myUrl="https://www.runoob.com"
echo "删除前: $myUrl"
# 输出：删除前：https://www.runoob.com

unset myUrl
echo "删除后: $myUrl"
# 输出：删除后：（空）

# 注意：unset 不能删除只读变量
```

**变量删除的实际应用**：

```bash
#!/bin/bash

# 临时变量
temp_file="/tmp/temp_$$"
echo "临时文件: $temp_file"

# 执行操作
perform_operation > $temp_file

# 清理临时文件
unset temp_file

# 只读变量无法删除
readonly CONSTANT="无法删除"
unset CONSTANT  # 这行会报错
```

### 变量类型

Shell 中存在三种变量类型：

#### 1. 局部变量

```bash
#!/bin/bash

# 局部变量：在函数或脚本中定义
local_variable="我在函数内"
global_variable="我在函数外"

function test_function() {
    local local_var="局部变量"
    echo "函数内访问: $local_var"
    echo "函数内访问全局: $global_variable"
}

test_function
echo "函数外访问局部: $local_variable"  # 输出空
echo "函数外访问全局: $global_variable"  # 输出：我...
```

#### 2. 环境变量

```bash
# 查看所有环境变量
env

# 查看特定环境变量
echo $PATH
echo $HOME
echo $USER
echo $SHELL

# 设置环境变量
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk
export PATH=$PATH:$JAVA_HOME/bin

# 在脚本中设置环境变量
#!/bin/bash
export DB_HOST="localhost"
export DB_PORT="5432"
export DB_USER="admin"

echo "数据库配置："
echo "主机: $DB_HOST"
echo "端口: $DB_PORT"
echo "用户: $DB_USER"
```

#### 3. Shell 变量

```bash
# Shell 内置变量（自动设置）
echo "当前脚本名称: $0"
echo "第一个参数: $1"
echo "所有参数: $@"
echo "参数个数: $#"
echo "上一个命令的退出码: $?"
echo "当前进程 ID: $$"
echo "后台任务的进程 ID: $!"
echo "当前选项: $-"

# 示例
#!/bin/bash
echo "脚本名称: $0"
echo "第一个参数: $1"
echo "第二个参数: $2"
echo "参数个数: $#"
```

## Shell 字符串操作

字符串是 Shell 编程中最常用的数据类型。Shell 支持单引号、双引号和无引号三种方式。

### 单引号 vs 双引号

#### 单引号字符串

```bash
str='this is a string'

# 特性：
# - 原样输出，不会解析变量
# - 不能包含单引号（即使转义也不行）
# - 适用于纯文本内容
```

```bash
# 示例
name="张三"
echo '$name'
# 输出：$name

echo '当前用户：$USER'
# 输出：当前用户：$USER

echo '不能包含单引号：It\'s'
# 输出错误或意外结果
```

**单引号的高级用法**：

```bash
# 拼接字符串（成对出现）
greeting='hello, '$USER' !'
echo $greeting
# 输出：hello, 当前用户名 !

# 包含特殊字符
echo '文件名：test*.txt'
# 输出：文件名：test*.txt（不会展开通配符）
```

#### 双引号字符串

```bash
your_name="runoob"
str="Hello, I know you are \"$your_name\"! \n"

# 特性：
# - 可以解析变量
# - 可以使用转义字符
# - 适用于包含变量的字符串
```

```bash
# 示例
name="李四"
echo "我的名字是 $name"
# 输出：我的名字是 李四

echo "当前目录：$(pwd)"
# 输出：当前目录：/当前路径

# 转义字符
echo "第一行\n第二行"
# 输出：
# 第一行
# 第二行

# 包含引号
echo "他说：\"Hello, World!\""
# 输出：他说："Hello, World!"
```

#### 无引号

```bash
# 适用场景：简单单词
word=hello
echo $word

# 不适用：包含空格或特殊字符
# message=hello world  # 错误
```

### 字符串拼接

#### 使用双引号拼接

```bash
your_name="runoob"

# 方法 1：直接拼接
greeting="hello, "$your_name" !"
echo $greeting
# 输出：hello, runoob !

# 方法 2：使用花括号
greeting_1="hello, ${your_name} !"
echo $greeting_1
# 输出：hello, runoob !

# 方法 3：混合使用
welcome="欢迎 "
full_message="${welcome}${your_name}"
echo $full_message
# 输出：欢迎 runoob
```

#### 使用单引号拼接

```bash
your_name="runoob"

# 方法 1：成对单引号
greeting_2='hello, '$your_name' !'
echo $greeting_2
# 输出：hello, runoob !

# 方法 2：单引号不解析变量
greeting_3='hello, ${your_name} !'
echo $greeting_3
# 输出：hello, ${your_name} !
```

#### 高级拼接技巧

```bash
# 多行拼接
message="第1行\
第2行\
第3行"
echo "$message"
# 输出：三行连在一起

# 使用换行符
message="第1行
第2行
第3行"
echo "$message"

# 数组拼接
parts=("第一部分" "第二部分" "第三部分")
result="${parts[0]} ${parts[1]} ${parts[2]}"
echo $result
# 输出：第一部分 第二部分 第三部分
```

### 字符串长度

```bash
string="abcd"

# 获取字符串长度
echo ${#string}
# 输出：4

# 实际应用
password="mypassword123"
password_length=${#password}

if [ $password_length -lt 8 ]; then
    echo "密码长度不足8位"
else
    echo "密码长度符合要求"
fi

# 计算文件路径长度
path="/home/user/documents/project/file.txt"
path_length=${#path}
echo "路径长度: $path_length"

# 动态计算
dynamic_string=$(date)
length=${#dynamic_string}
echo "当前日期字符串长度: $length"
```

### 提取子字符串

```bash
string="runoob is a great site"

# 语法：${string:start:length}
# start：从 0 开始计数
# length：提取的字符数

# 示例：从第 2 个字符开始，提取 4 个字符
echo ${string:1:4}
# 输出：unoo

# 完整示例
text="Hello World"
echo ${text:0:5}   # 输出：Hello
echo ${text:6:5}   # 输出：World
echo ${text:-5}    # 输出：World（从右边开始取5个字符）

# 实际应用
url="https://example.com/path/to/resource"
# 提取协议
protocol=${url%%://*}     # 输出：https
# 提取域名
domain=${url#*//}         # 输出：example.com/path/to/resource
domain=${domain%%/*}      # 输出：example.com
# 提取路径
path=${url#*//*/*/}       # 输出：resource
```

### 查找子字符串

```bash
string="runoob is a great site"

# 查找字符位置（使用 expr index）
echo `expr index "$string" io`
# 输出：4（i 在第 4 个位置）

# 实际应用
search_string="hello world"
character="world"
position=$(expr index "$search_string" "$character")

if [ $position -gt 0 ]; then
    echo "找到 '$character' 在位置 $position"
else
    echo "未找到 '$character'"
fi

# 查找字符串包含
if [[ "$string" == *"runoob"* ]]; then
    echo "字符串包含 'runoob'"
fi

# 查找字符串前缀
if [[ "$string" == runoob* ]]; then
    echo "字符串以 'runoob' 开头"
fi

# 查找字符串后缀
if [[ "$string" == *.com ]]; then
    echo "字符串以 '.com' 结尾"
fi
```

### 字符串替换

```bash
string="Hello World, Hello Universe"

# 替换第一个匹配项
echo ${string/Hello/Hi}
# 输出：Hi World, Hello Universe

# 替换所有匹配项
echo ${string//Hello/Hi}
# 输出：Hi World, Hi Universe

# 替换开头
echo ${string/#Hello/Hi}
# 输出：Hi World, Hello Universe

# 替换结尾
echo ${string/%Universe/Galaxy}
# 输出：Hello World, Hello Galaxy

# 实际应用
# 替换文件扩展名
filename="document.txt"
new_filename="${filename%.txt}.md"
echo $new_filename
# 输出：document.md

# 替换路径分隔符
path="C:/Users/John/Documents"
unix_path="${path//\\//}"
echo $unix_path
# 输出：C:/Users/John/Documents

# 替换空格为下划线
name="John Doe"
formatted_name="${name// /_}"
echo $formatted_name
# 输出：John_Doe
```

### 字符串删除

```bash
string="prefix_content_suffix"

# 删除前缀
echo ${string#prefix_}
# 输出：content_suffix

# 删除最长匹配前缀
echo ${string##prefix_}
# 输出：content_suffix

# 删除后缀
echo ${string%_suffix}
# 输出：prefix_content

# 删除最长匹配后缀
echo ${string%%_suffix}
# 输出：prefix_content

# 实际应用
# 提取文件名
filepath="/home/user/document.txt"
filename="${filepath##*/}"
echo $filename
# 输出：document.txt

# 提取目录路径
dirpath="${filepath%/*}"
echo $dirpath
# 输出：/home/user

# 提取文件扩展名
extension="${filename##*.}"
echo $extension
# 输出：txt

# 提取不带扩展名的文件名
basename="${filename%.*}"
echo $basename
# 输出：document
```

## 字符串操作高级技巧

### 条件判断

```bash
# 检查字符串是否为空
str=""
if [ -z "$str" ]; then
    echo "字符串为空"
fi

# 检查字符串是否非空
if [ -n "$str" ]; then
    echo "字符串非空"
fi

# 字符串比较
str1="hello"
str2="world"

if [ "$str1" = "$str2" ]; then
    echo "字符串相等"
else
    echo "字符串不相等"
fi

# 字符串模式匹配
string="hello123world"
if [[ "$string" =~ [0-9]+ ]]; then
    echo "字符串包含数字"
fi
```

### 字符串大小写转换

```bash
# Bash 4.0+ 支持大小写转换
string="Hello World"

# 转为大写
echo ${string^^}
# 输出：HELLO WORLD

# 转为小写
echo ${string,,}
# 输出：hello world

# 实际应用
username="JohnDoe"
# 检查用户名是否为大写
if [[ "$username" == *"[[:upper:]]"* ]]; then
    echo "用户名包含大写字母"
fi

# 统一转为小写处理
email="JohnDoe@Example.Com"
normalized_email="${email,,}"
echo $normalized_email
# 输出：johndoe@example.com
```

### 字符串填充

```bash
# 右填充（使用 printf）
number="123"
padded_number=$(printf "%05d" $number)
echo $padded_number
# 输出：00123

# 左填充
text="hello"
padded_text=$(printf "%10s" "$text")
echo "'$padded_text'"
# 输出：'      hello'

# 自定义填充字符
text="test"
padded_text=$(printf "%10s" "$text" | tr ' ' '*')
echo "'$padded_text'"
# 输出：'******test'
```

## 实践案例

### 案例 1：系统信息收集脚本

```bash
#!/bin/bash

# 系统信息收集脚本
readonly SCRIPT_NAME="System Info Collector"
readonly OUTPUT_FILE="system_info.txt"

# 收集系统信息
collect_info() {
    echo "正在收集系统信息..."

    {
        echo "=== $SCRIPT_NAME ==="
        echo "生成时间: $(date)"
        echo ""

        echo "=== 系统信息 ==="
        echo "操作系统: $(uname -s)"
        echo "内核版本: $(uname -r)"
        echo "架构: $(uname -m)"
        echo ""

        echo "=== 用户信息 ==="
        echo "当前用户: $(whoami)"
        echo "用户目录: $HOME"
        echo "登录历史: $(last -n 5 | head -5)"
        echo ""

        echo "=== 内存信息 ==="
        free -h
        echo ""

        echo "=== 磁盘信息 ==="
        df -h
        echo ""

        echo "=== 网络信息 ==="
        ip addr show | grep -E "inet "
        echo ""

        echo "=== 运行的进程 ==="
        ps aux --sort=-%cpu | head -10

    } > $OUTPUT_FILE

    echo "信息已保存到 $OUTPUT_FILE"
}

# 执行收集
collect_info
```

### 案例 2：批量文件重命名脚本

```bash
#!/bin/bash

# 批量文件重命名脚本
# 功能：将文件名中的空格替换为下划线

rename_files() {
    local directory="$1"
    local count=0

    if [ -z "$directory" ]; then
        directory="."
    fi

    echo "正在处理目录: $directory"

    # 遍历所有文件
    for file in "$directory"/*; do
        # 获取文件名（不包含路径）
        filename=$(basename "$file")

        # 检查是否包含空格
        if [[ "$filename" == *" "* ]]; then
            # 替换空格为下划线
            new_filename="${filename// /_}"
            new_path="$directory/$new_filename"

            # 执行重命名
            mv "$file" "$new_path"
            echo "重命名: '$filename' -> '$new_filename'"
            ((count++))
        fi
    done

    echo "共重命名 $count 个文件"
}

# 使用示例
if [ $# -eq 0 ]; then
    rename_files "."
else
    rename_files "$1"
fi
```

### 案例 3：数据库备份脚本

```bash
#!/bin/bash

# 数据库备份脚本

# 配置
readonly DB_HOST="localhost"
readonly DB_PORT="3306"
readonly DB_USER="root"
readonly DB_PASS="password"
readonly DB_NAME="mydb"
readonly BACKUP_DIR="/backup"
readonly RETENTION_DAYS=7

# 生成备份文件名
generate_filename() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    echo "${BACKUP_DIR}/${DB_NAME}_${timestamp}.sql"
}

# 执行备份
backup_database() {
    local backup_file=$(generate_filename)

    echo "开始备份数据库: $DB_NAME"
    echo "备份文件: $backup_file"

    # 执行备份命令
    mysqldump -h$DB_HOST -P$DB_PORT -u$DB_USER -p$DB_PASS \
        --single-transaction --routines --triggers \
        $DB_NAME > $backup_file

    if [ $? -eq 0 ]; then
        echo "备份成功！"

        # 压缩备份文件
        gzip "$backup_file"
        echo "备份文件已压缩: ${backup_file}.gz"
    else
        echo "备份失败！"
        exit 1
    fi
}

# 清理旧备份
cleanup_old_backups() {
    echo "清理 $RETENTION_DAYS 天前的备份文件..."

    find $BACKUP_DIR -name "${DB_NAME}_*.sql.gz" \
        -type f -mtime +$RETENTION_DAYS -delete

    echo "清理完成"
}

# 主函数
main() {
    # 创建备份目录
    mkdir -p $BACKUP_DIR

    # 执行备份
    backup_database

    # 清理旧备份
    cleanup_old_backups

    echo "所有任务完成"
}

# 执行主函数
main
```

### 案例 4：Web 日志分析脚本

```bash
#!/bin/bash

# Web 日志分析脚本

readonly LOG_FILE="$1"
readonly OUTPUT_DIR="./log_analysis"

if [ -z "$LOG_FILE" ]; then
    echo "使用方法: $0 <日志文件>"
    exit 1
fi

if [ ! -f "$LOG_FILE" ]; then
    echo "错误: 日志文件不存在"
    exit 1
fi

# 创建输出目录
mkdir -p $OUTPUT_DIR

# 分析访问量
analyze_visits() {
    echo "=== 访问量分析 ==="

    # 总访问次数
    total_requests=$(wc -l < "$LOG_FILE")
    echo "总访问次数: $total_requests"

    # 独立 IP 数
    unique_ips=$(awk '{print $1}' "$LOG_FILE" | sort -u | wc -l)
    echo "独立 IP 数: $unique_ips"

    # 每日访问量
    echo "每日访问量:"
    awk '{print $4}' "$LOG_FILE" | \
        cut -c2-12 | \
        sort | uniq -c | sort -nr | head -10

    echo ""
}

# 分析状态码
analyze_status_codes() {
    echo "=== HTTP 状态码分析 ==="

    awk '{print $9}' "$LOG_FILE" | \
        sort | uniq -c | sort -nr | head -10

    echo ""
}

# 分析热门页面
analyze_popular_pages() {
    echo "=== 热门页面分析 ==="

    awk '{print $7}' "$LOG_FILE" | \
        sort | uniq -c | sort -nr | head -10

    echo ""
}

# 分析流量最大的 IP
analyze_top_ips() {
    echo "=== 流量最大的 IP ==="

    awk '{print $1, $10}' "$LOG_FILE" | \
        awk '{ip[$1]+=$2} END {for (i in ip) print ip[i], i}' | \
        sort -nr | head -10

    echo ""
}

# 生成报告
generate_report() {
    local report_file="$OUTPUT_DIR/analysis_report.txt"

    {
        echo "Web 日志分析报告"
        echo "==================="
        echo "分析时间: $(date)"
        echo "日志文件: $LOG_FILE"
        echo ""

        # 调用所有分析函数
        analyze_visits
        analyze_status_codes
        analyze_popular_pages
        analyze_top_ips

    } > "$report_file"

    echo "分析报告已保存到: $report_file"
}

# 执行分析
echo "开始分析日志文件: $LOG_FILE"
generate_report
echo "分析完成！"
```

## 最佳实践

### 1. 脚本规范

```bash
#!/bin/bash

# 脚本说明
# 用途：系统监控脚本
# 作者：w0x7ce
# 版本：1.0
# 日期：2023-12-01

# 严格模式
set -euo pipefail

# 变量定义
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly LOG_FILE="${SCRIPT_DIR}/script.log"

# 函数定义
log_message() {
    local message="$1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $message" | tee -a "$LOG_FILE"
}

# 主逻辑
main() {
    log_message "脚本开始执行"

    # 业务逻辑
    # ...

    log_message "脚本执行完成"
}

# 执行主函数
main "$@"
```

### 2. 错误处理

```bash
#!/bin/bash

# 错误处理函数
error_exit() {
    echo "错误: $1" >&2
    exit 1
}

# 检查命令是否存在
check_command() {
    if ! command -v "$1" &> /dev/null; then
        error_exit "命令 '$1' 未找到，请先安装"
    fi
}

# 检查文件是否存在
check_file() {
    if [ ! -f "$1" ]; then
        error_exit "文件 '$1' 不存在"
    fi
}

# 使用示例
check_command "mysql"
check_file "/etc/config.conf"

# 捕获错误
trap 'error_exit "脚本在第 $LINENO 行发生错误"' ERR
```

### 3. 函数编写

```bash
#!/bin/bash

# 函数：检查是否为数字
is_number() {
    local value="$1"

    if [[ "$value" =~ ^[0-9]+$ ]]; then
        return 0
    else
        return 1
    fi
}

# 函数：获取文件大小
get_file_size() {
    local file="$1"

    if [ ! -f "$file" ]; then
        echo "文件不存在"
        return 1
    fi

    local size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    echo "$size"
}

# 函数：格式化文件大小
format_size() {
    local size="$1"

    if [ "$size" -gt 1073741824 ]; then
        echo "$(awk "BEGIN {printf \"%.2f GB\", $size/1073741824}")"
    elif [ "$size" -gt 1048576 ]; then
        echo "$(awk "BEGIN {printf \"%.2f MB\", $size/1048576}")"
    elif [ "$size" -gt 1024 ]; then
        echo "$(awk "BEGIN {printf \"%.2f KB\", $size/1024}")"
    else
        echo "${size} 字节"
    fi
}

# 使用示例
if is_number "123"; then
    echo "是数字"
fi

file_size=$(get_file_size "test.txt")
echo "文件大小: $(format_size $file_size)"
```

## 常见错误及解决方案

### 错误 1：变量赋值包含空格

```bash
# 错误
name = "John Doe"

# 正确
name="John Doe"

# 注意：等号前后不能有空格
```

### 错误 2：未使用引号

```bash
# 错误
file="my document.txt"
ls $file
# 会尝试列出 my 和 document.txt 两个文件

# 正确
file="my document.txt"
ls "$file"

# 或使用转义
file=my\ document.txt
ls $file
```

### 错误 3：字符串比较时未加引号

```bash
# 错误
if [ $string == "value" ]; then
# 当 string 为空时会报错

# 正确
if [ "$string" == "value" ]; then
# 始终安全
```

### 错误 4：使用反引号而非美元括号

```bash
# 旧式（仍可用但不推荐）
current_date=`date +%Y-%m-%d`

# 现代推荐
current_date=$(date +%Y-%m-%d)
```

## 总结

本指南详细介绍了 Shell 脚本编程的核心概念：

- **变量管理**：定义、赋值、只读变量、删除变量
- **字符串操作**：拼接、长度、提取、替换、删除
- **实际应用**：通过四个完整案例展示了 Shell 脚本的实用价值
- **最佳实践**：错误处理、函数编写、代码规范

Shell 脚本编程是 Linux 系统管理的基础技能，掌握这些知识将帮助您：

- 自动化日常任务
- 提高工作效率
- 简化复杂操作
- 增强系统管理能力

## 进阶学习

### 下一步学习内容

| 主题 | 说明 |
|------|------|
| 条件语句 | if、case 语句的使用 |
| 循环语句 | for、while、until 循环 |
| 函数 | 函数定义、参数传递、返回值 |
| 数组 | 数组定义、操作和遍历 |
| 正则表达式 | 文本匹配和处理 |
| 高级特性 | 进程替换、命令组合、管道 |

### 推荐资源

- **Bash 官方文档**：GNU Bash Reference Manual
- **ShellCheck**：在线 Shell 脚本静态分析工具
- **Bash 编程指南**：Advanced Bash-Scripting Guide
- **Linux 命令行**：Linux Command Line and Shell Scripting Bible

持续练习和实践，您将成为 Shell 脚本编程高手！

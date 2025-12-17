---
legacy: true
id: sed-text-processing-complete-guide
title: Sed文本处理完全指南 - 掌握Linux流编辑器
sidebar_label: Sed命令详解
description: 深入学习Linux Sed流编辑器，包括空行操作、文本替换、格式转换、选择性处理等实用技巧
date: 2021-09-13T21:25:58+08:00
tags: [Linux, Sed, 文本处理, Shell, 正则表达式, 系统管理]
authors: [w0x7ce]
---

# Sed文本处理完全指南 - 掌握Linux流编辑器

**Sed**（Stream Editor）是Linux系统中最强大的文本处理工具之一。作为一个流编辑器，Sed能够对文本进行自动化的编辑、转换和处理操作。本文将深入探讨Sed的各种用法，从基础到高级，帮助您掌握这个强大的文本处理工具。

## 目录

- [Sed基础概念](#sed基础概念)
  - [工作原理](#工作原理)
  - [基本语法](#基本语法)
  - [地址寻址](#地址寻址)
- [空行操作技巧](#空行操作技巧)
  - [添加空行](#添加空行)
  - [删除空行](#删除空行)
  - [空行管理](#空行管理)
- [行编号与统计](#行编号与统计)
  - [简单编号](#简单编号)
  - [格式化编号](#格式化编号)
  - [行数统计](#行数统计)
- [文本转换与格式化](#文本转换与格式化)
  - [换行符转换](#换行符转换)
  - [空白字符处理](#空白字符处理)
  - [文本对齐](#文本对齐)
  - [文本居中](#文本居中)
- [文本替换与搜索](#文本替换与搜索)
  - [基础替换](#基础替换)
  - [条件替换](#条件替换)
  - [多重替换](#多重替换)
  - [正则表达式替换](#正则表达式替换)
- [选择性显示与删除](#选择性显示与删除)
  - [显示特定行](#显示特定行)
  - [删除特定行](#删除特定行)
  - [模式匹配](#模式匹配)
- [高级文本处理](#高级文本处理)
  - [文本倒置](#文本倒置)
  - [字符反转](#字符反转)
  - [行合并](#行合并)
  - [数字格式化](#数字格式化)
- [实际应用场景](#实际应用场景)
  - [配置文件处理](#配置文件处理)
  - [日志分析](#日志分析)
  - [数据清洗](#数据清洗)
  - [代码格式化](#代码格式化)
- [性能优化](#性能优化)
- [常见错误与解决方案](#常见错误与解决方案)
- [Sed脚本最佳实践](#sed脚本最佳实践)
- [总结](#总结)

## Sed基础概念

### 工作原理

Sed采用**流式处理**模式，工作流程如下：

1. **读取**：从输入源（文件或标准输入）读取一行
2. **处理**：根据命令序列处理当前行
3. **输出**：将处理后的行输出到标准输出
4. **重复**：重复步骤1-3，直到所有行处理完毕

```
输入 → 模式空间 → 命令序列 → 输出
       ↑
    保持空间（可选）
```

**关键概念：**
- **模式空间（Pattern Space）**：当前处理的行所在的工作区
- **保持空间（Hold Space）**：临时存储数据的区域
- **自动打印（Auto-print）**：默认处理后自动打印模式空间内容

### 基本语法

```bash
# 基本语法
sed [选项] '命令' 文件名

# 常用选项
-n, --quiet, --silent    # 抑制自动打印
-i[扩展名]              # 直接修改文件（就地编辑）
-e 脚本                 # 指定多个编辑命令
-f 脚本文件             # 从文件读取命令
-r, -E                  # 使用扩展正则表达式
```

### 地址寻址

Sed通过地址指定要处理的行：

```bash
# 无地址：处理所有行
sed '命令' file.txt

# 单行号：处理指定行
sed '3p' file.txt        # 只处理第3行

# 地址范围：处理指定范围
sed '1,5p' file.txt      # 处理第1-5行
sed '3,$p' file.txt      # 处理第3行到最后一行

# 步长：每隔指定行数处理一次
sed '1~2p' file.txt      # 处理奇数行（1,3,5...）

# 模式匹配：匹配模式的行
sed '/ERROR/p' file.txt  # 匹配包含ERROR的行

# 组合地址
sed '/start/,/end/p' file.txt  # 从匹配start的行到匹配end的行
```

## 空行操作技巧

### 添加空行

#### 1. 在每行后添加空行

```bash
sed G file.txt
```

**应用场景：**
- 格式化文档，提高可读性
- 准备打印版本
- 创建空白行模板

**实际示例：**
```bash
# 原始文件
Line 1
Line 2
Line 3

# 处理后
Line 1

Line 2

Line 3

```

#### 2. 删除原空行并重新添加

```bash
sed '/^$/d;G' file.txt
```

**命令分解：**
- `/^$/d` - 删除所有空行
- `G` - 在每行后添加空行

**效果：确保每行后有且仅有一空行**

#### 3. 添加多行空行

```bash
# 添加两行空行
sed 'G;G' file.txt

# 添加三行空行
sed 'G;G;G' file.txt

# 添加N行空行（替换G的数量）
```

**实际应用 - 创建文档模板：**
```bash
#!/bin/bash
# 生成带空行的文档模板
cat > report_template.txt << EOF
标题: $(date +%Y-%m-%d) 报告
================================

第一章
_____

内容区域


第二章
_____

内容区域

EOF

# 格式化模板
sed 'G;G' report_template.txt > formatted_report.txt
```

### 删除空行

#### 1. 删除所有空行

```bash
# 方法1：使用d命令
sed '/^$/d' file.txt

# 方法2：使用!d命令（取反）
sed '/./!d' file.txt
```

#### 2. 删除相邻重复空行

```bash
# 只保留一个空行，删除多余的
sed '/^$/N;/^\n$/D' file.txt
```

**命令解释：**
- `N` - 追加下一行到模式空间
- `/^\n$/` - 匹配两个换行符（即两个空行）
- `D` - 删除模式空间中第一个换行符之前的内容并重新开始

#### 3. 删除文件开头和结尾的空行

```bash
# 删除文件开头的空行
sed '/./,$!d' file.txt

# 删除文件结尾的空行
sed -e :a -e '/^ *$/{$d;N;ba' -e '}' file.txt

# 同时删除开头和结尾的空行
sed '/./,/^$/!d' file.txt
```

### 空行管理

#### 高级空行处理脚本

```bash
#!/bin/bash
# 空行管理工具
# 用法: ./manage_blank_lines.sh [操作] 文件

if [ $# -lt 2 ]; then
    echo "用法: $0 <操作> <文件>"
    echo "操作: add|remove|compact|normalize"
    exit 1
fi

OPERATION=$1
FILE=$2

case $OPERATION in
    add)
        # 在每行后添加空行
        sed 'G' "$FILE"
        ;;
    remove)
        # 删除所有空行
        sed '/^$/d' "$FILE"
        ;;
    compact)
        # 压缩多个空行为一个
        sed '/^$/N;/^\n$/D' "$FILE"
        ;;
    normalize)
        # 标准化：删除所有空行，重新添加一个
        sed '/^$/d;G' "$FILE"
        ;;
    *)
        echo "未知操作: $OPERATION"
        exit 1
        ;;
esac
```

## 行编号与统计

### 简单编号

#### 1. 左对齐编号

```bash
sed = file.txt | sed 'N;s/\n/\t/'
```

**输出示例：**
```
1	Line content 1
2	Line content 2
3	Line content 3
```

**实际应用 - 代码行号：**
```bash
# 为脚本添加行号（用于调试）
sed = script.sh | sed 'N;s/\n/ /' > numbered_script.sh

# 查看脚本执行流程
cat numbered_script.sh
```

#### 2. 右对齐编号

```bash
sed = file.txt | sed 'N; s/^/     /; s/ *\(.\{6,\}\) \(.*\)\n\(.*\)/\1  \3/'
```

**更简洁的方法：**
```bash
cat -n file.txt
```

#### 3. 只对非空行编号

```bash
sed '/./=' file.txt | sed '/./N; s/\n/\t/'
```

### 格式化编号

#### 自定义编号格式

```bash
#!/bin/bash
# 生成行号前缀
sed = file.txt | sed 'N; s/^/Line /; s/\n/: /'
```

**输出：**
```
Line 1: Line content 1
Line 2: Line content 2
Line 3: Line content 3
```

#### 带零填充的编号

```bash
# 使用awk实现零填充
awk '{printf "%03d: %s\n", NR, $0}' file.txt

# 使用sed和printf（复杂方法）
sed = file.txt | sed 'N; s/^/0/' | sed 's/\(.*\)\n\(.*\)/\1\2/' | sed 's/\(0*\)/\1/'
```

### 行数统计

#### 模拟 wc -l

```bash
sed -n '$=' file.txt
```

**实际应用 - 快速统计：**

```bash
#!/bin/bash
# 统计代码行数（排除空行和注释）
echo "代码统计报告："
echo "总行数: $(sed -n '$=' code.py)"
echo "非空行数: $(sed '/^$/d' code.py | sed -n '$=')"
echo "注释行数: $(grep -c '^#' code.py)"
echo "有效代码行数: $(grep -v '^#' code.py | grep -v '^$' | sed -n '$=')"
```

## 文本转换与格式化

### 换行符转换

#### DOS/Windows转Unix (CRLF → LF)

```bash
# 删除行尾的CR字符
sed 's/\r$//' dos_file.txt > unix_file.txt

# 方法2：使用tr命令（更高效）
tr -d '\r' < dos_file.txt > unix_file.txt
```

**批量转换脚本：**
```bash
#!/bin/bash
# 批量转换文件换行符
for file in "$@"; do
    if [ -f "$file" ]; then
        echo "转换文件: $file"
        sed -i 's/\r$//' "$file"
    fi
done
```

#### Unix转DOS (LF → CRLF)

```bash
# 方法1：使用sed
sed "s/$/`echo -e \\\r`/" unix_file.txt > dos_file.txt

# 方法2：使用awk
awk '{printf "%s\r\n", $0}' unix_file.txt > dos_file.txt
```

**实际应用 - Git换行符管理：**
```bash
# 在Git中自动处理换行符
git config --global core.autocrlf true
git config --global core.safecrlf true

# 手动转换项目文件
find . -type f -name "*.txt" -exec sed -i 's/\r$//' {} \;
```

### 空白字符处理

#### 删除前导空白

```bash
# 删除行首空格和制表符
sed 's/^[ \t]*//' file.txt
```

#### 删除拖尾空白

```bash
# 删除行尾空格和制表符
sed 's/[ \t]*$//' file.txt
```

#### 同时删除前导和拖尾空白

```bash
# 删除行首和行尾空白
sed 's/^[ \t]*//;s/[ \t]*$//' file.txt

# 简化写法
sed -E 's/^[[:space:]]+|[[:space:]]+$//g' file.txt
```

**实际应用 - 代码格式化：**
```bash
#!/bin/bash
# 清理代码文件的空白字符
echo "正在清理代码格式..."

# 备份原文件
cp "$1" "$1.backup"

# 删除行首空白
sed -i 's/^[ \t]*//' "$1"

# 删除行尾空白
sed -i 's/[ \t]*$//' "$1"

# 删除文件末尾空行
sed -i '/^$/d' "$1"

echo "格式清理完成"
```

### 文本对齐

#### 右对齐（指定宽度）

```bash
# 79字符宽度右对齐
sed -e :a -e 's/^.\{1,78\}$/ &/;ta' file.txt
```

**应用示例 - 生成表格：**
```bash
#!/bin/bash
# 生成表格
cat > generate_table.sh << 'EOF'
#!/bin/bash
# 生成格式化的表格

echo "姓名              年龄    城市"
echo "-------------------------------"
cat employees.txt | sed -e :a -e 's/^.\{1,15\}$/ &/;ta' \
                       -e :a -e 's/^.\{1,22\}$/ &/;ta'
EOF
```

#### 左对齐（指定宽度）

```bash
# 79字符宽度左对齐
sed 's/^.\{1,78\}$/& /' file.txt
```

### 文本居中

#### 方法1：前后填充空格

```bash
# 居中对齐（79字符宽度）
sed -e :a -e 's/^.\{1,77\}$/ & /;ta' file.txt
```

#### 方法2：更精确的居中

```bash
# GNU sed专用，更精确的居中
sed -e :a -e 's/^.\{1,77\}$/ &/;ta' -e 's/\( *\)\1/\1/' file.txt
```

**实际应用 - 居中标题：**
```bash
#!/bin/bash
# 生成居中标题
generate_centered_title() {
    local width=80
    local title="$1"
    local title_len=${#title}
    local padding=$(( (width - title_len) / 2 ))

    printf "%${padding}s%s\n" "" "$title" | sed 's/ /-/g'
}

# 使用示例
generate_centered_title "我的报告"
```

## 文本替换与搜索

### 基础替换

#### 替换每行第一个匹配

```bash
# 替换每行第一个 "foo" 为 "bar"
sed 's/foo/bar/' file.txt
```

#### 替换所有匹配

```bash
# 替换每行所有 "foo" 为 "bar"
sed 's/foo/bar/g' file.txt
```

#### 替换第N个匹配

```bash
# 替换每行第4个 "foo"
sed 's/foo/bar/4' file.txt

# 替换倒数第二个 "foo"
sed 's/\(.*\)foo\(.*foo\)/\1bar\2/' file.txt

# 替换最后一个 "foo"
sed 's/\(.*\)foo/\1bar/' file.txt
```

**实际应用 - 批量替换配置：**
```bash
#!/bin/bash
# 批量替换配置文件中的参数
CONFIG_FILE="app.conf"

# 替换端口号
sed -i 's/port=8080/port=3000/' "$CONFIG_FILE"

# 替换数据库地址
sed -i 's/db_host=localhost/db_host=db.example.com/' "$CONFIG_FILE"

# 替换多个参数
sed -i -e 's/max_conn=100/max_conn=200/' \
       -e 's/timeout=30/timeout=60/' \
       "$CONFIG_FILE"
```

### 条件替换

#### 只在包含特定模式时替换

```bash
# 只在行中包含 "baz" 时替换 "foo" 为 "bar"
sed '/baz/s/foo/bar/g' file.txt
```

#### 只在不包含特定模式时替换

```bash
# 只在行中不包含 "baz" 时替换 "foo" 为 "bar"
sed '/baz/!s/foo/bar/g' file.txt
```

**实际应用 - 条件配置：**
```bash
#!/bin/bash
# 根据环境变量替换配置
ENV=$1

if [ "$ENV" = "production" ]; then
    # 生产环境：替换为生产配置
    sed -i '/#PROD/!s/localhost/prod.example.com/g' config.conf
    sed -i '/#PROD/!s/debug=true/debug=false/g' config.conf
elif [ "$ENV" = "development" ]; then
    # 开发环境：替换为开发配置
    sed -i '/#DEV/!s/prod.example.com/localhost/g' config.conf
fi
```

### 多重替换

#### 链式替换

```bash
# 依次替换多个模式
sed 's/scarlet/red/g; s/ruby/red/g; s/puce/red/g' file.txt
```

#### 使用扩展正则表达式

```bash
# 使用GNU sed的扩展正则
gsed -E 's/(scarlet|ruby|puce)/red/g' file.txt
```

**实际应用 - 关键词替换：**
```bash
#!/bin/bash
# 批量替换关键词
replace_keywords() {
    local file="$1"
    local keyword_file="$2"

    while IFS=':' read -r old new; do
        [ -z "$old" ] && continue
        sed -i "s/$old/$new/g" "$file"
    done < "$keyword_file"
}

# 使用示例
cat > keywords.txt << EOF
错误:error
警告:warning
信息:info
EOF

replace_keywords logfile.txt keywords.txt
```

### 正则表达式替换

#### 基础正则表达式

```bash
# 替换IP地址
sed 's/[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}/IP_MASKED/' file.txt

# 替换邮箱地址
sed 's/[a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]*\.[a-zA-Z]\{2,5\}/EMAIL_MASKED/' file.txt
```

#### 扩展正则表达式（GNU Sed）

```bash
# 使用-E选项（BSD/macOS）
sed -E 's/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/IP_MASKED/' file.txt

# 更简洁的写法
gsed -E 's/[0-9]{1,3}(\.[0-9]{1,3}){3}/IP_MASKED/' file.txt
```

**实际应用 - 数据脱敏：**
```bash
#!/bin/bash
# 日志数据脱敏
mask_sensitive_data() {
    local log_file="$1"

    # 脱敏IP地址
    sed -i -E 's/([0-9]{1,3}\.){3}[0-9]{1,3}/***.***.***.***/g' "$log_file"

    # 脱敏身份证号
    sed -i -E 's/[0-9]{17}[0-9Xx]/***************/g' "$log_file"

    # 脱敏手机号
    sed -i -E 's/1[0-9]{9}/1*********/g' "$log_file"

    # 脱敏邮箱
    sed -i -E 's/[a-zA-Z0-9._%+-]*@[*]+/***@***/g' "$log_file"
}

# 使用示例
mask_sensitive_data access.log
```

## 选择性显示与删除

### 显示特定行

#### 显示文件前N行

```bash
# 显示前10行
sed '10q' file.txt
```

**比head命令更高效的方法：**
```bash
# 显示前100行
sed '100q' file.txt
```

#### 显示文件后N行

```bash
# 显示最后10行（模拟tail）
sed -e :a -e '$q;N;11,$D;ba' file.txt
```

#### 显示指定范围

```bash
# 显示第8-12行
sed -n '8,12p' file.txt

# 显示从匹配行到最后
sed -n '/pattern/,$p' file.txt
```

**实际应用 - 查看日志片段：**
```bash
#!/bin/bash
# 查看日志特定时间段的内容
view_log_range() {
    local log_file="$1"
    local start_pattern="$2"
    local end_pattern="$3"

    sed -n "/$start_pattern/,/$end_pattern/p" "$log_file"
}

# 使用示例
view_log_range app.log "2024-01-15 10:00" "2024-01-15 11:00"
```

### 删除特定行

#### 删除指定范围

```bash
# 删除前10行
sed '1,10d' file.txt

# 删除最后一行
sed '$d' file.txt

# 删除最后N行
sed -e :a -e '$d;N;2,10ba' -e 'P;D' file.txt
```

#### 删除匹配行

```bash
# 删除包含特定模式的行
sed '/ERROR/d' file.txt

# 删除不包含特定模式的行
sed '/ERROR/!d' file.txt
```

**实际应用 - 清理日志：**
```bash
#!/bin/bash
# 清理日志文件
clean_log() {
    local log_file="$1"
    local backup="${log_file}.backup"

    # 备份原文件
    cp "$log_file" "$backup"

    # 删除DEBUG行
    sed -i '/DEBUG/d' "$log_file"

    # 删除空行
    sed -i '/^$/d' "$log_file"

    echo "日志已清理，备份保存在: $backup"
}
```

### 模式匹配

#### 显示匹配行（模拟grep）

```bash
# 显示匹配行
sed -n '/pattern/p' file.txt

# 显示不匹配行
sed -n '/pattern/!p' file.txt
```

#### 匹配行及其上下文

```bash
# 显示匹配行及前一行
sed -n '/pattern/{g;1!p;};h' file.txt

# 显示匹配行及后一行
sed -n '/pattern/{n;p;}' file.txt

# 显示匹配行及其前后各一行
sed -n -e '/pattern/{=;x;1!p;g;$!N;p;D;}' -e h file.txt
```

**实际应用 - 日志分析：**
```bash
#!/bin/bash
# 分析错误日志
analyze_errors() {
    local log_file="$1"

    echo "=== 错误统计 ==="
    echo "总错误数: $(grep -c 'ERROR' "$log_file")"

    echo -e "\n=== 最近10个错误 ==="
    sed -n '/ERROR/{g;1!p;};h' "$log_file" | tail -10

    echo -e "\n=== 错误类型统计 ==="
    grep 'ERROR' "$log_file" | sed -E 's/.*ERROR: (.*)/\1/' | sort | uniq -c | sort -rn
}
```

## 高级文本处理

### 文本倒置

#### 模拟tac命令

```bash
# 倒置所有行
sed '1!G;h;$!d' file.txt
```

**命令解释：**
- `1!G` - 第一行外的所有行，执行G命令（在保持空间追加换行和保持空间内容）
- `h` - 将模式空间内容复制到保持空间
- `$!d` - 最后一行外的所有行，执行d命令（删除）

**实际应用 - 反向查看日志：**
```bash
#!/bin/bash
# 反向查看最新日志
view_latest_logs() {
    local log_file="$1"
    local lines=${2:-50}

    # 获取最后N行，然后倒置
    tail -n "$lines" "$log_file" | sed '1!G;h;$!d'
}

# 使用示例
view_latest_logs app.log 100
```

### 字符反转

#### 模拟rev命令

```bash
# 反转每行字符
sed '/\n/!G;s/\(.\)\(.*\n\)/\2\1/;P;D' file.txt
```

**更简洁的方法（GNU sed）：**
```bash
# 使用rev命令（如果可用）
rev file.txt
```

**实际应用 - 测试文本处理：**
```bash
#!/bin/bash
# 生成测试数据
generate_test_data() {
    for i in {1..10}; do
        echo "Line $i: This is test data"
    done
}

# 反转字符测试
generate_test_data | rev
```

### 行合并

#### 合并两行为一行

```bash
# 将每两行合并为一行
sed '$!N;s/\n/ /' file.txt
```

**实际应用 - 合并CSV数据：**
```bash
#!/bin/bash
# 合并多行CSV记录
merge_csv_lines() {
    local csv_file="$1"
    local output="$2"

    # 合并以逗号结尾的行
    sed -e :a -e '$!N; s/,\n/,/; ta' -e 'P;D' "$csv_file" > "$output"
}

# 使用示例
merge_csv_lines raw_data.csv merged_data.csv
```

#### 合并以反斜杠结尾的行

```bash
# 合并反斜杠续行
sed -e :a -e '/\\$/N; s/\\\n//; ta' file.txt
```

**实际应用 - 处理配置文件：**
```bash
#!/bin/bash
# 合并配置文件的续行
process_config() {
    local config_file="$1"

    # 合并反斜杠续行
    sed -e :a -e '/\\$/N; s/\\\n//; ta' "$config_file" > "${config_file}.tmp"

    # 移除注释和空行
    sed -i -e '/^#/d' -e '/^$/d' "${config_file}.tmp"

    mv "${config_file}.tmp" "$config_file"
}
```

### 数字格式化

#### 添加千位分隔符

```bash
# GNU sed
gsed ':a;s/\B[0-9]\{3\}\>/,&/;ta' file.txt

# 其他sed
sed -e :a -e 's/\(.*[0-9]\)\([0-9]\{3\}\)/\1,\2/;ta' file.txt
```

**实际应用 - 格式化财务报表：**
```bash
#!/bin/bash
# 格式化金额
format_currency() {
    local amount="$1"

    # 添加千分位分隔符
    echo "$amount" | sed -e :a -e 's/\(.*[0-9]\)\([0-9]\{3\}\)/\1,\2/;ta' \
                         -e 's/^/¥/'
}

# 使用示例
format_currency 1234567  # 输出: ¥1,234,567
```

#### 处理小数和负数

```bash
# GNU sed扩展正则
gsed -r ':a;s/(^|[^0-9.])([0-9]+)([0-9]{3})/\1\2,\3/g;ta' file.txt
```

## 实际应用场景

### 配置文件处理

#### 自动生成Nginx配置

```bash
#!/bin/bash
# 生成Nginx虚拟主机配置
generate_nginx_config() {
    local domain="$1"
    local port="${2:-80}"
    local root="/var/www/$domain"

    cat > "/etc/nginx/sites-available/$domain" << EOF
server {
    listen $port;
    server_name $domain;
    root $root;
    index index.html index.htm index.php;

    location / {
        try_files \$uri \$uri/ =404;
    }

    location ~ \.php\$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
    }

    access_log /var/log/nginx/${domain}_access.log;
    error_log /var/log/nginx/${domain}_error.log;
}
EOF

    # 启用站点
    ln -sf "/etc/nginx/sites-available/$domain" "/etc/nginx/sites-enabled/"

    # 测试配置
    nginx -t && systemctl reload nginx
}

# 使用示例
generate_nginx_config example.com 80
```

#### 批量替换配置参数

```bash
#!/bin/bash
# 批量替换多个配置文件
batch_replace_config() {
    local config_dir="$1"
    local find_pattern="$2"
    local replace_value="$3"

    find "$config_dir" -type f -name "*.conf" -exec \
        sed -i "s/$find_pattern/$replace_value/g" {} \;

    echo "已在 $config_dir 中的所有.conf文件替换完成"
}

# 使用示例
batch_replace_config /etc/myapp "localhost" "db.example.com"
```

### 日志分析

#### 实时日志监控

```bash
#!/bin/bash
# 实时监控错误日志
monitor_errors() {
    local log_file="$1"

    tail -f "$log_file" | sed -u '/ERROR/{
        # 添加时间戳
        s/^/$(date "+%Y-%m-%d %H:%M:%S") ERROR: /
        # 高亮显示
        s/ERROR/\\x1b[31mERROR\\x1b[0m/
        p
    }'
}

# 使用示例
monitor_errors /var/log/app.log
```

#### 生成日志摘要

```bash
#!/bin/bash
# 生成日志分析摘要
generate_log_summary() {
    local log_file="$1"
    local output_file="${2:-log_summary.txt}"

    cat > "$output_file" << EOF
=== 日志分析摘要 ===
文件: $log_file
分析时间: $(date)

--- 错误统计 ---
EOF

    # 统计错误类型
    grep -i error "$log_file" | sed -E 's/.*ERROR: (.*)/\1/' | \
        sort | uniq -c | sort -rn >> "$output_file"

    cat >> "$output_file" << EOF

--- 警告统计 ---
EOF

    # 统计警告类型
    grep -i warn "$log_file" | sed -E 's/.*WARN: (.*)/\1/' | \
        sort | uniq -c | sort -rn >> "$output_file"

    cat >> "$output_file" << EOF

--- 顶级错误IP ---
EOF

    # 统计错误来源IP
    grep -i error "$log_file" | sed -E 's/([0-9]{1,3}\.){3}[0-9]{1,3}.*/\1***/' | \
        sort | uniq -c | sort -rn | head -10 >> "$output_file"

    echo "摘要已生成: $output_file"
}
```

### 数据清洗

#### CSV数据清洗

```bash
#!/bin/bash
# 清洗CSV数据
clean_csv_data() {
    local input_file="$1"
    local output_file="$2"

    # 移除BOM
    sed -i '1s/^\xEF\xBB\xBF//' "$input_file"

    # 移除空行
    sed -i '/^$/d' "$input_file"

    # 清理行尾空白
    sed -i 's/[ \t]*$//' "$input_file"

    # 统一换行符
    sed -i 's/\r$//' "$input_file"

    # 移除重复行
    awk '!seen[$0]++' "$input_file" > "$output_file"

    echo "数据清洗完成: $output_file"
}

# 使用示例
clean_csv_data dirty_data.csv clean_data.csv
```

#### JSON数据格式化

```bash
#!/bin/bash
# 格式化JSON文件
format_json() {
    local json_file="$1"

    # 使用jq格式化（需要安装jq）
    if command -v jq &> /dev/null; then
        jq '.' "$json_file" > "${json_file%.json}_formatted.json"
        echo "JSON已格式化: ${json_file%.json}_formatted.json"
    else
        echo "错误: 需要安装jq工具"
        return 1
    fi
}

# 使用示例
format_json data.json
```

### 代码格式化

#### Python代码格式化

```bash
#!/bin/bash
# Python代码格式化
format_python_code() {
    local python_file="$1"

    # 备份原文件
    cp "$python_file" "${python_file}.bak"

    # 移除行尾空白
    sed -i 's/[ \t]*$//' "$python_file"

    # 移除行尾分号（如果不需要）
    sed -i 's/;$//' "$python_file"

    # 统一缩进（将tab转换为4个空格）
    sed -i 's/\t/    /g' "$python_file"

    # 移除空行
    sed -i '/^$/d' "$python_file"

    echo "Python代码格式化完成"
    echo "备份文件: ${python_file}.bak"
}

# 使用示例
format_python_code script.py
```

#### JavaScript代码清理

```bash
#!/bin/bash
# JavaScript代码清理
clean_javascript() {
    local js_file="$1"

    # 备份原文件
    cp "$js_file" "${js_file}.bak"

    # 移除行尾空白
    sed -i 's/[ \t]*$//' "$js_file"

    # 移除行尾分号（可选）
    sed -i 's/;$//' "$js_file"

    # 统一换行符
    sed -i 's/\r$//' "$js_file"

    echo "JavaScript代码清理完成"
    echo "备份文件: ${js_file}.bak"
}

# 使用示例
clean_javascript app.js
```

## 性能优化

### 1. 优化替换命令

```bash
# ✗ 低效：全局替换
sed 's/foo/bar/g' file.txt

# ✓ 高效：只处理包含目标的行
sed '/foo/ s/foo/bar/g' file.txt

# ✓ 更高效：使用上一次替换的结果
sed '/foo/ s//bar/g' file.txt
```

### 2. 使用退出命令处理大文件

```bash
# ✗ 低效：处理整个文件
sed -n '100,200p' huge_file.txt

# ✓ 高效：处理到第200行后退出
sed -n '200q;100,200p' huge_file.txt
```

### 3. 原地编辑注意事项

```bash
# 使用-i选项时，先备份
sed -i.bak 's/foo/bar/g' file.txt

# 批量处理多个文件
find . -name "*.txt" -exec sed -i 's/foo/bar/g' {} \;
```

### 4. 并行处理

```bash
# 使用GNU parallel并行处理
find . -name "*.txt" | parallel sed -i 's/foo/bar/g'

# 使用xargs并行处理
find . -name "*.txt" -print0 | xargs -0 -P 4 sed -i 's/foo/bar/g'
```

## 常见错误与解决方案

### 错误1：正则表达式转义

```bash
# ✗ 错误：未正确转义
sed 's/[0-9]{3}/XXX/' file.txt

# ✓ 正确：转义花括号
sed 's/[0-9]\{3\}/XXX/' file.txt

# ✓ 正确：使用-E选项
sed -E 's/[0-9]{3}/XXX/' file.txt
```

### 错误2：特殊字符处理

```bash
# ✗ 错误：特殊字符未转义
sed 's/foo$/bar/' file.txt

# ✓ 正确：使用双引号
sed "s/foo$/bar/" file.txt

# ✓ 正确：转义特殊字符
sed 's/foo\$/bar/' file.txt
```

### 错误3：多行匹配

```bash
# ✗ 错误：尝试跨行匹配（默认不支持）
sed '/start.*end/s/foo/bar/' file.txt

# ✓ 正确：使用N命令读取多行
sed -e '/start/{N;/start.*end/s/foo/bar/;}' file.txt
```

### 错误4：保持空间使用

```bash
# 错误：保持空间内容未定义
sed 'h;d' file.txt  # 只会输出第一行

# 正确：先读取一行再复制
sed '1h;1!H;$!d;x' file.txt  # 倒置所有行
```

## Sed脚本最佳实践

### 1. 使用脚本文件

```bash
# 创建sed脚本文件
cat > myscript.sed << 'EOF'
# 删除空行
/^$/d

# 替换特定文本
s/old/new/g

# 添加行号
=
N
s/\n/\t/
EOF

# 执行脚本
sed -f myscript.sed input.txt
```

### 2. 注释和文档化

```bash
# 创建带注释的sed脚本
cat > documented_script.sed << 'EOF'
# 删除所有空行
/^$/d

# 删除以#开头的注释行
/^#/d

# 将所有"error"替换为"ERROR"（不区分大小写）
s/[Ee]rror/ERROR/g

# 在每行后添加空行（提高可读性）
G
EOF
```

### 3. 函数化常用操作

```bash
#!/bin/bash
# 创建sed函数库

# 删除空行
delete_blank_lines() {
    sed '/^$/d' "$1"
}

# 替换文本
replace_text() {
    local pattern="$1"
    local replacement="$2"
    local file="$3"

    sed "s/$pattern/$replacement/g" "$file"
}

# 格式化JSON（如果可用）
format_json() {
    local file="$1"

    if command -v jq &> /dev/null; then
        jq '.' "$file"
    else
        echo "警告: jq未安装，无法格式化JSON"
        cat "$file"
    fi
}

# 使用函数
delete_blank_lines logfile.txt > cleaned_log.txt
```

### 4. 错误处理

```bash
#!/bin/bash
# 带错误处理的sed脚本
safe_replace() {
    local pattern="$1"
    local replacement="$2"
    local input_file="$3"
    local output_file="$4"

    # 检查输入文件是否存在
    if [ ! -f "$input_file" ]; then
        echo "错误: 文件 $input_file 不存在"
        return 1
    fi

    # 检查模式是否有效
    if ! echo "test" | grep -qE "$pattern"; then
        echo "错误: 无效的正则表达式: $pattern"
        return 1
    fi

    # 执行替换
    sed "s/$pattern/$replacement/g" "$input_file" > "$output_file"

    if [ $? -eq 0 ]; then
        echo "替换成功: $input_file -> $output_file"
        return 0
    else
        echo "错误: 替换失败"
        return 1
    fi
}
```

## 总结

Sed作为Linux系统中最强大的流编辑器之一，掌握它能够极大提升文本处理效率。本文详细介绍了：

**核心概念：**
- Sed的工作原理和模式空间概念
- 地址寻址和命令语法
- 基本和扩展正则表达式

**实用技巧：**
- 空行管理（添加、删除、标准化）
- 行编号和统计
- 文本格式化（对齐、居中、缩进）
- 智能替换（条件替换、多重替换）
- 选择性显示和删除

**高级应用：**
- 文本倒置和字符反转
- 行合并和续行处理
- 数字格式化
- 数据脱敏

**最佳实践：**
- 性能优化技巧
- 错误处理方法
- 脚本编写规范
- 实际应用场景

**关键要点：**

1. **理解原理**：掌握模式空间和保持空间的工作机制
2. **正则表达式**：熟练使用正则表达式进行模式匹配
3. **命令组合**：学会组合多个sed命令实现复杂操作
4. **性能意识**：针对大文件采用优化策略
5. **实际应用**：将sed应用于日常工作中的文本处理任务

通过持续练习和在实际项目中的应用，您将能够充分发挥Sed的强大功能，成为文本处理高手！

---

## 相关资源

- [Sed官方手册](https://www.gnu.org/software/sed/manual/sed.html)
- [Sed常用实例](https://www.grymoire.com/Unix/Sed.html)
- [正则表达式指南](https://www.regular-expressions.info/)
- [高级Sed技巧](https://www.ibm.com/developerworks/linux/library/l-sed1/index.html)

---
legacy: true
title: Git完全使用指南：从入门到精通
description: 全面学习Git版本控制系统，包含仓库管理、提交修改、分支操作、远程协作、冲突解决等完整教程，适合开发者和团队协作
tags: [Git, 版本控制, 开发者工具, 代码管理, 协作开发]
category: Developer Tools
author: w0x7ce
date: 2021-12-15
---

# Git完全使用指南：从入门到精通

:::info[当前 Git 提示]

本文的核心命令仍适用于现代 Git。新项目的默认分支通常命名为 `main`，但仓库实际分支名由初始化配置和远端约定决定；遇到 `master` 示例时，将其替换为目标仓库的真实分支即可。

:::

## 目录

- [Git概述](#git概述)
- [Git基础概念](#git基础概念)
- [Git安装与配置](#git安装与配置)
- [创建仓库命令](#创建仓库命令)
- [基础工作流程](#基础工作流程)
- [提交与修改](#提交与修改)
- [查看历史](#查看历史)
- [分支管理](#分支管理)
- [远程操作](#远程操作)
- [分支合并与冲突解决](#分支合并与冲突解决)
- [标签管理](#标签管理)
- [Git工作流](#git工作流)
- [Git子模块](#git子模块)
- [Git钩子](#git钩子)
- [Git配置与别名](#git配置与别名)
- [最佳实践](#最佳实践)
- [故障排除](#故障排除)
- [进阶技巧](#进阶技巧)

---

## Git概述

Git是一个分布式版本控制系统，由Linus Torvalds于2005年开发。它允许开发者在本地进行完整的版本控制操作，并支持多人协作开发。

### Git的核心特点

- **分布式**：每个开发者都有完整的代码仓库副本
- **分支管理**：轻量级分支创建和切换
- **完整性**：使用SHA-1哈希保证数据完整性
- **性能**：快速和高效的操作
- **非线性开发**：支持并行开发

### Git vs 其他版本控制系统

| 特性 | Git | SVN | CVS |
|------|-----|-----|-----|
| 分布式 | ✓ | ✗ | ✗ |
| 分支操作 | 高效 | 低效 | 不支持 |
| 离线操作 | ✓ | ✗ | ✗ |
| 合并能力 | 强 | 弱 | 弱 |
| 速度 | 快 | 中等 | 慢 |

---

## Git基础概念

### Git工作区域

```
┌─────────────────┐
│   Working Tree  │ ← 工作目录（实际文件）
└────────┬────────┘
         │ (git add)
         ▼
┌─────────────────┐
│    Staging      │ ← 暂存区（Index）
│    (Index)      │
└────────┬────────┘
         │ (git commit)
         ▼
┌─────────────────┐
│   Local Repo    │ ← 本地仓库（HEAD）
└─────────────────┘
```

### Git文件状态

```
┌─────────────┐
│ Untracked   │ ← 未跟踪
└──────┬──────┘
       │ (git add)
       ▼
┌─────────────┐
│  Staged     │ ← 已暂存
└──────┬──────┘
       │ (git commit)
       ▼
┌─────────────┐
│ Unmodified  │ ← 未修改
└──────┬──────┘
       │ (edit files)
       ▼
┌─────────────┐
│  Modified   │ ← 已修改
└──────┬──────┘
       │ (git add)
       ▼
┌─────────────┐
│  Staged     │ ← 已暂存
└─────────────┘
```

### 基本术语

- **Repository（仓库）**：存储项目代码和历史的地方
- **Commit（提交）**：对项目文件的某个状态的记录
- **Branch（分支）**：独立开发线路
- **Merge（合并）**：将一个分支的修改应用到另一个分支
- **Pull Request（拉取请求）**：请求合并代码的协作方式
- **Clone（克隆）**：下载远程仓库到本地
- **Push（推送）**：上传本地代码到远程仓库
- **Fetch（获取）**：下载远程代码但不合并

---

## Git安装与配置

### 安装Git

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install git
```

#### CentOS/RHEL
```bash
sudo yum install git
```

#### macOS
```bash
# 使用Homebrew
brew install git

# 或从官网下载安装包
# https://git-scm.com/download/mac
```

#### Windows
- 下载并安装Git for Windows
- 或使用Chocolatey：`choco install git`

### 配置Git

```bash
# 设置全局用户名和邮箱
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 查看配置
git config --list

# 查看特定配置
git config user.name
git config user.email

# 配置文件位置
# 全局：~/.gitconfig
# 项目：.git/config
```

### 常用配置选项

```bash
# 设置默认分支名
git config --global init.defaultBranch main

# 设置默认编辑器
git config --global core.editor vim

# 设置默认推送方式
git config --global push.default simple

# 启用彩色输出
git config --global color.ui auto

# 设置行尾转换
git config --global core.autocrlf input  # Linux/macOS
git config --global core.autocrlf true   # Windows

# 设置忽略权限变化
git config --global core.fileMode false
```

### 生成SSH密钥

```bash
# 生成SSH密钥
ssh-keygen -t rsa -b 4096 -C "your.email@example.com"

# 添加到ssh-agent
ssh-add ~/.ssh/id_rsa

# 查看公钥
cat ~/.ssh/id_rsa.pub

# 复制到剪贴板（macOS）
pbcopy < ~/.ssh/id_rsa.pub

# 复制到剪贴板（Linux）
xclip -sel clip < ~/.ssh/id_rsa.pub
```

---

## 创建仓库命令

### 初始化新仓库

```bash
# 在当前目录初始化Git仓库
git init

# 初始化特定分支
git init -b main

# 初始化裸仓库（用于服务器）
git init --bare
```

**初始化后的目录结构：**
```
project/
├── .git/          # Git仓库数据
│   ├── HEAD       # 当前分支
│   ├── config     # 仓库配置
│   ├── objects/   # Git对象
│   ├── refs/      # 分支和标签引用
│   └── ...
└── (项目文件)
```

### 克隆现有仓库

```bash
# 克隆整个仓库
git clone https://github.com/username/repository.git

# 克隆到指定目录
git clone https://github.com/username/repository.git my-project

# 克隆特定分支
git clone -b develop https://github.com/username/repository.git

# 浅克隆（节省空间和时间）
git clone --depth 1 https://github.com/username/repository.git

# 克隆包含子模块
git clone --recursive https://github.com/username/repository.git

# 克隆并自定义仓库名
git clone https://github.com/username/repository.git repo-name
```

**克隆后的目录结构：**
```
my-project/
├── .git/          # 完整的Git仓库
├── .gitmodules    # 子模块配置（如果存在）
└── (项目文件)
```

### 初始化裸仓库（用于服务器）

```bash
# 创建共享仓库
git init --bare /path/to/shared/repo.git

# 设置权限
chmod 755 /path/to/shared/repo.git

# 推送代码到共享仓库
git remote add origin /path/to/shared/repo.git
git push -u origin main
```

---

## 基础工作流程

### 标准的Git工作流程

```bash
# 1. 创建或克隆仓库
git init  # 或 git clone <url>

# 2. 修改文件
echo "Hello World" > README.md
echo "console.log('Hello');" > index.js

# 3. 查看状态
git status

# 4. 添加文件到暂存区
git add README.md      # 添加特定文件
git add .              # 添加所有更改

# 5. 提交更改
git commit -m "Initial commit"

# 6. 查看日志
git log
```

### 完整示例

```bash
# 初始化项目
mkdir my-project
cd my-project
git init

# 创建README
cat > README.md << EOF
# My Project

这是一个示例项目。
EOF

# 创建源代码
cat > main.py << EOF
def main():
    print("Hello, Git!")

if __name__ == "__main__":
    main()
EOF

# 查看状态
git status
# 输出：
# On branch main
#
# No commits yet
#
# Untracked files:
#   (use "git add <file>..." to include in what will be committed)
# 	README.md
# 	main.py

# 添加文件
git add README.md main.py

# 提交
git commit -m "Initial commit: Add README and main.py"

# 查看日志
git log
# 输出：
# commit a1b2c3d4e5f6... (HEAD -> main)
# Author: Your Name <your.email@example.com>
# Date:   Wed Dec 15 15:32:38 2021 +0800
#
#     Initial commit: Add README and main.py
```

---

## 提交与修改

### 查看状态

```bash
# 查看工作目录和暂存区状态
git status

# 简短输出
git status -s
# 输出格式：
#  M README.md     # 已修改，已暂存
# A  new-file.txt  # 新文件，已暂存
# ?? untracked.txt # 未跟踪文件

# 查看详细状态
git status -v

# 查看分支状态
git status -b
```

### 添加文件到暂存区

```bash
# 添加特定文件
git add filename.txt

# 添加当前目录所有文件
git add .

# 添加所有文件（包括删除的）
git add -A

# 添加特定模式的文件
git add *.txt
git add src/**/*.js

# 交互式添加
git add -i
# 进入交互模式
#   1) -        2) u  3) s  4) v  5) r
#   6) [p]atc  7) q  8) h  ?) help
# 选择要添加的文件

# 添加部分文件内容（交互式）
git add -p
# 可以选择添加文件的某些部分
```

### 提交更改

```bash
# 提交暂存区内容
git commit -m "Add new feature"

# 添加并提交（跳过暂存区）
git commit -am "Update existing files"

# 修改最后一次提交
git commit --amend -m "Fix commit message"

# 修改最后一次提交但保留原时间戳
git commit --amend --no-edit

# 创建空提交（用于触发CI/CD）
git commit --allow-empty -m "Trigger build"

# 指定作者
git commit --author="John Doe <john@example.com>" -m "Update"

# 使用不同的日期
git commit -m "Update" --date="2021-12-15 10:30:00"
```

### 查看差异

```bash
# 查看工作目录与暂存区的差异
git diff

# 查看暂存区与仓库的差异
git diff --staged
git diff --cached

# 查看工作目录与仓库的差异
git diff HEAD

# 查看两个提交之间的差异
git diff commit1 commit2

# 查看特定文件的差异
git diff filename.txt

# 查看分支间的差异
git diff branch1 branch2

# 查看两个分支在某个文件上的差异
git diff branch1 branch2 -- filename.txt

# 统计差异
git diff --stat

# 仅显示文件名
git diff --name-only

# 显示变更的行数统计
git diff --numstat
```

### 删除文件

```bash
# 删除工作目录文件并添加到暂存区
git rm filename.txt

# 删除目录
git rm -r directory/

# 仅从暂存区删除（保留工作目录）
git rm --cached filename.txt

# 强制删除（工作目录和暂存区）
git rm -f filename.txt

# 删除已跟踪的忽略文件
git rm -f --cached *.log

# 批量删除
git rm -f *.tmp
```

### 重命名文件

```bash
# 重命名文件
git mv oldname.txt newname.txt

# 等价于：
# mv oldname.txt newname.txt
# git rm oldname.txt
# git add newname.txt

# 移动文件到子目录
git mv file.txt src/file.txt

# 移动多个文件
git mv file1.txt file2.txt src/
```

### 恢复文件

```bash
# 从暂存区恢复文件
git restore --staged filename.txt

# 从仓库恢复文件（丢弃工作目录更改）
git restore filename.txt

# 恢复所有文件
git restore .

# 使用特定提交恢复文件
git restore --source=commit-hash filename.txt

# 恢复并创建新分支
git restore --source=commit-hash -b new-branch filename.txt

# 恢复被删除的文件
git restore --source=HEAD~1 path/to/file.txt
```

### 撤销操作

```bash
# 撤销最后一次提交但保留更改
git reset --soft HEAD~1

# 撤销最后一次提交并移除暂存区更改
git reset HEAD~1

# 彻底撤销最后一次提交
git reset --hard HEAD~1

# 撤销到特定提交
git reset --hard commit-hash

# 撤销暂存区操作
git reset

# 撤销特定文件的暂存
git reset HEAD filename.txt

# 撤销工作目录的修改
git checkout -- filename.txt

# 安全撤销所有修改
git checkout .
```

---

## 查看历史

### 查看提交日志

```bash
# 查看完整日志
git log

# 查看简化日志
git log --oneline

# 查看最近N条提交
git log -5

# 显示每次提交的差异
git log -p

# 显示每次提交的简略统计
git log --stat

# 按时间范围查看
git log --since="2021-12-01"
git log --until="2021-12-31"
git log --after="2021-12-01" --before="2021-12-31"

# 查看特定作者的提交
git log --author="John"

# 查看特定字符串的提交
git log --grep="fix bug"

# 查看特定文件的提交
git log -- filename.txt

# 显示分支图
git log --graph --oneline --all

# 美化输出
git log --pretty=format:"%h - %an, %ar : %s"

# 查看变更概览
git log --oneline --graph --decorate --all

# 显示被合并和未被合并的提交
git log --merges
git log --no-merges
```

### 格式化日志输出

```bash
# 自定义格式
git log --pretty=format:"%h %ad %s" --date=short

# 可用的占位符
# %h - 简写哈希
# %H - 完整哈希
# %an - 作者名
# %ae - 作者邮箱
# %ad - 作者日期
# %ar - 作者相对日期
# %s - 提交说明
# %b - 提交内容
# %d - 引用（分支、标签）

# 示例
git log --pretty=format:"%C(yellow)%h%Creset - %C(green)%ad%Creset - %s" --date=short

# 带颜色的输出
git log --color --pretty=format:"%h %s"
```

### 查看特定提交

```bash
# 查看特定提交的详细信息
git show commit-hash

# 查看特定提交的文件列表
git show --name-only commit-hash

# 查看特定提交的统计信息
git show --stat commit-hash

# 查看特定文件在特定提交的内容
git show commit-hash:filename.txt

# 查看特定提交中的特定文件
git show commit-hash:path/to/file.txt

# 查看最后一次提交
git show HEAD

# 查看倒数第二次提交
git show HEAD~1

# 查看分支指向的提交
git show branch-name
```

### 查看文件历史

```bash
# 查看文件的所有变更历史
git log --follow filename.txt

# 显示每次变更的详细信息
git log -p filename.txt

# 显示简略信息
git log --oneline filename.txt

# 显示统计信息
git log --stat filename.txt

# 使用blame查看每行的作者
git blame filename.txt

# 显示最后一次修改每一行的人
git blame -L 10,20 filename.txt

# 忽略空格变更
git blame -w filename.txt

# 显示被重命名后的文件历史
git log --follow --oneline -- filename.txt
```

---

## 分支管理

### 查看分支

```bash
# 查看本地分支
git branch

# 查看远程分支
git branch -r

# 查看所有分支（包括远程）
git branch -a

# 查看分支详细信息
git branch -vv

# 显示分支图
git log --all --graph --decorate --oneline

# 查看每个分支的最后提交
git branch -v

# 查看已合并到当前分支的分支
git branch --merged

# 查看未合并到当前分支的分支
git branch --no-merged
```

### 创建分支

```bash
# 创建新分支
git branch feature-login

# 创建并切换到新分支
git checkout -b feature-login

# 创建并切换到新分支（Git 2.23+）
git switch -c feature-login

# 基于特定提交创建分支
git branch feature-login commit-hash

# 基于远程分支创建分支
git checkout -b feature-login origin/feature-login

# 创建空分支（没有提交历史）
git checkout --orphan empty-branch
git rm -rf .
git commit --allow-empty -m "Initial empty commit"
```

### 切换分支

```bash
# 切换到分支
git checkout feature-login

# 切换到新分支（Git 2.23+）
git switch feature-login

# 切换到上一个分支
git checkout -

# 切换到新分支并跟踪远程分支
git checkout --track origin/feature-login

# 切换到分支并设置上游分支
git checkout -b feature-login origin/feature-login

# 切换到特定提交（分离头指针状态）
git checkout commit-hash

# 切换到标签（分离头指针状态）
git checkout v1.0.0
```

### 删除分支

```bash
# 删除本地分支
git branch -d feature-login

# 强制删除分支（即使有未合并的更改）
git branch -D feature-login

# 删除远程分支
git push origin --delete feature-login

# 删除远程分支（旧方式）
git push origin :feature-login

# 删除已被合并的分支
git branch --merged | grep -v "\*" | xargs git branch -d

# 清理远程已删除的分支
git fetch --prune
git remote prune origin
```

### 重命名分支

```bash
# 重命名当前分支
git branch -m new-feature-name

# 重命名指定分支
git branch -m old-name new-name

# 重命名远程分支的步骤
# 1. 重命名本地分支
git branch -m old-branch new-branch

# 2. 删除远程旧分支
git push origin --delete old-branch

# 3. 推送新分支
git push origin new-branch

# 4. 设置上游分支
git push -u origin new-branch
```

---

## 远程操作

### 查看远程仓库

```bash
# 查看远程仓库列表
git remote

# 查看远程仓库详细信息
git remote -v

# 查看特定远程仓库信息
git remote show origin

# 查看远程仓库的引用
git remote show origin --porcelain

# 查看远程分支
git remote show origin | grep "HEAD branch"
```

### 添加远程仓库

```bash
# 添加远程仓库
git remote add origin https://github.com/username/repo.git

# 添加远程仓库并指定名称
git remote add upstream https://github.com/username/repo.git

# 添加远程仓库（SSH）
git remote add origin git@github.com:username/repo.git

# 添加远程仓库并设置获取URL
git remote add origin https://github.com/username/repo.git

# 查看所有远程分支
git remote show origin
```

### 修改远程仓库

```bash
# 修改远程仓库URL
git remote set-url origin https://github.com/username/new-repo.git

# 修改远程仓库获取URL
git remote set-url --fetch origin https://github.com/username/repo.git

# 重命名远程仓库
git remote rename origin upstream

# 删除远程仓库
git remote remove origin

# 清空远程URL
git remote set-url origin ""
```

### 同步远程仓库

```bash
# 从远程仓库获取最新数据（不合并）
git fetch

# 获取特定分支
git fetch origin

# 获取所有分支
git fetch --all

# 获取并自动更新远程分支引用
git fetch --prune

# 获取并显示变更
git fetch --verbose

# 获取特定标签
git fetch --tags

# 强制更新远程分支引用
git fetch --prune --force
```

### 拉取代码

```bash
# 从远程仓库拉取并合并
git pull

# 拉取特定分支
git pull origin main

# 拉取并变基（替代合并）
git pull --rebase

# 拉取但不要自动合并
git pull --no-commit

# 拉取特定引用
git pull origin feature/branch

# 使用rebase解决冲突后的拉取
git pull --rebase origin main
```

### 推送代码

```bash
# 推送代码到远程仓库
git push

# 推送当前分支并设置上游分支
git push -u origin main

# 推送所有分支
git push --all

# 推送所有标签
git push --tags

# 强制推送（谨慎使用）
git push --force

# 安全强制推送
git push --force-with-lease

# 推送特定分支
git push origin feature-branch

# 删除远程分支
git push origin --delete feature-branch

# 推送标签
git push origin v1.0.0

# 推送所有标签
git push origin --tags

# 推送到裸仓库
git push /path/to/bare/repo.git main
```

### 跟踪分支

```bash
# 查看跟踪分支
git branch -vv

# 设置跟踪分支
git branch --set-upstream-to=origin/main main

# 取消跟踪分支
git branch --unset-upstream

# 推送并设置跟踪分支
git push -u origin feature-branch

# 修改跟踪分支
git branch --set-upstream-to=origin/new-feature main
```

---

## 分支合并与冲突解决

### 合并分支

```bash
# 合并指定分支到当前分支
git merge feature-branch

# 合并但不创建合并提交（快速前进）
git merge --ff-only feature-branch

# 合并但始终创建合并提交
git merge --no-ff feature-branch

# 合并但禁止快速前进
git merge --no-fast-forward feature-branch

# 合并并使用squash
git merge --squash feature-branch

# 合并但暂停（用于解决冲突）
git merge --no-commit feature-branch

# 合并并显示合并信息
git merge --log feature-branch

# 查看合并状态
git status

# 查看合并日志
git log --oneline --graph --all
```

### 变基（Rebase）

```bash
# 将当前分支变基到main分支
git rebase main

# 交互式变基（重写提交历史）
git rebase -i HEAD~3

# 交互式变基选项：
# pick: 使用提交
# reword: 修改提交信息
# edit: 修改提交
# squash: 合并提交（保留消息）
# fixup: 合并提交（丢弃消息）
# drop: 删除提交

# 变基到特定分支
git rebase main feature-branch

# 继续变基（在解决冲突后）
git rebase --continue

# 跳过当前提交
git rebase --skip

# 取消变基
git rebase --abort

# 在变基时指定作者
git rebase --committer-date-is-author-date

# 保持分支合并
git rebase --preserve-merges main
```

### 解决冲突

```bash
# 查看冲突文件
git status

# 查看冲突详情
git diff

# 查看冲突的具体内容
git diff --name-only --diff-filter=U

# 手动编辑冲突文件（删除冲突标记）
# 冲突标记格式：
# <<<<<<< HEAD
# 当前分支内容
# =======
# 合并分支内容
# >>>>>>> branch-name

# 使用合并工具
git mergetool

# 常见合并工具：
# vimdiff
# kdiff3
# meld
# opendiff
# tortoisemerge

# 取消合并
git merge --abort

# 在冲突解决后继续合并
git add resolved-file.txt
git commit

# 在冲突解决后继续变基
git add .
git rebase --continue
```

### 冲突解决策略

#### 策略1：使用ours和theirs
```bash
# 使用当前分支的版本
git checkout --ours filename.txt

# 使用合并分支的版本
git checkout --theirs filename.txt

# 然后添加并提交
git add filename.txt
```

#### 策略2：使用变基
```bash
# 在合并前先变基
git checkout main
git pull origin main
git checkout feature-branch
git rebase main

# 如果有冲突，解决后继续
git rebase --continue
```

#### 策略3：选择性合并
```bash
# 只合并特定提交
git cherry-pick commit-hash

# 选择性合并多个提交
git cherry-pick commit1 commit2

# 选择性合并一系列提交
git cherry-pick commit1..commit5

# 退出cherry-pick
git cherry-pick --abort
```

---

## 标签管理

### 创建标签

```bash
# 创建附注标签
git tag -a v1.0.0 -m "Release version 1.0.0"

# 创建轻量标签
git tag v1.0.0

# 为特定提交创建标签
git tag v1.0.0 commit-hash

# 创建带注释和签名的标签
git tag -s v1.0.0 -m "Release version 1.0.0"

# 创建带检查标签
git tag -a v1.0.0 -m "Release version 1.0.0" --checkpoint
```

### 查看标签

```bash
# 查看所有标签
git tag

# 查看标签列表（匹配模式）
git tag -l "v1.*"

# 查看标签详细信息
git show v1.0.0

# 查看标签列表并显示标签信息
git tag -n

# 查看特定标签的详细信息
git tag -l -n1 v1.0.0

# 查看标签的注释
git tag -n5

# 查看轻量标签和附注标签
git tag -l -n
```

### 删除标签

```bash
# 删除本地标签
git tag -d v1.0.0

# 删除远程标签
git push origin --delete v1.0.0

# 删除远程标签（旧方式）
git push origin :refs/tags/v1.0.0

# 删除匹配的标签
git tag -d $(git tag -l "v1.*")

# 清理已删除的远程标签
git fetch --prune --prune-tags
```

### 推送标签

```bash
# 推送所有标签
git push --tags

# 推送特定标签
git push origin v1.0.0

# 推送标签到指定分支
git push origin v1.0.0 main

# 推送标签并设置跟踪
git push -u origin v1.0.0

# 推送标签覆盖远程标签
git push --tags --force

# 批量推送标签
git push origin --follow-tags
```

### 使用标签

```bash
# 检出标签（进入分离头指针状态）
git checkout v1.0.0

# 创建基于标签的分支
git checkout -b release-branch v1.0.0

# 创建标签并推送到远程
git tag -a v1.0.0 -m "Release"
git push origin v1.0.0

# 查看标签间的差异
git diff v1.0.0 v1.1.0

# 查看特定标签的文件内容
git show v1.0.0:filename.txt

# 查看特定标签的提交日志
git log v1.0.0

# 查看标签的作者和日期
git show v1.0.0 --format=fuller
```

---

## Git工作流

### Git Flow

```bash
# 初始化Git Flow
git flow init

# 开始新功能
git flow feature start feature-name

# 完成功能
git flow feature finish feature-name

# 发布版本
git flow release start v1.0.0
git flow release finish v1.0.0

# 创建热修复
git flow hotfix start hotfix-name
git flow hotfix finish hotfix-name
```

### GitHub Flow

```bash
# 1. 从主分支创建功能分支
git checkout main
git pull origin main
git checkout -b feature/new-feature

# 2. 开发并提交
git add .
git commit -m "Add new feature"

# 3. 推送到远程
git push origin feature/new-feature

# 4. 创建Pull Request

# 5. 代码审查和修改
git commit --amend
git push --force-with-lease

# 6. 合并到主分支
# 在GitHub上点击Merge Pull Request
```

### GitLab Flow

```bash
# 环境分支
git checkout -b production origin/production
git merge feature-branch
git push origin production

# 发布分支
git checkout -b release-1.0 origin/master
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0
```

---

## Git子模块

### 添加子模块

```bash
# 添加子模块
git submodule add https://github.com/username/repo.git path/to/submodule

# 添加特定分支的子模块
git submodule add -b develop https://github.com/username/repo.git path/to/submodule

# 添加子模块并跟踪所有分支
git submodule add --branch master https://github.com/username/repo.git path/to/submodule
```

### 克隆包含子模块的仓库

```bash
# 克隆仓库
git clone https://github.com/username/repo.git

# 初始化子模块
git submodule init

# 更新子模块
git submodule update

# 一步完成
git clone --recursive https://github.com/username/repo.git

# 如果已克隆但没有子模块
git submodule update --init --recursive
```

### 管理子模块

```bash
# 查看子模块状态
git submodule status

# 更新子模块
git submodule update

# 更新子模块到最新提交
git submodule update --remote

# 在子模块中工作
cd path/to/submodule
git checkout main
git pull
cd ../..
git add path/to/submodule
git commit -m "Update submodule"

# 同步子模块URL
git submodule sync

# 删除子模块
git submodule deinit path/to/submodule
git rm path/to/submodule
```

---

## Git钩子

### 客户端钩子

#### pre-commit钩子
```bash
# .git/hooks/pre-commit
#!/bin/sh
# 检查代码格式
if [ -f .eslintrc.js ]; then
    npm run lint
    if [ $? -ne 0 ]; then
        echo "ESLint failed, commit aborted."
        exit 1
    fi
fi
```

#### commit-msg钩子
```bash
# .git/hooks/commit-msg
#!/bin/sh
# 检查提交信息格式
commit_regex='^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,50}'
if ! grep -qE "$commit_regex" "$1"; then
    echo "Invalid commit message format."
    exit 1
fi
```

### 服务器端钩子

#### pre-receive钩子
```bash
# .git/hooks/pre-receive
#!/bin/sh
# 检查推送分支
while read oldrev newrev ref
do
    if [[ $ref =~ refs/heads/ ]]; then
        branch=$(echo $ref | sed 's/refs\/heads\///')
        # 只允许推送到main分支
        if [ "$branch" != "main" ]; then
            echo "Push to branch '$branch' is not allowed."
            exit 1
        fi
    fi
done
```

### 安装钩子

```bash
# 复制钩子示例
cp .git/hooks/commit-msg.sample .git/hooks/commit-msg

# 赋予执行权限
chmod +x .git/hooks/commit-msg

# 创建钩子（如果不存在）
touch .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

---

## Git配置与别名

### 常用别名

```bash
# 查看所有别名
git config --get-regexp alias

# 设置别名
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'

# 删除别名
git config --global --unset alias.st

# 复杂别名
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

# 撤销别名（查看最后一次提交）
git config --global alias.undo 'reset HEAD~1 --mixed'

# 暂存别名（保存当前工作）
git config --global alias.stash-all 'stash --include-untracked'

# 快速推送
git config --global alias.p 'push origin HEAD'

# 拉取并合并
git config --global alias.pullr 'pull --rebase'
```

### 高级配置

```bash
# 颜色配置
git config --global color.ui auto
git config --global color.branch auto
git config --global color.diff auto
git config --global color.interactive auto
git config --global color.status auto

# 差异工具配置
git config --global diff.tool vimdiff
git config --global merge.tool vimdiff

# 忽略文件模式变化
git config --global core.fileMode false

# 设置行尾转换
git config --global core.autocrlf true  # Windows
git config --global core.autocrlf input # Linux/macOS

# 设置推送默认方式
git config --global push.default simple

# 设置默认分支
git config --global init.defaultBranch main

# 启用自动颜色（如果终端支持）
git config --global color.ui true

# 设置日志格式
git config --global format.pretty oneline

# 设置日志日期格式
git config --global log.date iso

# 启用自动警告
git config --global advice.addEmptyPathspec true
```

### 配置文件编辑

```bash
# 编辑全局配置文件
git config --global --edit

# 编辑项目配置文件
git config --edit

# 从文件设置配置
git config --file config.file user.name "Name"
```

---

## 最佳实践

### 提交规范

#### 提交信息格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

#### 提交类型
- **feat**: 新功能
- **fix**: 修复bug
- **docs**: 文档更改
- **style**: 代码格式（不影响代码运行的变动）
- **refactor**: 重构（即不是新增功能，也不是修改bug的代码变动）
- **test**: 增加测试
- **chore**: 构建过程或辅助工具的变动

#### 示例
```
feat(auth): add login functionality

Implement user authentication with JWT token
- Add login endpoint
- Add token validation middleware
- Update user model

Closes #123
```

### 分支命名规范

```bash
# 功能分支
feature/user-authentication
feature/add-payment-system

# 修复分支
bugfix/login-issue
bugfix/fix-memory-leak

# 紧急修复
hotfix/critical-security-patch

# 发布分支
release/v1.0.0
release/v1.1.0

# 实验分支
experimental/new-ui
experimental/ai-features
```

### 提交最佳实践

```bash
# 小而频繁的提交
git commit -m "feat: add user login"
git commit -m "feat: add user logout"
git commit -m "fix: resolve login redirect issue"

# 原子性提交（每个提交只包含一个逻辑变更）
git commit -m "feat: implement password reset" # 包含密码重置的所有相关文件

# 描述性的提交信息
git commit -m "feat(auth): add JWT token authentication for REST API"

# 包含相关issue编号
git commit -m "fix: resolve race condition in user registration (Fixes #456)"

# 编写清晰的提交主体
git commit -m "feat: add email verification

- Add email verification endpoint
- Send verification email after registration
- Verify email before allowing login
- Add unit tests for email verification"

# 使用工具生成变更日志
git log --oneline --grep="feat:" > FEATURES.md
```

### 分支管理最佳实践

```bash
# 1. 从主分支创建功能分支
git checkout main
git pull origin main
git checkout -b feature/new-feature

# 2. 定期更新主分支
git checkout main
git pull origin main
git checkout feature/new-feature
git rebase main

# 3. 合并前检查
git diff main
git diff --stat main

# 4. 使用rebase保持线性历史
git checkout feature/new-feature
git rebase main

# 5. 清理已完成的分支
git checkout main
git branch --merged
git branch -d feature/completed-feature
```

### 团队协作最佳实践

```bash
# 1. 频繁推送代码
git push origin feature/new-feature

# 2. 使用Pull Request进行代码审查
# 3. 小步提交，便于审查
# 4. 保持功能分支最新
git fetch origin
git rebase origin/main

# 5. 使用标签管理版本
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# 6. 保护主分支
# 在GitHub/GitLab中配置主分支保护规则
```

### 安全最佳实践

```bash
# 1. 不要提交敏感信息
# 创建.gitignore文件
echo "config.ini" >> .gitignore
echo ".env" >> .gitignore

# 2. 使用Git LFS处理大文件
git lfs track "*.psd"
git lfs track "*.zip"
git add .gitattributes

# 3. 使用SSH而不是HTTPS
git remote set-url origin git@github.com:username/repo.git

# 4. 定期更新Git
git --version
git update-git-for-windows # Windows

# 5. 使用GPG签名提交
git config --global user.signingkey YOUR_KEY_ID
git config --global commit.gpgsign true
```

---

## 故障排除

### 常见问题及解决方案

#### 1. 合并冲突

**问题：**
```
Auto-merging file.txt
CONFLICT (content): Merge conflict in file.txt
```

**解决方案：**
```bash
# 查看冲突文件
git status

# 编辑冲突文件（删除冲突标记）
vim file.txt

# 添加解决后的文件
git add file.txt

# 完成合并
git commit

# 或者取消合并
git merge --abort
```

#### 2. 推送被拒绝

**问题：**
```
! [rejected]        main -> main (non-fast-forward)
```

**解决方案：**
```bash
# 方案1：拉取并合并
git pull origin main
git push origin main

# 方案2：强制推送（谨慎使用）
git push --force-with-lease

# 方案3：变基后推送
git pull --rebase
git push origin main
```

#### 3. 分离头指针状态

**问题：**
```
You are in 'detached HEAD' state.
```

**解决方案：**
```bash
# 创建新分支
git checkout -b new-branch

# 切换回主分支
git checkout main
```

#### 4. 恢复误删的提交

**问题：**
```
HEAD is now at abc1234 Some commit
```

**解决方案：**
```bash
# 查看所有引用日志
git reflog

# 恢复到之前的提交
git checkout -b recovery-branch abc1234

# 或使用reset
git reset --hard abc1234
```

#### 5. 大文件导致推送失败

**问题：**
```
error: GH001: Large files detected. You may want to try Git Large File Storage
```

**解决方案：**
```bash
# 使用Git LFS
git lfs install
git lfs track "*.zip"
git add .gitattributes
git commit -m "Add LFS tracking"

# 或删除大文件
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch large-file.zip' \
  --prune-empty --tag-name-filter cat -- --all
```

#### 6. 重置后无法推送

**问题：**
```
Updates were rejected because the tip of your current branch is behind
```

**解决方案：**
```bash
# 强制推送（如果确定要丢弃远程提交）
git push --force-with-lease

# 或更新本地分支
git pull --rebase
git push origin main
```

#### 7. 子模块问题

**问题：**
```
fatal: No url found for remote submodule 'submodule-name'
```

**解决方案：**
```bash
# 同步子模块URL
git submodule sync

# 更新子模块
git submodule update --init --recursive

# 或删除并重新添加
git submodule deinit path/to/submodule
git rm path/to/submodule
git submodule add https://github.com/username/repo.git path/to/submodule
```

#### 8. 凭证问题

**问题：**
```
fatal: Authentication failed for 'https://github.com/...'
```

**解决方案：**
```bash
# 更新凭证
git config --global credential.helper osxkeychain  # macOS
git config --global credential.helper manager-core # Windows

# 或使用SSH
git remote set-url origin git@github.com:username/repo.git

# 或使用令牌
git remote set-url origin https://username:token@github.com/username/repo.git
```

---

## 进阶技巧

### 使用Git LFS

```bash
# 安装Git LFS
git lfs install

# 跟踪特定文件类型
git lfs track "*.psd"
git lfs track "*.zip"
git lfs track "*.mov"

# 查看跟踪的文件
git lfs track

# 提交LFS配置
git add .gitattributes
git commit -m "Add LFS tracking"

# 克隆包含LFS的仓库
git lfs clone https://github.com/username/repo.git
```

### 使用Git Notes

```bash
# 添加注释
git notes add -m "Review comments" HEAD

# 查看注释
git notes show HEAD

# 添加注释到特定提交
git notes add -m "Reviewed by John" commit-hash

# 查看所有注释
git notes list

# 删除注释
git notes remove HEAD

# 推送注释
git push origin refs/notes/commits

# 拉取注释
git fetch origin refs/notes/commits
```

### 使用Git Bisect（二分查找）

```bash
# 开始二分查找
git bisect start

# 标记当前提交为坏版本
git bisect bad

# 标记最后一个已知的好版本
git bisect good v1.0.0

# Git会自动检出中间版本
# 测试该版本
# ...
# 标记为good或bad
git bisect good
git bisect bad

# 重复直到找到第一个坏提交
git bisect reset  # 退出二分查找
```

### 使用Git Cherry-pick

```bash
# 合并特定提交
git cherry-pick commit-hash

# 合并多个提交
git cherry-pick commit1 commit2

# 合并一系列提交
git cherry-pick commit1..commit5

# 合并但不要自动提交
git cherry-pick -n commit-hash

# 退出cherry-pick
git cherry-pick --abort

# 继续cherry-pick
git cherry-pick --continue
```

### 使用Git Filter-branch

```bash
# 重写作者信息
git filter-branch --env-filter '
OLD_EMAIL="old@email.com"
CORRECT_NAME="New Name"
CORRECT_EMAIL="new@email.com"

if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags

# 删除文件从所有提交
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch path/to/file' \
  --prune-empty --tag-name-filter cat -- --all

# 重置到干净状态
git filter-branch --force --tree-filter '
rm -f path/to/unwanted-file
' --all
```

### 使用Git Rerere

```bash
# 启用rerere
git config --global rerere.enabled true

# Git会自动记录合并冲突的解决方案
# 下次遇到相同冲突时自动应用解决方案
```

### 使用Git Worktree

```bash
# 添加工作树
git worktree add ../my-project-copy main

# 列出工作树
git worktree list

# 移除工作树
git worktree remove ../my-project-copy

# 分离工作树
git worktree add ../temp-checkout commit-hash

# 清理孤立工作树
git worktree prune
```

---

## 总结

Git作为现代软件开发的核心工具，掌握其使用方法对每个开发者都至关重要。本指南涵盖了从基础到高级的Git使用技巧，包括：

### 核心技能
- Git基础概念和工作原理
- 仓库创建和管理
- 文件生命周期管理
- 分支操作和合并策略
- 远程仓库协作
- 冲突解决技巧

### 进阶能力
- 分支管理策略
- 代码审查流程
- Git钩子自动化
- 大文件处理（Git LFS）
- 历史重写技术
- 高级搜索和恢复

### 最佳实践
- 提交信息规范
- 分支命名约定
- 团队协作流程
- 安全最佳实践
- 性能优化技巧

### 持续学习建议

1. **日常实践**：在项目中持续使用Git
2. **学习资源**：
   - [Git官方文档](https://git-scm.com/doc)
   - [GitHub Guides](https://guides.github.com/)
   - [Pro Git书籍](https://git-scm.com/book/)
3. **实践项目**：创建多个分支进行实验
4. **工具辅助**：使用图形化Git工具（如GitKraken、SourceTree）
5. **团队学习**：参与开源项目，学习真实团队的协作方式

### 下一步

- 学习GitHub Actions（CI/CD）
- 掌握GitLab或Bitbucket功能
- 了解GitOps工作流
- 学习其他版本控制系统（Mercurial、Bazaar）

记住：**Git不仅仅是一个工具，更是一种协作思维方式。**通过不断实践和总结，你将能够充分发挥Git的强大功能，成为高效的协作开发者。

---

## 参考资源

- [Git官方文档](https://git-scm.com/doc)
- [GitHub官方指南](https://guides.github.com/)
- [GitLab文档](https://docs.gitlab.com/)
- [Pro Git书籍（免费）](https://git-scm.com/book/)
- [Git可视化学习](https://learngitbranching.js.org/)
- [Git速查表](https://education.github.com/git-cheat-sheet-education.pdf)

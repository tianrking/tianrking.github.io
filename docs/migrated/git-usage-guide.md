---
legacy: true
id: git-usage-guide
title: Git 使用完全指南
sidebar_label: Git 使用
description: Git 版本控制系统完整使用指南，包括仓库创建、提交修改、分支操作和远程协作等核心功能
date: 2021-12-15T15:32:38+08:00
tags: [Git, 版本控制, 开发工具, 协作]
authors: [w0x7ce]
---

# Git 使用完全指南

Git 是目前世界上最流行的分布式版本控制系统，广泛应用于软件开发中。本指南将详细介绍 Git 的核心概念和常用操作。

## 基本概念

### Git 工作流程

Git 的工作就是创建和保存项目的快照，并与后续的快照进行对比。主要区域包括：

- **工作区** (Working Directory)：实际编辑文件的地方
- **暂存区** (Staging Area)：临时存储你的改动
- **本地仓库** (Repository)：本地存储所有版本历史
- **远程仓库** (Remote)：云端存储共享代码

### 基础命令

```bash
git init      # 初始化仓库
git add .     # 添加文件到暂存区
git commit    # 将暂存区内容添加到仓库中
```

## 创建仓库命令

| 命令 | 说明 | 示例 |
|------|------|------|
| `git init` | 初始化新仓库 | `git init my-project` |
| `git clone` | 克隆远程仓库 | `git clone https://github.com/user/repo.git` |

### 初始化仓库

```bash
# 在当前目录初始化
git init

# 在指定目录初始化
git init my-project

# 创建裸仓库（用于服务器）
git init --bare repo.git
```

### 克隆仓库

```bash
# 克隆最新版本
git clone https://github.com/user/repo.git

# 克隆到指定目录
git clone https://github.com/user/repo.git my-project

# 克隆特定分支
git clone -b develop https://github.com/user/repo.git

# 克隆特定标签
git clone --depth 1 --branch v1.0.0 https://github.com/user/repo.git
```

## 提交与修改

### 文件操作

| 命令 | 说明 | 示例 |
|------|------|------|
| `git add` | 添加文件到暂存区 | `git add file.txt` |
| `git status` | 查看仓库当前状态 | `git status` |
| `git diff` | 比较文件差异 | `git diff` |
| `git commit` | 提交暂存区到本地仓库 | `git commit -m "message"` |
| `git reset` | 回退版本 | `git reset --hard HEAD~1` |
| `git rm` | 删除工作区文件 | `git rm file.txt` |
| `git mv` | 移动或重命名文件 | `git mv old.txt new.txt` |

### 添加文件

```bash
# 添加特定文件
git add file1.txt file2.txt

# 添加当前目录所有文件
git add .

# 添加所有修改和删除的文件（不包括新文件）
git add -u

# 添加所有文件（包括新文件）
git add -A

# 交互式添加
git add -p
```

### 查看状态

```bash
# 查看工作区状态
git status

# 简短状态
git status -s

# 显示分支和追踪信息
git status -b
```

### 查看差异

```bash
# 查看工作区与暂存区的差异
git diff

# 查看暂存区与仓库的差异
git diff --staged

# 查看两次提交的差异
git diff HEAD~1 HEAD

# 查看特定文件的差异
git diff file.txt

# 显示差异统计
git diff --stat
```

### 提交更改

```bash
# 提交并添加提交信息
git commit -m "Add new feature"

# 添加并提交（一步完成）
git commit -am "Update existing files"

# 修改最后一次提交
git commit --amend -m "Update last commit message"

# 跳过暂存区直接提交
git commit -a -m "Direct commit"
```

## 提交日志

### 查看历史

| 命令 | 说明 | 示例 |
|------|------|------|
| `git log` | 查看历史提交记录 | `git log` |
| `git blame <file>` | 查看文件历史修改记录 | `git blame file.txt` |

### git log 常用选项

```bash
# 基本日志
git log

# 每行显示一个提交
git log --oneline

# 图形化显示分支
git log --graph --oneline --all

# 显示文件变更统计
git log --stat

# 显示补丁（变更内容）
git log -p

# 显示最近 N 次提交
git log -3

# 显示作者提交的记录
git log --author="username"

# 按日期过滤
git log --since="2023-01-01" --until="2023-12-31"

# 搜索提交信息
git log --grep="bug fix"

# 显示所有分支
git log --all --graph --oneline
```

### 查看特定文件历史

```bash
# 查看文件完整历史
git log --follow file.txt

# 查看文件每行的修改历史
git blame file.txt

# 显示文件特定行号的修改者
git blame -L 10,20 file.txt
```

## 远程操作

### 基础操作

| 命令 | 说明 | 示例 |
|------|------|------|
| `git remote` | 远程仓库操作 | `git remote -v` |
| `git fetch` | 从远程获取代码库 | `git fetch origin` |
| `git pull` | 下载并合并远程代码 | `git pull origin main` |
| `git push` | 上传本地代码到远程 | `git push origin main` |

### 远程仓库管理

```bash
# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add origin https://github.com/user/repo.git

# 修改远程仓库地址
git remote set-url origin https://new-url.com/repo.git

# 删除远程仓库
git remote remove origin

# 重命名远程仓库
git remote rename origin upstream
```

### 同步操作

```bash
# 获取远程更新（不合并）
git fetch origin

# 获取并合并远程更新
git pull origin main

# 强制更新到远程最新版本
git pull --rebase origin main

# 上传本地分支到远程
git push origin main

# 删除远程分支
git push origin --delete branch-name

# 上传并设置追踪
git push -u origin feature-branch
```

## 分支操作

### 创建和管理分支

```bash
# 查看所有分支
git branch

# 查看本地和远程分支
git branch -a

# 创建新分支
git branch feature-login

# 切换分支
git checkout feature-login

# 创建并切换到新分支
git checkout -b feature-login

# 切换到上一个分支
git checkout -

# 删除分支
git branch -d feature-login

# 强制删除分支
git branch -D feature-login

# 重命名分支
git branch -m old-name new-name
```

### 分支合并

```bash
# 合并指定分支到当前分支
git merge feature-branch

# 合并但不产生合并提交
git merge --no-commit feature-branch

# 合并并压扁提交
git merge --squash feature-branch

# 交互式合并
git merge --interactive feature-branch
```

### 分支变基

```bash
# 变基到目标分支
git rebase main

# 交互式变基
git rebase -i HEAD~3

# 继续变基
git rebase --continue

# 取消变基
git rebase --abort

# 解决冲突后继续
git add . && git rebase --continue
```

## 撤销操作

### 撤销工作区更改

```bash
# 撤销文件修改
git checkout -- file.txt

# 撤销所有未提交的修改
git checkout .

# 撤销暂存区更改
git reset HEAD file.txt

# 撤销最后一次提交但保留更改
git reset HEAD~1

# 完全撤销最后一次提交
git reset --hard HEAD~1
```

### 撤销提交

```bash
# 创建反向提交（推荐）
git revert HEAD

# 撤销特定提交
git revert <commit-hash>

# 撤销多个提交
git revert HEAD~3..HEAD

# 撤销但不提交
git revert --no-commit HEAD
```

## 标签管理

```bash
# 创建标签
git tag v1.0.0

# 带注释的标签
git tag -a v1.0.0 -m "Release version 1.0.0"

# 查看标签
git tag

# 查看标签详情
git show v1.0.0

# 推送标签到远程
git push origin v1.0.0

# 推送所有标签
git push origin --tags

# 删除标签
git tag -d v1.0.0

# 删除远程标签
git push origin --delete v1.0.0
```

## 配置文件

### 全局配置

```bash
# 设置用户名和邮箱
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 设置默认分支名
git config --global init.defaultBranch main

# 设置默认编辑器
git config --global core.editor vim

# 设置别名
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm commit
```

### 项目配置

```bash
# 在项目目录下设置（不使用 --global）
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### 查看配置

```bash
# 查看所有配置
git config --list

# 查看特定配置
git config user.name

# 编辑配置文件
git config --global --edit
```

## 忽略文件

创建 `.gitignore` 文件来忽略不需要版本控制的文件：

```gitignore
# 依赖目录
node_modules/
vendor/

# 构建输出
dist/
build/

# 环境配置
.env
.env.local

# 日志文件
*.log
logs/

# 临时文件
*.tmp
*.swp
*~

# IDE 配置
.vscode/
.idea/

# 系统文件
.DS_Store
Thumbs.db
```

## 高级操作

### 储藏（Stash）

```bash
# 储藏当前更改
git stash

# 储藏并添加说明
git stash save "Work in progress"

# 查看储藏列表
git stash list

# 应用最近的储藏
git stash apply

# 应用特定的储藏
git stash apply stash@{1}

# 应用并删除储藏
git stash pop

# 删除储藏
git stash drop stash@{1}

# 清空所有储藏
git stash clear
```

### 查找和搜索

```bash
# 搜索文件
git grep "search term"

# 在提交历史中搜索
git log --grep="search term"

# 搜索作者
git log --author="username"

# 搜索变更内容
git log -S "code pattern"

# 查找特定文件在哪个提交中
git log --follow -- filename
```

### 清理操作

```bash
# 清理未跟踪的文件
git clean -fd

# 检查清理效果（不实际删除）
git clean -nd

# 压缩本地仓库
git gc

# 压缩并优化
git gc --aggressive

# 清理远程分支（已删除）
git remote prune origin

# 等价于上面的命令
git fetch --prune
```

## 常见问题解决

### 合并冲突

1. 打开冲突文件，查看冲突标记
2. 编辑文件解决冲突
3. 添加解决后的文件
4. 完成合并提交

```bash
git add resolved-file.txt
git commit -m "Resolve merge conflict"
```

### 撤销变基

```bash
git reflog
git reset --hard HEAD@{5}
```

### 修复错误提交

```bash
# 修改最后一次提交
git commit --amend

# 推送修改后的提交
git push --force-with-lease origin main
```

## 最佳实践

### 1. 提交规范

- 编写清晰的提交信息
- 小步提交，频繁提交
- 每个提交应该完成一个功能
- 使用现在时描述（"Add feature" 而不是 "Added feature"）

### 2. 分支策略

- 主分支保持稳定（main/master）
- 开发分支用于集成功能（develop）
- 功能分支开发新特性（feature/*）
- 发布分支准备发布（release/*）
- 修复分支修复紧急问题（hotfix/*）

### 3. 协作流程

```bash
# 获取最新代码
git fetch origin

# 创建功能分支
git checkout -b feature/new-feature

# 开发和提交
git add .
git commit -m "Add new feature"

# 推送分支
git push origin feature/new-feature

# 创建 Pull Request/Merge Request
# 代码审查后合并到主分支
```

### 4. 常用别名

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'
```

## 总结

Git 是一个功能强大的版本控制系统，掌握这些核心命令可以帮助您高效地管理代码：

- **基本操作**：init, add, commit, status
- **查看历史**：log, blame, diff
- **分支管理**：branch, checkout, merge, rebase
- **远程操作**：remote, fetch, pull, push
- **撤销操作**：reset, revert, stash

建议在实际项目中多练习这些命令，并建立适合团队的工作流程。

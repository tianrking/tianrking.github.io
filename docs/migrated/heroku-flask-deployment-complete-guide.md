---
legacy: true
id: heroku-flask-deployment-complete-guide
title: Heroku Flask 部署完整指南
sidebar_label: Heroku Flask 部署
description: 详细介绍如何在 Heroku 平台上部署 Flask 应用，包括环境配置、数据库集成、扩展、监控和最佳实践
date: 2022-04-25T16:02:03+08:00
tags: [Heroku, Flask, Python, 云计算, 部署, PaaS]
authors: [w0x7ce]
---

# Heroku Flask 部署完整指南

Heroku 是领先的云平台即服务（PaaS）提供商，支持多种编程语言和框架。对于 Python Flask 开发者来说，Heroku 提供了简单、快速的应用部署和扩展方案。

## 目录

- [Heroku 简介](#heroku-简介)
- [准备工作](#准备工作)
- [安装 Heroku CLI](#安装-heroku-cli)
- [创建 Flask 应用](#创建-flask-应用)
- [配置部署文件](#配置部署文件)
- [部署到 Heroku](#部署到-heroku)
- [数据库集成](#数据库集成)
- [环境变量管理](#环境变量管理)
- [域名配置](#域名配置)
- [扩展和缩放](#扩展和缩放)
- [监控和日志](#监控和日志)
- [持续集成](#持续集成)
- [高级配置](#高级配置)
- [故障排除](#故障排除)
- [最佳实践](#最佳实践)
- [成本优化](#成本优化)

## Heroku 简介

### 什么是 Heroku

Heroku 是一个基于容器的 PaaS 平台，提供：

- **简单部署**：使用 Git 即可部署应用
- **自动扩展**：根据流量自动调整资源
- **多语言支持**：Python、Node.js、Ruby、Java、Go 等
- **丰富插件**：数据库、缓存、监控等服务
- **无需服务器管理**：Heroku 处理底层基础设施

### Heroku 核心概念

| 概念 | 说明 |
|------|------|
| **Dyno** | 容器化计算单元，类似虚拟机 |
| **Slug** | 应用代码和依赖的打包文件 |
| **Buildpack** | 构建脚本，支持多种语言 |
| **Add-on** | 附加服务（数据库、缓存等） |
| **Release** | 应用版本，包含代码和配置 |
| **Stack** | 底层操作系统（heroku-22, heroku-20） |

### 价格计划

| 类型 | 价格 | 特点 |
|------|------|------|
| Free | 免费 | 有限制，适合测试 |
| Eco | $5/月 | 轻量级应用 |
| Basic | $7-25/月 | 单 dyno 生产应用 |
| Standard-1X | $25-50/月 | 标准性能 |
| Standard-2X | $50-100/月 | 双倍性能 |
| Performance | 按需 | 高性能计算 |

## 准备工作

### 系统要求

- **操作系统**：macOS、Linux、Windows
- **Git**：版本控制系统
- **Python**：3.7+（推荐 3.9+）
- **账户**：有效的邮箱地址

### 创建 Heroku 账户

1. 访问 [Heroku 官网](https://www.heroku.com)
2. 点击 "Sign Up" 注册
3. 验证邮箱
4. 设置密码和双重认证

### 验证账户设置

```bash
# 登录后验证
heroku auth:whoami
```

## 安装 Heroku CLI

### macOS 安装

```bash
# 使用 Homebrew
brew tap heroku/brew && brew install heroku

# 或使用官方安装包
curl https://cli-assets.heroku.com/install.sh | sh

# 或使用 Snap（Ubuntu）
sudo snap install heroku --classic
```

### Windows 安装

```powershell
# 使用 Chocolatey
choco install heroku-cli

# 或下载安装包
# 访问: https://devcenter.heroku.com/articles/heroku-cli
```

### Linux 安装

```bash
# Ubuntu/Debian
curl https://cli-assets.heroku.com/install.sh | sh

# CentOS/RHEL
sudo yum install heroku-cli
```

### 验证安装

```bash
# 检查版本
heroku --version

# 登录
heroku login

# 验证登录状态
heroku auth:whoami
```

## 创建 Flask 应用

### 项目结构

创建标准 Flask 项目结构：

```
my-flask-app/
├── app/
│   ├── __init__.py
│   ├── routes.py
│   ├── models.py
│   └── utils.py
├── tests/
│   └── test_app.py
├── .gitignore
├── .env.example
├── app.py
├── requirements.txt
├── runtime.txt
├── Procfile
├── wsgi.py
└── README.md
```

### 基本 Flask 应用

创建 `app.py`：

```python
import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 创建应用
app = Flask(__name__)

# 应用配置
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['DEBUG'] = os.getenv('DEBUG', 'False').lower() == 'true'

@app.route('/')
def index():
    """主页"""
    return render_template('index.html',
                         title='Heroku Flask App',
                         message='欢迎来到我的 Flask 应用！')

@app.route('/api/health():
    """健康')
def health_check检查端点"""
    return jsonify({
        'status': 'healthy',
        'message': '应用运行正常',
        'environment': os.getenv('ENVIRONMENT', 'development')
    }), 200

@app.route('/api/user/<int:user_id>')
def get_user(user_id):
    """获取用户信息"""
    # 模拟数据
    user_data = {
        'id': user_id,
        'name': f'用户 {user_id}',
        'email': f'user{user_id}@example.com'
    }
    return jsonify(user_data)

@app.route('/api/data', methods=['POST'])
def process_data():
    """处理 POST 数据"""
    try:
        data = request.get_json()
        return jsonify({
            'status': 'success',
            'received': data
        }), 201
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

@app.errorhandler(404)
def not_found(error):
    """404 错误处理"""
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    """500 错误处理"""
    app.logger.error(f'Server error: {str(error)}')
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # 开发环境
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
```

### 创建路由模块

创建 `app/routes.py`：

```python
from flask import Blueprint, request, jsonify
from app.models import User

api_bp = Blueprint('api', __name__)

@api_bp.route('/users', methods=['GET'])
def list_users():
    """获取用户列表"""
    users = User.get_all()
    return jsonify([user.to_dict() for user in users])

@api_bp.route('/users', methods=['POST'])
def create_user():
    """创建用户"""
    data = request.get_json()
    user = User.create(**data)
    return jsonify(user.to_dict()), 201
```

### 创建 WSGI 文件

创建 `wsgi.py`：

```python
import os
from app import create_app

# 获取环境
config_name = os.getenv('FLASK_ENV', 'development')
app = create_app(config_name)

if __name__ == "__main__":
    app.run()
```

## 配置部署文件

### 1. Procfile

创建 `Procfile`（无扩展名）：

```
web: gunicorn wsgi:app --log-file=-
release: python manage.py db upgrade
```

### 2. requirements.txt

创建 `requirements.txt`：

```
# Web 框架
Flask==2.3.3
Werkzeug==2.3.7

# 生产服务器
gunicorn==21.2.0

# 数据库
psycopg2-binary==2.9.7
Flask-SQLAlchemy==3.1.1

# 环境变量
python-dotenv==1.0.0

# HTTP 客户端
requests==2.31.0

# 缓存
redis==4.6.0

# 邮件
Flask-Mail==0.9.1

# 监控
sentry-sdk==1.32.0

# 开发工具
pytest==7.4.3
pytest-flask==1.3.0
```

### 3. runtime.txt

创建 `runtime.txt`：

```
python-3.11.4
```

### 4. .gitignore

创建 `.gitignore`：

```
# Python
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
*.so
.pytest_cache/
.coverage
htmlcov/

# 环境变量
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Heroku
.slugignore
```

### 5. .env.example

创建 `.env.example`：

```
# 应用配置
SECRET_KEY=your-secret-key-here
DEBUG=False
ENVIRONMENT=production

# 数据库
DATABASE_URL=postgresql://user:password@host:5432/dbname

# 邮件
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Redis
REDIS_URL=redis://localhost:6379/0

# 监控
SENTRY_DSN=your-sentry-dsn-here
```

## 部署到 Heroku

### 创建应用

```bash
# 创建新应用（随机命名）
heroku create

# 指定应用名
heroku create my-flask-app

# 查看应用信息
heroku apps:info
```

### 初始化 Git

```bash
# 初始化仓库
git init

# 添加远程仓库
heroku git:remote -a your-app-name

# 或手动添加
git remote add heroku https://git.heroku.com/your-app-name.git
```

### 部署应用

```bash
# 添加文件
git add .

# 提交
git commit -m "Initial commit"

# 推送到 Heroku
git push heroku main

# 或推送到 master 分支（如果使用 master）
git push heroku master
```

### 验证部署

```bash
# 查看应用状态
heroku ps

# 打开应用
heroku open

# 查看日志
heroku logs --tail

# 进入远程控制台
heroku run python manage.py shell
```

## 数据库集成

### 添加 PostgreSQL

```bash
# 添加 PostgreSQL 插件（免费版）
heroku addons:create heroku-postgresql:mini

# 查看数据库信息
heroku pg:info

# 获取数据库 URL
heroku config:get DATABASE_URL
```

### 数据库配置

更新 `app.py`：

```python
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# 创建应用
app = Flask(__name__)

# 数据库配置
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# 初始化数据库
db = SQLAlchemy(app)

# 数据库模型
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now())

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }
```

### 数据库迁移

创建 `manage.py`：

```python
import os
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from app import app, db

migrate = Migrate(app, db)
manager = Manager(app)

manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()
```

更新 `requirements.txt`：

```
Flask-Script==2.0.6
Flask-Migrate==4.0.5
```

初始化迁移：

```bash
# 本地初始化
heroku run python manage.py db init

# 生成迁移脚本
heroku run python manage.py db migrate -m "Initial migration"

# 应用迁移
heroku run python manage.py db upgrade
```

## 环境变量管理

### 设置环境变量

```bash
# 设置单个变量
heroku config:set SECRET_KEY=your-secret-key

# 设置多个变量
heroku config:set DEBUG=False ENVIRONMENT=production

# 从 .env 文件读取
heroku config:set $(cat .env)

# 查看所有变量
heroku config

# 获取单个变量
heroku config:get DATABASE_URL

# 删除变量
heroku config:unset DEBUG
```

### 使用 python-dotenv

安装：

```bash
pip install python-dotenv
```

创建 `.env` 文件：

```
SECRET_KEY=your-secret-key
DATABASE_URL=your-database-url
```

在代码中使用：

```python
from dotenv import load_dotenv
import os

load_dotenv()

secret_key = os.getenv('SECRET_KEY')
```

### 配置管理最佳实践

```python
# config.py
import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': ProductionConfig
}
```

## 域名配置

### 自定义域名

```bash
# 添加域名
heroku domains:add www.yourdomain.com

# 查看域名
heroku domains

# 添加根域名
heroku domains:add yourdomain.com

# 配置 DNS
# 类型: CNAME
# 名称: www
# 值: your-app.herokuapp.com
```

### SSL 证书

```bash
# Heroku 自动提供 SSL 证书
# 无需手动配置

# 强制 HTTPS
heroku labs:enable https-endpoint
```

### 域名重定向

```python
# app.py
from flask import redirect, url_for

@app.before_request
def force_https():
    if request.headers.get('X-Forwarded-Proto') == 'http':
        url = request.url.replace('http://', 'https://', 1)
        return redirect(url, code=301)
```

## 扩展和缩放

### 手动扩展

```bash
# 查看当前 dyno
heroku ps

# 扩展到 2 个 dyno
heroku ps:scale web=2

# 扩展到标准 dyno
heroku ps:type web=standard-1x

# 查看账单
heroku billing:info
```

### 自动扩展

创建 `app.json`：

```json
{
  "name": "My Flask App",
  "description": "Flask app on Heroku",
  "repository": "https://github.com/username/flask-app",
  "logo": "https://example.com/logo.png",
  "keywords": ["flask", "python"],
  "stack": "heroku-22",
  "env": {
    "SECRET_KEY": {
      "description": "A secret key for signing sessions",
      "generator": "secret"
    }
  },
  "formation": {
    "web": {
      "quantity": 1,
      "size": "basic"
    }
  },
  "addons": [
    "heroku-postgresql:mini"
  ]
}
```

### 性能监控

```bash
# 查看性能指标
heroku metrics

# 查看应用指标
heroku metrics:web

# 实时监控
heroku logs --tail --ps web
```

## 监控和日志

### 日志管理

```bash
# 查看日志
heroku logs

# 实时日志
heroku logs --tail

# 查看特定类型日志
heroku logs --source app --tail

# 保存日志到文件
heroku logs > app.log
```

### 日志聚合

```python
import logging
from logging.handlers import LogHandler
import sys

class HerokuLogHandler(logging.Handler):
    def emit(self, record):
        print(record.getMessage(), file=sys.stderr)

app.logger.addHandler(HerokuLogHandler())
app.logger.setLevel(logging.INFO)
```

### 性能监控

```bash
# 添加监控插件
heroku addons:create newrelic:wayne

# 添加 Papertrail（日志查看）
heroku addons:create papertrail:choklad

# 添加 Redis（缓存）
heroku addons:create heroku-redis:mini
```

### 错误追踪

```python
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn=os.environ.get('SENTRY_DSN'),
    integrations=[FlaskIntegration()],
    traces_sample_rate=1.0
)

app = Flask(__name__)
```

## 持续集成

### 使用 GitHub Actions

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Heroku

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: '3.11'

    - name: Install dependencies
      run: |
        pip install -r requirements.txt

    - name: Run tests
      run: |
        pytest

    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
        heroku_app_name: "your-app-name"
        heroku_email: "your-email@example.com"
```

### 使用 GitHub Integration

1. 在 Heroku 控制台连接 GitHub
2. 选择仓库
3. 配置自动部署
4. 设置部署分支

## 高级配置

### 缓存配置

```python
from flask_caching import Cache
import os

app = Flask(__name__)

# 缓存配置
cache_config = {
    "CACHE_TYPE": "redis",
    "CACHE_REDIS_URL": os.environ.get('REDIS_URL'),
    "CACHE_DEFAULT_TIMEOUT": 300
}
app.config.update(cache_config)

cache = Cache(app)

@app.route('/api/data')
@cache.cached(timeout=60)
def get_data():
    # 数据处理逻辑
    return expensive_operation()
```

### 异步任务

创建 `tasks.py`：

```python
from rq import Queue
from redis import Redis
import os

redis_url = os.environ.get('REDIS_URL', 'redis://localhost:6379')
redis_conn = Redis.from_url(redis_url)
queue = Queue('default', connection=redis_conn)

def background_task(data):
    # 长时间运行的任务
    # 例如：发送邮件、处理文件等
    pass

# 在视图中使用
from flask import request

@app.route('/api/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    queue.enqueue(background_task, file.read())
    return jsonify({'status': 'queued'}), 202
```

### 媒体文件存储

```python
from flask_uploads import UploadSet, IMAGES, configure_uploads
import os

# 配置上传
app.config['UPLOADED_PHOTOS_DEST'] = 'uploads'
app.config['UPLOADED_PHOTOS_ALLOW'] = IMAGES

photos = UploadSet('photos', IMAGES)
configure_uploads(app, photos)

@app.route('/upload', methods=['POST'])
def upload():
    if 'photo' in request.files:
        filename = photos.save(request.files['photo'])
        return jsonify({'filename': filename})
    return jsonify({'error': 'No file'}), 400
```

## 故障排除

### 常见问题

#### 1. 应用无法启动

```bash
# 检查构建日志
heroku logs --tail --ps build

# 查看应用日志
heroku logs --tail --ps web

# 检查配置
heroku config

# 检查 dyno 状态
heroku ps
```

#### 2. 数据库连接错误

```bash
# 检查数据库状态
heroku pg:info

# 查看数据库日志
heroku logs --tail --ps postgres

# 重启数据库
heroku pg:killall

# 重置数据库（谨慎使用）
heroku pg:reset
```

#### 3. 内存不足

```bash
# 查看内存使用
heroku metrics

# 升级 dyno 类型
heroku ps:type web=standard-1x

# 检查内存泄漏
heroku logs --source app | grep Memory
```

#### 4. 静态文件问题

创建 `static.py`：

```python
from flask import Blueprint, send_from_directory

static_bp = Blueprint('static', __name__)

@static_bp.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
```

### 调试技巧

```bash
# 进入远程 Python shell
heroku run python

# 运行一次性任务
heroku run python manage.py db upgrade

# 检查环境
heroku run env

# 使用 heroku run:detached
heroku run:detached python manage.py db seed
```

## 最佳实践

### 1. 代码组织

```
app/
├── __init__.py          # 应用工厂
├── models/              # 数据模型
├── routes/              # 路由
├── services/            # 业务逻辑
├── utils/               # 工具函数
└── templates/           # 模板
    ├── base.html
    └── index.html
```

### 2. 配置管理

```python
# settings.py
import os

class BaseConfig:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(BaseConfig):
    DEBUG = True
    TESTING = False

class ProductionConfig(BaseConfig):
    DEBUG = False
    TESTING = False

class TestingConfig(BaseConfig):
    TESTING = True
```

### 3. 错误处理

```python
from flask import jsonify

@app.errorhandler(400)
def bad_request(e):
    return jsonify(error=400, message='Bad request'), 400

@app.errorhandler(404)
def not_found(e):
    return jsonify(error=404, message='Not found'), 404

@app.errorhandler(500)
def internal_error(e):
    db.session.rollback()
    return jsonify(error=500, message='Internal server error'), 500
```

### 4. 安全配置

```python
from flask import Flask
from flask_talisman import Talisman

app = Flask(__name__)
Talisman(app, force_https=True)
```

### 5. 测试

```python
# tests/test_app.py
import pytest
from app import create_app, db

@pytest.fixture
def app():
    app = create_app('testing')
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

def test_health_check(client):
    response = client.get('/api/health')
    assert response.status_code == 200
    assert response.json['status'] == 'healthy'
```

## 成本优化

### 免费计划限制

- **应用睡眠**：30 分钟无活动后进入睡眠
- **数据库连接数**：有限制
- **存储空间**：有限

### 成本优化策略

```bash
# 使用 Eco dyno（轻量级）
heroku ps:type web=eco

# 监控使用情况
heroku metrics

# 定期清理无用数据
heroku pg:cleanup

# 使用缓存减少数据库查询
```

### 资源监控

```bash
# 查看账单
heroku billing:info

# 查看使用统计
heroku billing:usage

# 设置预算提醒
heroku addons:create keen:developer
```

## 总结

本指南全面介绍了在 Heroku 平台上部署 Flask 应用的完整流程：

- **快速部署**：使用 Git 部署简单快捷
- **数据库集成**：PostgreSQL、Redis 等
- **扩展能力**：手动和自动扩展
- **监控日志**：内置日志系统
- **持续集成**：GitHub Actions 集成
- **最佳实践**：代码组织和安全配置

通过掌握这些技能，您可以：

- 快速将 Flask 应用部署到云端
- 集成数据库和缓存服务
- 实现应用扩展和负载均衡
- 建立监控和日志系统
- 优化成本和性能

## 相关资源

- [Heroku 官方文档](https://devcenter.heroku.com/articles/getting-started-with-python)
- [Flask 官方文档](https://flask.palletsprojects.com/)
- [Gunicorn 文档](https://docs.gunicorn.org/)
- [Heroku CLI 文档](https://devcenter.heroku.com/articles/heroku-cli)

持续实践这些概念，您将成为 Heroku 部署专家！

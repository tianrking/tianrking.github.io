---
legacy: true
id: chrome-selenium-headless-setup-guide
title: Chrome + Selenium 无界面环境搭建完整指南
sidebar_label: Chrome + Selenium 无界面搭建
description: 详细介绍在 Linux 服务器上安装和配置 Chrome 浏览器和 Selenium WebDriver，实现无界面（Headless）自动化测试和网页抓取
date: 2022-02-13T20:08:40+08:00
tags: [Selenium, Chrome, 自动化测试, 网页抓取, 爬虫, 无界面, Headless]
authors: [w0x7ce]
---

# Chrome + Selenium 无界面环境搭建完整指南

在无图形界面的 Linux 服务器上搭建 Chrome + Selenium 环境是自动化测试和网页抓取的常见需求。本指南将详细介绍完整的安装和配置过程。

## 系统准备

### 系统要求

- **操作系统**：Ubuntu 18.04+ / Debian 9+ / CentOS 7+
- **内存**：建议 2GB 以上
- **权限**：root 或 sudo 权限
- **网络**：能够访问外网

### 1. 更新系统

```bash
# SSH 登录 VPS
ssh username@your-server-ip

# 更新软件包列表
sudo apt update

# 升级系统
sudo apt upgrade -y

# 安装必要的工具
sudo apt install -y wget curl unzip
```

## 安装 Google Chrome

### 方法 1：使用官方 .deb 包（推荐）

```bash
# 下载最新版本的 Chrome
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb

# 安装 Chrome
sudo dpkg -i google-chrome-stable_current_amd64.deb

# 如果出现依赖错误，运行以下命令
sudo apt-get install -f

# 验证安装
google-chrome --version
```

### 方法 2：使用官方仓库

```bash
# 添加 Google 官方仓库
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list

# 更新软件包列表
sudo apt update

# 安装 Chrome
sudo apt install -y google-chrome-stable

# 验证安装
google-chrome --version
```

### 方法 3：安装 Beta 或 Unstable 版本

```bash
# 安装 Beta 版本
sudo apt install -y google-chrome-beta

# 安装 Unstable 版本
sudo apt install -y google-chrome-unstable

# 验证版本
google-chrome-beta --version
google-chrome-unstable --version
```

### 测试 Chrome 安装

```bash
# 启动 Chrome（无界面模式）
google-chrome --headless --disable-gpu --screenshot="test.png" https://google.com

# 查看是否生成了截图
ls -lh test.png

# 或者检查 Chrome 版本
google-chrome --version

# 查看可用的 Chrome 选项
google-chrome --help
```

## 安装 ChromeDriver

### 1. 查看 Chrome 版本

```bash
# 获取 Chrome 版本号
google-chrome --version

# 输出示例：Google Chrome 120.0.6099.109
# 版本号是：120.0.6099.109
```

### 2. 下载匹配的 ChromeDriver

```bash
# 访问 ChromeDriver 下载页面
# https://chromedriver.chromium.org/downloads

# 或者使用脚本自动获取
CHROME_VERSION=$(google-chrome --version | grep -oP '\d+\.\d+\.\d+\.\d+')
echo "Chrome version: $CHROME_VERSION"

# 根据 Chrome 版本选择合适的 ChromeDriver 版本
# 通常 ChromeDriver 版本需要与 Chrome 版本主版本号匹配

# 下载 ChromeDriver（以 120 版本为例）
wget -O chromedriver.zip https://chromedriver.storage.googleapis.com/120.0.6099.109/chromedriver_linux64.zip

# 解压文件
unzip chromedriver.zip

# 移动到系统路径
sudo mv chromedriver /usr/local/bin/chromedriver

# 设置权限
sudo chown root:root /usr/local/bin/chromedriver
sudo chmod +x /usr/local/bin/chromedriver

# 验证安装
chromedriver --version
```

### 3. 使用第三方工具自动匹配版本

```bash
# 安装 chromedriver-autoinstaller（Python 包）
pip install chromedriver-autoinstaller

# 在 Python 代码中自动处理
python3 -c "
import chromedriver_autoinstaller
chromedriver_autoinstaller.install()
print('ChromeDriver installed successfully')
"
```

### 4. 使用 snap 安装（可选）

```bash
# 安装 snap
sudo apt install snapd

# 安装 ChromeDriver
sudo snap install chromedriver

# 设置链接
sudo ln -s /snap/chromedriver/current/chromedriver /usr/local/bin/chromedriver
```

## 安装 Selenium

### 1. 安装 Python 和 pip

```bash
# 安装 Python3 和 pip
sudo apt install -y python3 python3-pip

# 验证安装
python3 --version
pip3 --version
```

### 2. 安装 Selenium

```bash
# 安装最新版本的 Selenium
pip3 install selenium

# 安装指定版本（可选）
pip3 install selenium==4.15.0

# 安装相关依赖
pip3 install webdriver-manager  # 自动管理 WebDriver
```

### 3. 验证 Selenium 安装

```bash
# 检查 Selenium 版本
python3 -c "import selenium; print(selenium.__version__)"

# 测试导入
python3 -c "from selenium import webdriver; print('Selenium imported successfully')"
```

## 配置无界面 Chrome

### 1. 基础配置

创建测试脚本：

```python
#!/usr/bin/env python3
# test_selenium.py

from selenium import webdriver
from selenium.webdriver.chrome.options import Options

# 配置 Chrome 选项
options = Options()
options.headless = True  # 无界面模式
options.add_argument('--no-sandbox')  # 跳过沙箱
options.add_argument('--disable-dev-shm-usage')  # 禁用 /dev/shm
options.add_argument('--disable-gpu')  # 禁用 GPU 加速

# 初始化 WebDriver
driver = webdriver.Chrome(options=options)

# 测试访问
driver.get("https://www.google.com/")
print(f"页面标题: {driver.title}")

# 截图
driver.save_screenshot("screenshot.png")

# 关闭浏览器
driver.quit()

print("测试完成！")
```

运行测试：

```bash
python3 test_selenium.py
```

### 2. 高级配置

完整的无界面配置：

```python
#!/usr/bin/env python3
# advanced_selenium.py

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def create_driver():
    """创建配置完整的 Chrome WebDriver"""
    options = Options()

    # 无界面配置
    options.headless = True
    options.add_argument('--headless')

    # 基本设置
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--disable-software-rasterizer')

    # 窗口大小
    options.add_argument('--window-size=1920,1080')

    # 用户代理
    options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

    # 性能优化
    options.add_argument('--disable-extensions')
    options.add_argument('--disable-plugins')
    options.add_argument('--disable-images')  # 禁用图片加载
    options.add_argument('--disable-javascript')  # 可选：禁用 JS
    options.add_argument('--disable-css')  # 可选：禁用 CSS

    # 禁用通知和弹窗
    prefs = {
        "profile.default_content_setting_values.notifications": 2,
        "profile.default_content_setting_values.media_stream": 2,
    }
    options.add_experimental_option("prefs", prefs)

    # 禁用日志
    options.add_argument('--disable-logging')
    options.add_argument('--silent')

    # 网络设置
    options.add_argument('--disable-web-security')
    options.add_argument('--allow-running-insecure-content')

    return webdriver.Chrome(options=options)

def main():
    driver = create_driver()

    try:
        # 访问页面
        print("正在访问 https://httpbin.org/html...")
        driver.get("https://httpbin.org/html")

        # 等待页面加载
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "h1"))
        )

        # 获取页面信息
        title = driver.title
        h1_text = driver.find_element(By.TAG_NAME, "h1").text

        print(f"页面标题: {title}")
        print(f"H1 文本: {h1_text}")

        # 截图
        driver.save_screenshot("advanced_s print("截图已creenshot.png")
       保存为 advanced_screenshot.png")

        # 获取页面源码
        page_source = driver.page_source[:500]
        print(f"页面源码前 500 字符:\n{page_source}")

        # 等待一段时间
        time.sleep(2)

    except Exception as e:
        print(f"发生错误: {e}")

    finally:
        driver.quit()
        print("浏览器已关闭")

if __name__ == "__main__":
    main()
```

### 3. 使用 ChromeDriver Manager（推荐）

自动管理 WebDriver：

```python
#!/usr/bin/env python3
# auto_driver.py

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options

def main():
    # 使用 webdriver_manager 自动下载和管理 ChromeDriver
    service = Service(ChromeDriverManager().install())

    options = Options()
    options.headless = True
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')

    driver = webdriver.Chrome(service=service, options=options)

    try:
        driver.get("https://www.baidu.com")
        print(f"页面标题: {driver.title}")

        # 搜索
        search_box = driver.find_element('name', 'wd')
        search_box.send_keys("Selenium")
        search_box.submit()

        # 等待结果
        driver.implicitly_wait(5)
        print("搜索完成")

    finally:
        driver.quit()

if __name__ == "__main__":
    main()
```

## 常用配置选项

### Chrome 选项详解

| 选项 | 说明 | 示例 |
|------|------|------|
| `--headless` | 无界面模式 | `--headless` |
| `--no-sandbox` | 跳过沙箱检查 | `--no-sandbox` |
| `--disable-dev-shm-usage` | 禁用 /dev/shm | `--disable-dev-shm-usage` |
| `--disable-gpu` | 禁用 GPU 加速 | `--disable-gpu` |
| `--window-size` | 设置窗口大小 | `--window-size=1920,1080` |
| `--user-agent` | 自定义 User-Agent | `--user-agent="..."` |
| `--disable-images` | 禁用图片加载 | `--disable-images` |
| `--disable-javascript` | 禁用 JavaScript | `--disable-javascript` |
| `--disable-extensions` | 禁用扩展 | `--disable-extensions` |
| `--disable-plugins` | 禁用插件 | `--disable-plugins` |
| `--disable-css` | 禁用 CSS | `--disable-css` |
| `--hide-scrollbars` | 隐藏滚动条 | `--hide-scrollbars` |
| `--mute-audio` | 静音 | `--mute-audio` |
| `--disable-web-security` | 禁用 Web 安全 | `--disable-web-security` |
| `--disable-features` | 禁用特定功能 | `--disable-features=VizDisplayCompositor` |

### 配置示例

#### 高性能模式（快速加载）

```python
options = Options()
options.headless = True
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--disable-gpu')
options.add_argument('--disable-images')  # 不加载图片
options.add_argument('--disable-plugins')
options.add_argument('--disable-extensions')
options.add_argument('--mute-audio')
options.add_argument('--window-size=1920,1080')
```

#### 兼容性模式（完整渲染）

```python
options = Options()
options.headless = True
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--window-size=1920,1080')
options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
```

#### 移动端模拟

```python
options = Options()
options.headless = True
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')

# 移动设备配置
mobile_emulation = {
    "deviceMetrics": {
        "width": 375,
        "height": 667,
        "pixelRatio": 2.0
    },
    "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15"
}
options.add_experimental_option("mobileEmulation", mobile_emulation)
```

## 实战案例

### 案例 1：网页抓取

```python
#!/usr/bin/env python3
# web_scraper.py

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import json

class WebScraper:
    def __init__(self):
        self.options = Options()
        self.options.headless = True
        self.options.add_argument('--no-sandbox')
        self.options.add_argument('--disable-dev-shm-usage')
        self.options.add_argument('--disable-images')
        self.driver = None

    def start(self):
        self.driver = webdriver.Chrome(options=self.options)
        return self

    def scrape(self, url, selectors):
        """抓取网页数据"""
        try:
            print(f"正在访问: {url}")
            self.driver.get(url)

            # 等待页面加载
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )

            time.sleep(2)  # 额外等待

            results = {}
            for key, selector in selectors.items():
                try:
                    elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    results[key] = [elem.text.strip() for elem in elements]
                except Exception as e:
                    print(f"抓取 {key} 时出错: {e}")
                    results[key] = []

            return results

        except Exception as e:
            print(f"抓取失败: {e}")
            return {}

    def screenshot(self, filename="screenshot.png"):
        """保存截图"""
        if self.driver:
            self.driver.save_screenshot(filename)
            print(f"截图已保存: {filename}")

    def close(self):
        """关闭浏览器"""
        if self.driver:
            self.driver.quit()
            print("浏览器已关闭")

# 使用示例
if __name__ == "__main__":
    scraper = WebScraper().start()

    # 抓取示例页面
    selectors = {
        'titles': 'h1, h2, h3',
        'links': 'a',
        'paragraphs': 'p'
    }

    results = scraper.scrape("https://httpbin.org/html", selectors)

    # 输出结果
    for key, values in results.items():
        print(f"\n{key}:")
        for value in values[:5]:  # 只显示前 5 个
            print(f"  - {value}")

    # 保存截图
    scraper.screenshot()

    # 关闭
    scraper.close()
```

### 案例 2：自动化测试

```python
#!/usr/bin/env python3
# test_login.py

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class LoginTest:
    def __init__(self):
        options = Options()
        options.headless = True
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        self.driver = webdriver.Chrome(options=options)

    def test_login(self, login_url, username, password):
        """测试登录功能"""
        try:
            print(f"访问登录页面: {login_url}")
            self.driver.get(login_url)

            # 等待登录表单
            username_field = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.NAME, "username"))
            )

            password_field = self.driver.find_element(By.NAME, "password")
            submit_button = self.driver.find_element(By.XPATH, "//input[@type='submit']")

            # 输入凭据
            print("输入用户名和密码...")
            username_field.clear()
            username_field.send_keys(username)
            password_field.clear()
            password_field.send_keys(password)

            # 提交表单
            print("提交登录表单...")
            submit_button.click()

            # 等待重定向或页面变化
            time.sleep(3)

            # 检查是否登录成功
            if "dashboard" in self.driver.current_url or "welcome" in self.driver.page_source.lower():
                print("✅ 登录测试通过")
                return True
            else:
                print("❌ 登录测试失败")
                return False

        except Exception as e:
            print(f"❌ 登录测试出错: {e}")
            return False

    def close(self):
        self.driver.quit()

# 运行测试
if __name__ == "__main__":
    test = LoginTest()
    success = test.test_login(
        "https://example.com/login",
        "test_user",
        "test_password"
    )
    test.close()
```

### 案例 3：多标签页处理

```python
#!/usr/bin/env python3
# multi_tab.py

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time

options = Options()
options.headless = True
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
driver = webdriver.Chrome(options=options)

try:
    # 打开第一个标签页
    driver.get("https://www.baidu.com")
    print(f"标签页 1: {driver.title}")

    # 打开新标签页
    driver.execute_script("window.open('https://www.google.com', '_blank');")
    driver.switch_to.window(driver.window_handles[1])
    print(f"标签页 2: {driver.title}")

    # 打开第三个标签页
    driver.execute_script("window.open('https://www.github.com', '_blank');")
    driver.switch_to.window(driver.window_handles[2])
    print(f"标签页 3: {driver.title}")

    # 切换回第一个标签页
    driver.switch_to.window(driver.window_handles[0])
    print(f"切换回标签页 1: {driver.title}")

    # 获取所有标签页
    print(f"\n总共打开了 {len(driver.window_handles)} 个标签页")

    # 关闭当前标签页
    driver.close()

    # 切换到剩余标签页中的第一个
    driver.switch_to.window(driver.window_handles[0])
    print(f"剩余标签页: {driver.title}")

finally:
    driver.quit()
```

## 故障排除

### 常见问题及解决方案

#### 问题 1：ChromeDriver 版本不匹配

**错误信息：**
```
SessionNotCreatedException: session not created: This version of ChromeDriver only supports Chrome version XX
```

**解决方案：**

```python
# 方法 1：使用 webdriver_manager 自动管理
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=options)

# 方法 2：手动下载匹配版本
# 1. 查看 Chrome 版本
google-chrome --version

# 2. 下载对应版本的 ChromeDriver
# https://chromedriver.chromium.org/downloads

# 3. 替换系统中的 chromedriver
sudo rm /usr/local/bin/chromedriver
sudo mv chromedriver /usr/local/bin/
sudo chmod +x /usr/local/bin/chromedriver
```

#### 问题 2：权限错误

**错误信息：**
```
Permission denied: '/usr/local/bin/chromedriver'
```

**解决方案：**

```bash
# 设置正确的权限
sudo chown root:root /usr/local/bin/chromedriver
sudo chmod +x /usr/local/bin/chromedriver

# 或者将 chromedriver 放在用户目录下
mkdir -p ~/bin
mv chromedriver ~/bin/
echo 'export PATH=$HOME/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

#### 问题 3：内存不足

**错误信息：**
```
DevToolsActivePort file doesn't exist
```

**解决方案：**

```python
# 添加更多内存选项
options = Options()
options.headless = True
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--disable-gpu')
options.add_argument('--disable-software-rasterizer')
options.add_argument('--disable-setuid-sandbox')
options.add_argument('--disable-extensions')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--disable-background-timer-throttling')
options.add_argument('--disable-backgrounding-occluded-windows')
options.add_argument('--disable-renderer-backgrounding')

# 设置内存限制
options.add_argument('--memory-pressure-off')
options.add_argument('--max_old_space_size=4096')
```

#### 问题 4：页面加载失败

**解决方案：**

```python
# 添加更多网络选项
options = Options()
options.headless = True
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--disable-gpu')

# 网络配置
options.add_argument('--disable-web-security')
options.add_argument('--allow-running-insecure-content')
options.add_argument('--disable-features=VizDisplayCompositor')
options.add_argument('--ignore-certificate-errors')
options.add_argument('--ignore-ssl-errors')

# 设置超时
driver = webdriver.Chrome(options=options)
driver.set_page_load_timeout(30)  # 30 秒超时
driver.implicitly_wait(10)  # 隐式等待 10 秒
```

### 调试技巧

#### 1. 查看 Chrome 日志

```python
options = Options()
options.headless = True
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')

# 启用详细日志
options.add_argument('--enable-logging')
options.add_argument('--v=1')
options.add_argument('--log-level=0')

driver = webdriver.Chrome(options=options)

# 获取日志
logs = driver.get_log('browser')
for log in logs:
    print(log)
```

#### 2. 保存页面源码

```python
try:
    driver.get(url)

    # 保存页面源码
    with open('page_source.html', 'w', encoding='utf-8') as f:
        f.write(driver.page_source)

    # 保存截图
    driver.save_screenshot('debug_screenshot.png')

except Exception as e:
    print(f"调试信息: {e}")
```

#### 3. 使用远程调试

```bash
# 启动 Chrome 并启用远程调试
google-chrome --headless --disable-gpu --remote-debugging-port=9222

# 然后连接
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_experimental_option("debuggerAddress", "127.0.0.1:9222")

driver = webdriver.Chrome(options=options)
```

## 性能优化

### 1. 禁用不必要的功能

```python
options = Options()
options.headless = True

# 禁用图片加载
prefs = {
    "profile.managed_default_content_settings.images": 2
}
options.add_experimental_option("prefs", prefs)

# 禁用 CSS 加载
prefs = {
    "profile.default_content_settings.stylesheets": 2
}
options.add_experimental_option("prefs", prefs)

# 禁用 JavaScript（如果不需要）
options.add_argument('--disable-javascript')
```

### 2. 使用无头模式优化

```python
options = Options()
options.headless = True

# 使用 new headless 实现（Chrome 96+）
options.add_argument('--headless=new')
```

### 3. 复用浏览器实例

```python
# 在同一浏览器中执行多个任务
driver = webdriver.Chrome(options=options)

# 任务 1
driver.get("https://site1.com")
do_task1(driver)

# 任务 2
driver.get("https://site2.com")
do_task2(driver)

# 关闭
driver.quit()
```

## 最佳实践

### 1. 编码规范

```python
# ✅ 推荐：封装为类
class ChromeDriver:
    def __init__(self, headless=True):
        self.options = self._configure_options(headless)
        self.driver = None

    def _configure_options(self, headless):
        options = Options()
        if headless:
            options.headless = True
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        return options

    def __enter__(self):
        self.driver = webdriver.Chrome(options=self.options)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.driver:
            self.driver.quit()

# 使用
with ChromeDriver() as driver:
    driver.get("https://example.com")
```

### 2. 错误处理

```python
from selenium.common.exceptions import TimeoutException, NoSuchElementException

def safe_find_element(driver, by, value, timeout=10):
    try:
        element = WebDriverWait(driver, timeout).until(
            EC.presence_of_element_located((by, value))
        )
        return element
    except TimeoutException:
        print(f"未找到元素: {value}")
        return None
```

### 3. 配置管理

```python
# config.py
import os

class Config:
    CHROME_OPTIONS = {
        'headless': True,
        'window_size': '1920,1080',
        'user_agent': 'Mozilla/5.0 (compatible; Bot/1.0)',
    }

    @classmethod
    def get_chrome_options(cls):
        options = Options()
        for key, value in cls.CHROME_OPTIONS.items():
            if key == 'headless':
                if value:
                    options.add_argument('--headless')
            elif key == 'window_size':
                options.add_argument(f'--window-size={value}')
            elif key == 'user_agent':
                options.add_argument(f'--user-agent={value}')
        return options
```

## 总结

在 Linux 服务器上成功搭建 Chrome + Selenium 无界面环境的关键点：

1. **正确安装 Chrome**：使用官方 .deb 包或仓库
2. **匹配 ChromeDriver 版本**：确保与 Chrome 版本兼容
3. **配置必要参数**：`--no-sandbox` 和 `--disable-dev-shm-usage`
4. **优化性能**：禁用不必要的功能
5. **错误处理**：添加适当的异常捕获
6. **测试验证**：使用简单脚本验证环境

掌握这些知识，您就能在服务器环境中高效使用 Selenium 进行自动化测试和网页抓取！

## 相关资源

- [Selenium 官方文档](https://selenium-python.readthedocs.io/)
- [ChromeDriver 文档](https://chromedriver.chromium.org/)
- [Chrome 选项列表](https://peter.sh/experiments/chromium-command-line-switches/)
- [WebDriver Manager 项目](https://github.com/SergeyPirogov/webdriver_manager)

持续实践，您将成为 Selenium 自动化专家！

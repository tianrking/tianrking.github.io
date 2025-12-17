---
legacy: true
id: python-gmail-sending-guide
title: Python 发送 Gmail 邮件完整指南
sidebar_label: Python Gmail 发送
description: 详细介绍如何使用 Python 发送 Gmail 邮件，包括文本邮件、HTML 邮件和带附件邮件的配置和实现
date: 2022-04-27T16:24:12+08:00
tags: [Python, Gmail, SMTP, 邮件发送, 自动化]
authors: [w0x7ce]
---

# Python 发送 Gmail 邮件完整指南

本指南将详细介绍如何使用 Python 发送 Gmail 邮件，包括文本邮件、HTML 邮件和带附件的邮件。

## 准备工作

### 1. 启用两步验证

访问 [Google 账户两步验证页面](https://myaccount.google.com/signinoptions/two-step-verification) 并启用两步验证。

### 2. 创建应用程序密码

1. 访问 [应用程序密码页面](https://security.google.com/settings/security/apppasswords)
2. 选择"邮件"和"其他（自定义名称）"
3. 输入应用程序名称（如"Python Gmail"）
4. 点击"生成"
5. 复制生成的16位密码（格式如"abcd efgh ijkl mnop"）

### 3. 授权外部访问

访问 [Google 账户访问授权页面](https://accounts.google.com/DisplayUnlockCaptcha) 并点击"继续"。

## 发送文本邮件

### 基本实现

```python
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# 配置信息
username = "your-email@gmail.com"  # 你的 Gmail 地址
password = "your-16-digit-app-password"  # 应用程序密码
mail_from = "your-email@gmail.com"  # 发件人邮箱
mail_to = "recipient@example.com"  # 收件人邮箱
mail_subject = "Test Subject"  # 邮件主题
mail_body = "This is a test message"  # 邮件正文

# 创建邮件对象
mimemsg = MIMEMultipart()
mimemsg['From'] = mail_from
mimemsg['To'] = mail_to
mimemsg['Subject'] = mail_subject
mimemsg.attach(MIMEText(mail_body, 'plain'))

# 发送邮件
try:
    # 连接到 Gmail SMTP 服务器
    connection = smtplib.SMTP(host='smtp.gmail.com', port=587)
    connection.starttls()  # 启用 TLS 加密

    # 登录
    connection.login(username, password)

    # 发送邮件
    connection.send_message(mimemsg)

    # 关闭连接
    connection.quit()

    print("邮件发送成功！")
except Exception as e:
    print(f"邮件发送失败：{e}")
```

### 优化版本

```python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GmailSender:
    def __init__(self, email, password):
        self.email = email
        self.password = password
        self.smtp_server = "smtp.gmail.com"
        self.port = 587

    def send_email(self, to_email, subject, body, is_html=False):
        """发送邮件"""
        try:
            # 创建邮件
            msg = MIMEMultipart()
            msg['From'] = self.email
            msg['To'] = to_email
            msg['Subject'] = subject

            # 添加正文
            msg.attach(MIMEText(body, 'html' if is_html else 'plain'))

            # 发送邮件
            with smtplib.SMTP(self.smtp_server, self.port) as server:
                server.starttls()
                server.login(self.email, self.password)
                server.send_message(msg)

            logger.info(f"邮件已成功发送到 {to_email}")
            return True

        except Exception as e:
            logger.error(f"邮件发送失败: {e}")
            return False

# 使用示例
sender = GmailSender("your-email@gmail.com", "your-app-password")
sender.send_email(
    to_email="recipient@example.com",
    subject="测试邮件",
    body="这是一封测试邮件"
)
```

## 发送 HTML 邮件

```python
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def send_html_email(sender_email, sender_password, recipient_email):
    """发送 HTML 邮件"""

    # HTML 邮件内容
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>欢迎使用 Gmail 发送服务</h1>
            </div>
            <div class="content">
                <h2>您好！</h2>
                <p>这是一封 <strong>HTML 格式</strong> 的测试邮件。</p>
                <p>您可以在这里添加任何 HTML 内容：</p>
                <ul>
                    <li>格式化文本</li>
                    <li>表格</li>
                    <li>图片链接</li>
                    <li>其他 HTML 元素</li>
                </ul>
                <p><a href="https://www.example.com" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">点击这里</a></p>
            </div>
            <div class="footer">
                <p>此邮件由 Python 自动发送</p>
            </div>
        </div>
    </body>
    </html>
    """

    # 创建邮件
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = "HTML 邮件测试"

    # 添加 HTML 内容
    msg.attach(MIMEText(html_content, 'html', 'utf-8'))

    try:
        # 发送邮件
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)

        print("HTML 邮件发送成功！")

    except Exception as e:
        print(f"发送失败：{e}")

# 使用示例
send_html_email(
    "your-email@gmail.com",
    "your-app-password",
    "recipient@example.com"
)
```

## 发送带附件的邮件

```python
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import os

def send_email_with_attachment(
    sender_email,
    sender_password,
    recipient_email,
    subject,
    body,
    attachment_path,
    attachment_name=None
):
    """发送带附件的邮件"""

    # 如果没有指定附件名，使用文件名
    if attachment_name is None:
        attachment_name = os.path.basename(attachment_path)

    # 创建邮件
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = subject

    # 添加正文
    msg.attach(MIMEText(body, 'plain'))

    try:
        # 读取附件
        with open(attachment_path, "rb") as attachment:
            # 创建 MIME 对象
            mime_file = MIMEBase('application', 'octet-stream')
            mime_file.set_payload(attachment.read())

        # 编码附件
        encoders.encode_base64(mime_file)

        # 添加附件头部信息
        mime_file.add_header(
            'Content-Disposition',
            f'attachment; filename= {attachment_name}'
        )

        # 将附件添加到邮件
        msg.attach(mime_file)

        # 发送邮件
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)

        print(f"带附件的邮件发送成功！附件：{attachment_name}")

    except Exception as e:
        print(f"发送失败：{e}")

# 使用示例
send_email_with_attachment(
    sender_email="your-email@gmail.com",
    sender_password="your-app-password",
    recipient_email="recipient@example.com",
    subject="测试附件邮件",
    body="请查收附件中的文件。",
    attachment_path="/path/to/your/file.pdf",
    attachment_name="document.pdf"
)
```

## 发送多附件邮件

```python
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from pathlib import Path

def send_email_with_attachments(
    sender_email,
    sender_password,
    recipient_email,
    subject,
    body,
    attachment_paths
):
    """发送带多个附件的邮件"""

    # 创建邮件
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = subject

    # 添加正文
    msg.attach(MIMEText(body, 'plain'))

    # 添加所有附件
    for attachment_path in attachment_paths:
        attachment_path = Path(attachment_path)

        if not attachment_path.exists():
            print(f"附件不存在：{attachment_path}")
            continue

        with open(attachment_path, "rb") as attachment:
            mime_file = MIMEBase('application', 'octet-stream')
            mime_file.set_payload(attachment.read())
            encoders.encode_base64(mime_file)

            mime_file.add_header(
                'Content-Disposition',
                f'attachment; filename= {attachment_path.name}'
            )

            msg.attach(mime_file)

    try:
        # 发送邮件
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)

        print(f"多附件邮件发送成功！附件数量：{len(attachment_paths)}")

    except Exception as e:
        print(f"发送失败：{e}")

# 使用示例
attachments = [
    "/path/to/file1.pdf",
    "/path/to/image.jpg",
    "/path/to/document.docx"
]

send_email_with_attachments(
    sender_email="your-email@gmail.com",
    sender_password="your-app-password",
    recipient_email="recipient@example.com",
    subject="多个附件测试",
    body="请查收附件中的多个文件。",
    attachment_paths=attachments
)
```

## 批量发送邮件

```python
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import time

def send_bulk_emails(
    sender_email,
    sender_password,
    recipients,
    subject_template,
    body_template
):
    """批量发送邮件"""

    success_count = 0
    fail_count = 0

    for recipient_email in recipients:
        try:
            # 个性化邮件内容
            subject = subject_template.format(name=recipient_email.split('@')[0])
            body = body_template.format(name=recipient_email.split('@')[0])

            # 创建邮件
            msg = MIMEMultipart()
            msg['From'] = sender_email
            msg['To'] = recipient_email
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain'))

            # 发送邮件
            with smtplib.SMTP("smtp.gmail.com", 587) as server:
                server.starttls()
                server.login(sender_email, sender_password)
                server.send_message(msg)

            print(f"✓ 邮件已发送到：{recipient_email}")
            success_count += 1

            # 添加延迟以避免被识别为垃圾邮件
            time.sleep(1)

        except Exception as e:
            print(f"✗ 发送失败 {recipient_email}：{e}")
            fail_count += 1

    print(f"\n发送完成：成功 {success_count}，失败 {fail_count}")

# 使用示例
recipients = [
    "user1@example.com",
    "user2@example.com",
    "user3@example.com"
]

send_bulk_emails(
    sender_email="your-email@gmail.com",
    sender_password="your-app-password",
    recipients=recipients,
    subject_template="个性化邮件 - {name}",
    body_template="你好 {name}，这是一封个性化邮件。"
)
```

## 高级功能

### 发送内嵌图片的 HTML 邮件

```python
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage

def send_email_with_inline_image(
    sender_email,
    sender_password,
    recipient_email,
    image_path
):
    """发送带内嵌图片的邮件"""

    # HTML 内容（引用内嵌图片）
    html_content = f"""
    <html>
    <body>
        <h1>内嵌图片测试</h1>
        <p>这是一张内嵌的图片：</p>
        <img src="cid:image1" alt="内嵌图片" style="max-width: 100%;">
        <p>图片下方文字</p>
    </body>
    </html>
    """

    # 创建邮件
    msg = MIMEMultipart('related')
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = "内嵌图片邮件"

    # 添加 HTML 内容
    msg.attach(MIMEText(html_content, 'html'))

    # 添加内嵌图片
    with open(image_path, 'rb') as img_file:
        img_data = img_file.read()
        img = MIMEImage(img_data)
        img.add_header('Content-ID', '<image1>')
        img.add_header('Content-Disposition', 'inline', filename='image1.jpg')
        msg.attach(img)

    try:
        # 发送邮件
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)

        print("内嵌图片邮件发送成功！")

    except Exception as e:
        print(f"发送失败：{e}")

# 使用示例
send_email_with_inline_image(
    "your-email@gmail.com",
    "your-app-password",
    "recipient@example.com",
    "/path/to/image.jpg"
)
```

### 定时发送邮件

```python
import schedule
import time
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_daily_report():
    """发送每日报告"""

    sender_email = "your-email@gmail.com"
    sender_password = "your-app-password"
    recipient_email = "recipient@example.com"

    # 报告内容
    subject = "每日报告 - " + time.strftime("%Y-%m-%d")
    body = f"""
    您好！

    这是每日自动报告。
    发送时间：{time.strftime("%Y-%m-%d %H:%M:%S")}

    祝好！
    """

    # 创建并发送邮件
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
        print(f"每日报告已发送：{time.strftime('%Y-%m-%d %H:%M:%S')}")
    except Exception as e:
        print(f"发送失败：{e}")

# 设置定时任务
schedule.every().day.at("09:00").do(send_daily_report)
schedule.every().monday.at("10:00").do(send_daily_report)

print("定时任务已启动，等待执行...")
while True:
    schedule.run_pending()
    time.sleep(1)
```

## 常见问题解决

### 1. SMTPAuthenticationError 错误

**问题**：用户名和密码不正确

**解决方案**：
- 确保使用应用程序密码，不是 Gmail 密码
- 检查两步验证是否已启用

### 2. SMTPServerDisconnected 错误

**问题**：连接意外断开

**解决方案**：
```python
# 添加重试机制
def send_with_retry(msg, max_retries=3):
    for attempt in range(max_retries):
        try:
            with smtplib.SMTP("smtp.gmail.com", 587) as server:
                server.starttls()
                server.login(username, password)
                server.send_message(msg)
            return True
        except Exception as e:
            if attempt == max_retries - 1:
                raise e
            time.sleep(2 ** attempt)  # 指数退避
    return False
```

### 3. 邮件进入垃圾邮件

**解决方案**：
- 避免使用垃圾邮件关键词
- 添加 SPF、DKIM、DMARC 记录
- 不要频繁发送相同内容

### 4. 附件发送失败

**解决方案**：
- 检查文件路径是否正确
- 确保附件大小不超过 25MB
- 使用正确的 MIME 类型

## 最佳实践

### 1. 安全建议

- **永远不要在代码中硬编码密码**：使用环境变量或配置文件
- **使用应用程序密码**：不要使用主密码
- **限制权限**：只授予必要的权限
- **定期更新密码**：定期更换应用程序密码

### 2. 性能优化

- **使用上下文管理器**：自动关闭连接
- **添加延迟**：批量发送时添加延迟
- **连接复用**：复用 SMTP 连接（如果支持）

### 3. 错误处理

```python
import logging

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('email.log'),
        logging.StreamHandler()
    ]
)

def send_email_safe(sender_email, sender_password, recipient_email, subject, body):
    """安全的邮件发送函数"""
    try:
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = recipient_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)

        logging.info(f"邮件成功发送到 {recipient_email}")
        return True

    except smtplib.SMTPAuthenticationError:
        logging.error("身份验证失败，请检查用户名和密码")
        return False
    except smtplib.SMTPException as e:
        logging.error(f"SMTP 错误：{e}")
        return False
    except Exception as e:
        logging.error(f"未知错误：{e}")
        return False
```

### 4. 配置管理

使用环境变量或配置文件管理敏感信息：

```python
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 从环境变量获取配置
SENDER_EMAIL = os.getenv('GMAIL_EMAIL')
SENDER_PASSWORD = os.getenv('GMAIL_APP_PASSWORD')
SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
```

创建 `.env` 文件：
```env
GMAIL_EMAIL=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-digit-password
```

## 完整示例

```python
#!/usr/bin/env python3
"""
Gmail 邮件发送工具
"""

import smtplib
import os
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from typing import List, Optional

class GmailSender:
    """Gmail 邮件发送器"""

    def __init__(self, email: str, password: str):
        self.email = email
        self.password = password
        self.smtp_server = "smtp.gmail.com"
        self.port = 587

    def send_text(
        self,
        to: str,
        subject: str,
        body: str,
        is_html: bool = False
    ) -> bool:
        """发送文本邮件"""
        try:
            msg = MIMEMultipart()
            msg['From'] = self.email
            msg['To'] = to
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'html' if is_html else 'plain'))

            with smtplib.SMTP(self.smtp_server, self.port) as server:
                server.starttls()
                server.login(self.email, self.password)
                server.send_message(msg)

            logging.info(f"邮件已发送到 {to}")
            return True

        except Exception as e:
            logging.error(f"发送失败到 {to}: {e}")
            return False

    def send_with_attachment(
        self,
        to: str,
        subject: str,
        body: str,
        attachment_path: str,
        attachment_name: Optional[str] = None
    ) -> bool:
        """发送带附件的邮件"""
        try:
            msg = MIMEMultipart()
            msg['From'] = self.email
            msg['To'] = to
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain'))

            if attachment_name is None:
                attachment_name = os.path.basename(attachment_path)

            with open(attachment_path, 'rb') as attachment:
                part = MIMEBase('application', 'octet-stream')
                part.set_payload(attachment.read())
                encoders.encode_base64(part)
                part.add_header(
                    'Content-Disposition',
                    f'attachment; filename= {attachment_name}'
                )
                msg.attach(part)

            with smtplib.SMTP(self.smtp_server, self.port) as server:
                server.starttls()
                server.login(self.email, self.password)
                server.send_message(msg)

            logging.info(f"带附件邮件已发送到 {to}")
            return True

        except Exception as e:
            logging.error(f"发送失败到 {to}: {e}")
            return False

# 使用示例
if __name__ == "__main__":
    # 配置日志
    logging.basicConfig(level=logging.INFO)

    # 创建发送器
    sender = GmailSender(
        email="your-email@gmail.com",
        password="your-app-password"
    )

    # 发送文本邮件
    sender.send_text(
        to="recipient@example.com",
        subject="测试邮件",
        body="这是一封测试邮件"
    )

    # 发送带附件的邮件
    sender.send_with_attachment(
        to="recipient@example.com",
        subject="测试附件",
        body="请查收附件",
        attachment_path="/path/to/file.pdf"
    )
```

## 总结

使用 Python 发送 Gmail 邮件是一个强大的功能，可以用于：

- **自动化通知**：系统监控、错误报告
- **批量邮件**：营销邮件、新闻通讯
- **数据报告**：定期发送分析报告
- **文件共享**：自动发送文件

遵循本指南的最佳实践，可以安全、高效地实现邮件发送功能。

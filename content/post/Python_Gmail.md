---
title: "Python_Gmail"
date: 2022-04-27T16:24:12+08:00
draft: false

tags: ["Python","Gmail"]
categories: ["DevOps"]
author: "w0x7ce"
---

## 準備

[啓用兩步驗證](https://myaccount.google.com/signinoptions/two-step-verification)

[創建程式密碼](https://security.google.com/settings/security/apppasswords)

[授權外部訪問 Google Account](https://accounts.google.com/DisplayUnlockCaptcha)。

## 發送電子郵件

### 發送文本電子郵件

```Python
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

username = "@gmail.com"
password = "password"
mail_from = "@gmail.com"
mail_to = "@gmail.com"
mail_subject = "Test Subject"
mail_body = "This is a test message"

mimemsg = MIMEMultipart()
mimemsg['From']=mail_from
mimemsg['To']=mail_to
mimemsg['Subject']=mail_subject
mimemsg.attach(MIMEText(mail_body, 'plain'))
connection = smtplib.SMTP(host='smtp.gmail.com', port=587)
connection.starttls()
connection.login(username,password)
connection.send_message(mimemsg)
connection.quit()
```

### 發送包含附件的電子郵件

```Python
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

username = "@gmail.com"
password = "password"
mail_from = "@gmail.com"
mail_to = "@gmail.com"
mail_subject = "Test Subject"
mail_body = "This is a test message"
mail_attachment="a.txt"
mail_attachment_name="test.txt"

mimemsg = MIMEMultipart()
mimemsg['From']=mail_from
mimemsg['To']=mail_to
mimemsg['Subject']=mail_subject
mimemsg.attach(MIMEText(mail_body, 'plain'))

with open(mail_attachment, "rb") as attachment:
    mimefile = MIMEBase('application', 'octet-stream')
    mimefile.set_payload((attachment).read())
    encoders.encode_base64(mimefile)
    mimefile.add_header('Content-Disposition', "attachment; filename= %s" % mail_attachment_name)
    mimemsg.attach(mimefile)
    connection = smtplib.SMTP(host='smtp.gmail.com', port=587)
    connection.starttls()
    connection.login(username,password)
    connection.send_message(mimemsg)
    connection.quit()
```
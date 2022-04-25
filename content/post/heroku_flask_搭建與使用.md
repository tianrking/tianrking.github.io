---
title: "Heroku_flask_搭建與使用"
date: 2022-04-25T16:02:03+08:00
draft: false

tags: ["heroku","flask","Python"]
categories: ["DevOps"]
author: "w0x7ce"

---

## Install heroku CLI

```bash
sudo snap install heroku --classic
```

setup account

```bash
heroku login
```

## Create app

```bash
heroku create
```

### Create a new Git repository

```bash
cd my-project/
git init
heroku git:remote -a name
```

### Existing Git repository

```bash
heroku git:remote -a name
```

## FLASK DEMO

app.py

```python
from flask import Flask
app = Flask(__name__)

@app.route("/who")
def who_am_i():
    return "w0x7ce"

if __name__ == '__main__':
    app.run(port=5000)
```

wsgi.py

```python
from app import app

if __name__ == "__main__":
    app.run()
```

Procfile

```text
web: gunicorn wsgi:app
```

gen requirements.txt

```bash
pip freeze >requirements.txt
```

## Develop

```bash
git add .
git commit -m "update"
git push heroku master
```

## View logs

```bash
heroku logs --tail
```

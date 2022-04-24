---
title: "GCP Python_Flask搭建与使用"
date: 2022-04-24T09:20:10+08:00
draft: false

tags: ["Python","GCP","Flask"]
categories: ["DevOps"]
author: "w0x7ce"
---

## GCP Python 文檔

[官方資料](https://cloud.google.com/appengine/docs/standard/python3)

[Demo](https://github.com/GoogleCloudPlatform/python-docs-samples)

## Installing the gcloud CLI 

Download
```bash
#x86_64
curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-382.0.0-linux-x86_64.tar.gz

#arm64
curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-382.0.0-linux-arm.tar.gz

#x86
curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-382.0.0-linux-x86.tar.gz 
```

```bash
tar -xf google-cloud-*.tar.gz
```

```bash
./google-cloud-sdk/install.sh
```

## Initialize the gcloud CLI

Run gcloud init:

```bash
gcloud init
```

If you are in a remote terminal session, you can use the --console-only flag to prevent the command from launching a browser-based authorization flow, if required:

```bash
gcloud init --console-only
```

## Demo

Deploy

```bash
gcloud app deploy
```

main.py

```Python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello World!'

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
```

requirements.txt

```Python
Flask==2.1.0
```

app.yaml

```Python
runtime: python39
```

## My Project

[Twitter Api](https://github.com/tianrking/dont_post_me/tree/main/twitter/flask/gcp)
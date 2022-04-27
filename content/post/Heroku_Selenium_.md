---
title: "Heroku_Selenium_"
date: 2022-04-27T20:24:38+08:00
draft: false

tags: ["Python","Selenium","Heroku"]
categories: ["DevOps"]
author: "w0x7ce"
--- 

## Step 1: Set Up Your Code

```Python
from selenium import webdriver
import os

chrome_options = webdriver.ChromeOptions()
chrome_options.binary_location = os.environ.get("GOOGLE_CHROME_BIN")
chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--no-sandbox")
driver = webdriver.Chrome(executable_path=os.environ.get("CHROMEDRIVER_PATH"), chrome_options=chrome_options)
```

## Step 2: Add the Buildpacks

On Heroku, open your App. Click on the Settings tab and scroll down to Buildpacks. Add the following:

```bash
Python (Select it from the officially supported buildpacks)
Headless Google Chrome: https://github.com/heroku/heroku-buildpack-google-chrome
Chromedriver: https://github.com/heroku/heroku-buildpack-chromedriver
```

## Step 3: Add the Config Vars

Scroll to the config vars section. Here, we will add the paths to Chrome and the Chromedriver. Add the following config vars:

```bash
CHROMEDRIVER_PATH = /app/.chromedriver/bin/chromedriver
GOOGLE_CHROME_BIN = /app/.apt/usr/bin/google-chrome
```

## Step 4: Deploy the Application

```bash
git add .
git commit -m "update"
git push heroku master
```

---
title: "Setting up Chrome and Selenium without GUI"
date: 2022-02-13T20:08:40+08:00
draft: false

tags: ["爬虫","自动化","测试"]
categories: ["爬虫"]
author: "w0x7ce"
---

## SSH into your VPS

```bash
sudo apt update
sudo apt upgrade
```

```
sudo apt install wget -y
```

## Download &Install Chrome
```
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
```

```
sudo dpkg -i google-chrome-stable_current_amd64.deb
```

```
sudo apt-get install -f
```

Test your intall
```
google-chrome
```

View the version
```
google-chrome --version
```

## Download the chrome-driver

Find the package here
https://chromedriver.chromium.org/downloads

``` bash
wget {link you copied above}
unzip xxx.zip
```
```bash
sudo mv chromedriver /usr/bin/chromedriver
sudo chown root:root /usr/bin/chromedriver
sudo chmod +x /usr/bin/chromedriver
```

Verify chromedriver is working
```
chromedriver --url-base=/wd/hub
```
## Install selenium

```bash
apt-get install python3 python3-pip -y
```

```bash
pip install selenium
```



## Test the env

```
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
options = Options()
options.headless = True
driver = webdriver.Chrome("/usr/bin/chromedriver", options=options)
driver.get("https://google.com/")
print(driver.title)
driver.quit()
```

If everything worked out your terminal should print out
$ Google


# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time
options = Options()
options.headless = True
# options.add_argument("--proxy-server=socks5://127.0.0.1:12999")

# chrome_options.add_argument('--headless')
# chrome_options.add_argument('--no-sandbox')
# chrome_options.add_argument('--disable-dev-shm-usage')
driver = webdriver.Chrome("/usr/bin/chromedriver", options=options)
driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
  "source": """
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined
    })
  """
})

driver.get("https://www.simuwang.com/")
# driver.get("https://dc.simuwang.com/")

# 定位搜尋框 賬戶密碼登入
# context = driver.find_element_by_class_name("comp-login-method comp-login-b2 comp-login-active")
# 傳入字串
# context.click()
try:
    context_1 = driver.find_element(By.XPATH, value="//button[@class='comp-login-method comp-login-b2']")
    # context_1 = driver.find_element_by_xpath("//button[@class='comp-login-method comp-login-b2']")
    context_1.click()
    
    # try:
    time.sleep(2)
    username = driver.find_element_by_name('username')
    username.send_keys("15773211225")
    
    password = driver.find_element(By.XPATH, value="//input[@class='comp-login-input comp-login-user-input2']")
    password.send_keys("Lyp82nlf")
    
    login_button = driver.find_element(By.XPATH, value="//button[@class='comp-login-btn']")
    login_button.click()
    
except:
    time.sleep(2)

print(driver.title)
# driver.quit()
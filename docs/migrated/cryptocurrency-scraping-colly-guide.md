---
legacy: true
id: cryptocurrency-scraping-colly-guide
title: 数字货币行情爬取实战 - 基于Colly框架
sidebar_label: Colly数字货币爬虫
description: 使用Go语言Colly框架实战爬取CoinMarketCap数字货币价格数据，包含完整代码、网络代理配置和Excel导出功能
date: 2022-03-17T12:44:48+08:00
tags: [Golang, 爬虫, Colly, 数字货币, 数据采集, 量化交易, CoinMarketCap]
authors: [w0x7ce]
---

# 数字货币行情爬取实战 - 基于Colly框架

在数字货币量化交易中，数据是核心资源。实时、准确的价格数据能够帮助我们做出更好的交易决策。本文将介绍如何使用Go语言的Colly框架爬取CoinMarketCap上的数字货币价格数据，为量化分析提供数据支持。

## 目录

- [Colly框架简介](#colly框架简介)
  - [什么是Colly](#什么是colly)
  - [为什么选择Colly](#为什么选择colly)
  - [Colly在量化交易中的应用](#colly在量化交易中的应用)
- [Colly核心概念](#colly核心概念)
  - [执行顺序](#执行顺序)
  - [回调函数](#回调函数)
- [环境搭建](#环境搭建)
  - [Golang安装](#golang安装)
  - [Go Modules配置](#go-modules配置)
  - [Colly安装](#colly安装)
- [网络环境配置](#网络环境配置)
  - [代理设置](#代理设置)
  - [Shadowsocks配置](#shadowsocks配置)
- [实战代码实现](#实战代码实现)
  - [完整代码](#完整代码)
  - [代码解析](#代码解析)
  - [运行结果](#运行结果)
- [数据处理与存储](#数据处理与存储)
  - [Excel导出](#excel导出)
  - [数据格式化](#数据格式化)
- [进阶优化](#进阶优化)
  - [代理轮询](#代理轮询)
  - [请求频率控制](#请求频率控制)
  - [错误处理](#错误处理)
- [常见问题与解决方案](#常见问题与解决方案)
- [总结与展望](#总结与展望)

## Colly框架简介

### 什么是Colly

Colly是用Go语言编写的功能强大的网页爬虫框架。它提供了简洁的API、强劲的性能，并且能够自动处理cookie和session，还提供了灵活的扩展机制。

**Colly的主要特性：**
- 🚀 **高性能**：基于Go语言的高并发特性
- 🎯 **简洁API**：学习曲线平缓，易于上手
- 🍪 **自动处理Cookie**：内置Cookie和Session管理
- 🔌 **插件扩展**：支持自定义插件和中间件
- 🌐 **代理支持**：内置代理轮询和切换功能
- 📊 **多格式支持**：支持HTML、XML等多种数据格式

### 为什么选择Colly

在众多爬虫框架中，Colly的优势在于：

1. **性能优异**：Go语言的并发特性让Colly能够高效处理大量请求
2. **稳定性强**：自动处理网络异常和重试机制
3. **内存占用低**：相比Python爬虫，Go程序占用资源更少
4. **跨平台**：一次编写，多平台运行
5. **社区活跃**：持续更新，文档完善

### Colly在量化交易中的应用

Colly本身不能直接进行量化交易，但它能够高效地帮助我们采集数据，为量化分析提供"弹药"。

**典型应用场景：**
- 📈 **价格监控**：实时获取数字货币价格
- 📊 **数据收集**：构建历史数据库
- 🔍 **市场分析**：分析价格趋势和交易量
- ⚠️ **异常检测**：监控价格异常波动
- 📝 **数据备份**：定期备份重要数据

## Colly核心概念

### 执行顺序

Colly的回调函数执行顺序（Call order of callbacks）：

```mermaid
graph TD
    A[OnRequest] --> B[OnError]
    A --> C[OnResponseHeaders]
    C --> D[OnResponse]
    D --> E[OnHTML]
    D --> F[OnXML]
    E --> G[OnScraped]
    F --> G
```

**详细说明：**

1. **OnRequest**
   - 在发起请求前执行
   - 用于设置请求头、代理等参数
   - 示例：设置User-Agent、Cookie等

2. **OnError**
   - 请求出错时触发
   - 用于错误日志记录和重试机制
   - 示例：记录错误信息、重新排队请求

3. **OnResponseHeaders**
   - 收到响应头时执行
   - 用于检查响应状态和内容类型
   - 示例：验证响应是否成功

4. **OnResponse**
   - 收到响应时执行
   - 用于响应数据预处理
   - 示例：检查响应内容、日志记录

5. **OnHTML**
   - 收到HTML响应时执行
   - 用于DOM元素选择和数据提取
   - 使用goquery进行CSS选择器操作

6. **OnXML**
   - 收到XML响应时执行
   - 用于XML数据解析
   - 使用xpath进行数据筛选

7. **OnScraped**
   - 整个抓取流程完成后执行
   - 用于最终数据处理和保存
   - 示例：保存到数据库、生成报告

### 回调函数

Colly通过回调函数来处理不同的抓取阶段：

```go
// 1. 请求前设置
c.OnRequest(func(r *colly.Request) {
    fmt.Println("访问:", r.URL)
})

// 2. 错误处理
c.OnError(func(r *colly.Response, err error) {
    fmt.Println("请求错误:", err)
})

// 3. 响应处理
c.OnResponse(func(r *colly.Response) {
    fmt.Println("响应状态:", r.StatusCode)
})

// 4. HTML解析
c.OnHTML("selector", func(e *colly.HTMLElement) {
    data := e.Text
    fmt.Println("提取数据:", data)
})

// 5. XML解析
c.OnXML("//xpath", func(e *colly.XMLElement) {
    data := e.Text
    fmt.Println("XML数据:", data)
})

// 6. 抓取完成
c.OnScraped(func(r *colly.Response) {
    fmt.Println("抓取完成:", r.URL)
})
```

## 环境搭建

### Golang安装

**Linux系统安装：**

```bash
# 下载Go 1.18
wget "https://go.dev/dl/go1.18.linux-amd64.tar.gz"

# 移除旧版本（如果存在）
rm -rf /usr/local/go

# 解压到/usr/local
tar -C /usr/local -xzf go1.18.linux-amd64.tar.gz

# 添加到PATH
export PATH=$PATH:/usr/local/go/bin

# 验证安装
go version
```

**Windows系统安装：**
1. 下载go1.18.windows-amd64.msi
2. 双击安装包，按提示完成安装
3. 打开命令行，运行 `go version` 验证

**macOS系统安装：**

```bash
# 使用Homebrew
brew install go

# 验证安装
go version
```

### Go Modules配置

为了解决国内访问Go模块的问题，需要配置代理：

```bash
# 启用Go Modules
go env -w GO111MODULE=on

# 配置代理（选择其中一个）
# 1. 七牛云CDN
go env -w GOPROXY=https://goproxy.cn,direct

# 2. 阿里云
go env -w GOPROXY=https://mirrors.aliyun.com/goproxy/,direct

# 3. 官方全球代理
go env -w GOPROXY=https://goproxy.io,direct

# 验证配置
go env GOPROXY
```

### Colly安装

```bash
# 创建项目目录
mkdir Crawl && cd Crawl

# 初始化Go模块
go mod init crawl

# 安装Colly v2
go get -u github.com/gocolly/colly/v2

# 安装Excel处理库
go get -u github.com/xuri/excelize/v2

# 整理依赖
go mod tidy

# 查看模块列表
go list -m
```

**项目结构：**

```
Crawl/
├── go.mod          # 模块依赖文件
├── go.sum          # 依赖校验文件
├── main.go         # 主程序
└── Coin_price.xlsx # 导出的Excel文件（运行后生成）
```

## 网络环境配置

### 代理设置

由于国内网络环境限制，无法直接访问CoinMarketCap等国外网站，因此需要配置代理。

**常见代理类型：**

1. **SOCKS5代理**
   ```bash
   socks5://127.0.0.1:1080
   socks5://username:password@127.0.0.1:1080
   ```

2. **HTTP代理**
   ```bash
   http://127.0.0.1:8080
   http://username:password@127.0.0.1:8080
   ```

3. **HTTPS代理**
   ```bash
   https://127.0.0.1:8080
   ```

### Shadowsocks配置

如果没有代理服务器，可以尝试在服务器上用snap安装shadowsocks：

```bash
# 更新系统
sudo apt-get update && sudo apt-get upgrade -y

# 安装snapd
sudo apt install snapd

# 安装shadowsocks-libev
sudo snap install shadowsocks-libev

# 启动shadowsocks本地服务
sudo snap run shadowsocks-libev.ss-local \
    -s server_ip \
    -p server_port \
    -l local_port \
    -b 0.0.0.0 \
    -k password \
    -m encryption_method
```

**配置参数说明：**
- `server_ip`: 代理服务器IP地址
- `server_port`: 代理服务器端口
- `local_port`: 本地监听端口（默认1080）
- `password`: 代理密码
- `encryption_method`: 加密方式（如aes-256-gcm）

**配置文件示例：**

```json
{
    "server":"your_server_ip",
    "server_port":8388,
    "local_port":1080,
    "password":"your_password",
    "timeout":60,
    "method":"aes-256-gcm",
    "fast_open":true
}
```

## 实战代码实现

### 完整代码

```golang
package main

import (
	"fmt"
	"log"
	"strconv"

	colly "github.com/gocolly/colly/v2"
	"github.com/gocolly/colly/v2/proxy"
	excelize "github.com/xuri/excelize/v2"
)

// GG 定义数字货币数据结构
type GG struct {
	_url       string
	_name      string
	_now_price string
}

func main() {
	num := 0
	f := excelize.NewFile()

	// 创建默认收集器
	c := colly.NewCollector()

	// 设置SOCKS5代理轮询
	rp, err := proxy.RoundRobinProxySwitcher(
		"socks5://127.0.0.1:12999",
		"socks5://127.0.0.1:12999",
	)
	if err != nil {
		log.Fatal(err)
	}

	// 设置代理函数
	c.SetProxyFunc(rp)

	// OnRequest: 请求前设置请求头
	c.OnRequest(func(r *colly.Request) {
		r.Headers.Set("Authority", "coinmarketcap.com")
		r.Headers.Set("Cache-Control", "max-age=0")
		r.Headers.Set("Sec-Ch-Ua", "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Microsoft Edge\";v=\"99\"")
		r.Headers.Set("Sec-Ch-Ua-Mobile", "?0")
		r.Headers.Set("Sec-Ch-Ua-Platform", "\"Windows\"")
		r.Headers.Set("Upgrade-Insecure-Requests", "1")
		r.Headers.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36 Edg/99.0.1150.39")
		r.Headers.Set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9")
		r.Headers.Set("Sec-Fetch-Site", "same-origin")
		r.Headers.Set("Sec-Fetch-Mode", "navigate")
		r.Headers.Set("Sec-Fetch-User", "?2")
		r.Headers.Set("Sec-Fetch-Dest", "document")
		r.Headers.Set("Referer", "https://coinmarketcap.com/all/views/all/")
		r.Headers.Set("Accept-Language", "zh-TW,zh-HK;q=0.9,zh;q=0.8,en;q=0.7,zh-CN;q=0.6,en-GB;q=0.5,en-US;q=0.4")
	})

	// OnResponse: 响应后处理
	c.OnResponse(func(r *colly.Response) {
		fmt.Printf("响应状态: %d\n", r.StatusCode)
	})

	// OnHTML: HTML解析
	c.OnHTML(".cmc-table__table-wrapper-outer tbody tr", func(e *colly.HTMLElement) {
		DOGE := GG{}

		// 提取货币名称
		if len(e.ChildText("td[class='name-cell']")) == 0 {
			DOGE._url = "https://coinmarketcap.com" + e.ChildAttr("a[class='cmc-link']", "href")
			DOGE._name = e.ChildText("a[class='cmc-table__column-name--name cmc-link']")
		} else {
			DOGE._url = "https://coinmarketcap.com" + e.ChildAttr("a[class='cmc-link']", "href")
			DOGE._name = e.ChildText("td[class='name-cell']")
		}

		// 创建子收集器获取价格
		c_coin := colly.NewCollector()
		c_coin.SetProxyFunc(rp)
		c_coin.OnRequest(func(r *colly.Request) {
			r.Headers.Set("Authority", "coinmarketcap.com")
			r.Headers.Set("Cache-Control", "max-age=0")
			r.Headers.Set("Sec-Ch-Ua", "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Microsoft Edge\";v=\"99\"")
			r.Headers.Set("Sec-Ch-Ua-Mobile", "?0")
			r.Headers.Set("Sec-Ch-Ua-Platform", "\"Windows\"")
			r.Headers.Set("Upgrade-Insecure-Requests", "1")
			r.Headers.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36 Edg/99.0.1150.39")
			r.Headers.Set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9")
			r.Headers.Set("Sec-Fetch-Site", "same-origin")
			r.Headers.Set("Sec-Fetch-Mode", "navigate")
			r.Headers.Set("Sec-Fetch-User", "?2")
			r.Headers.Set("Sec-Fetch-Dest", "document")
			r.Headers.Set("Referer", "https://coinmarketcap.com/all/views/all/")
			r.Headers.Set("Accept-Language", "zh-TW,zh-HK;q=0.9,zh;q=0.8,en;q=0.7,zh-CN;q=0.6,en-GB;q=0.5,en-US;q=0.4")
		})
		c_coin.OnResponse(func(r *colly.Response) {
		})
		c_coin.OnHTML("div[class='priceValue ']", func(r *colly.HTMLElement) {
			DOGE._now_price = string(r.Text)
		})
		c_coin.Visit(DOGE._url)

		// 输出到控制台
		fmt.Print(DOGE._name, "     ")
		fmt.Print(DOGE._now_price, "     ")
		fmt.Println(DOGE._url)

		// 导出到Excel
		A_num := "A" + strconv.Itoa(num)
		B_price := "B" + strconv.Itoa(num)
		C_url := "C" + strconv.Itoa(num)

		f.SetCellValue("Sheet1", A_num, DOGE._name)
		f.SetCellValue("Sheet1", B_price, DOGE._now_price)
		f.SetCellValue("Sheet1", C_url, DOGE._url)

		if err := f.SaveAs("Coin_price.xlsx"); err != nil {
			fmt.Println(err)
		}
		num += 1
	})

	// 访问目标网站
	c.Visit("https://coinmarketcap.com/all/views/all/")
}
```

### 代码解析

#### 1. 数据结构定义

```go
type GG struct {
	_url       string  // 货币详情页URL
	_name      string  // 货币名称
	_now_price string  // 当前价格
}
```

**设计思路：**
- 使用结构体封装货币数据
- 便于数据管理和传递
- 支持后续扩展更多字段

#### 2. 主函数流程

```go
func main() {
    num := 0              // 行号计数器
    f := excelize.NewFile() // 创建Excel文件

    // 1. 创建收集器
    c := colly.NewCollector()

    // 2. 设置代理
    rp, _ := proxy.RoundRobinProxySwitcher("socks5://127.0.0.1:12999")
    c.SetProxyFunc(rp)

    // 3. 设置回调函数
    c.OnRequest(...)
    c.OnHTML(...)

    // 4. 发起请求
    c.Visit("https://coinmarketcap.com/all/views/all/")
}
```

#### 3. 代理轮询机制

```go
// 多个代理地址轮换使用
rp, err := proxy.RoundRobinProxySwitcher(
    "socks5://127.0.0.1:12999",
    "socks5://127.0.0.1:12999",
)
```

**优势：**
- 避免单一IP被封
- 提高爬取成功率
- 分散网络请求压力

#### 4. 请求头伪装

```go
r.Headers.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...")
r.Headers.Set("Accept", "text/html,application/xhtml+xml,...")
r.Headers.Set("Sec-Fetch-Site", "same-origin")
```

**目的：**
- 模拟真实浏览器行为
- 避免被反爬虫系统检测
- 提高请求成功率

#### 5. 数据提取

```go
c.OnHTML(".cmc-table__table-wrapper-outer tbody tr", func(e *colly.HTMLElement) {
    // 提取货币名称
    DOGE._name = e.ChildText("td[class='name-cell']")

    // 提取详情页链接
    DOGE._url = "https://coinmarketcap.com" +
                e.ChildAttr("a[class='cmc-link']", "href")
})
```

**选择器说明：**
- `.cmc-table__table-wrapper-outer tbody tr`: 表格行选择器
- `td[class='name-cell']`: 货币名称单元格
- `a[class='cmc-link']`: 货币详情链接

#### 6. 嵌套爬取

```go
// 创建子收集器获取价格
c_coin := colly.NewCollector()
c_coin.OnHTML("div[class='priceValue ']", func(r *colly.HTMLElement) {
    DOGE._now_price = string(r.Text)
})
c_coin.Visit(DOGE._url)
```

**设计思路：**
- 主页面获取货币列表
- 详情页获取精确价格
- 嵌套爬取获取完整数据

### 运行结果

运行程序后，控制台输出示例：

```
Bitcoin     $43,256.78     https://coinmarketcap.com/currencies/bitcoin/
Ethereum     $2,567.89     https://coinmarketcap.com/currencies/ethereum/
Binance Coin     $312.45     https://coinmarketcap.com/currencies/bnb/
...
```

同时会在项目目录下生成 `Coin_price.xlsx` 文件，包含三列：
- A列：货币名称
- B列：当前价格
- C列：详情页URL

## 数据处理与存储

### Excel导出

```go
import excelize "github.com/xuri/excelize/v2"

// 创建Excel文件
f := excelize.NewFile()

// 设置单元格值
f.SetCellValue("Sheet1", "A1", "货币名称")
f.SetCellValue("Sheet1", "B1", "价格")
f.SetCellValue("Sheet1", "C1", "URL")

// 保存文件
if err := f.SaveAs("Coin_price.xlsx"); err != nil {
    fmt.Println(err)
}
```

**Excelize库特性：**
- 支持.xlsx格式
- 读写Excel文件
- 设置单元格样式
- 支持公式计算
- 创建图表

### 数据格式化

```go
// 格式化价格数据
func formatPrice(price string) string {
    // 移除$符号和空格
    price = strings.ReplaceAll(price, "$", "")
    price = strings.ReplaceAll(price, " ", "")

    // 添加千分位分隔符
    if num, err := strconv.ParseFloat(price, 64); err == nil {
        return fmt.Sprintf("%.2f", num)
    }
    return price
}

// 清理货币名称
func cleanName(name string) string {
    // 移除多余空格
    name = strings.TrimSpace(name)
    return name
}
```

**进阶处理：**
- 数据清洗和验证
- 价格格式标准化
- 异常值检测
- 数据去重

## 进阶优化

### 代理轮询

```go
// 多个代理地址池
proxyList := []string{
    "socks5://proxy1:1080",
    "socks5://proxy2:1080",
    "socks5://proxy3:1080",
}

rp, _ := proxy.RoundRobinProxySwitcher(proxyList...)
```

**最佳实践：**
- 准备多个代理IP
- 定期更换代理
- 监控代理可用性
- 设置代理超时时间

### 请求频率控制

```go
// 设置请求间隔
c.Limit(&colly.LimitRule{
    DomainGlob: "*",
    Parallelism: 2,  // 并发数
    Delay: 1,        // 请求间隔（秒）
})

// 随机延迟
c.Limit(&colly.LimitRule{
    DomainGlob: "*",
    Parallelism: 1,
    RandomDelay: 5 * time.Second,  // 随机延迟0-5秒
})
```

**频率控制策略：**
- 设置合理的并发数
- 添加随机延迟
- 遵守robots.txt
- 避免对服务器造成压力

### 错误处理

```go
// 错误重试机制
c.OnError(func(r *colly.Response, err error) {
    fmt.Printf("错误: %v\n", err)

    // 记录错误日志
    log.Printf("请求失败: %s, 错误: %v", r.Request.URL, err)

    // 重试机制（最多3次）
    if r.Request.Ctx.GetInt("retry") < 3 {
        time.Sleep(5 * time.Second)
        r.Request.Ctx.Set("retry", r.Request.Ctx.GetInt("retry")+1)
        r.Request.Retry()
    }
})

// 状态码处理
c.OnResponse(func(r *colly.Response) {
    switch r.StatusCode {
    case 403:
        fmt.Println("禁止访问，可能需要更换代理")
    case 404:
        fmt.Println("页面不存在")
    case 500:
        fmt.Println("服务器内部错误")
    }
})
```

## 常见问题与解决方案

### 1. 代理连接失败

**问题：**无法连接到代理服务器

**解决方案：**
```bash
# 检查代理服务状态
ps aux | grep shadowsocks

# 测试代理连通性
curl --socks5 127.0.0.1:12999 http://httpbin.org/ip
```

### 2. 请求被拒绝

**问题：**返回403 Forbidden错误

**解决方案：**
- 更换代理IP
- 调整User-Agent
- 增加请求间隔
- 使用Cookie会话

### 3. 数据提取失败

**问题：**选择器无法找到元素

**解决方案：**
- 检查网页结构是否变化
- 使用浏览器开发者工具验证选择器
- 等待JavaScript渲染完成
- 尝试不同的选择器策略

### 4. 程序崩溃

**问题：**运行时panic

**解决方案：**
```go
// 添加错误恢复
defer func() {
    if r := recover(); r != nil {
        fmt.Println("程序异常:", r)
    }
}()

// 验证数据有效性
if name == "" {
    return  // 跳过无效数据
}
```

### 5. 内存占用过高

**问题：**长时间运行后内存持续增长

**解决方案：**
```go
// 定期清理收集器
c := colly.NewCollector(
    colly.CacheDir("./cache"),
)

// 限制缓存大小
c.SetStorage(&sqlstorage.SqliteStorage{
    Db: "cache.db",
})
```

## 总结与展望

### 本文要点

1. **Colly框架优势**：高性能、简洁API、自动处理Cookie
2. **量化数据采集**：为量化交易提供实时数据支持
3. **网络代理配置**：解决国内访问限制问题
4. **实战代码实现**：完整的CoinMarketCap爬虫示例
5. **数据处理存储**：Excel导出和数据格式化

### 进阶方向

1. **数据库存储**
   - 使用MySQL/PostgreSQL存储历史数据
   - 实现数据持久化和查询
   - 构建时间序列数据库

2. **实时数据流**
   - 结合WebSocket获取实时价格
   - 实现数据推送和订阅
   - 构建实时监控系统

3. **数据分析**
   - 价格趋势分析
   - 技术指标计算
   - 市场情绪分析

4. **自动化交易**
   - 结合交易API实现自动下单
   - 风险管理机制
   - 策略回测系统

### 法律与伦理提醒

- ✅ 遵守网站robots.txt规则
- ✅ 合理控制请求频率
- ✅ 不用于商业用途的恶意爬取
- ✅ 尊重数据版权和隐私
- ⚠️ 仅用于学习和研究目的

**免责声明：**本教程仅供学习交流使用，使用者应遵守相关法律法规和网站使用条款，作者不承担任何责任。

---

## 相关资源

- [Colly官方文档](https://go-colly.org/)
- [Go语言官方文档](https://golang.org/doc/)
- [CoinMarketCap官网](https://coinmarketcap.com/)
- [Excelize库文档](https://xuri.me/excelize/)
- [Go爬虫实战指南](https://github.com/gocolly/colly/tree/master/examples)

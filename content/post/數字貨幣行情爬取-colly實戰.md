---
title: "數字貨幣行情爬取 Colly實戰"
date: 2022-03-17T12:44:48+08:00
draft: true

tags: ["Golang","Spider","Colly"]
categories: ["爬虫","實戰","數字貨幣"]
author: "w0x7ce"




---

## Colly & coinmarket

### Colly 是什么，什么要用它，怎样利用它进行量化相关的应用

colly 是用Go 语言编写的功能强大的爬虫框架。 它提供简洁的API，拥有强劲的性能，可以自动处理cookie&session，还有提供灵活的扩展机制

Colly 本身不能做量化 但是 Colly可以更高效的帮助我们采集数据，为我们提供量化的弹药

## Colly的使用

### Colly的执行顺序

colly函式作用順序(Call order of callbacks)

1. OnRequest
   在发起请求前 可以进行Header相关的设定
2. OnError
   如果请求时候出现错误 在这里捕获它
3. OnResponseHeaders
   收到响应标头时候 我们需要做的东西写在这里
4. OnResponse
   收到响应回复的时候 我们要做的事情 写在这里
5. OnHTML
   收到相应为HTML格式时候（晚于OnResponse），进行goquerySelector篩選
6. OnXML
   收到相应为XML格式时候（晚于OnHTML），进行xpathQuery筛选
7. OnScraped
   抓取网页（类似于OnResponse），但在最后才进行调用

### Colly 的安装

    ```bash
    # 安装Golang
    wget "https://go.dev/dl/go1.18.linux-amd64.tar.gz"
    rm -rf /usr/local/go && tar -C /usr/local -xzf go1.18.linux-amd64.tar.gz
    export PATH=$PATH:/usr/local/go/bin
    go version
    ```

    ```bash
    # 启用 Go Modules 功能
    go env -w GO111MODULE=on
    # 1. 七牛 CDN
    go env -w  GOPROXY=https://goproxy.cn,direct
    # 2. 阿里云
    go env -w GOPROXY=https://mirrors.aliyun.com/goproxy/,direct
    # 3. 官方
    go env -w  GOPROXY=https://goproxy.io,direct
    ```

    ```bash
    mkdir Crawl && pushd Crawl
    go mod init
    go get -u github.com/gocolly/colly/v2
    go mod tidy
    ```

### 网络环境的配置

    因为在国内 无法直接连接上数字货币的网站 所以 我们需要配置代理, 我们的本地代理为 socks5:/127.0.0.1:12999

    如果没有搭建 可以 尝试在服务器上用snap 安装 shadowsocks

    ```bash
    sudo apt-get update && sudo apt-get upgrade -y
    sudo apt install snapd
    sudo snap install shadowsocks-libev
    sudo snap run shadowsocks-libev.ss-local -s server_ip -p server_port -l local_port -b 0.0.0.0 -k passwd -m method
    ```

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

        type GG struct {
            _url       string
            _name      string
            _now_price string
        }

        func main() {

            num := 0
            f := excelize.NewFile()

            // Instantiate default collector
            c := colly.NewCollector()
            // Rotate two socks5 proxies
            rp, err := proxy.RoundRobinProxySwitcher("socks5://127.0.0.1:12999", "socks5://127.0.0.1:12999")
            if err != nil {
                log.Fatal(err)
            }
            // 【设置代理IP】 ，这里使用的是轮询ip方式
            c.SetProxyFunc(rp)

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

            c.OnResponse(func(r *colly.Response) { 
                
            })

            c.OnHTML(".cmc-table__table-wrapper-outer tbody tr", func(e *colly.HTMLElement) {
            
                DOGE := GG{}
                if len(e.ChildText("td[class='name-cell']")) == 0 {
                    DOGE._url = "https://coinmarketcap.com" + e.ChildAttr("a[class='cmc-link']", "href")
                    DOGE._name = e.ChildText("a[class='cmc-table__column-name--name cmc-link']")
                } else {
                    DOGE._url = "https://coinmarketcap.com" + e.ChildAttr("a[class='cmc-link']", "href")
                    DOGE._name = e.ChildText("td[class='name-cell']")
                }

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

                fmt.Print(DOGE._name, "     ")
                fmt.Print(DOGE._now_price, "     ")
                fmt.Println(DOGE._url)

                var A_num string = "A" + strconv.Itoa(num)
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

            c.Visit("https://coinmarketcap.com/all/views/all/")
            
        }
    ```

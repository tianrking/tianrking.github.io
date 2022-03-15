---
title: "爬蟲框架 Colly"
date: 2022-03-15T21:17:31+08:00
draft: false

tags: ["Golang","Spider","Colly"]
categories: ["爬虫"]
author: "w0x7ce"

---

## 安裝 colly

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
go get -u github.com/gocolly/colly/v2
```

## Colly OnResponse

    ```Golang

    package main

    import (
        "fmt"
        "strings"
        "github.com/gocolly/colly"
    )

    var count int = 0

    func main() {
        c := colly.NewCollector() // 在colly中使用 Collector 這類物件 來做事情

        c.OnResponse(func(r *colly.Response) { // 當Visit訪問網頁後，網頁響應(Response)時候執行的事情
            // fmt.Println(string(r.Body)) // 返回的Response物件r.Body 是[]Byte格式，要再轉成字串
        })

        c.OnRequest(func(r *colly.Request) { // 需要寫這一段 User-Agent 降低被ban 可能性
            r.Headers.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36")
        })

        // 當Visit訪問網頁後，在網頁響應(Response)之後、發現這是HTML格式 執行的事情
        // F12 OnHTML 支持 class
        c.OnHTML(".qa-list__title-link", func(e *colly.HTMLElement) { // 每找到一個符合 goquerySelector字樣的結果，便會進這個OnHTML一次
            e.Text = strings.TrimSpace(e.Text)
            fmt.Println(e.Text)
            count++
        })

        c.Visit("https://ithelp.ithome.com.tw/users/20125192/ironman/3155") // Visit 要放最後
    }

    ```

## c.OnHTML

```html
<title>...</title>
<meta name="..." content="...">
<h3 class="qa-list__title qa-list__title--ironman">Go繁不及備載<span> 系列</span></h3>
<a href="/users/20125192" id="account" data-account="gjlmotea">我的主頁</a>
```

1. Tag 標籤

    ```Golang
    c.OnHTML("title", func(e *colly.HTMLElement) {
        fmt.Println(e.Text)
    })
    ```

2. Attr 屬性

    ```Golang
    c.OnHTML("meta[name]", func(e *colly.HTMLElement) {
        fmt.Println(e)
    })
    ```

3. AttrVal 屬性值

    name="description"這串屬性的content

    ```Goalng
    c.OnHTML("meta[name='description']", func(e *colly.HTMLElement) {
        fmt.Println(e.Attr("content")) // 抓此Tag中的name屬性 來找出此Tag，再印此Tag中的content屬性
    })
    ```

4. CSS Class 名稱

    ```Golang
    c.OnHTML(".qa-list__title-link", func(e *colly.HTMLElement) { // 每找到一個符合 goquerySelector字樣的結果，便會進這個OnHTML一次
            fmt.Println(e.Text)
        })

    ```

5. CSS ID 唯一識別

    以 CSS來抓該 id底下的字

    ```Golang
    c.OnHTML("#read_more", func(e *colly.HTMLElement) {
        fmt.Println(e.Text)
    })
    ```

## 執行順序

colly函式作用順序(Call order of callbacks)

1. OnRequest
    在發起請求之前，可以預先對Header的參數進行設定

2. OnError
如果在請求的時候發生錯誤

3. OnResponseHeaders
收到響應的標頭時

4. OnResponse
收到響應回復的時候

5. OnHTML
收到的響應是HTML格式時（時間點比 OnResponse還晚），進行goquerySelector篩選

6. OnXML
收到的響應是XML格式時（時間點比 OnHTML還晚），進行xpathQuery篩選

7. OnScraped
抓取網頁（與OnResponse相仿），但在最後才進行調用
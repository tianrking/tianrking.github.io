---
title: "Ab压力测试"
date: 2022-03-15T08:44:16+08:00
draft: false

tags: ["Linux","ab","test"]
categories: ["压力测试","DevOps"]
author: "w0x7ce"

---

## ab install

```bash
sudo apt-get install apache2-utils
```

## ab 参数

```bash
-A auth-username:password
为服务器提供BASIC身份验证凭据。用户名和密码由一个单独分隔，:并通过wire base64编码发送。无论服务器是否需要它，都会发送该字符串（即，已发送401认证）。
-b windowsize
TCP发送/接收缓冲区的大小，以字节为单位。
-B local-address
在进行传出连接时绑定的地址。
-c concurrency
一次执行多个请求的数量。默认值是一次一个请求。
-C cookie-name=value
Cookie:在请求中添加一行。论证通常是一 对的形式。该字段是可重复的。name=value
-d
不显示“XX [ms]表中提供的百分比”。（遗产支持）。
-e csv-file
写一个逗号分隔值（CSV）文件，其中包含为每个百分比（从1％到100％）提供服务该百分比请求所用的时间（以毫秒为单位）。这通常比'gnuplot'文件更有用; 因为结果已经“装箱”了。
-f protocol
指定SSL / TLS协议（SSL2，SSL3，TLS1，TLS1.1，TLS1.2或ALL）。2.4.4及更高版本中提供了TLS1.1和TLS1.2支持。
-g gnuplot-file
将所有测量值写为'gnuplot'或TSV（Tab单独值）文件。这个文件可以很容易地导入到Gnuplot，IDL，Mathematica，Igor甚至Excel等软件包中。标签位于文件的第一行。
-h
显示使用信息。
-H custom-header
在请求中附加额外的标头。该参数是典型地在一个有效报头线的形式，含有一个冒号分隔的字段值对（即，"Accept-Encoding: zip/zop;8bit"）。
-i
做HEAD请求而不是GET。
-k
启用HTTP KeepAlive功能，即在一个HTTP会话中执行多个请求。默认值是没有KeepAlive。
-l
如果响应的长度不恒定，请不要报告错误。这对动态页面很有用。适用于2.4.7及更高版本。
-m HTTP-method
请求的自定义HTTP方法。适用于2.4.10及更高版本。
-n requests
为基准测试会话执行的请求数。默认情况下只执行单个请求，这通常会导致非代表性的基准测试结果。
-p POST-file
包含POST数据的文件。记得还要设置-T。
-P proxy-auth-username:password
将BASIC身份验证凭据提供给代理路由。用户名和密码由一个单独分隔，:并通过wire base64编码发送。无论代理是否需要它，都会发送该字符串（即，已发送407代理身份验证）。
-q
处理超过150个请求时，每10％或100个请求左右ab输出进度计数stderr。该 -q标志将禁止这些消息。
-r
不要退出套接字接收错误。
-s timeout
套接字超时前等待的最大秒数。默认值为30秒。适用于2.4.4及更高版本。
-S
当平均值和中位数分别超过标准差的一倍或两倍时，不显示中值和标准差值，也不显示警告/错误消息。默认为min / avg / max值。（遗产支持）。
-t timelimit
用于基准测试的最大秒数。这意味着 -n 50000内部。使用此选项可在固定的总时间内对服务器进行基准测试。默认情况下没有时间限制。
-T content-type
用于POST / PUT数据的内容类型标头，例如。 application/x-www-form-urlencoded。默认是text/plain。
-u PUT-file
包含数据到PUT的文件。记得还要设置-T。
-v verbosity
设置详细级别 - 4以及上面打印标题信息，3上面打印响应代码（404,200等）， 2以及上面打印警告和信息。
-V
显示版本号并退出。
-w
在HTML表格中打印结果。默认表格为两列宽，背景为白色。
-x <table>-attributes
用作...的属性的字符串<table>。插入属性。<table here >
-X proxy[:port]
使用代理服务器来处理请求。
-y <tr>-attributes
用作...的属性的字符串<tr>。
-z <td>-attributes
用作...的属性的字符串<td>。
-Z ciphersuite
指定SSL / TLS密码套件（请参阅openssl密码）
```

### 常用参数

```txt
-t timelimit  测试时间限制，单位秒
-s timeout    每个请求时间限制，单位秒
-v verbosity  日志输出级别，可以选择1, 2等，调试使用
-T content-type  POST/PUT接口的content-type
-p postfile      POST请求发送的数据文件
```

## ab demo

```bash
ab -c 10 -n 100 -r -s 200 http://127.0.0.1:1080/
```

### 测试POST请求

1. 以x-www-form-urlencoded形式发送

    ```bash
    ab -n 1000 -c 100 -p post.txt -T 'application/x-www-form-urlencoded' http://www.test.com/test/api
    ```

    假定需要发送的json数据为 {name : “hello,world”}。
    post.txt文件内容：

    ```txt
    name=hello,world
    ```

2. 以multipart/form-data形式发送

    ```bash
    ab -n 1000 -c 100 -p post.txt -T 'multipart/form-data; boundary=--WebKitFormBoundaryE19zNvXGzXaLvS5C' http://www.test.com/test/api
    ```

    post.txt文件内容如下：

    ```post.txt
    ----WebKitFormBoundaryE19zNvXGzXaLvS5C
    Content-Disposition: form-data; name="name"

    hello,world
    ----WebKitFormBoundaryE19zNvXGzXaLvS5C
    ```

- POST的文件内容可以通过postman测试接口来查看。
- 性能测试得到的最重要的指标就是QPS(Requests per second)，反映了接口的并发承受能力，也就是系统的峰值性能。如果对接口的调用超过了这一限制，就要考虑提升硬件或者做一些优化了。

## 参考文档：

1. ab参数介绍：<http://httpd.apache.org/docs/2.4/programs/ab.html>
2. 使用ab命令发送一个post请求：<http://stackoverflow.com/questions/29731023/make-a-post-request-using-ab-apache-benchmarking-on-a-django-server>
3. 同上：<http://stackoverflow.com/questions/20220270/posting-multipart-form-data-with-apache-bench-ab>
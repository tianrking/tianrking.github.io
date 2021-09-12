---

title: "常用Linux命令(一)"
date: 2021-09-12T15:33:23+08:00
draft: false

tags: ["Linux"]
categories: ["系统"]
author: "w0x7ce"

---

# Shell echo命令

## 1.显示普通字符串:
echo "It is a test"
这里的双引号完全可以省略，以下命令与上面实例效果一致：

echo It is a test
## 2.显示转义字符
echo "\"It is a test\""
结果将是:

"It is a test"
同样，双引号也可以省略

## 3.显示变量
read 命令从标准输入中读取一行,并把输入行的每个字段的值指定给 shell 变量

#!/bin/sh
read name 
echo "$name It is a test"
以上代码保存为 test.sh，name 接收标准输入的变量，结果将是:

[root@www ~]# sh test.sh
OK                     #标准输入
OK It is a test        #输出
## 4.显示换行
echo -e "OK! \n" # -e 开启转义
echo "It is a test"
输出结果：

OK!

It is a test
## 5.显示不换行
#!/bin/sh
echo -e "OK! \c" # -e 开启转义 \c 不换行
echo "It is a test"
输出结果：

OK! It is a test
## 6.显示结果定向至文件
echo "It is a test" > myfile
## 7.原样输出字符串，不进行转义或取变量(用单引号)
echo '$name\"'
输出结果：

$name\"
## 8.显示命令执行结果
echo `date`
注意： 这里使用的是反引号 `, 而不是单引号 '。

结果将显示当前日期

Thu Jul 24 10:08:46 CST 2014


## -e 控制字符参数

控制字元	作 用

```bash
\\	輸出\本身
\a	輸出警告音
\b	退格鍵， 刪除左邊一個字元
\c	取消輸出行末的換行符。和“-n”選項一致
\e	Esc鍵
\f	換頁符
\n	換行符
\r	回車鍵
\t	製表符，也就是Tab鍵
\v	垂直製表符
\0nnn	按照八進位制 ASCII 碼錶輸出字元。其中 0 為數字 0，nnn 是三位八進位制數
\xhh	按照十六進位制 ASCH 碼錶輸出字元。其中 hh 是兩位十六進位制數
```
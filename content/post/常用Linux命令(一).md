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


# Linux wc命令

Linux wc命令用于计算字数。

利用wc指令我们可以计算文件的Byte数、字数、或是列数，若不指定文件名称、或是所给予的文件名为"-"，则wc指令会从标准输入设备读取数据。

- 语法
```
wc [-clw][--help][--version][文件...]
参数：

-c或--bytes或--chars 只显示Bytes数。
-l或--lines 显示行数。
-w或--words 只显示字数。
--help 在线帮助。
--version 显示版本信息。
```

在默认的情况下，wc将计算指定文件的行数、字数，以及字节数。使用的命令为：
```
wc testfile 
```
先查看testfile文件的内容，可以看到：
```
$ cat testfile
```
```  
Linux networks are becoming more and more common, but scurity is often an overlooked  
issue. Unfortunately, in today’s environment all networks are potential hacker targets,  
fro0m tp-secret military research networks to small home LANs.  
Linux Network Securty focuses on securing Linux in a networked environment, where the  
security of the entire network needs to be considered rather than just isolated machines.  
It uses a mix of theory and practicl techniques to teach administrators how to install and  
use security applications, as well as how the applcations work and why they are necesary. 
```
使用 wc统计，结果如下：
```
$ wc testfile           # testfile文件的统计信息  
3 92 598 testfile       # testfile文件的行数为3、单词数92、字节数598 
```
其中，3 个数字分别表示testfile文件的行数、单词数，以及该文件的字节数。

如果想同时统计多个文件的信息，例如同时统计testfile、testfile_1、testfile_2，可使用如下命令：
```
wc testfile testfile_1 testfile_2   #统计三个文件的信息 
```
输出结果如下：
```
$ wc testfile testfile_1 testfile_2  #统计三个文件的信息  
```
```
3 92 598 testfile                    #第一个文件行数为3、单词数92、字节数598  
9 18 78 testfile_1                   #第二个文件的行数为9、单词数18、字节数78  
3 6 32 testfile_2                    #第三个文件的行数为3、单词数6、字节数32  
15 116 708 总用量                    #三个文件总共的行数为15、单词数116、字节数708 
```
---
title: "QT5模板庫(一)"
date: 2022-04-22T09:50:00+08:00
draft: false

tags: ["C++","QT","Gui"]
categories: ["圖形化開發"]
author: "w0x7ce"
---

## 字符串類

### 操作字符串

basic

```C++
QString str1 = "a";
QString str2 = "b";
QString str = str1 + str2;
```

append

```C++
QString str1 = "Welcome";
QString str2 = "to";
str1.append(str2);
str1.append(" you! ");
```

sprintf

```C++
Qstring str;
str.sprintf("%s", "Welcome");
str.sprintf("%s %s", "Welcome","to you");
```

%n

```C++
QString str;
str=QString("%1 was born in %2.").arg("Bob").arg(1998);
```

others

```C++
insert() 特定位置插入字符串
prepend() 開頭插入字符串
replace() 指定字符串代替原字符串
QString::trimmed() 移除字符串兩端的空白字符
QString::simplified() 一處字符串兩端空白字符 使用單個空格字符代替
```

### 查詢字符串

QString::startsWith()
QString::endsWith()

```C++
QString  str = "Aa Bb Cc";
str.startsWith("Aa",Qt::CaseSensitive); //true
str.startsWith("Bb",Qt::CaseSensitive); //false
```

QString::contains()

```C++
QString  str = "Aa Bb Cc";
str.startsWith("Bb",Qt::CaseSensitive); //true
```

operator<(const QString &)

operator<=(const QString &)

...

### 字符串轉換

QString::toInt();
QString::toDouble();
QString::toFloat();
QString::toLong();
QString::toLongLong();

```C++
QString str = "125";
bool ok;
int hex = str.toInt(&ok,16); // ok = True, hex = 293
int dec = str.toInt(&ok,10); // ok = True, dec=125

```

toAscii()

toLatin1()

toUtf8()

toLocal8Bit()

isNull()

isEmpty()

## 容器類

||||||
|---|----|----|----|----|
|容器類|查找|插入|頭部添加|尾部添加|
QList()|O(1) |O(n)|Amort.O(1)|Amort.O(1)
QLinkedList()|O(n)|O(1)|O(1)|O(1)
QVector()|O(1)|O(n)|O(n)|Amort.O(1)

```C++
#include <QDebug>
int main(){
    QList<QString> list;
    {
        QString str("abc");
        list<<str;
    }
    qDebug()<<list[0]<<"What";
    return 0;
}
```

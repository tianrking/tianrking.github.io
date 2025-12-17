---
legacy: true
id: qt5-standard-library-guide
title: Qt5 标准库完全指南
sidebar_label: Qt5 标准库指南
description: 详细介绍 Qt5 标准库的使用，包括字符串、容器、算法、I/O 操作等核心类和最佳实践
date: 2022-04-22T09:50:00+08:00
tags: [Qt5, C++, GUI开发, Qt库, 标准库]
authors: [w0x7ce]
---

# Qt5 标准库完全指南

Qt5 标准库提供了丰富的 C++ 类和工具，是 Qt 框架的核心组成部分。本指南将详细介绍 Qt5 标准库的主要组件和使用方法。

## 字符串类（QString）

QString 是 Qt 中最重要的类之一，用于处理 Unicode 字符串。

### 基本操作

```cpp
// 创建字符串
QString str1 = "Hello";
QString str2 = "World";
QString str3 = str1 + " " + str2;  // 字符串连接

// 格式化字符串
QString str;
str.sprintf("%s %d", "Count:", 42);
qDebug() << str;  // 输出: "Count: 42"

// 使用 arg 方法（推荐）
QString result = QString("%1 was born in %2.").arg("Bob").arg(1998);
qDebug() << result;  // 输出: "Bob was born in 1998."
```

### 字符串修改

```cpp
QString str = "Welcome";

// 追加字符串
str.append(" to Qt");
qDebug() << str;  // 输出: "Welcome to Qt"

// 在开头插入
str.prepend("Hello, ");
qDebug() << str;  // 输出: "Hello, Welcome to Qt"

// 在指定位置插入
str.insert(7, "Beautiful ");
qDebug() << str;  // 输出: "Hello, Beautiful Welcome to Qt"

// 替换字符串
str.replace("Hello", "Hi");
qDebug() << str;  // 输出: "Hi, Beautiful Welcome to Qt"

// 移除空白字符
QString messy = "  Hello   World  ";
QString trimmed = QString::trimmed(messy);  // "Hello   World"
QString simplified = QString::simplified(messy);  // "Hello World"
```

### 字符串查询

```cpp
QString str = "Aa Bb Cc";

// 检查是否以指定字符串开头/结尾
bool startsWith = str.startsWith("Aa", Qt::CaseSensitive);  // true
bool endsWith = str.endsWith("Cc", Qt::CaseSensitive);  // true

// 检查是否包含指定字符串
bool contains = str.contains("Bb", Qt::CaseSensitive);  // true

// 字符串比较
QString str1 = "apple";
QString str2 = "Apple";
bool isEqual = (str1 == str2);  // false
bool isLess = (str1 < str2);  // true (小写字母 > 大写字母)

// 字符串长度
int length = str.length();
int size = str.size();  // 与 length 相同
```

### 字符串转换

```cpp
QString str = "123";

// 转换为数值
bool ok;
int decimal = str.toInt(&ok, 10);  // ok = true, decimal = 123
int hexadecimal = str.toInt(&ok, 16);  // ok = true, hexadecimal = 291

// 转换为浮点数
QString floatStr = "3.14";
double d = floatStr.toDouble();  // 3.14

// 数值转字符串
int num = 42;
QString numStr = QString::number(num);  // "42"
QString hexStr = QString::number(num, 16);  // "2a"

// 编码转换
QByteArray asciiData = str.toAscii();
QByteArray latin1Data = str.toLatin1();
QByteArray utf8Data = str.toUtf8();
QByteArray local8Bit = str.toLocal8Bit();

// 检查字符串状态
QString emptyStr = "";
QString nullStr;

bool isEmpty = emptyStr.isEmpty();  // true
bool isNull = nullStr.isNull();  // true
```

### 正则表达式

```cpp
#include <QRegExp>
#include <QRegularExpression>

// 使用 QRegExp（Qt5）
QRegExp rx("(\\d+)");
int pos = rx.indexIn("Item 123, price 456");
if (pos >= 0) {
    QString matched = rx.cap(1);  // "123"
}

// 使用 QRegularExpression（Qt5.1+，推荐）
QRegularExpression re("(\\d+)");
QRegularExpressionMatch match = re.match("Item 123, price 456");
if (match.hasMatch()) {
    QString matched = match.captured(1);  // "123"
}

// 全局匹配
QString text = "There are 5 apples and 10 oranges.";
QRegularExpression re("\\d+");
QRegularExpressionMatchIterator it = re.globalMatch(text);
while (it.hasNext()) {
    QRegularExpressionMatch m = it.next();
    qDebug() << m.captured();  // 输出 "5", "10"
}
```

## 容器类

Qt 提供了多种容器类，每种适用于不同的场景。

### QList - 动态数组

```cpp
#include <QList>
#include <QDebug>

QList<QString> list;

// 添加元素
list << "One" << "Two" << "Three";
list.append("Four");
list.prepend("Zero");

// 访问元素
QString first = list.first();  // "Zero"
QString last = list.last();   // "Four"
QString item = list[1];       // "One"
QString item2 = list.at(2);   // "Two"

// 修改元素
list[0] = "NewZero";

// 查找元素
int index = list.indexOf("Two");  // 2
bool contains = list.contains("Three");  // true

// 插入和删除
list.insert(2, "Inserted");  // 在索引 2 处插入
list.removeAt(2);            // 删除索引 2 处的元素
list.removeOne("Zero");      // 删除第一个匹配的元素
list.removeAll("Two");       // 删除所有匹配的元素

// 遍历
for (int i = 0; i < list.size(); ++i) {
    qDebug() << list[i];
}

// 使用迭代器
QList<QString>::iterator i;
for (i = list.begin(); i != list.end(); ++i) {
    qDebug() << *i;
}

// 使用 foreach（C++11）
foreach (QString str, list) {
    qDebug() << str;
}

// 列表排序
QList<int> numbers = {5, 2, 8, 1, 9};
std::sort(numbers.begin(), numbers.end());
// 结果: {1, 2, 5, 8, 9}
```

### QLinkedList - 链表

```cpp
#include <QLinkedList>

QLinkedList<QString> linkedList;

linkedList << "First" << "Second" << "Third";

// 插入（O(1)）
linkedList.prepend("NewFirst");
linkedList.append("NewLast");

// 访问（O(n)）
QString first = linkedList.first();
QString item = linkedList.at(2);  // 较慢

// 遍历
for (auto it = linkedList.begin(); it != linkedList.end(); ++it) {
    qDebug() << *it;
}
```

### QVector - 向量

```cpp
#include <QVector>

QVector<int> vector;

// 容量管理
vector.reserve(100);  // 预分配 100 个元素的空间
vector.resize(50);    // 设置大小为 50

// 随机访问（O(1)）
vector[0] = 10;
int value = vector[5];

// 插入（O(n)）
vector.insert(2, 100);  // 在索引 2 处插入 100

// 替换
vector.replace(1, 200);  // 替换索引 1 处的元素

// 删除
vector.remove(1);        // 删除索引 1 处的元素
vector.remove(1, 5);     // 从索引 1 开始删除 5 个元素

// 查找
int index = vector.indexOf(10);
bool contains = vector.contains(10);
int count = vector.count(10);  // 统计出现次数
```

### QMap - 映射

```cpp
#include <QMap>

QMap<QString, int> ages;
ages["Alice"] = 30;
ages["Bob"] = 25;
ages.insert("Charlie", 35);

// 访问
int aliceAge = ages["Alice"];           // 如果键不存在，会创建新条目
int charlieAge = ages.value("Charlie"); // 如果键不存在，返回 0

// 安全访问
int defaultAge = ages.value("David", 0);  // 指定默认值

// 检查键是否存在
if (ages.contains("Alice")) {
    qDebug() << "Alice exists";
}

// 删除
ages.remove("Bob");

// 获取所有键/值
QList<QString> keys = ages.keys();
QList<int> values = ages.values();

// 遍历
QMap<QString, int>::iterator i;
for (i = ages.begin(); i != ages.end(); ++i) {
    qDebug() << i.key() << ":" << i.value();
}
```

### QHash - 哈希表

```cpp
#include <QHash>

QHash<QString, QString> hash;
hash["name"] = "John";
hash["city"] = "New York";
hash["country"] = "USA";

// 访问
QString name = hash.value("name");
QString unknown = hash.value("unknown", "Default");

// 删除
hash.remove("city");

// 遍历
foreach (const QString& key, hash.keys()) {
    qDebug() << key << ":" << hash[key];
}
```

### QSet - 集合

```cpp
#include <QSet>

QSet<QString> set;
set << "apple" << "banana" << "orange";

// 添加
set.insert("grape");
set += "melon";

// 检查
bool hasApple = set.contains("apple");

// 集合运算
QSet<QString> set1 = {"a", "b", "c"};
QSet<QString> set2 = {"b", "c", "d"};

QSet<QString> unionSet = set1 | set2;       // 并集: {"a", "b", "c", "d"}
QSet<QString> intersectSet = set1 & set2;   // 交集: {"b", "c"}
QSet<QString> diffSet = set1 - set2;        // 差集: {"a"}
```

### 容器性能对比

| 容器类型 | 查找 | 插入 | 头部添加 | 尾部添加 | 特点 |
|----------|------|------|----------|----------|------|
| QList | O(1) | O(n) | Amort. O(1) | Amort. O(1) | 最常用，适合小数据量 |
| QLinkedList | O(n) | O(1) | O(1) | O(1) | 频繁插入/删除 |
| QVector | O(1) | O(n) | O(n) | Amort. O(1) | 随机访问频繁 |
| QMap | O(log n) | O(log n) | - | - | 键值对，按键排序 |
| QHash | Avg. O(1) | Avg. O(1) | - | - | 键值对，无序 |

### 容器迭代器

```cpp
// 只读迭代器
QList<int>::const_iterator i;
for (i = list.constBegin(); i != list.constEnd(); ++i) {
    qDebug() << *i;
}

// 可写迭代器
QList<int>::iterator j;
for (j = list.begin(); j != list.end(); ++j) {
    *j *= 2;  // 修改元素
}

// STL 风格迭代器（C++11）
for (auto& item : list) {
    qDebug() << item;
}
```

## 算法库

Qt 提供了丰富的算法函数，基于 STL 实现。

```cpp
#include <QList>
#include <QDebug>
#include <algorithm>

QList<int> numbers = {5, 2, 8, 1, 9, 3};

// 排序
std::sort(numbers.begin(), numbers.end());
// 结果: {1, 2, 3, 5, 8, 9}

// 降序排序
std::sort(numbers.begin(), numbers.end(), std::greater<int>());

// 查找
auto it = std::find(numbers.begin(), numbers.end(), 5);
if (it != numbers.end()) {
    qDebug() << "Found at position" << std::distance(numbers.begin(), it);
}

// 计数
int count = std::count(numbers.begin(), numbers.end(), 5);

// 检查是否满足条件
bool allEven = std::all_of(numbers.begin(), numbers.end(),
                          [](int n) { return n % 2 == 0; });

bool anyEven = std::any_of(numbers.begin(), numbers.end(),
                          [](int n) { return n % 2 == 0; });

// 变换
QList<int> squared;
std::transform(numbers.begin(), numbers.end(),
              std::back_inserter(squared),
              [](int n) { return n * n; });

// 删除重复元素
QList<int> withDuplicates = {1, 2, 2, 3, 3, 3};
withDuplicates.erase(std::unique(withDuplicates.begin(), withDuplicates.end()),
                    withDuplicates.end());

// 自定义比较函数
struct Person {
    QString name;
    int age;
};

QList<Person> people = {
    {"Alice", 30},
    {"Bob", 25},
    {"Charlie", 35}
};

// 按年龄排序
std::sort(people.begin(), people.end(),
         [](const Person& a, const Person& b) {
             return a.age < b.age;
         });
```

## I/O 操作

### 文件操作

```cpp
#include <QFile>
#include <QTextStream>
#include <QDir>

// 读取文本文件
QFile file("data.txt");
if (file.open(QIODevice::ReadOnly | QIODevice::Text)) {
    QTextStream in(&file);
    QString line;
    while (!in.atEnd()) {
        line = in.readLine();
        qDebug() << line;
    }
    file.close();
}

// 写入文本文件
QFile outFile("output.txt");
if (outFile.open(QIODevice::WriteOnly | QIODevice::Text)) {
    QTextStream out(&outFile);
    out << "Hello, World!\n";
    out << "Line 2\n";
    outFile.close();
}

// 二进制文件
QFile binFile("data.bin");
if (binFile.open(QIODevice::WriteOnly)) {
    QDataStream out(&binFile);
    out << 42 << "text" << 3.14;
    binFile.close();
}

// 读取二进制文件
if (binFile.open(QIODevice::ReadOnly)) {
    QDataStream in(&binFile);
    int num;
    QString text;
    double d;
    in >> num >> text >> d;
    binFile.close();
}

// 检查文件是否存在
if (QFile::exists("data.txt")) {
    qDebug() << "File exists";
}

// 获取文件信息
QFileInfo info("data.txt");
QString name = info.fileName();
QString path = info.absolutePath();
qint64 size = info.size();
QDateTime modified = info.lastModified();

// 删除文件
QFile::remove("data.txt");
```

### 目录操作

```cpp
#include <QDir>

// 列出目录内容
QDir dir(".");
QStringList entries = dir.entryList();
foreach (QString entry, entries) {
    qDebug() << entry;
}

// 只列出文件
QStringList files = dir.entryList(QDir::Files);

// 只列出目录
QStringList dirs = dir.entryList(QDir::Dirs);

// 过滤文件
QStringList images = dir.entryList(QStringList() << "*.jpg" << "*.png",
                                  QDir::Files);

// 创建目录
QDir().mkdir("newDirectory");

// 删除目录
QDir().rmdir("newDirectory");

// 当前目录
QString currentDir = QDir::currentPath();

// 家目录
QString homeDir = QDir::homePath();

// 临时目录
QString tempDir = QDir::tempPath();
```

## 数据流

### 文本流

```cpp
#include <QTextStream>

QString buffer;
QTextStream stream(&buffer);

// 写入
stream << "Integer: " << 42 << endl;
stream << "Float: " << 3.14 << endl;
stream << "String: " << "Hello" << endl;

qDebug() << buffer;

// 读取
QString input = "42 3.14 Hello";
QTextStream in(&input);
int num;
double d;
QString str;
in >> num >> d >> str;
qDebug() << num << d << str;  // 输出: 42 3.14 "Hello"
```

### 数据流

```cpp
#include <QDataStream>

QByteArray array;
QDataStream out(&array, QIODevice::WriteOnly);
out << quint16(0x1234);  // 写入 16 位无符号整数
out << "String";
out << 3.14;

QDataStream in(array);
quint16 value;
QString text;
double d;
in >> value >> text >> d;

qDebug() << value << text << d;
```

## 时间和日期

```cpp
#include <QDate>
#include <QTime>
#include <QDateTime>
#include <QTimer>

// 当前日期和时间
QDate today = QDate::currentDate();
QTime now = QTime::currentTime();
QDateTime current = QDateTime::currentDateTime();

// 创建日期
QDate birthday(1990, 5, 15);

// 日期计算
QDate nextWeek = today.addDays(7);
QDate nextMonth = today.addMonths(1);
QDate nextYear = today.addYears(1);

// 计算天数差
int days = today.daysTo(birthday);

// 格式化输出
QString dateStr = today.toString("yyyy-MM-dd");  // "2022-04-22"
QString timeStr = now.toString("hh:mm:ss");      // "10:30:45"
QString datetimeStr = current.toString("yyyy-MM-dd hh:mm:ss");

// 解析字符串
QDate parsedDate = QDate::fromString("2022-04-22", "yyyy-MM-dd");

// QTimer - 定时器
QTimer* timer = new QTimer();
connect(timer, &QTimer::timeout, []() {
    qDebug() << "Timer triggered!";
});
timer->start(1000);  // 每秒触发一次
```

## 智能指针

```cpp
#include <QSharedPointer>
#include <QWeakPointer>
#include <QScopedPointer>

// QSharedPointer - 共享指针
QSharedPointer<QString> ptr1 = QSharedPointer<QString>::create();
ptr1->append("Hello");

QSharedPointer<QString> ptr2 = ptr1;  // 引用计数增加
qDebug() << ptr1->data() << ptr2->data();  // 指向同一个对象

// QScopedPointer - 作用域指针（自动释放）
{
    QScopedPointer<QString> scoped(new QString("Auto-deleted"));
    qDebug() << *scoped;
}  // scoped 超出作用域，自动删除

// QWeakPointer - 弱引用（不增加引用计数）
QWeakPointer<QString> weak = ptr1;
if (!weak.isNull()) {
    qDebug() << *weak.data();
}
```

## 正则表达式高级用法

```cpp
#include <QRegularExpression>
#include <QRegularExpressionMatchIterator>

// 邮箱验证
QRegularExpression emailRe("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
QRegularExpressionMatch match = emailRe.match("user@example.com");
if (match.hasMatch()) {
    qDebug() << "Valid email";
}

// URL 提取
QString text = "Visit http://example.com or https://qt-project.org";
QRegularExpression urlRe("https?://[^\\s]+");
QRegularExpressionMatchIterator it = urlRe.globalMatch(text);
while (it.hasNext()) {
    QRegularExpressionMatch m = it.next();
    qDebug() << "Found URL:" << m.captured();
}

// 替换
QString text = "Hello, WORLD!";
QRegularExpression re("\\bworld\\b", QRegularExpression::CaseInsensitiveOption);
QString replaced = text.replace(re, "Qt");
qDebug() << replaced;  // "Hello, Qt!"

// 分组和捕获
QString dateStr = "Date: 2022-04-22";
QRegularExpression dateRe("Date: (\\d{4})-(\\d{2})-(\\d{2})");
QRegularExpressionMatch dateMatch = dateRe.match(dateStr);
if (dateMatch.hasMatch()) {
    QString year = dateMatch.captured(1);  // "2022"
    QString month = dateMatch.captured(2); // "04"
    QString day = dateMatch.captured(3);   // "22"
}
```

## JSON 处理

```cpp
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QJsonValue>

// 创建 JSON 对象
QJsonObject jsonObject;
jsonObject["name"] = "John Doe";
jsonObject["age"] = 30;
jsonObject["isEmployed"] = true;

// 创建 JSON 数组
QJsonArray jsonArray;
jsonArray.append("Programming");
jsonArray.append("Reading");
jsonArray.append("Gaming");

jsonObject["skills"] = jsonArray;

// 转换为 JSON 文档
QJsonDocument doc(jsonObject);
QByteArray jsonData = doc.toJson(QJsonDocument::Compact);
qDebug() << jsonData;

// 解析 JSON
QJsonParseError error;
QJsonDocument doc = QJsonDocument::fromJson(jsonData, &error);
if (error.error == QJsonParseError::NoError) {
    QJsonObject obj = doc.object();
    QString name = obj["name"].toString();
    int age = obj["age"].toInt();
    QJsonArray skills = obj["skills"].toArray();

    foreach (QJsonValue skill, skills) {
        qDebug() << skill.toString();
    }
}
```

## XML 处理

```cpp
#include <QDomDocument>
#include <QIODevice>

// 创建 XML
QDomDocument doc;
QDomElement root = doc.createElement("root");
doc.appendChild(root);

QDomElement person = doc.createElement("person");
person.setAttribute("id", "1");
root.appendChild(person);

QDomElement name = doc.createElement("name");
name.appendChild(doc.createTextNode("John Doe"));
person.appendChild(name);

QDomElement age = doc.createElement("age");
age.appendChild(doc.createTextNode("30"));
person.appendChild(age);

// 输出 XML
QString xml = doc.toString();
qDebug() << xml;

// 解析 XML
QDomDocument xmlDoc;
xmlDoc.setContent("<root><person id='1'><name>John Doe</name><age>30</age></person></root>");
QDomElement rootEl = xmlDoc.documentElement();
QDomElement personEl = rootEl.firstChildElement("person");
QString id = personEl.attribute("id");
QString name = personEl.firstChildElement("name").text();
int age = personEl.firstChildElement("age").text().toInt();
```

## 最佳实践

### 1. 选择合适的容器

```cpp
// 随机访问频繁 -> QVector
QVector<double> measurements;

// 频繁插入/删除 -> QLinkedList
QLinkedList<int> queue;

// 键值对，排序 -> QMap
QMap<QString, QString> dictionary;

// 键值对，查找频繁 -> QHash
QHash<QString, User> userDatabase;
```

### 2. 使用 const 引用

```cpp
// ✅ 正确
void processList(const QList<QString>& list) {
    for (const QString& item : list) {
        // 只读操作
    }
}

// ❌ 错误（不必要地复制）
void processList(QList<QString> list) {
    // 列表被复制，效率低
}
```

### 3. 使用 Qt 的算法

```cpp
// ✅ 推荐
QList<int> numbers = {1, 2, 3, 4, 5};
std::sort(numbers.begin(), numbers.end());

// ❌ 不推荐
QList<int> numbers = {1, 2, 3, 4, 5};
numbers.sort();  // QList::sort() 已被弃用
```

### 4. 内存管理

```cpp
// 使用智能指针
QSharedPointer<QWidget> widget = QSharedPointer<QWidget>::create();

// 使用 QObject 父子关系
QWidget* parent = new QWidget();
QWidget* child = new QWidget(parent);  // child 会自动被删除
delete parent;  // 也会删除 child
```

### 5. 异常安全

```cpp
// 确保异常安全
class DataProcessor {
public:
    void process() {
        QScopedPointer<QFile> file(new QFile("data.txt"));
        if (!file->open(QIODevice::ReadOnly)) {
            return;  // QScopedPointer 会自动清理
        }

        // 处理数据
        // 如果这里抛出异常，文件也会被正确清理
    }
};
```

## 性能优化建议

1. **预分配空间**：使用 `reserve()` 预分配容器容量
2. **避免不必要的复制**：使用 const 引用传递参数
3. **选择合适的数据结构**：根据访问模式选择容器
4. **使用隐式共享**：Qt 的隐式共享减少了复制开销
5. **延迟加载**：必要时才加载大型资源

## 总结

Qt5 标准库提供了强大而丰富的功能：

- **字符串处理**：QString 提供了全面的字符串操作
- **容器类**：多种容器满足不同场景需求
- **算法库**：基于 STL 的高效算法
- **I/O 操作**：完整的文件和数据流处理
- **时间日期**：灵活的时间和日期处理
- **正则表达式**：强大的文本匹配和处理
- **数据格式**：JSON、XML 等格式支持

掌握这些核心组件，能够显著提高 Qt/C++ 程序的开发效率和代码质量。建议在实际项目中：
1. 熟悉各种容器类的特点和使用场景
2. 掌握字符串和正则表达式的常用操作
3. 合理使用智能指针和自动内存管理
4. 遵循 Qt 的编码规范和最佳实践

持续实践，您将成为 Qt 开发专家！

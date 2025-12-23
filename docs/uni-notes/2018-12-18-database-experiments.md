---
title: "数据库实验记录"
date: 2018-12-18
tags: ["主修"]
category: "数据库原理及应用教程"
description: "数据库实验代码，包括建表、插入数据、查询操作等"
---

:::note Archived University Note
This content is from my university archives and may not be reliable or up-to-date.
:::

## 数据库实验记录

### 实验一：建表与简单操纵

```sql
-- 创建数据库
create database EDUC
on
(
    name = 'student_data',
    filename = '/var/opt/mssql/tudent_data.mdf',
    size = 10,
    filegrowth = 5%,
    maxsize = 50
)
log on
(
    name = 'student_log',
    filename = '/var/opt/mssql/student_log.ldf',
    size = 2,
    maxsize = 5,
    filegrowth = 1
)

-- 创建学生表
create table student
(
    sno char(8) not null constraint PK_student primary key,
    sname char(8) not null,
    sex char(2),
    native char(20),
    birthday smalldatetime,
    dno char(6),
    entime smalldatetime,
    home varchar(40),
    tel varchar(40),
)

-- 创建课程表
create table course
(
    cno char(10) not null primary key,
    spno char(8),
    cname char(20) not null,
    experiment tinyint,
    lecture tinyint
)

-- 创建学生选课表
create table student_course
(
    sno char(8) not null primary key,
    cno char(10) not null,
    score tinyint
)

-- 创建教师表
create table teacher
(
    tno char(8) not null primary key,
    tname char(8) not null,
    sex char(2),
    birthday smalldatetime,
    dno char(6),
    pno tinyint,
    home varchar(40),
    tel varchar(40),
)

-- 创建教师授课表
create table teacher_course
(
    tno char(8) not null constraint T_Force foreign key references teacher(tno),
    classno char(4),
    cno char(10) not null constraint C_Force foreign key references course(cno),
    classtime varchar(40),
    classroom varchar(40),
    weektime tinyint,
)

-- 修改表
alter table course add year datetime
alter table course alter column year smalldatetime
alter table course add constraint year check(year between 2004 and 2012)
alter table course drop year
alter table course drop column year

-- 插入数据
insert into student (sno,sname,sex,birthday,dno,entime,home,tel)
values ('800130','w0x7c3','m','1998-11-02','idiot','2017-09-01','Jin','+17654000663')

-- 更新数据
update student set native='Jining Shandong' where sname='w0x7c3'
```

### 实验二：图书管理系统

```sql
-- 创建数据库
create database BR
on
(
    name = 'book_reader_data',
    filename = '/var/opt/mssql/book_reader.mdf',
    size = 10,
    filegrowth = 5%,
    maxsize = 50
)
log on
(
    name = 'book_reader_log',
    filename = '/var/opt/mssql/book_reader.ldf',
    size = 2,
    maxsize = 5,
    filegrowth = 1
)

-- 创建图书表
create table book
(
    bno char(10) constraint bkey primary key not null,
    bsort char(12),
    bpublish char(50) not null,
    author char(20),
    bname char(50) not null,
    bprice money(8),
)

-- 创建读者表
create table reader
(
    rnu char(10) not null constraint rkey primary key,
    rname char(8) not null,
    rwork char(50),
    rsex char(2) constraint csex check(rsex=='男' or rsex == '女'),
    rtel char(15),
)

-- 创建借阅表
create table borrow
(
    number char(10) primary key,
    bnu char(10),
    rnu char(10),
    bdata datetime,
)
```

#### 操纵查询示例

```sql
use br

-- 查找这样的图书类别：要求类别中最高的图书定价不低于按类别分组的图书的平均定价的2倍
-- select bsort from book group by bsort having max(bprice)>=all(select 2*avg(bprice) from book group by bsort)

-- 验证
-- select 2*avg(bprice),bsort,max(bprice) from book group by bsort

-- 求机械工业出版社出版的各类图书的平均定价
-- select avg(bprice),bsort from book where (bpublish='机械工业出版社') group by bsort

-- 列出计算机类图书的书号、名称及价格，最后求出册数和总价格
-- select bname,bprice from book where bsort like '计算机'
-- select count(*) from book where bsort='计算机'
-- select sum(bprice) from book where bsort like '计算机'
```

### 实验三：供应商-工程-零件系统

```sql
-- 创建数据库
create database en_tools
on
(
    name='en-tools_data',
    filename='/var/opt/mssql/en-tools.ldf',
    size=10,
    filegrowth=5%,
    maxsize=50
)
log on
(
    name='en-tools_log',
    filename='/var/opt/mssql/en-tools.mdf',
    size=2,
    maxsize=5,
    filegrowth=1
)

-- 创建供应商表
create table S
(
    sno char(5) constraint S_pk primary key,
    sname char(20),
    scity char(20),
    stel char(20),
)

-- 创建工程表
create table J
(
    jno char(5) constraint J_pk primary key,
    jname char(50),
    jmaster char(10),
    jplan char(8),
)

-- 创建零件表
create table P
(
    pno char(5) constraint P_pk primary key,
    pname char(50),
    ptype char(10),
    plocal char(20),
    pcolor char(10),
)

-- 创建供应关系表
create table SPJ
(
    spj_sno char(5),
    spj_jno char(5),
    spj_pno char(5),
    spj_count int(4),
    constraint SPJ_pk primary key(spj_jno,spj_count,spj_sno)
)
```

#### 插入数据示例

```sql
-- 插入供应商数据
insert into S(sno,sname,scity,stel) values('S1','北京供应商','北京','0108888888')
insert into S(sno,sname,scity,stel) values('S2','天津供应商','天津','022888888')
insert into S(sno,sname,scity,stel) values('S3','重庆供应商','重庆','023888888')
```

#### 查询示例

```sql
-- 查询为J4工程提供红色零件的供应商代码和姓名
select sno as 供应商代码, sname as 姓名 from s
where sno in (
    select spj_sno from SPJ
    where spj_sno = 'J4' and spj_pno in (
        select pno from p
        where pcolor = '红色'
    )
)

-- 查询与上海供应商没有工程关系的工程代码
select jno as 工程代码 from S,SPJ
where not exist(
    select * from SPJ
    where S.sno=SPJ.spj_sno and scity='上海'
)
```

### 实验四：高级操纵

```sql
-- 显示所有专业号为'001'，并且在服务器显示之前，暂停1分钟
waitfor delay '00:01'
select * from course where spno='001'

-- CASE语句更新
update student
set entime = (
    case spno
        when '001' then null
        else entime
    end
),
classno = (
    case spno
        when '003' then '001'
        else classno
    end
),
native = (
    case spno
        when '001' then native
        when '003' then native
        else null
    end
)
```

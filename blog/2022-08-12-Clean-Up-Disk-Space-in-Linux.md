---
slug: "Clean-Up-Disk-Space-in-Linux"
title: "Clean Up Disk Space in Linux"
authors: [w0x7ce]
tags: [misc,Linux,"Linux","Docker"]
---

# Clean Up Disk Space in Linux

## df

df命令可以获取硬盘被占用了多少空间，目前还剩下多少空间等信息，它也可以显示所有文件系统对i节点和磁盘块的使用情况。

```bash
df命令各个选项的含义如下：
  -a：显示所有文件系统的磁盘使用情况，包括0块（block）的文件系统，如/proc文件系统。
  -k：以k字节为单位显示。
  -i：显示i节点信息，而不是磁盘块。
  -t：显示各指定类型的文件系统的磁盘空间使用情况。
  -x：列出不是某一指定类型文件系统的磁盘空间使用情况（与t选项相反）。
  -T：显示文件系统类型。
```

```bash
ubuntu@VM-HK-w0x7ce:~$ df
Filesystem     1K-blocks    Used Available Use% Mounted on
tmpfs             202488     968    201520   1% /run
/dev/vda2       51538380 6022796  45499200  12% /
tmpfs            1012440      24   1012416   1% /dev/shm
tmpfs               5120       0      5120   0% /run/lock
tmpfs             202488       4    202484   1% /run/user/1000
```

第1列是代表文件系统对应的设备文件的路径名（一般是硬盘上的分区）；第2列给出分区包含的数据块（1024字节）的数目；第3，4列分别表示已用的和可用的数据块数目。

第3，4列块数之和不一定等于第2列中的块数。这是因为默认的每个分区都留了少量空间供系统管理员使用的缘故。即使遇到普通用户 空间已满的情况，管理员仍能登录和留有解决问题所需的工作空间。清单中Use%列表示普通用户空间使用的百分比，若这一数字达到100%，分区仍然留有系 统管理员使用的空间。

最后，Mounted on列表示文件系统的安装点。

## du （disk usage）

disk usage 含义为显示磁盘空间的使用情况，统计目录（或文件）所占磁盘空间的大小。该命令的功能是逐级进入指定目录的每一个子目录并显示该目录占用文件系统数据块（1024字节）的情况。若没有给出指定目录，则对当前目录进行统计。

```bash
du命令各个选项的含义如下：  
    -s：对每个Names参数只给出占用的数据块总数。
    -a：递归地显示指定目录中各文件及子目录中各文件占用的数据块数。若既不指定-s，也不指定-a，则只显示Names中的每一个目录及其中的各子目录所占的磁盘块数。
    -b：以字节为单位列出磁盘空间使用情况（系统默认以k字节为单位）。
    -k：以1024字节为单位列出磁盘空间使用情况。
    -c：最后再加上一个总计（系统默认设置）。
    -l：计算所有的文件大小，对硬链接文件，则计算多次。
    -x：跳过在不同文件系统上的目录不予统计。
```

```bash
ubuntu@VM-HK-w0x7ce:/etc$ du -h ./apt
12K     ./apt/trusted.gpg.d
4.0K    ./apt/keyrings
64K     ./apt/apt.conf.d
4.0K    ./apt/auth.conf.d
4.0K    ./apt/preferences.d
4.0K    ./apt/sources
4.0K    ./apt/sources.list.d
104K    ./apt
```

## tune2fs

tune2fs 命令用于调整文件系统的参数，是 ext2 及 ext3 文件系统常用的调整工具。

```bash
df命令各个选项的含义如下：
    -c 次数 #挂载多少次后运行硬盘检查命令
    -e 行为 #发现错误时的行为，包括continue（继续）、remount-on（挂载成只读）、panic（导致内核不稳定）
    -f #及时发现错误，仍强制执行
    -i 时间 #检查的时间间隔， d 为天数， m 为月数， w 为周数
    -j #新建 ext3 日志式的文件系统
    -l #显示文件系统的相关信息
    -L 标签 #指定文件系统的标签名称
    -m 保留比例 #指定对硬盘的保留比例，默认为 5%
```

### 查看文件系统信息

```bash
root@VM-HK-w0x7ce:/home/ubuntu# tune2fs -l /dev/vda2
tune2fs 1.46.5 (30-Dec-2021)
Filesystem volume name:   Disk_One
Last mounted on:          /
Filesystem UUID:          7bccaefa-b039-4ff6-bd32-22dde0066c0b
Filesystem magic number:  0xEF53
Filesystem revision #:    1 (dynamic)
Filesystem features:      has_journal ext_attr resize_inode dir_index filetype needs_recovery extent 64bit flex_bg sparse_super large_file huge_file dir_nlink extra_isize metadata_csum
Filesystem flags:         signed_directory_hash 
Default mount options:    user_xattr acl
Filesystem state:         clean
Errors behavior:          Continue
Filesystem OS type:       Linux
Inode count:              3276800
Block count:              13106683
Reserved block count:     0
Overhead clusters:        66747
Free blocks:              12042633
Free inodes:              3179795
First block:              0
Block size:               4096
Fragment size:            4096
Group descriptor size:    64
Reserved GDT blocks:      1019
Blocks per group:         32768
Fragments per group:      32768
Inodes per group:         8192
Inode blocks per group:   512
Flex block group size:    16
Filesystem created:       Sun Apr 24 20:03:06 2022
Last mount time:          Thu Jul 28 09:59:27 2022
Last write time:          Fri Aug 12 12:45:27 2022
Mount count:              11
Maximum mount count:      -1
Last checked:             Sun Apr 24 20:03:06 2022
Check interval:           0 (<none>)
Lifetime writes:          13 GB
Reserved blocks uid:      0 (user root)
Reserved blocks gid:      0 (group root)
First inode:              11
Inode size:               256
Required extra isize:     32
Desired extra isize:      32
Journal inode:            8
First orphan inode:       15612
Default directory hash:   half_md4
Directory Hash Seed:      06aeded3-785f-4aaa-8100-d3e54f41d421
Journal backup:           inode blocks
Checksum type:            crc32c
Checksum:                 0xf004571c
```

### 显示卷 & 更改卷名字

```bash
root@VM-HK-w0x7ce:/home/ubuntu# tune2fs -l /dev/vda2 | grep volume
Filesystem volume name:   <none>
root@VM-HK-w0x7ce:/home/ubuntu# tune2fs -L w0x7ce_disk_01 /dev/vda2
tune2fs 1.46.5 (30-Dec-2021)
root@VM-HK-w0x7ce:/home/ubuntu# tune2fs -l /dev/vda2 | grep volume
Filesystem volume name:   w0x7ce_disk_01
```

### 改变预留空间比例

```bash
root@VM-HK-w0x7ce:/home/ubuntu# tune2fs -m 1 /dev/vda2
tune2fs 1.46.5 (30-Dec-2021)
Setting reserved blocks percentage to 1% (131066 blocks)
```

## 案例分析

```bash
root@slave01:~# df -h
Filesystem      Size  Used Avail Use% Mounted on
udev             63G     0   63G   0% /dev
tmpfs            13G  2.8M   13G   1% /run
/dev/sda4       221G  217G  4.8G  100% /
tmpfs            63G     0   63G   0% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
tmpfs            63G     0   63G   0% /sys/fs/cgroup
/dev/loop1      1.9M  1.9M     0 100% /snap/shadowsocks-libev/508
/dev/loop5       56M   56M     0 100% /snap/core18/2538
/dev/loop4      114M  114M     0 100% /snap/core/13425
/dev/sda2       1.9G  100M  1.6G   6% /boot
/dev/sda1       952M  4.4M  947M   1% /boot/efi
/dev/sda3       215G  185G   20G  91% /home
/dev/sdb        3.6T  2.8T  668G  81% /storage
/dev/loop2      560M  560M     0 100% /snap/pycharm-community/293
tmpfs            13G     0   13G   0% /run/user/1000
/dev/loop3      224M  224M     0 100% /snap/code/104
overlay         221G  214G  4.8G  98% /var/lib/docker/overlay2/38ce2a2c8fadbb345c6c88e4023e2553a15580cef2852c121098679f6c4c2abf/merged
overlay         221G  214G  4.8G  98% /var/lib/docker/overlay2/28bbbb41fef8d50f3ecf916b6134e3ba7e7348120fa78314df5ffdbe1dc7d797/merged
overlay         221G  214G  4.8G  98% /var/lib/docker/overlay2/2e5c611e27c16368f4383de5c8ac6ae560f34d64160f08eb9a9e1e433daa6ac4/merged
tmpfs            13G     0   13G   0% /run/user/1008
overlay         221G  214G  4.8G  98% /var/lib/docker/overlay2/84b5916793a1773e5835462fdd0467acb3576e94743cdc79c9e08504ac52ca31/merged
overlay         221G  214G  4.8G  98% /var/lib/docker/overlay2/5a7005e5cefa0a120fccb4855eab9bff258c6a950166faac2fd22c8cf2979484/merged
overlay         221G  214G  4.8G  98% /var/lib/docker/overlay2/3ab0a88edd37a7e5df24d68b4e5f59f0aee2f01419b9a6f82b982e3f7e89ef79/merged
tmpfs            13G     0   13G   0% /run/user/1011
tmpfs            13G     0   13G   0% /run/user/0
```

### Step 1 在根目录下寻找 大于 500M 的文件

```bash
find . -size +500M -print0 | xargs -0 du -h > /root/AA.log
```

```bash
vim /root/AA.log

#type 
:g/{STRING}/d 
#global 文字 delete 删除 /storage /xxx 不相关行

```

然后 删除对应无用文件

### Step 2 根据 Filesystem 查看可疑文件系统

#### overlay

首先 利用mount 查看 overlay 对应的路径

```bash
root@slave01:/var/lib/docker/overlay2# mount -t  overlay
overlay on /var/lib/docker/overlay2/38ce2a2c8fadbb345c6c88e4023e2553a15580cef2852c121098679f6c4c2abf/merged type overlay (rw,relatime,lowerdir=/var/lib/docker/overlay2/l/VPU3WEBK7ZSS4CAIEG2WSIDEWG:/var/lib/docker/overlay2/l/HJSGHVFPEIXPODVB2G6SGCVUKX:/var/lib/docker/overlay2/l/LQIBNX7UBIZU2AKHNK2G6V2KLV:/var/lib/docker/overlay2/l/KGEOYKQ734GFQEKUWZCSE6KFSL,upperdir=/var/lib/docker/overlay2/38ce2a2c8fadbb345c6c88e4023e2553a15580cef2852c121098679f6c4c2abf/diff,workdir=/var/lib/docker/overlay2/38ce2a2c8fadbb345c6c88e4023e2553a15580cef2852c121098679f6c4c2abf/work)
overlay on /var/lib/docker/overlay2/28bbbb41fef8d50f3ecf916b6134e3ba7e7348120fa78314df5ffdbe1dc7d797/merged type overlay (rw,relatime,lowerdir=/var/lib/docker/overlay2/l/DHEKFL6D46UEDBR5PHWHN6UEHH:/var/lib/docker/overlay2/l/SNN7A2T7ZBXYKW2SXBQKSIX67C:/var/lib/docker/overlay2/l/FYK374GFEJZGCQQW2ALAIRHVSO:/var/lib/docker/overlay2/l/7HACMERHIGQR7JZQQGJNCKNUS7:/var/lib/docker/overlay2/l/QS6R2DYIBTBQRHOVGB4VHAWPV6:/var/lib/docker/overlay2/l/FKTA7IQF4JNBOFNRG353Q4T22C:/var/lib/docker/overlay2/l/IAWRXYRJ4V67KBVYV2TI5M7M4M:/var/lib/docker/overlay2/l/Y4G4HGVVSYPCSPGILFDLB5ITYI:/var/lib/docker/overlay2/l/STDB5J7V3YO3XUK5XNT7D6FEOG:/var/lib/docker/overlay2/l/YPRRYJ5PGWZ6BQ5NSLMEBYPB4I:/var/lib/docker/overlay2/l/RCUOIVTEDAON5N3DP3BVUQVXBH:/var/lib/docker/overlay2/l/U2F73KIPTHDRJA7NZVNJT4KHLI,upperdir=/var/lib/docker/overlay2/28bbbb41fef8d50f3ecf916b6134e3ba7e7348120fa78314df5ffdbe1dc7d797/diff,workdir=/var/lib/docker/overlay2/28bbbb41fef8d50f3ecf916b6134e3ba7e7348120fa78314df5ffdbe1dc7d797/work)
```

留意到

```bash
/var/lib/docker/overlay2
```

pushd 进相关目录

```bash
du -h --max-depth=1
```

如下输出

```bash
root@slave01:/var/lib/docker/overlay2# du -h --max-depth=1
1.7G    ./7129b703bd58ba9d0217e3770050b5bfba57cfef6548eda21f1dd3b9a3c572bf
40K     ./28bbbb41fef8d50f3ecf916b6134e3ba7e7348120fa78314df5ffdbe1dc7d797-init
24K     ./86e5ce373c451d537975223605338f787a218d361a7292ea93e1ab667e28e644
3.8G    ./4718a3ed58149a869dea349ae80c487584a8ab3dd16a5d9f385eaf15bdb18a3a
241M    ./38ce2a2c8fadbb345c6c88e4023e2553a15580cef2852c121098679f6c4c2abf
40K     ./f39b75e04364d91c1ac074e3b797a670b9f8d419e693890b66967438fc7427e1-init
78M     ./5cf6779b3682b5f40be1100134d3d6d6d763f1cc96193ad87b20ec20bbab301f
292K    ./0df64755c145230dfad62016a000dc0d16302c868bf36e1c45af249af28eeaaa
18G     ./f187076c8cc73e4212e7b59944af7665800961898f345c54d7210adddacdc0fe
18M     ./bfd5b5212714fa1ea875934e2fcdadc77d295fc614ead0f5eb69b2bc58440a79
14G     ./84b5916793a1773e5835462fdd0467acb3576e94743cdc79c9e08504ac52ca31
749M    ./b23680886239a3b89d53948e1311bffa1c0e0dbaa0649f9dfc6df62b75c5c67d
32K     ./48477f6ae9617edff67f43e59c9b546bb1a228fa0212231ac662b1a0f2cfe1d5
32K     ./16ce11a5b972bba2b98cacd5609674e944e82770a79808040a297b70f951d238
116M    ./1b207660bbd786106a86ad125b12fc0525ec51d602a6cfef8e3ff5f6567f7cd3
36K     ./34253942384fd03637adbd7b959fab29e8e60c421f071e2a14f72452db97f1eb
18M     ./94d362e3e7a1e6efee5d373008a19e9e3cc4578541cbb140a13eabba3ff66a96
70G     ./28bbbb41fef8d50f3ecf916b6134e3ba7e7348120fa78314df5ffdbe1dc7d797
40K     ./36affaa6f22adb0d45e6b8f5c3ad9c92fbf50f0c53fc6518465c86a52429990f-init
29M     ./80c6d1117ca7c8b64095c1e1f18bd7df9d916347031b6bd403521103443b7505
33M     ./8dd21e66d906381cbb62062e2aac36e863ad1e373c39facd9f3764a9144c09c4
11G     ./3ab0a88edd37a7e5df24d68b4e5f59f0aee2f01419b9a6f82b982e3f7e89ef79
244G    .
```

这时 我们可以利用grep 来检索对应的docker

```bash
docker ps -q | xargs docker inspect --format '{{.State.Pid}}, {{.Name}}, {{.GraphDriver.Data.WorkDir}}' | grep "x"
```

如id含3的容器

```bash
root@slave01:/var/lib/docker/overlay2# docker ps -q | xargs docker inspect --format '{{.State.Pid}}, {{.Name}}, {{.GraphDriver.Data.WorkDir}}' | grep "3"
4637, /wanta7780, /var/lib/docker/overlay2/2e5c611e27c16368f4383de5c8ac6ae560f34d64160f08eb9a9e1e433daa6ac4/work
17106, /nn2, /var/lib/docker/overlay2/3ab0a88edd37a7e5df24d68b4e5f59f0aee2f01419b9a6f82b982e3f7e89ef79/work
15986, /chz, /var/lib/docker/overlay2/84b5916793a1773e5835462fdd0467acb3576e94743cdc79c9e08504ac52ca31/work
4384, /xpq, /var/lib/docker/overlay2/28bbbb41fef8d50f3ecf916b6134e3ba7e7348120fa78314df5ffdbe1dc7d797/work
38783, /portainer, /var/lib/docker/overlay2/38ce2a2c8fadbb345c6c88e4023e2553a15580cef2852c121098679f6c4c2abf/work
```

如果找不到相关的容器，可能这就是之前的残留文件，直接 删除删除即可。

通过 df -h 我们可以看到 Used 下降了很多

```bash
root@slave01:/var/lib/docker/overlay2# df -h
Filesystem      Size  Used Avail Use% Mounted on
udev             63G     0   63G   0% /dev
tmpfs            13G  2.9M   13G   1% /run
/dev/sda4       221G  214G  4.8G  100% /
```

最后修改预留空间为 1%

```bash
tune2fs -m 1 /dev/sda4
```

```bash
df -h

##可以看到
/dev/sda4       221G  214G  4.8G  98% /
```

```bash
root@slave01:/var/lib/docker/overlay2# sudo tune2fs -l /dev/sda4 | grep -i 'block count'
Block count:              59107328
Reserved block count:     591073
```

可以看出可用空间变多，完成空间释放

# Tips 

## xargs (eXtended ARGuments）

1. xargs 是给命令传递参数的一个过滤器，也是组合多个命令的一个工具。

2. xargs 可以将管道或标准输入（stdin）数据转换成命令行参数，也能够从文件的输出中读取数据。

3. xargs 也可以将单行或多行文本输入转换为其他格式，例如多行变单行，单行变多行。

4. xargs 默认的命令是 echo，这意味着通过管道传递给 xargs 的输入将会包含换行和空白，不过通过 xargs 的处理，换行和空白将被空格取代。

5. xargs 是一个强有力的命令，它能够捕获一个命令的输出，然后传递给另外一个命令。

xargs 一般是和管道一起使用。

```bash
命令格式：
somecommand |xargs -item  command
参数：

-a file 从文件中读入作为 stdin

-e flag ，注意有的时候可能会是-E，flag必须是一个以空格分隔的标志，当xargs分析到含有flag这个标志的时候就停止。

-p 当每次执行一个argument的时候询问一次用户。

-n num 后面加次数，表示命令在执行的时候一次用的argument的个数，默认是用所有的。

-t 表示先打印命令，然后再执行。

-i 或者是-I，这得看linux支持了，将xargs的每项名称，一般是一行一行赋值给 {}，可以用 {} 代替。

-r no-run-if-empty 当xargs的输入为空的时候则停止xargs，不用再去执行了。

-s num 命令行的最大字符数，指的是 xargs 后面那个命令的最大命令行字符数。

-L num 从标准输入一次读取 num 行送给 command 命令。

-l 同 -L。

-d delim 分隔符，默认的xargs分隔符是回车，argument的分隔符是空格，这里修改的是xargs的分隔符。

-x exit的意思，主要是配合-s使用
```

example

```bash
find ./ -name "systemd*" | xargs -i cp -r {} {}.bak #寻找 systemd开头文件并备份
```

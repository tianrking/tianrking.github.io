---
slug: "2024-09-05-fpga-design-a-uart-loopback-system-2247483918"
title: "FPGA design a UART Loopback System"
authors: [w0x7ce]
tags: [微信公眾號]
date: 2024-09-05
description: "从微信公众号导入的文章《FPGA design a UART Loopback System》，保留原始排版图并提供本地 OCR 转写。"
---

# FPGA design a UART Loopback System

> 发布于 2024-09-05 21:40:27（微信公众号导出记录）。
>
> 本文来自公众号后台的“导出文章内容”功能。博客正文由导出长图进行本地 OCR 转写，并保留原始排版图用于逐段核对。
>
> 原文链接：[查看原文](http://mp.weixin.qq.com/s?__biz=MzIwMjMyNzIzNw==&mid=2247483918&idx=1&sn=0e7c544157d8c0bcfaeb0091fd43e639&chksm=96e117a4a1969eb2146277042dbc0c3d911be7f71ca4a644b5ec5391d9987cba698aa53b8a56#rd)
>
> OCR 转写有效文字约 5655 字；代码、流程图和版式以文末原始排版图为准。

## 正文（本地 OCR 转写）

original we×7ce EI V1ajero 2824年9月5日 21:41 波兰

## 1.背景信息

本项目使用的是GWINR-9FPGA开发板,其主要特性如下:

- Logic units (LUT4): 8649

- Registers (FF): 6480

- Shadow SRAM (SSRAM) : 17280 bits

- Block SRAM (BSRAM): 468K bits (26个块)

- User flash: 608K bits

- SDR SDRAM: 64M bits

- 18 × 18 Multiplier: 20

- SPI FLASH: 32M-b1t

- PLL: 2

- Display interface: HDMI, SPI screen, RGB screen

- Debugger:板载 BL702 芯片提供 USB-JTAG 和 USB-UART 功能

- I0能力:

- 支持 4mA、8mA、16mA、24mA 驱动能力

■每个I/0提供独立的总线保持器、上拉/下拉电阻和开漏输出选项

- 连接器:TF卡播,2x24P2.54mm排针

- 按钮:2个可编程按钮

- LED:板载6个可编程LED

这些特性使得该开发板非常适合实现UART回环系统,特别是其丰富的I/0资源和板载LED
可以方便地进行调试和状态显示。

## 2.I0约束

### 1.001

I0_PDRT "c1k* PULL_MoDE=UP;
ot [e]po. 0n0I
I0_Loc “led[1]′ 11;
t [z]pa 3001
[≤]po0n0I
I0_LOC "led[4]* 15;
,x4ien. oon0I
I0_PORT "uart_tx* I0_TYPE=LVCMOS33;
gt ,x.1e, 301 01
I0_PORT "uart_rx* IO_TYPE=LVCMoS33;
详细解释:
l.时钟(clk):
分配到52号引脚

- 设置为上拉模式(PULL_MODE-UP)

- 上拉模式有助于减少硬声干扰,提高信号完整性

## 2. LED 输出:

- led[0] 到led[5] 分别分配到 10, 11, 13, 14, 15, 16 号引脚

- 这些LED将用于显示接收到的数据,提供直观的调试信息

## 3. UART 接口:

- 发送(uart_tx)分配到17号引脚

- 接收(uart_rx)分配到18号引脚

- 都设置为LVCM0S33标准(3.3V逻辑电平)

- LVCMOS33是一种常见的低压CMOS逻辑标准,兼容性好,功耗低

知识点:

- I0约束对于FPGA设计至关重要,它们定义了逻辑设计如何与物理硬件接口。

- 正确的I0标准(如LVCMOS33)确保了信号的电气特性与外部设备匹配。

- 上拉/下拉设置可以提高信号稳定性,特别是对于时钟等关键信号。

## 3.UART 回环模块(uart_loop_back)

### 3.1模块接口

nodule uart_loop_back (
input clk,
output uart_tx,
output reg [5:0] led
):
这个模块是整个系统的顶层模块,它连接了UART接收器、发送器和LED显示逻辑。

### 3.2内部信号

vire rxDatavalid;
1reg txDatavalid;
wire txBusy:
这些信号用于模块间的通信和数据传输控制

### 3.3UART接收器和发送器实例化

uart_rx
.DELAY_FRAMES (234)
) uart_rx_inst (
.clk(clk),
.uart_rx(uart_rx),
, rxData( rxData),
):
uart_tx
DELAY_FRAMES (234)
) uart_tx_inst (
.clk(clk),
. txData(txData),
. txBusy(txBusy)
uart_tx(uart_tx)

DELAY_FRAHE5参数的计算:
DELAY_FRAMES-(系统时钟频率)/《波特率)-27,060,000/ 115,200234

- 系统时钟频率:27 MHz(27,000,000 Hz)

- 目标波特率:115,200bps

这个计算确保了UART通信的正确时序。每个比特持续的时钟周期致为234,这样可以精确地
采样和发送数据。

### 3.4缓冲区和控制变量

reg [7:0] buffer [0:255]:
reg [7:0] readPtr = 0;
reg sending = ;
这里实现了一个256字节的循环缓冲区,用于暂存接收到的数据。

- buffcr:存储接收到的数据

writePtr:指向下一个要写入的位置

- readPtr:指向下一个要读取的位置

- sending:指示当前是否正在发送数据

循环缓冲区的工作原理:
写人数据
wrtePtr
通冲区活
通年区空
等特新款据

graph TD
B-&gt;|说取数据|C[发送数据]
C --&gt;|增加 readPtr| B
D[writePtr ==readPtr]--&gt;|线冲区空|E[等待新数据]

这种设计允许连续接收数据,即使发送这度暂时眼不上接收速度。

### 3.5主要逻辑

主要逻辑在一个always@(posedgeclk)块中实现:

中区有款

开用发理

新有数报已发坊

graph T0
A[开始]-&gt;B&#123;[接收到有效数据?&#125;
B--&gt;|是|C[存人螺冲区]
B --&gt;|否|D&#123;正在发送?&#125;

- -&gt; D

C
D--&gt;|否|E&#123;线冲区有数据?&#125;
E--&gt;|是|F[开始发送】
E --&gt;|否| A
&#125;0&lt;-
6-&gt;|是|H[发送下一个数据]
5 -&gt;|否| A
H--&gt;I&#123;所有数据已发送?&#125;
I--&gt;是|J[端束发送过程]

- &gt;|否|A

这个逻辑确保了数据的连续接收和发送,同时处理了发送器忙绿时的情况。

### 3.6LED控制

alvays @(posedge clk) beg1n
if [rxDatavalid)
led &lt;= -rxData[5:];
end
这个块在每次接收到有效数据时更新LED显示,显示接收数据的低6位的反码。这提供了直
观的数据接收指示。

## 4.UART接收器模块(uart_rx)

### 4.1模块接口

nodule uart_rx #(
parameter DELAY_FRAMESs = 234
)(
input clk,
input uart_rx,
output reg rxDatavalid
) ;

### 4.2状态定义

localparam RX_STATE_IDLE = 3;

Localparam RX_STATE_STOP_BIT = 5;

### 4.3接收逻辑流程

IDLE

START_BIT
第特半个比特时间
READ_WAIT
检测到停止位
到达比特中心
末读完 8 位
RFAD
读完8位
STOP_BIT
stateD1agral-v2
310I &lt;-- []
IDLE&gt;START_BIT:检测到开始位
START_BIT --&gt; READ_WAIT:等特半个比特时间
READ WAIT -* READ:到达比特中心
READ-&gt;READ_WAIT:未说完8位
READ --&gt; STOP_BIT : 读完 8 位
STOP BIT-&gt;IDLE:检到停止位
详细说明:
L.IDLE状态:等待起始位(低电平)

## 2.START_BIT状态:确认起始位,准备读取数据

## 3.READ_WAIT状态:等待到达比特中心

## 1.READ状态:采样数据位

## 5.STOP BIT状态:确认停止位,完成接取

知识点:

- UART协议的基本原理:起始位、数据位、停止位

- 在比特中心采样以提高可靠性

- 使用状态机实现率行协议解析

## 5.UART发送器模块(uart_tx)

### 5.1模块接口

nodule uart_tx #(
parameter DELAY_FRAMES = 234
)(
input clk,
input txDataValid,
output reg uart_tx

### 5.2状态定义

Local.param TX_STATE_START_BIT - 1;
4localparam TX_STATE_STOP_BIT = 3;

### 5.3发送逻辑流程

详细说明:
L.IDLE状态:等待有效数据

## 2.START_BIT状态:发送起始位(低电平)

## 3.WRITE状态:逐位发送8位数据

## 1.STOP_BIT状态:发送停止位(高电平)

知识点:

- UART发送过程中的精确时序控制

- 使用计数器(txCounter)来控制每个位的持续时间

- txBusy信号的使用,用于招示发送器状态

## 6.系统整体流程

外部UART设备
发运救据
UART_RX
rxData, rxDatavalid
控收数据
回环经辑
LED显不
txData, txDatavalid
存
读取
福环规冲区
UART_TX
发送数据
外部UART设备

graph TD
A[外部UART设备]--&gt;|发送效据]B(UART_RX)
B --&gt;|rxData, rxDataValid| C&#123;回环逐辑&#125;

- &gt;|存储|D[循环强冲区]

D --&gt;|读取|C
C --&gt;|txData, txDataValid| E(UART_TX]

- &gt;|发送数据|F[外部UART设务]

B --&gt;|接收数据|G[LED显示]

这个流程图展示了整个系统的数据流:
L.外部设备发送数据到UART_RX

## 2.接收到的数据通过回环逻辑存入缓冲区

## 3.数据从缓冲区读出并发送到UART_TX

## 1.UART_TX将数据发送回外部设备

## 5.同时,接收到的效据会显示在LED上

## 7.关键设计考虑

## 5.模块化设计:将功能分解为独立模块(接收器、发送器、回环逻辑),提高代码可读性和可

维护性,这种方法也允许各个模块的独立溯试和重用。

## 5.错误处理:虽然当前设计没有明确的错误处理机制,但可以考虑添加奇偶校验或赖错误检测

来提高可靠性。

## 7.LED反馈:使用板我LED显示接收到的数据,为调试和状态监控提供了直现的方法。

## 3.I0配置:精心选择的I0配置(如LVCMOS33标准和上拉设置)确保了与外部设备的良

好兼容性和信号完整性。

## 8.性能分析

### 8.1时序性能

- 系统时钟:27MHz

- UART 浪特率:115286 bps

- 每比特时钟周期:234个系统时钟周期

这意味着系统有足够的时间分辨率来准确采样和发送UART数据。事实上,它可以支持更高的
波特率,理论上最高可达:
最大波特率=27 MHz/ 16×1.6875 Mbps
(假设每比特至少需要16个时钟周期来准确采样)

### 8.2资源利用

基于提供的GWINR-9FPGA规格,我们可以估计资源利用率:

- 还辑单元(LUT4):该设计可能使用不到100个LUT,占总数8648的约1%.

- 寄存器(FF):可能使用约50-100个FF,占总数6488的约1-2%

- 块RAM(BSRAM):此设计不使用块 RAM

- I/0:使用了9个I/0引脚(1个时钟,6个LED,2个UART),远低于设备的总

1/0 能力。
这表明该设计在资源利用上非常高效,留有大量空间forfutureenhancements。

## 9.可能的改进和扩展

L.错误检测和处理:

- 实现奇偶校验

- 添加帧错误检测(无效的停止位)

- 实现接收器超时机制

## 2.缓冲区增强:

- 实现可配置的缓冲区大小

- 漆加缓冲区满/空标志

- 实现中断机制for缓冲区状态变化

## 3.波特率配置:

- 实现运行时可配置的波特率

- 支持自动波特率检测

## 1.数据处理:

- 添加简单的命令解析功能

- 实现数据滤波或格式转换

,诊断功能:

- 添加更多的状态LED指示

- 实现环回测试模式

## 3.接口扩展:

- 添加 SPI或I2C接口for配置

- 实现USB-UART桥接功能

01 qde.6
A[UART系统]-&gt;B[错误处理]
A--&gt;C[缓冲区增强]
A·-&gt;D[波特率配置】
A--&gt; E[数据处理]
A --&gt; F[诊断功能]
A--&gt; G[接口扩展]
B--&gt;B1[奇校验]
B --&gt;B2[帧错误检测]
B --&gt; B3[接收超时]
C-&gt;C1[可配置爆冲区大小]
C--&gt;C2[线冲区状态标志]
C--&gt;C3[中断机利]
D--&gt;D1[可配置波特率]
D--&gt;D2[自动退特率检测]
E --&gt; E1[命令解析]
E--&gt; E2[数据转换]
F --&gt; F1[状态LED]
F--&gt;F2[环同测试模式]
F--&gt;F3[性计数器]
6 --&gt; G1[SPI/I2C配置]
G --&gt; G2[USB-UART桥接]

## 10.测试策略

为确保系统的可靠性和正确性,可以采用以下测试策略:

## 1.单元测试:

- 对UART_RX和UART_TX模块进行独立测试

- 验证不同波特率下的正确操作

- 测试边界条件(如最大速度数据传输)

## 1.集成测试:

- 测试完整的回环功据

- 验证缓冲区在各种数据流情况下的行为

## 3.压力测试:

- 连续发送大量数据

- 模拟数据突发和间数性传输

## 1.精误注入剩试:

- 模拟帧错误、噪声干扰

- 测试系统在异常情况下的行为

## 5.实际硬件测试:

- 使用实际UART设备(如PC串口或微控制器)进行端到端测试

- 在不同环境条件下进行长时间稳定性测试

graph TD
A[测试策略]--&gt;B[单元测试]
A--&gt;C[集成测试]
A--&gt;D[压力测试]
A--&gt;E[错误注入测试]
A--&gt;F[实际硬件测试]
6
B--&gt;B2[UART_TX测试]
B--&gt;B3[波特率验证]
10
C--&gt;C1[回环功能测试]
11
C--&gt;C2[缓冲区行为测试]
D--&gt;D1[大量数据测试]
12
13
14
E--&gt;E1[帧错误模拟]
15
E--&gt;E2[噪声干扰模拟]
16
F--&gt;F1[端到端测试]
17
F--&gt;F2[长期稳定性测试]
18
完整代码
https://github.com/tianrking/TANGNANo9K_FPGA_TEMPLATE/tree/master/uart
_loopback
这个UART回环系统展示了如何在FPGA上实现一个基本但功能完整的串行通信接口。通过模
块化设计、状态机实现和缓冲策略,系统能够可靠地接收和发送数据。该设计不仅演示了UART
协议的基本原理,还展示了FPGA设计中的一些重要概念,如时序控制、资源管理和IO配
置。

FPGA·目录三
下一篇·高云FPGALinux下调制PWM&gt;

## 原始排版图

![FPGA design a UART Loopback System：微信公众号导出原始排版图](/img/wechat/2024-09-05-fpga-design-a-uart-loopback-system-2247483918/article.webp)

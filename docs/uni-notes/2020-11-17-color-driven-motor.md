---
title: "颜色驱动电机"
date: 2020-11-17
tags: ["单片机", "DIY"]
category: "自动化"
description: "使用51单片机通过PWM控制电机速度的代码示例"
---

:::note[Archived University Note]
This content is from my university archives and may not be reliable or up-to-date.
:::

## 代码

```c
/*********************************************************************************

***************************************************************************************/

#include "reg52.h"
typedef unsigned int u16;
typedef unsigned char u8;
typedef unsigned int uint;

sbit IN1=P3^7;
sbit ENA=P3^6;
sbit IN2=P3^5; //L
sbit ENB=P3^4;	//L

sbit ENSER=P3^0;

uint time_temp=0;

/*********************************************************************************

*******************************************************************************/

void delay(u16 i)
{
	while(i--);
}

void Speed_L(uint a) // a范围0~100
{
  ENB=1;
	//ENB=1;
 delay(a); // a越大,电机越快,持续时间越长
  ENB=0;
	//ENB=0;// 休息时间
 delay(100-a);// 补足到100
}

void Speed_R(uint a) // a范围0~100
{
	ENA=0;
	//ENB=1;
 delay(a);
  ENA=1;
}

void Speed_SER(uint a) // a范围0~100
{
	switch(time_temp%2){
		case 0:
			ENSER=1;
			delay(a);
			ENSER=0;
			delay(10-a);
			break;
		case 1:
			ENSER=0;
			delay(a);
			ENSER=1;
			delay(10-a);
			break;
	}
	time_temp=time_temp+1;
}

/*********************************************************************************

*******************************************************************************/

void main()
{
	while(1)
	{
		//led=0x00;
		//delay(50000);
		//led=0;//led2=0;
		//delay(50000);

		//////
		/*IN2=1;
		IN1=0;
		Speed_L(98);
		Speed_R(98);
		Speed_SER(5);  */
		//////
		IN2=0; //L
		ENB=1;
	}
}
```

## 功能说明

这是一个基于51单片机的PWM电机速度控制程序：

1. **Speed_L(uint a)**: 控制左侧电机速度，参数a为0-100的占空比
2. **Speed_R(uint a)**: 控制右侧电机速度
3. **Speed_SER(uint a)**: 控制舵机速度，通过交替开关实现

## 引脚定义

- P3^7: IN1
- P3^6: ENA
- P3^5: IN2
- P3^4: ENB
- P3^0: ENSER (舵机控制)

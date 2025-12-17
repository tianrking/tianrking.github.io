---
legacy: true
id: raspberry-pi-pico-motor-control
title: 树莓派 Pico 闭环电机控制完全指南
sidebar_label: Pico 闭环电机控制
description: 详细介绍如何使用树莓派 Pico 和 C++ SDK 实现闭环电机控制，包括 PWM 驱动、编码器读取和 PID 控制算法
date: 2021-09-13T20:08:40+08:00
tags: [树莓派Pico, 嵌入式, 电机控制, C++, 硬件编程]
authors: [w0x7ce]
---

# 树莓派 Pico 闭环电机控制完全指南

树莓派 Pico 是一款强大的微控制器，非常适合用于电机控制应用。本指南将详细介绍如何使用 Pico 和 C++ SDK 实现闭环电机控制系统，包括 PWM 驱动、编码器读取和 PID 控制算法。

## Pico 简介

### 什么是树莓派 Pico

树莓派 Pico 是基于 RP2040 微控制器的低成本、高性能开发板：
- **双核 ARM Cortex-M0+ 处理器**：最高 133 MHz
- **264KB SRAM**：充足的程序和数据存储
- **2MB QSPI Flash**：程序存储空间
- **丰富的 GPIO**：支持多种外设
- **专用硬件模块**：PWM、PIO、ADC 等

### Pico 在电机控制中的优势

- **多 PWM 通道**：最多 16 个独立 PWM 通道
- **PIO 可编程 IO**：精确的时序控制
- **硬件定时器**：精确的时间控制
- **多核处理**：并行处理控制算法
- **丰富的外设**：UART、SPI、I2C 支持

## 环境配置

### 安装开发工具

#### 1. 安装 CMake 和 GCC 编译器

```bash
# Ubuntu/Debian 系统
sudo apt update
sudo apt install cmake gcc-arm-none-eabi libnewlib-arm-none-eabi libstdc++-arm-none-eabi-newlib

# CentOS/RHEL 系统
sudo yum install cmake arm-none-eabi-gcc arm-none-eabi-newlib

# macOS (使用 Homebrew)
brew install cmake

# 验证安装
cmake --version
arm-none-eabi-gcc --version
```

#### 2. 下载 Pico SDK

```bash
# 克隆 Pico SDK
git clone https://github.com/raspberrypi/pico-sdk.git ~/pico-sdk

# 克隆示例代码（可选）
git clone https://github.com/raspberrypi/pico-examples.git ~/pico-examples

# 设置环境变量
export PICO_SDK_PATH=~/pico-sdk
echo 'export PICO_SDK_PATH=~/pico-sdk' >> ~/.bashrc
source ~/.bashrc
```

#### 3. 安装 VS Code 和插件（推荐）

```bash
# 安装 VS Code
# 从官网下载：https://code.visualstudio.com/

# 安装 C++ 插件
# 安装 Cortex-Debug 插件
```

### 验证环境

```bash
# 检查 Pico SDK
ls $PICO_SDK_PATH
# 应该看到 CMakeLists.txt 和 src 等文件

# 测试编译示例
cd ~/pico-examples/pico_setup
mkdir build
cd build
cmake ..
make
```

## 创建项目

### 1. 项目结构

```bash
# 创建项目目录
mkdir ~/pico_motor_control
cd ~/pico_motor_control

# 目录结构
pico_motor_control/
├── CMakeLists.txt          # CMake 构建配置
├── pico_sdk_import.cmake   # SDK 导入文件
├── motor_control.cpp       # 主程序
├── quadrature_encoder.pio  # PIO 程序（用于编码器）
├── pid_controller.h        # PID 控制器头文件
└── motor_driver.h          # 电机驱动头文件
```

### 2. 复制 Pico SDK 导入文件

```bash
# 复制 SDK 导入文件
cp $PICO_SDK_PATH/external/pico_sdk_import.cmake ./
```

### 3. 编写 CMakeLists.txt

```cmake
cmake_minimum_required(VERSION 3.13)

include(pico_sdk_import.cmake)

project(motor_control C CXX ASM)

# 初始化 Pico SDK
pico_sdk_init()

# 添加可执行文件
add_executable(motor_control
    motor_control.cpp
    pid_controller.cpp
    motor_driver.cpp
)

# 生成 PIO 头文件
pico_generate_pio_header(motor_control ${CMAKE_CURRENT_LIST_DIR}/quadrature_encoder.pio)

# 设置编译选项
target_compile_options(motor_control PRIVATE
    -Wall
    -Wno-format
    -Wno-unused-function
    -Wno-unused-parameter
)

# 链接库
target_link_libraries(motor_control PRIVATE
    pico_stdlib
    pico_multicore
    hardware_pio
    hardware_pwm
    hardware_timer
    hardware_clocks
    pico_time
)

# 启用 USB 串口，禁用 UART
pico_enable_stdio_usb(motor_control 1)
pico_enable_stdio_uart(motor_control 0)

# 生成额外输出文件
pico_add_extra_outputs(motor_control)

# 创建目标目录
add_custom_command(TARGET motor_control POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E make_directory $<TARGET_FILE_DIR:motor_control>/firmware
    COMMAND ${CMAKE_COMMAND} -E copy_if_different
        $<TARGET_FILE:motor_control>.uf2
        $<TARGET_FILE_DIR:motor_control>/firmware/motor_control.uf2
)
```

## PWM 驱动电机

### L298N 电机驱动模块

L298N 是一款常用的双 H 桥电机驱动模块：
- **双 H 桥设计**：可同时控制两个直流电机
- **高电压范围**：6V - 46V
- **高电流输出**：每通道 2A
- **过热保护**：内置热保护功能
- **逻辑控制**：5V 逻辑电平输入

### 接线方式

```
Pico 引脚        L298N 引脚      功能
GP18            ENA             PWM 控制 A
GP19            IN1             方向控制 A1
GP20            IN2             方向控制 A2
GP21            ENB             PWM 控制 B
GP22            IN3             方向控制 B1
GP26            IN4             方向控制 B2
GND             GND             地线
5V              5V              电源（逻辑部分）
```

### PWM 基本原理

Pico 的 PWM 模块基于 125 MHz 系统时钟：
- **时钟频率**：125 MHz（8ns 周期）
- **计数器宽度**：16 位（0 - 65535）
- **频率计算**：f_pwm = 125MHz / (wrap + 1)
- **占空比计算**：duty_cycle = level / wrap

### PWM 驱动代码

#### 头文件：motor_driver.h

```cpp
#ifndef MOTOR_DRIVER_H
#define MOTOR_DRIVER_H

#include "pico/stdlib.h"
#include "hardware/pwm.h"
#include "hardware/gpio.h"

class MotorDriver {
private:
    uint pwm_pin;
    uint dir_pin1;
    uint dir_pin2;
    uint slice_num;
    uint channel;
    float max_speed;

public:
    // 构造函数
    MotorDriver(uint pwm_pin, uint dir_pin1, uint dir_pin2, float max_speed = 1.0);

    // 初始化
    void init();

    // 设置速度（-1.0 到 1.0）
    void set_speed(float speed);

    // 停止电机
    void stop();

    // 设置方向
    void set_direction(bool forward);

private:
    // 计算 PWM 参数
    void calculate_pwm_params(float speed, uint &wrap, uint &level);
};

#endif
```

#### 实现：motor_driver.cpp

```cpp
#include "motor_driver.h"

// 构造函数
MotorDriver::MotorDriver(uint pwm_pin, uint dir_pin1, uint dir_pin2, float max_speed)
    : pwm_pin(pwm_pin), dir_pin1(dir_pin1), dir_pin2(dir_pin2), max_speed(max_speed) {
    slice_num = 0;
    channel = 0;
}

// 初始化
void MotorDriver::init() {
    // 设置 GPIO 为 PWM 功能
    gpio_set_function(pwm_pin, GPIO_FUNC_PWM);
    slice_num = pwm_gpio_to_slice_num(pwm_pin);
    channel = pwm_gpio_to_channel(pwm_pin);

    // 设置方向引脚为输出
    gpio_init(dir_pin1);
    gpio_init(dir_pin2);
    gpio_set_dir(dir_pin1, GPIO_OUT);
    gpio_set_dir(dir_pin2, GPIO_OUT);

    // 初始化 PWM
    uint wrap = 500;  // 25kHz PWM 频率
    pwm_set_wrap(slice_num, wrap);
    pwm_set_enabled(slice_num, true);

    // 初始速度为 0
    set_speed(0.0);
}

// 设置速度
void MotorDriver::set_speed(float speed) {
    // 限制速度范围
    speed = (speed > max_speed) ? max_speed : speed;
    speed = (speed < -max_speed) ? -max_speed : speed;

    uint wrap = 500;
    uint level;

    // 计算占空比
    level = abs(speed) * wrap;

    // 设置方向
    if (speed >= 0) {
        gpio_put(dir_pin1, 1);
        gpio_put(dir_pin2, 0);
    } else {
        gpio_put(dir_pin1, 0);
        gpio_put(dir_pin2, 1);
    }

    // 设置 PWM 占空比
    pwm_set_chan_level(slice_num, channel, level);
}

// 停止电机
void MotorDriver::stop() {
    set_speed(0.0);
}

// 设置方向
void MotorDriver::set_direction(bool forward) {
    if (forward) {
        gpio_put(dir_pin1, 1);
        gpio_put(dir_pin2, 0);
    } else {
        gpio_put(dir_pin1, 0);
        gpio_put(dir_pin2, 1);
    }
}
```

## 编码器读取与闭环控制

### 增量式编码器

增量式编码器输出两路正交脉冲信号（A 和 B 相）：
- **脉冲计数**：用于计算转速
- **方向检测**：通过 A、B 相相位差判断转向
- **分辨率**：每转脉冲数（PPR）

### PIO 程序：quadrature_encoder.pio

```pio
; Quadrature Encoder PIO Program
; 使用 PIO 读取正交编码器信号

.program quadrature_encoder
.side_set 1 opt

; 检测 A 相的上升沿
wait 0 pin 0        ; 等待 A 相为低电平
wait 1 pin 0        ; 等待 A 相为高电平（上升沿）
; 读取 B 相状态
mov isr, null
mov isr, !pin 1     ; 读取 B 相并取反
in isr, 1           ; 将 B 相移入 ISR
push noblock        ; 推送到 FIFO
jmp wait_0

% c-sdk {
static inline void quadrature_encoder_program_init(PIO pio, uint sm, uint offset, uint pin_a, uint pin_b) {
    pio_gpio_init(pio, pin_a);
    pio_gpio_init(pio, pin_b);
    pio_sm_set_consecutive_pindirs(pio, sm, pin_a, 2, false);

    pio_sm_config c = quadrature_encoder_program_get_default_config(offset);
    sm_config_set_in_pins(&c, pin_a);
    sm_config_set_sideset_pins(&c, pin_b);
    ino_config_set_in_shift(&c, true, false, 1);

    pio_sm_init(pio, sm, offset, &c);
    pio_sm_set_enabled(pio, sm, true);
}
%}
```

### PID 控制算法

#### 头文件：pid_controller.h

```cpp
#ifndef PID_CONTROLLER_H
#define PID_CONTROLLER_H

#include <stdint.h>

class PIDController {
private:
    float kp, ki, kd;
    float error, last_error, integral;
    float output;
    float max_output, min_output;
    float dead_zone;

public:
    // 构造函数
    PIDController(float kp, float ki, float kd, float max_output, float min_output = 0);

    // 设置 PID 参数
    void set_parameters(float kp, float ki, float kd);

    // 设置输出限制
    void set_output_limits(float max_output, float min_output);

    // 设置死区
    void set_dead_zone(float dz);

    // 计算 PID 输出
    float calculate(float setpoint, float input);

    // 重置控制器
    void reset();

    // 获取当前输出
    float get_output() const { return output; }

private:
    // 限幅函数
    float saturate(float value, float max, float min);
};

#endif
```

#### 实现：pid_controller.cpp

```cpp
#include "pid_controller.h"
#include <math.h>

// 构造函数
PIDController::PIDController(float kp, float ki, float kd, float max_output, float min_output)
    : kp(kp), ki(ki), kd(kd), max_output(max_output), min_output(min_output) {
    error = 0.0;
    last_error = 0.0;
    integral = 0.0;
    output = 0.0;
    dead_zone = 0.0;
}

// 设置 PID 参数
void PIDController::set_parameters(float kp, float ki, float kd) {
    this->kp = kp;
    this->ki = ki;
    this->kd = kd;
}

// 设置输出限制
void PIDController::set_output_limits(float max_output, float min_output) {
    this->max_output = max_output;
    this->min_output = min_output;
}

// 设置死区
void PIDController::set_dead_zone(float dz) {
    dead_zone = dz;
}

// 计算 PID 输出
float PIDController::calculate(float setpoint, float input) {
    // 计算误差
    error = setpoint - input;

    // 死区处理
    if (fabs(error) < dead_zone) {
        error = 0.0;
    }

    // 比例项
    float proportional = kp * error;

    // 积分项
    integral += ki * error;

    // 积分限幅
    integral = saturate(integral, max_output, min_output);

    // 微分项
    float derivative = kd * (error - last_error);

    // 计算输出
    output = proportional + integral + derivative;

    // 输出限幅
    output = saturate(output, max_output, min_output);

    // 保存误差
    last_error = error;

    return output;
}

// 重置控制器
void PIDController::reset() {
    error = 0.0;
    last_error = 0.0;
    integral = 0.0;
    output = 0.0;
}

// 限幅函数
float PIDController::saturate(float value, float max, float min) {
    if (value > max) return max;
    if (value < min) return min;
    return value;
}
```

### 主程序：motor_control.cpp

```cpp
#include <stdio.h>
#include "pico/stdlib.h"
#include "pico/multicore.h"
#include "hardware/pio.h"
#include "hardware/timer.h"
#include "motor_driver.h"
#include "pid_controller.h"

#define PWM_FREQUENCY 25000  // 25 kHz
#define CONTROL_FREQUENCY 100  // 100 Hz
#define ENCODER_PIN_A 0
#define ENCODER_PIN_B 1
#define MOTOR_PWM_PIN 18
#define MOTOR_DIR_PIN1 19
#define MOTOR_DIR_PIN2 20

// 全局变量
volatile int32_t encoder_count = 0;
float motor_speed = 0.0;
float target_speed = 0.5;  // 目标速度（0.0 到 1.0）
bool motor_running = true;

// PID 控制器
PIDController pid(1.0, 0.5, 0.1, 1.0, -1.0);

// 电机驱动实例
MotorDriver motor(MOTOR_PWM_PIN, MOTOR_DIR_PIN1, MOTOR_DIR_PIN2);

// 编码器读取中断处理（模拟）
void encoder_isr() {
    // 实际项目中需要配置 GPIO 中断
    // 这里仅作示例
    encoder_count++;
}

// 编码器读取任务（在核心 1 上运行）
void core1_main() {
    while (true) {
        // 读取编码器值
        // 实际项目中需要从 PIO FIFO 读取
        int32_t current_count = encoder_count;

        // 计算转速（简化示例）
        float measured_speed = (float)current_count / 1000.0;  // 简化计算

        // 运行 PID 控制器
        motor_speed = pid.calculate(target_speed, measured_speed);

        // 设置电机速度
        motor.set_speed(motor_speed);

        // 打印调试信息
        printf("目标速度: %.2f, 测量速度: %.2f, PID输出: %.2f\n",
               target_speed, measured_speed, motor_speed);

        // 等待控制周期
        sleep_ms(10);  // 100 Hz
    }
}

int main() {
    // 初始化串口
    stdio_init_all();

    printf("Pico 电机控制启动\n");

    // 初始化电机驱动
    motor.init();

    // 初始化 PID 控制器
    pid.set_parameters(1.0, 0.5, 0.1);
    pid.set_dead_zone(0.01);

    // 配置编码器（示例）
    gpio_init(ENCODER_PIN_A);
    gpio_init(ENCODER_PIN_B);
    gpio_set_dir(ENCODER_PIN_A, GPIO_IN);
    gpio_set_dir(ENCODER_PIN_B, GPIO_IN);

    // 设置 PWM 参数
    uint32_t system_clock = clock_get_hz(CLK_SYS);
    uint32_t clock_div = system_clock / (PWM_FREQUENCY * 65535);
    if (clock_div > 1) {
        clock_div -= 1;
    }

    // 在核心 1 上启动编码器读取任务
    multicore_launch_core1(core1_main);

    // 主循环
    while (motor_running) {
        // 检查用户输入（简化示例）
        // 实际项目中需要从按键或串口读取

        sleep_ms(100);
    }

    // 停止电机
    motor.stop();

    return 0;
}
```

## 编译与烧录

### 编译项目

```bash
# 进入项目目录
cd ~/pico_motor_control

# 创建构建目录
mkdir build
cd build

# 配置 CMake
cmake ..

# 编译
make -j$(nproc)

# 查看编译结果
ls -la
# 应该看到 .uf2 文件
```

### 烧录程序

#### 方法 1：UF2 文件（推荐）

1. **按住 BOOTSEL 按钮连接 Pico 到电脑**
2. **电脑会识别为一个可移动磁盘**
3. **复制 .uf2 文件到该磁盘**

```bash
# 复制固件文件
cp motor_control.uf2 /media/$USER/RPI-RP2/
```

#### 方法 2：picotool（高级用户）

```bash
# 安装 picotool
git clone https://github.com/raspberrypi/picotool.git
cd picotool
make
sudo make install

# 烧录固件
picotool load motor_control.elf
```

### 调试程序

#### 串口调试

```bash
# 查看串口设备
ls /dev/tty*

# 连接串口（使用 minicom 或 screen）
minicom -D /dev/ttyACM0

# 或使用 screen
screen /dev/ttyACM0 115200
```

#### 查看输出

程序运行后会通过 USB 串口输出调试信息：

```
Pico 电机控制启动
目标速度: 0.50, 测量速度: 0.48, PID输出: 0.52
目标速度: 0.50, 测量速度: 0.49, PID输出: 0.51
目标速度: 0.50, 测量速度: 0.50, PID输出: 0.50
...
```

## PID 参数调试

### 参数整定方法

#### 1. Ziegler-Nichols 方法

```cpp
// 步骤：
// 1. 设置 Ki = 0, Kd = 0
pid.set_parameters(1.0, 0.0, 0.0);

// 2. 逐渐增加 Kp 直到系统开始振荡
// 记录此时的 Kp 值（Kc）

// 3. 测量振荡周期（Tc）
// 根据 Z-N 表计算参数：
// Kp = 0.6 * Kc
// Ki = 2 * Kp / Tc
// Kd = Kp * Tc / 8
```

#### 2. 手动整定

```cpp
// 比例控制（Kp）
// 1. 设置 Ki = 0, Kd = 0
// 2. 调整 Kp 直到响应速度满意
pid.set_parameters(0.5, 0.0, 0.0);

// 积分控制（Ki）
// 3. 逐渐增加 Ki 消除稳态误差
pid.set_parameters(0.5, 0.1, 0.0);

// 微分控制（Kd）
// 4. 调整 Kd 减少超调
pid.set_parameters(0.5, 0.1, 0.05);
```

### 调试技巧

```cpp
// 1. 添加实时调试信息
printf("误差: %.3f, 比例: %.3f, 积分: %.3f, 微分: %.3f\n",
       error, kp * error, integral, kd * (error - last_error));

// 2. 使用示波器观察 PWM 信号
// 3. 使用转速表测量实际转速
// 4. 记录响应曲线进行分析
```

## 高级功能

### 多电机控制

```cpp
// 控制两个电机
MotorDriver motor1(18, 19, 20);  // 左轮
MotorDriver motor2(21, 22, 23);  // 右轮

// 差速控制
void set_robot_speed(float linear_speed, float angular_speed) {
    float left_speed = linear_speed - angular_speed * wheel_base / 2;
    float right_speed = linear_speed + angular_speed * wheel_base / 2;

    motor1.set_speed(left_speed);
    motor2.set_speed(right_speed);
}
```

### 速度曲线控制

```cpp
class SpeedProfile {
private:
    float accel_rate;
    float decel_rate;
    float current_speed;
    float target_speed;

public:
    void update() {
        float error = target_speed - current_speed;

        if (error > 0) {
            current_speed += accel_rate;
            if (current_speed > target_speed) {
                current_speed = target_speed;
            }
        } else if (error < 0) {
            current_speed -= decel_rate;
            if (current_speed < target_speed) {
                current_speed = target_speed;
            }
        }
    }
};
```

### 位置控制

```cpp
class PositionController {
private:
    PIDController position_pid;
    PIDController velocity_pid;
    int32_t target_position;
    int32_t current_position;
    float velocity_setpoint;

public:
    void update() {
        // 位置 PID
        int32_t position_error = target_position - current_position;
        velocity_setpoint = position_pid.calculate(position_error, 0);

        // 速度 PID
        float current_velocity = (float)(current_position - last_position);
        float motor_speed = velocity_pid.calculate(velocity_setpoint, current_velocity);

        motor.set_speed(motor_speed);
    }
};
```

## 故障排除

### 常见问题

#### 1. 电机不转动

```cpp
// 检查：
// 1. PWM 信号是否正确
// 2. 电源电压是否充足
// 3. 接线是否正确
// 4. 电机是否损坏

// 调试代码
void debug_motor() {
    motor.set_speed(0.5);
    sleep_ms(2000);
    motor.set_speed(-0.5);
    sleep_ms(2000);
    motor.stop();
}
```

#### 2. 编码器读数异常

```cpp
// 检查：
// 1. 编码器电源是否正常
// 2. 信号线是否松动
// 3. PIO 程序是否正确
// 4. 中断是否配置正确

// 调试代码
void debug_encoder() {
    int32_t last_count = encoder_count;
    sleep_ms(1000);
    int32_t count_diff = encoder_count - last_count;
    printf("编码器脉冲: %d\n", count_diff);
}
```

#### 3. PID 参数不稳定

```cpp
// 解决方案：
// 1. 检查传感器噪声
// 2. 调整采样周期
// 3. 添加低通滤波器
// 4. 使用自适应 PID

// 低通滤波器示例
float filter_input(float input) {
    static float last_output = 0.0;
    float alpha = 0.1;  // 滤波系数
    float output = alpha * input + (1 - alpha) * last_output;
    last_output = output;
    return output;
}
```

### 性能优化

#### 1. 中断处理优化

```cpp
// 使用硬件定时器
void timer_callback() {
    // 读取编码器
    // 运行 PID
    // 更新 PWM
}
```

#### 2. 多核并行处理

```cpp
// 核心 0：PID 控制和 PWM 更新
void core0_main() {
    while (true) {
        // PID 计算
        // PWM 更新
        sleep_us(100);  // 10 kHz
    }
}

// 核心 1：编码器读取和通信
void core1_main() {
    while (true) {
        // 读取编码器
        // 串口通信
        sleep_us(1000);  // 1 kHz
    }
}
```

## 总结

本指南详细介绍了使用树莓派 Pico 实现闭环电机控制的完整流程：

- **环境配置**：CMake、GCC、Pico SDK 安装
- **PWM 驱动**：L298N 电机驱动模块的使用
- **编码器读取**：PIO 程序和正交编码器
- **PID 控制**：增量式 PID 算法实现
- **项目实战**：完整的电机控制系统代码

掌握这些技能将帮助您：
- 开发精确的电机控制系统
- 实现多电机协调控制
- 优化控制算法性能
- 解决实际工程问题

## 进阶学习

### 相关主题

- **无传感器控制**：使用反电动势估算转速
- **FOC 控制**：磁场定向控制算法
- **自适应 PID**：参数自动调整
- **多轴协调**：机器人运动控制
- **CAN 总线**：多节点通信

### 推荐资源

- [Raspberry Pi Pico C/C++ SDK](https://datasheets.raspberrypi.org/pico/raspberry-pi-pico-c-sdk.pdf)
- [PIO 文档](https://raspberrypi.github.io/pico-sdk-doxygen/pio_8h.html)
- [Motor Control 案例](https://github.com/raspberrypi/pico-examples/tree/master/pwm/motor_control)

持续实践这些概念和代码，您将能够开发出高性能的电机控制系统！

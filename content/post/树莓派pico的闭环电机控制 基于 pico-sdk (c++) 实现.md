---
title: "树莓派pico的闭环电机控制 基于 Pico Sdk (C++) 实现"
date: 2022-09-05T07:12:09+08:00
draft: false

tags: ["C","raspberry"]
categories: ["嵌入式"]
author: "w0x7ce"

---

# 树莓派pico的闭环电机控制 基于 pico-sdk (c++) 实现

## 环境配置

<https://github.com/raspberrypi/pico-sdk>

安装相关软件包

1. 安装 CMake (3.13以上版本), 和支持arm架构的gcc编译器

    ```bash
    sudo apt install cmake gcc-arm-none-eabi libnewlib-arm-none-eabi libstdc++-arm-none-eabi-newlib
    ```

2. 配置环境变量 确保可以正确的调用 Pico-SDK 开发套件

    ```bash
    git clone https://github.com/raspberrypi/pico-sdk ~/pico-sdk
    export PICO_SDK_PATH={pico-sdk下载的路径}
    ```

## 创建项目

1. 在合适的路径下

```bash
mkdir ~/pico_project
cd ~/pico_project
```

2. 复制 在 SDK 里面的 [pico_sdk_import.cmake](https://github.com/raspberrypi/pico-sdk/blob/master/external/pico_sdk_import.cmake) 到我们的项目根路径

```bash
cp ~/pico-sdk/external/pico_sdk_import.cmake ~/pico_project
```

3. 参考 [pico-example](https://github.com/raspberrypi/pico-examples)  编写 `CMakeLists.txt` 对于电机控制的项目我的代码是这样的:

    ```cmake
    cmake_minimum_required(VERSION 3.13)

    include(pico_sdk_import.cmake)

    project(my_project)

    # 初始化 pico-sdk 开发套件
    pico_sdk_init()

    add_executable(motor_control)

    pico_generate_pio_header(motor_control ${CMAKE_CURRENT_LIST_DIR}/quadrature_encoder.pio)

    target_sources(motor_control PRIVATE motor_control.cpp)


    # 连接相关的依赖
    target_link_libraries(motor_control PRIVATE
            pico_stdlib
            pico_multicore
            hardware_pio
            hardware_pwm
            )

    # 启用 usb 串口输出 禁用 uart 输出
    pico_enable_stdio_usb(motor_control 1)
    pico_enable_stdio_uart(motor_control 0)

    # 创建 map/bin/hex/uf2 类型烧录文件.
    pico_add_extra_outputs(motor_control)
    ```

## 编写项目代码

经过上面的步骤我们完成了环境的配置 下边可以开始编写功能代码。

### PWM 驱动电机

我们选用的是L298N电机驱动

<img src = "https://github.com/tianrking/ros2_noob/blob/motor_control/media/L298N-Motor-Driver-Module-Pinout.png"></img>

可同时控制两个直流减速电机做不同动作，在6V到46V的电压范围内，提供2安培的电流，并且具有过热自断和反馈检测功能。正确接线后，在软件层面，我们只需要使能对应的输出，通过调整输出的pwm信号就可以驱动电机旋转。

pico有一个频率为125Mhz的pwm时钟，这个时钟8ns计数一次，内部计数器连续计数，到达65535后 重新回到0.

我们可以利用它生成一个 周期为4ns ，占空比为50% 的PWM信号如

25000kHZ=25mHz
4us / 8ns = 500 Cycles //我们可让pico 计数到五百个为一组
250 / 500 = 50%
V-pwm = 3.3*50% = 1.65V 在高频的情况下我们也可以将其视为一个1.65V的信号  

代码如下

   ```c
    #include <stdio.h>
    #include "pico/stdlib.h"
    #include "hardware/timer.h"
    #include "hardware/pwm.h"

    #include "iostream"

    int wrap;

    int main() {
        gpio_set_function(GPIO_motor_pwm, GPIO_FUNC_PWM);
        uint slice_num = pwm_gpio_to_slice_num(GPIO_motor_pwm);

        wrap = 500; // 25Mhz
        // wrap = 62500; // 2khz
        // wrap = 12500 ; //should be 10 kHz 
        // wrap = 1250; // should be 100 kHz 
        pwm_set_wrap(slice_num, wrap);
        pwm_set_enabled(slice_num, true);

        pwm_set_chan_level(slice_num, PWM_CHAN_A, 0.5*wrap);
    }
   ```

这样就可以调制出对应的波形

### 编码器数值读取与闭环控制  

通过以上的步骤 我们可用调制出需要的pwm信号，现在我们利用编码器来获取电机转动的相对速度，下面以便于理解的增量式PID来举例说明。

**此步骤需要调用 [quadrature_encoder.pio](https://github.com/raspberrypi/pico-examples/blob/master/pio/quadrature_encoder/quadrature_encoder.pio) 在开始前我们需要先拷贝此文件**

1. 定义一个便于实现PID的类

```c++
class PID_class
{
    private:
        float kp, ki, kd;
        float err, last_err;
        float err_i;
        float err_d;
        float fix;

    public:
        PID_class(int p, int i, int d)
        {
            kp = p;
            ki = i;
            kd = d;
            std::cout << kp << " " << ki << " " << kd;
        };

        void PID_init(int p, int i, int d)
        {
            PID_class(p, i, d);
        };

        void PID_change(int p, int i, int d)
        {
            kp = p;
            ki = i;
            kd = d;
            std::cout << kp << " " << ki << " " << kd;
        };

        int caculate(int now, int target)
        {
            err = target - now;
            err_i += err;
            err_d = err - last_err;
            last_err = err;

            fix = kp * err + ki * err_i + kd * err_d;
            return fix;
        }
        
} PID(5, 0.5, 0);
```

2. 读取编码器的值 调用 PID 并自动调节输出脉冲的占空比

```c++
#include <stdio.h>
#include "pico/stdlib.h"
#include "hardware/pio.h"
#include "hardware/timer.h"
#include "hardware/pwm.h"

#include "iostream"

#include "quadrature_encoder.pio.h"

int wrap;
int GPIO_motor_pwm = 6;

/// 定义 PID_class 代码在上面部分 
/// 复制粘贴到这里即可 在根据实际情况修改参数
/// 此处省略

int main()
{
    int new_value, delta, old_value = 0;

    //编码器一根线接到Pin10 另外一根接到11
    const uint PIN_AB = 10;

    stdio_init_all();

    PIO pio = pio0;
    const uint sm = 0;

    uint offset = pio_add_program(pio, &quadrature_encoder_program);
    quadrature_encoder_program_init(pio, sm, offset, PIN_AB, 0);

    // 选择输出 pwm 的引脚 用作控制信号传入L298n 电机驱动并完成初始化
    gpio_set_function(GPIO_motor_pwm, GPIO_FUNC_PWM);
    uint slice_num = pwm_gpio_to_slice_num(GPIO_motor_pwm);
    wrap = 62500; // 2khz
    pwm_set_wrap(slice_num, wrap);
    pwm_set_enabled(slice_num, true);

    // 在这里我们设定默认输出 占空比为0 即 静止状态
    float output_pwm = 0; // 12000

    while (1)
    {
        // 读取编码器的数值
        
        new_value = quadrature_encoder_get_count(pio, sm);
        delta = new_value - old_value; //获取反应速度的相对数值
        old_value = new_value;

        // 调用PID 第一个参数 传入当前值， 第二个参数 传入我们理想的速度值， 可用根据不同编码器的脉冲数来进行对应映射的计算，算出角速度。如果只是需要反应速度的快慢，想提速就增大第二个参数值即可，然后转速就会随之改变，最后实时速度的数值会趋于第二个参数，即目标速度
        
        output_pwm += PID.caculate(delta, 12);

        // 我们需要对 pwm 进行 限幅 
        // 有两个原因 一是起到保护作用 二是pico 计数不能超过 65535 
        
        if (output_pwm > 65000)
        {
            output_pwm = 65000;
        }

        if (output_pwm < 0)
        {
            output_pwm = 0;
        }

        pwm_set_chan_level(slice_num, PWM_CHAN_A, output_pwm);

        std::cout << "position " << new_value << " delta " << delta << "  pwm " << output_pwm*100/62500 <<"%" << std::endl;

        sleep_ms(2);
    }
}

```

## 编译代码与调试

### 编译

进入项目目录 创建并进入 build 目录,在修改 CMakeLists.txt 后需要重新执行 " cmake .. ", 修改 cpp 源代码 只需要重新执行 make 完成编译

```bash
cd ~/pico_project
mkdir build
cd build
cmake ..
make
```

### 烧录

```bash
cp ~/pico_project/build/motor_control.uf2 /media/$USER/RPI-RP2
```
### 调试

```bash
sudo minicom -D /dev/serial/by-id/usb-Raspberry_Pi_Pico_E6605481DB64B936-if00
```

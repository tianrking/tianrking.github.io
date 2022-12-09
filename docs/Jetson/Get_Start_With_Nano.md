---
description: Get_Start_With_Nano
title: Get_Start_With_Nano
tags:
  - embedded
  - nano
  - jetson
  - ros2
keywords:
  - embedded
  - nano
  - jetson
  - ros2
image: https://github.com/tianrking.png
last_update:
  date: 12/9/2022
  author: w0x7ce

---

### GPIO

[Jetson-GPIO](https://github.com/NVIDIA/jetson-gpio.git)

```bash
sudo pip install Jetson.GPIO
```

```python
import Jetson.GPIO as GPIO
import time as time
# 导入相关库

LED_Pin = 11
GPIO.setmode(GPIO.BOARD)
GPIO.setup(LED_Pin, GPIO.OUT)
# 设置目标引脚及模式

while (True):
   GPIO.output(LED_Pin, GPIO.HIGH)
   time.sleep(2)
   GPIO.output(LED_Pin, GPIO.LOW)
   time.sleep(2)
 # 主循环

GPIO.cleanup()
#清除GPIO的状态
```

### UART

```bash
sudo apt-get install python3-serial

sudo chmod 777 /dev/ttyTHS1
# 开启串口权限,关机后该权限也将被关闭，下次使用串口前需再次重新开启；

git clone https://github.com/JetsonHacksNano/UARTDemo
# 获取串口通讯测试案例
```

```bash
Jetson Nano引脚8（TXD） →USB转TTL模块RX
Jetson Nano 引脚10（RXD） →USB转TTL模块TX
Jetson Nano J引脚6（GND） →USB转TTL模块GN
#Jetson Nano J引脚2（5V） →USB转TTL模块VCC  该引脚可不接
```

```python
#！ /usr/bin/python3
import time
import serial
#导入serial库

serial_port = serial.Serial(
    port="/dev/ttyTHS1",
    baudrate=115200,
    bytesize=serial.EIGHTBITS,
    parity=serial.PARITY_NONE,
    stopbits=serial.STOPBITS_ONE,
)
time.sleep(1)
# 串口配置信息
# 波特率115200，8位数据位，无奇偶校验位，1位停止位

try:
    serial_port.write("UART Demonstration Program\r\n".encode())
    serial_port.write("NVIDIA Jetson Nano Developer Kit\r\n".encode())
    while True:
        if serial_port.inWaiting() > 0:
            data = serial_port.read()
            print(data)
            serial_port.write(data)
            if data == "\r".encode():
                serial_port.write("\n".encode())

except KeyboardInterrupt:
    print("Exiting Program")

except Exception as exception_error:
    print("Error occurred. Exiting Program")
    print("Error: " + str(exception_error))

finally:
    serial_port.close()
    pass
```

### I2C 

#### smbus python IIC

```bash
sudo apt-get install -y python3-smbus
sudo usermod -aG i2c <用户名>				 #添加用户组
sudo reboot								   #重启
```

#### I2Ctool

```bash
sudo apt-get install -y i2c-tools			#下载I2Ctool
apt-cache policy i2c-tools					#检查是否安装成功

sudo i2cdetect -y -r -a 1
```

### Camera

```
sudo apt install v4l-utils
ls /dev/video*
v4l2-ctl --device=/dev/video0 --list-formats-ext
```

#### Gstreamer

```bash
sudo add-apt-repository universe
sudo add-apt-repository multiverse
sudo apt-get update
sudo apt-get install gstreamer1.0-tools gstreamer1.0-alsa gstreamer1.0-plugins-base gstreamer1.0-plugins-good gstreamer1.0-plugins-bad gstreamer1.0-plugins-ugly gstreamer1.0-libav
sudo apt-get install libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev libgstreamer-plugins-good1.0-dev libgstreamer-plugins-bad1.0-dev
```

```python
import CV2

# 设置gstreamer管道参数
def gstreamer_pipeline(
    capture_width=1280, #摄像头预捕获的图像宽度
    capture_height=720, #摄像头预捕获的图像高度
    display_width=1280, #窗口显示的图像宽度
    display_height=720, #窗口显示的图像高度
    framerate=60,       #捕获帧率
    flip_method=0,      #是否旋转图像
):
    return (
        "nvarguscamerasrc ! "
        "video/x-raw(memory:NVMM), "
        "width=(int)%d, height=(int)%d, "
        "format=(string)NV12, framerate=(fraction)%d/1 ! "
        "nvvidconv flip-method=%d ! "
        "video/x-raw, width=(int)%d, height=(int)%d, format=(string)BGRx ! "
        "videoconvert ! "
        "video/x-raw, format=(string)BGR ! appsink"
        % (
            capture_width,
            capture_height,
            framerate,
            flip_method,
            display_width,
            display_height,
        )
    )

if __name__ == "__main__":
    capture_width = 1280
    capture_height = 720

    display_width = 1280
    display_height = 720

    framerate = 60			# 帧数
    flip_method = 0			# 方向

    # 创建管道
    print(gstreamer_pipeline(capture_width,capture_height,display_width,display_height,framerate,flip_method))

    #管道与视频流绑定
    cap = CV2.VideoCapture(gstreamer_pipeline(flip_method=0), CV2.CAP_GSTREAMER)

    if cap.isOpened():
        window_handle = CV2.namedWindow("CSI Camera", CV2.WINDOW_AUTOSIZE)

        # 逐帧显示
        while CV2.getWindowProperty("CSI Camera", 0) >= 0:
            ret_val, img = cap.read()
            CV2.imshow("CSI Camera", img)

            keyCode = CV2.waitKey(30) & 0xFF
            if keyCode == 27:# ESC键退出
                break

        cap.release()
        CV2.destroyAllWindows()
    else:
        print("打开摄像头失败")

```

#### Jetcam


```bash
pip3 install traitlets==4.3.3
pip3 install traitlets
git clone https://github.com/NVIDIA-AI-IOT/jetcam
cd jetcam
sudo python3 setup.py install
```

```python
from jetcam.csi_camera import CSICamera
import CV2

#CSI-0
camera0 = CSICamera(capture_device=0, width=224, height=224)
image0 = camera0.read()
print(image0.shape)
print(camera0.value.shape)

#CSI-1
#camera1 = CSICamera(capture_device=1, width=224, height=224)
#image1 = camera1.read()
#print(image1.shape)
#print(camera1.value.shape)

while 1:
    image0 = camera0.read()
    CV2.imshow("CSI Camera0", image0)

    #image1 = camera1.read()
    #CV2.imshow("CSI Camera1", image1)

    kk = CV2.waitKey(1)
    if kk == ord('q'):  						#按下q键,退出
        break

```
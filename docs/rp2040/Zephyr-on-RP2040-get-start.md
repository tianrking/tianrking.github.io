---
description: Zephyr-on-RP2040-get-start
title: Zephyr on RP2040 Getting started
tags:
  - embedded
  - rp2040
  - zephyr
keywords:
  - embedded
  - rp2040
  - zephyr
image: https://github.com/tianrking.png
last_update:
  date: 12/13/2022
  author: w0x7ce

---

## Get Zephyr and install Python dependencies

```bash
sudo apt install python3-venv

python3 -m venv ~/zephyrproject/.venv

source ~/zephyrproject/.venv/bin/activate

pip install west

west init ~/zephyrproject

cd ~/zephyrproject

west update

west zephyr-export

pip install -r ~/zephyrproject/zephyr/scripts/requirements.txt
```

# Install Zephyr SDK

```bash
cd ~
wget https://github.com/zephyrproject-rtos/sdk-ng/releases/download/v0.15.2/zephyr-sdk-0.15.2_linux-x86_64.tar.gz
wget -O - https://github.com/zephyrproject-rtos/sdk-ng/releases/download/v0.15.2/sha256.sum | shasum --check --ignore-missing
```

```bash
tar xvf zephyr-sdk-0.15.2_linux-x86_64.tar.gz
cd zephyr-sdk-0.15.2
./setup.sh
```

```bash
sudo cp ~/zephyr-sdk-0.15.2/sysroots/x86_64-pokysdk-linux/usr/share/openocd/contrib/60-openocd.rules /etc/udev/rules.d
sudo udevadm control --reload
```

## Build the Blinky Sample

```bash
cd ~/zephyrproject/zephyr
west build -p always -b <your-board-name> samples/basic/blinky

# For RP2040
west build -p always -b rpi_pico samples/basic/blinky
```

## Read Code

DTS

```bash title='~/zephyrproject/zephyr/boards/arm/rpi_pico/rpi_pico.dts'
	// #define PICO_DEFAULT_LED_R_PIN 17 // Xiao RP2040
	// #define PICO_DEFAULT_LED_G_PIN 16 // Xiao RP2040
	// #define PICO_DEFAULT_LED_B_PIN 25 // Xiao RP2040
	leds {
		compatible = "gpio-leds";
		led0: led_0 {
			gpios = <&gpio0 25 GPIO_ACTIVE_HIGH>; //
			label = "LED";
		};
	};

```

```c title='~/zephyrproject/zephyr/samples/basic/blinky/src/main.c'
/*
 * Copyright (c) 2016 Intel Corporation
 *
 * SPDX-License-Identifier: Apache-2.0
 */

#include <zephyr/kernel.h>
#include <zephyr/drivers/gpio.h>

/* 1000 msec = 1 sec */
#define SLEEP_TIME_MS   1000

/* The devicetree node identifier for the "led0" alias. */
#define LED0_NODE DT_ALIAS(led0)

/*
 * A build error on this line means your board is unsupported.
 * See the sample documentation for information on how to fix this.
 */
static const struct gpio_dt_spec led = GPIO_DT_SPEC_GET(LED0_NODE, gpios);


#define PICO_DEFAULT_LED_R_PIN 17 // Xiao RP2040
#define PICO_DEFAULT_LED_G_PIN 16 // Xiao RP2040
#define PICO_DEFAULT_LED_B_PIN 25 // Xiao RP2040

void main(void)
{
	int ret;

	if (!device_is_ready(led.port)) {
		return;
	}

	ret = gpio_pin_configure_dt(&led, GPIO_OUTPUT_ACTIVE);
	if (ret < 0) {
		return;
	}

	while (1) {
		ret = gpio_pin_toggle_dt(&led);
		if (ret < 0) {
			return;
		}
		k_msleep(SLEEP_TIME_MS);
	}
}

```

## Xiao RP2040 Pinout Note

```
#define PICO_DEFAULT_LED_R_PIN 17 // Xiao RP2040
#define PICO_DEFAULT_LED_G_PIN 16 // Xiao RP2040
#define PICO_DEFAULT_LED_B_PIN 25 // Xiao RP2040
```
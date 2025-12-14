---
slug: first-blog-post
title: First Blog Post
authors: [w0x7ce]
tags: [hola, docusaurus]
---

## Arduino

framework-arduinoespressif32 @ https://github.com/espressif/arduino-esp32.git#2.0.17

# ESP32 範例程式清單

## 藍牙 (BLE) 示例

| 示例名稱 | 功能描述 | 開發工具 | 適用晶片 |
| --- | --- | --- | --- |
| BLE5_extended_scan | 演示 Bluetooth 5.0 的擴展廣播和掃描功能 | Arduino IDE / PlatformIO | ESP32 系列 |
| BLE5_multi_advertising | 演示 Bluetooth 5.0 的多廣播功能 | Arduino IDE / PlatformIO | ESP32 系列 |
| BLE5_periodic_advertising | 演示 Bluetooth 5.0 的週期性廣播功能 | Arduino IDE / PlatformIO | ESP32 系列 |
| BLE5_periodic_sync | 演示 Bluetooth 5.0 的週期性同步功能 | Arduino IDE / PlatformIO | ESP32 系列 |
| BLE_Beacon_Scanner | 實現 BLE 信標掃描器 | Arduino IDE / PlatformIO | ESP32 系列 |
| BLE_EddystoneTLM_Beacon | 實現 Eddystone 遙測信標 | Arduino IDE / PlatformIO | ESP32 系列 |
| BLE_EddystoneURL_Beacon | 實現 Eddystone URL 信標 | Arduino IDE / PlatformIO | ESP32 系列 |
| BLE_client | 實現 BLE 客戶端功能 | Arduino IDE / PlatformIO | ESP32 系列 |
| BLE_iBeacon | 實現 iBeacon 協議 | Arduino IDE / PlatformIO | ESP32 系列 |
| BLE_notify | 演示 BLE 特徵值通知功能 | Arduino IDE / PlatformIO | ESP32 系列 |
| BLE_scan | 實現基礎的 BLE 掃描功能 | Arduino IDE / PlatformIO | ESP32 系列 |
| BLE_server | 實現 BLE 伺服器功能 | Arduino IDE / PlatformIO | ESP32 系列 |
| BLE_server_multiconnect | 支持多設備同時連接的 BLE 伺服器 | Arduino IDE / PlatformIO | ESP32 系列 |
| BLE_uart | 通過 BLE 實現串口通信 | Arduino IDE / PlatformIO | ESP32 系列 |
| BLE_write | 演示 BLE 特徵值寫入功能 | Arduino IDE / PlatformIO | ESP32 系列 |

## 經典藍牙示例（不適用於 ESP32-S2, ESP32-C3, ESP32-S3）

| 示例名稱 | 功能描述 | 開發工具 | 適用晶片 |
| --- | --- | --- | --- |
| DiscoverConnect | 經典藍牙設備發現和連接 | Arduino IDE / PlatformIO | ESP32 系列 |
| GetLocalMAC | 獲取本地藍牙 MAC 地址 | Arduino IDE / PlatformIO | ESP32 系列 |
| SerialToSerialBT | 經典藍牙串口通信 | Arduino IDE / PlatformIO | ESP32 系列 |
| SerialToSerialBTM | 經典藍牙多設備串口通信 | Arduino IDE / PlatformIO | ESP32 系列 |
| SerialToSerialBT_SSP_pairing | 經典藍牙安全簡單配對 | Arduino IDE / PlatformIO | ESP32 系列 |
| bt_classic_device_discovery | 經典藍牙設備發現 | Arduino IDE / PlatformIO | ESP32 系列 |
| bt_remove_paired_devices | 刪除已配對的經典藍牙設備 | Arduino IDE / PlatformIO | ESP32 系列 |

## Wi-Fi 示例

| 示例名稱 | 功能描述 | 開發工具 | 適用晶片 |
| --- | --- | --- | --- |
| FTM_Initiator | 實現 802.11 Fine Timing Measurement (FTM) 協議 - 作為發起方 | Arduino IDE / PlatformIO | ESP32-S2, ESP32-C3 |
| FTM_Responder | 實現 802.11 Fine Timing Measurement (FTM) 協議 - 作為響應方 | Arduino IDE / PlatformIO | ESP32-S2, ESP32-C3 |
| SimpleWiFiServer | 實現一個簡單的 Wi-Fi 伺服器 | Arduino IDE / PlatformIO | ESP32 系列 |
| WPS | 實現 Wi-Fi Protected Setup (WPS) 配網 | Arduino IDE / PlatformIO | ESP32 系列, ESP32-S2 |
| WiFiAccessPoint | 創建一個 Wi-Fi 接入點 | Arduino IDE / PlatformIO | ESP32 系列 |
| WiFiBlueToothSwitch | 在 Wi-Fi 和藍牙之間切換 | Arduino IDE / PlatformIO | ESP32 系列 |
| WiFiClient | 實現 Wi-Fi 客戶端功能 | Arduino IDE / PlatformIO | ESP32 系列 |
| WiFiClientBasic | 實現基礎的 Wi-Fi 客戶端功能 | Arduino IDE / PlatformIO | ESP32 系列 |
| WiFiClientConnect | 實現 Wi-Fi 客戶端自動重連功能 | Arduino IDE / PlatformIO | ESP32 系列 |
| WiFiClientEnterprise | 實現 Wi-Fi 企業級連接 | Arduino IDE / PlatformIO | ESP32 系列 |
| WiFiClientEvents | 監聽 Wi-Fi 客戶端事件 | Arduino IDE / PlatformIO | ESP32 系列 |
| WiFiClientStaticIP | 設置 Wi-Fi 客戶端靜態 IP | Arduino IDE / PlatformIO | ESP32 系列 |
| WiFiIPv6 | 演示 IPv6 功能 | Arduino IDE / PlatformIO | ESP32 系列, ESP32-S2 |
| WiFiMulti | 支持多個 Wi-Fi 網絡的切換 | Arduino IDE / PlatformIO | ESP32 系列 |
| WiFiScan | 實現 Wi-Fi 網絡掃描功能 | Arduino IDE / PlatformIO | ESP32 系列 |
| WiFiScanDualAntenna | 利用雙天線進行 Wi-Fi 掃描 | Arduino IDE / PlatformIO | ESP32 系列 |
| WiFiSmartConfig | 實現 SmartConfig 配網功能 | Arduino IDE / PlatformIO | ESP32 系列 |
| WiFiTelnetToSerial | 通過 Telnet 訪問 ESP32 串口 | Arduino IDE / PlatformIO | ESP32 系列, ESP32-S2 |
| WiFiUDPClient | 實現 Wi-Fi UDP 客戶端功能 | Arduino IDE / PlatformIO | ESP32 系列 |

## 其他功能示例

| 示例類別 | 功能描述 | 開發工具 | 適用晶片 |
| --- | --- | --- | --- |
| AnalogOut | DAC 模擬信號輸出 | Arduino IDE / PlatformIO | ESP32 系列 |
| AnalogRead | ADC 模擬信號採集 | Arduino IDE / PlatformIO | ESP32 系列 | 
| Camera | 攝像頭拍照、錄像、視頻流傳輸 | Arduino IDE / PlatformIO | ESP32-Camera | 
| DeepSleep | 深度睡眠低功耗 | Arduino IDE / PlatformIO | ESP32 系列 |
| ESPNow | ESP-NOW 無線通信 | Arduino IDE / PlatformIO | ESP32 系列 | 
| FreeRTOS | 多線程與實時系統 | Arduino IDE / PlatformIO | ESP32 系列 |
| GPIO | 數字 IO 控制和外部中斷 | Arduino IDE / PlatformIO | ESP32 系列 |
| I2S | 數字音頻接口 | Arduino IDE / PlatformIO | ESP32 系列 |
| RMT | 紅外、433MHz 等遠程控制 | Arduino IDE / PlatformIO | ESP32 系列 | 
| Serial | 串口通信 | Arduino IDE / PlatformIO | ESP32 系列 |
| Timer | 硬件定時器 | Arduino IDE / PlatformIO | ESP32 系列 |
| Touch | 電容式觸摸感應 | Arduino IDE / PlatformIO | ESP32 系列 |
| TWAI | CAN 總線通信 | Arduino IDE / PlatformIO | ESP32 系列 |

<!-- truncate -->

## USB 功能示例

| 示例名稱 | 功能描述 | 開發工具 | 適用晶片 |
| --- | --- | --- | --- |
| CompositeDevice | USB 複合設備 | Arduino IDE / PlatformIO | ESP32-S2、ESP32-S3 |
| ConsumerControl | USB 消費類控制設備 | Arduino IDE / PlatformIO | ESP32-S2、ESP32-S3 |
| CustomHIDDevice | 自定義 USB HID 設備 | Arduino IDE / PlatformIO | ESP32-S2、ESP32-S3 |
| FirmwareMSC | U 盤/USB MSC 設備 | Arduino IDE / PlatformIO | ESP32-S2、ESP32-S3 |
| Gamepad | USB 遊戲手柄 | Arduino IDE / PlatformIO | ESP32-S2、ESP32-S3 |
| Keyboard | USB 鍵盤 | Arduino IDE / PlatformIO | ESP32-S2、ESP32-S3 |
| KeyboardAndMouseControl | USB 鍵盤+滑鼠組合 | Arduino IDE / PlatformIO | ESP32-S2、ESP32-S3 |
| Mouse/ButtonMouseControl | USB 滑鼠 | Arduino IDE / PlatformIO | ESP32-S2、ESP32-S3 |
| SystemControl | USB 系統控制設備 | Arduino IDE / PlatformIO | ESP32-S2、ESP32-S3 |
| USBMSC | U 盤/USB MSC 設備 | Arduino IDE / PlatformIO | ESP32-S2、ESP32-S3 |
| USBSerial | 虛擬 USB 串口 | Arduino IDE / PlatformIO | ESP32-S2、ESP32-S3 |
| USBVendor | 自定義 USB 通信協議 | Arduino IDE / PlatformIO | ESP32-S2、ESP32-S3 |
---
id: tutorial
title: 技術筆記
sidebar_label: 技術筆記
sidebar_position: 1
description: w0x7ce 的嵌入式系統、軟體基礎設施與工程實作筆記。
slug: /tutorial
hide_table_of_contents: true
---

# 技術筆記

技術筆記按問題與領域分類，涵蓋版本、工具、限制與驗證邊界。

## 推薦入口

| 領域 | 內容 | 推薦入口 |
|---|---|---|
| Embedded Systems | 晶片、周邊、通訊介面、燒錄與實板除錯 | [TLSR8258：SWS、燒錄與驗證](/embedded/telink/tlsr8258/sws-build-flash-verify) |
| RP2040 / PIO | PIO、UART、PWM、Timer 與資源管理 | [PIO UART 實作](/micro-controladores/RP2040/pio-uart-implementation-rp2040) |
| Linux / Infrastructure | 系統管理、網路、容器與部署 | [Linux 指令參考](/migrated/linux-commands-complete-reference) |
| Docker / DevOps | 容器環境、Kubernetes 與開發工具鏈 | [Docker 入門](/migrated/docker-getting-started-guide) |

## 內容怎麼分類

- **技術筆記**：可持續更新的完整指南、參考資料與故障排除。
- **[開發誌](/blog)**：有日期的實驗過程、設計取捨與階段性結論。
- **[專案](/projects)**：GitHub 原始碼、Release、技術棧與目前狀態。
- **[實驗場](/labs)**：可以直接打開的服務、工具與互動原型。
- **封存內容**：過去的課程筆記與較舊文章，保留作為歷史參考，但不代表目前建議做法。

:::tip[閱讀技術文章時]

先確認文章標示的晶片、SDK、作業系統與最後更新時間。能成功編譯不等於已通過實板或正式環境驗證；文章會盡可能把這些證據分開說明。

:::

## 目前關注的方向

```text
Embedded systems  /  BLE · MCU · Secure Element · Robotics
Local AI          /  Inference · Tooling · Model infrastructure
Infrastructure    /  Rust · Edge · Containers · Network systems
```

使用左側分類瀏覽筆記；專案見[專案](/projects)，時間線見[開發誌](/blog)。

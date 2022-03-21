---
title: "Mermaid"
date: 2022-03-17T23:52:37+08:00
draft: true
---

```mermaid
flowchart TB
A[Yolov5] -->|目标坐标,原始图片,目标类别|B(Lidar Point_Seg)
B --> |获得距离|C{融合结果}
A --> |含框定的图片|C
```
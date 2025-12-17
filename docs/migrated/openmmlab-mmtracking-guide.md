---
legacy: true
id: openmmlab-mmtracking-guide
title: OpenMMLab MMTracking 目标跟踪完整指南
sidebar_label: MMTracking 指南
description: 详细介绍 OpenMMLab MMTracking 框架的安装、配置和使用，包括多目标跟踪算法、模型部署和实战项目
date: 2021-09-30T20:12:44+08:00
tags: [OpenMMLab, MMTracking, 目标跟踪, Python, PyTorch, 计算机视觉]
authors: [w0x7ce]
---

# OpenMMLab MMTracking 目标跟踪完整指南

MMTracking 是 OpenMMLab 开源的多目标跟踪（MOT）工具箱，基于 PyTorch 和 MMCV 构建。本指南将详细介绍 MMTracking 的安装、配置和使用方法。

## 环境准备

### 系统要求

- **操作系统**：Linux (Ubuntu 18.04+)
- **Python**：3.6-3.9
- **CUDA**：10.0-11.4
- **PyTorch**：1.3.0-1.10.0
- **GPU**：NVIDIA GPU（建议 8GB+ 显存）

### 环境配置示例

以下是实际运行环境：

```bash
$ nvidia-smi
Fri Oct  1 10:29:58 2021
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 450.142.00   Driver Version: 450.142.00   CUDA Version: 11.0     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  GeForce GTX 105...  Off  | 00000000:01:00.0 Off |                  N/A |
| N/A   36C    P8    N/A /  N/A |    461MiB /  4042MiB |     17%      Default |
|                               |                      |                  |
+-------------------------------+----------------------+----------------------+

| Processes:                                                                  |
|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
|        ID   ID                                                   Usage      |
|=============================================================================|
|    0   N/A  N/A      1308      G   /usr/lib/xorg/Xorg                 45MiB |
|    0   N/A  N/A      1806      G   /usr/lib/xorg/Xorg                173MiB |
|    0   N/A  N/A      1985      G   /usr/bin/gnome-shell              162MiB |
+-----------------------------------------------------------------------------+
```

## 安装步骤

### 1. 创建虚拟环境

```bash
# 使用 Conda 创建独立环境
conda create -n open-mmlab python=3.7 -y

# 激活环境
conda activate open-mmlab
```

### 2. 安装 PyTorch

根据 CUDA 版本选择合适的 PyTorch 版本：

```bash
# CUDA 11.0
conda install pytorch cudatoolkit=11.0 torchvision -c pytorch

# CUDA 10.2
# conda install pytorch cudatoolkit=10.2 torchvision -c pytorch

# CPU 版本（不推荐）
# conda install pytorch torchvision cpuonly -c pytorch
```

### 3. 安装 MMCV

```bash
# 安装完整版 MMCV（包含 CUDA 扩展）
pip install mmcv-full -f https://download.openmmlab.com/mmcv/dist/cu110/torch1.7.0/index.html

# 验证安装
python -c "import mmcv; print(mmcv.__version__)"
```

### 4. 安装 MMDetection

```bash
# 安装 MMDetection
pip install mmdet
```

### 5. 安装 MMTracking

```bash
# 克隆仓库
git clone https://github.com/open-mmlab/mmtracking.git
cd mmtracking

# 安装依赖
pip install -r requirements/build.txt

# 以开发模式安装
pip install -v -e .

# 或者使用 setup.py
# python setup.py develop
```

## MMTracking 简介

### 核心特性

- **统一框架**：支持多种跟踪算法（SOT、MOT、VOS）
- **模块化设计**：检测器、跟踪器、重新识别器可独立配置
- **丰富的模型**：提供多种预训练模型
- **易于扩展**：支持自定义算法和数据集

### 支持的算法

#### 1. 单目标跟踪（SOT）

- **SiameseRPN++**：基于孪生网络的目标跟踪
- **ATOM**：目标感知跟踪网络

#### 2. 多目标跟踪（MOT）

- **DeepSORT**：深度关联度量跟踪
- **FairMOT**：基于公平关联的多目标跟踪
- **Tracktor**：跟踪到检测跟踪算法

#### 3. 视频目标分割（VOS）

- **MaskTrackRCNN**：视频实例分割

## 基本使用

### 1. 运行演示

#### 多目标跟踪演示

```bash
# 运行 MOT 演示
python demo/demo_mot.py \
    configs/mot/deepsort/sort_faster-rcnn_fpn_4e_mot17-private.py \
    --input demo/demo.mp4 \
    --output mot_output.mp4
```

参数说明：
- `--input`：输入视频路径
- `--output`：输出视频路径
- `--checkpoint`：预训练模型路径（可选）

#### 单目标跟踪演示

```bash
# 运行 SOT 演示
python demo/demo_sot.py \
    configs/sot/siamese_rpn/siamese_rpn_r50_1x_lasot.py \
    --input demo/demo.mp4 \
    --output sot_output.mp4
```

### 2. 训练模型

#### 多目标跟踪训练

```bash
# 训练 FairMOT 模型
python tools/train.py configs/mot/fairmot/fairmot_hrnetv2-w18_dw_8x4_620e_coco.py

# 指定 GPU
python tools/train.py \
    configs/mot/fairmot/fairmot_hrnetv2-w18_dw_8x4_620e_coco.py \
    --gpus 4 \
    --work-dir work_dirs/fairmot
```

#### 自定义训练

```python
# 1. 准备数据集
# 将数据集按照 COCO 格式组织

# 2. 修改配置文件
# configs/mot/fairmot/custom_fairmot.py

# 3. 开始训练
python tools/train.py configs/mot/fairmot/custom_fairmot.py
```

### 3. 模型评估

```bash
# 评估 MOT 模型
python tools/test_mot.py \
    configs/mot/fairmot/fairmot_hrnetv2-w18_dw_8x4_620e_coco.py \
    checkpoints/fairmot_hrnetv2-w18_dw_8x4_620e_coco_20211124_124232-0d2b1b3a.pth \
    --eval bbox track

# 评估 SOT 模型
python tools/test_sot.py \
    configs/sot/siamese_rpn/siamese_rpn_r50_1x_lasot.py \
    checkpoints/siamese_rpn_r50_1x_lasot_20211203_151612-da22e5e4.pth \
    --output-dir work_dirs/sot_results
```

### 4. 模型测试

```bash
# 测试并输出视频
python tools/test.py \
    configs/mot/deepsort/sort_faster-rcnn_fpn_4e_mot17-private.py \
    checkpoints/deepsort.pth \
    --out mot_results.mp4
```

## 配置文件详解

### MOT 配置文件结构

```python
# configs/mot/fairmot/fairmot_hrnetv2-w18_dw_8x4_620e_coco.py

# 模型配置
model = dict(
    type='FairMOT',  # 模型类型
    backbone=dict(  # 骨干网络
        type='HRNet',
        extra=dict(
            stage1=dict(num_channels=64),
            stage2=dict(num_channels=[18, 36, 72, 144]),
        )
    ),
    neck=dict(  # 颈部网络
        type='HRNetNeck',
    ),
    head=dict(  # 检测头
        type='FairMOTHead',
    ),
    tracker=dict(  # 跟踪器
        type='BaseTracker',
        obj_score_thr=0.4,
        # ... 其他参数
    )
)

# 数据配置
data = dict(
    train=dict(
        type='MOT17Dataset',
        ann_file='data/MOT17/annotations/train.json',
        # ... 其他配置
    ),
    val=dict(
        type='MOT17Dataset',
        ann_file='data/MOT17/annotations/val.json',
    ),
    test=dict(
        type='MOT17Dataset',
        ann_file='data/MOT17/annotations/test.json',
    )
)

# 训练配置
optimizer = dict(
    type='AdamW',
    lr=0.0001,
    weight_decay=0.05,
)

lr_config = dict(
    policy='step',
    step=[40, 90]
)

total_epochs = 120
```

### 自定义配置示例

```python
# custom_mot_config.py
model = dict(
    type='FairMOT',
    backbone=dict(
        type='HRNet',
        extra=dict(
            stage1=dict(num_channels=64),
            stage2=dict(num_channels=[18, 36, 72, 144]),
            stage3=dict(num_channels=[18, 36, 72, 144]),
            stage4=dict(num_channels=[18, 36, 72, 144]),
        )
    ),
    neck=dict(type='HRNetNeck'),
    head=dict(
        type='FairMOTHead',
        num_classes=1,
    ),
    tracker=dict(
        type='BaseTracker',
        obj_score_thr=0.5,  # 提高置信度阈值
        nms_thr=0.6,
        motion=dict(type='KalmanFilter'),
    )
)

# 数据增强
img_norm_cfg = dict(
    mean=[0, 0, 0],
    std=[255, 255, 255],
    to_rgb=True
)

train_pipeline = [
    dict(type='LoadImageFromFile'),
    dict(type='LoadAnnotations', with_cls=True, with_bbox=True),
    dict(type='Resize', img_scale=(800, 1440), keep_ratio=True),
    dict(type='RandomFlip', flip_ratio=0.5),
    dict(type='Normalize', **img_norm_cfg),
    dict(type='Pad', size_divisor=32),
    dict(type='DefaultFormatBundle'),
    dict(type='Collect', keys=['img', 'gt_bboxes', 'gt_labels']),
]
```

## 实战项目

### 项目 1：实时行人跟踪

```python
#!/usr/bin/env python
# realtime_pedestrian_tracking.py

import cv2
import numpy as np
from mmtrack.apis import init_model, inference_mot

# 初始化模型
config_file = 'configs/mot/fairmot/fairmot_hrnetv2-w18_dw_8x4_620e_coco.py'
checkpoint_file = 'checkpoints/fairmot_hrnetv2-w18_dw_8x4_620e_coco_20211124_124232-0d2b1b3a.pth'
model = init_model(config_file, checkpoint_file, device='cuda:0')

# 打开摄像头
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # 推理
    result = inference_mot(model, frame, frame_id=0)

    # 可视化
    vis_frame = mmtrack_show_result(
        frame,
        result,
        thickness=2,
        font_size=12
    )

    cv2.imshow('Realtime MOT', vis_frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
```

### 项目 2：自定义数据集训练

#### 数据集准备

```bash
# 创建数据集目录
mkdir -p data/custom_mot/images/train
mkdir -p data/custom_mot/images/val
mkdir -p data/custom_mot/annotations

# 准备图像
# 将图像放入对应目录，命名为 000001.jpg, 000002.jpg, ...

# 创建标注文件
# data/custom_mot/annotations/train.json
[
    {
        "filename": "000001.jpg",
        "width": 1920,
        "height": 1080,
        "ann": {
            "bboxes": [[100, 100, 200, 300]],
            "labels": [0],
            "instances": [1]
        }
    }
]
```

#### 配置文件

```python
# configs/mot/fairmot/fairmot_custom_dataset.py

# 数据集配置
data = dict(
    train=dict(
        type='MOT17Dataset',
        ann_file='data/custom_mot/annotations/train.json',
        img_prefix='data/custom_mot/images/train/',
        pipeline=[
            dict(type='LoadImageFromFile'),
            dict(type='LoadAnnotations', with_cls=True, with_bbox=True),
            dict(type='Resize', img_scale=(800, 1440), keep_ratio=True),
            dict(type='RandomFlip', flip_ratio=0.5),
            dict(type='Normalize', mean=[0, 0, 0], std=[255, 255, 255]),
            dict(type='Pad', size_divisor=32),
            dict(type='DefaultFormatBundle'),
            dict(type='Collect', keys=['img', 'gt_bboxes', 'gt_labels']),
        ],
    ),
    val=dict(
        type='MOT17Dataset',
        ann_file='data/custom_mot/annotations/val.json',
        img_prefix='data/custom_mot/images/val/',
        pipeline=[
            dict(type='LoadImageFromFile'),
            dict(type='LoadAnnotations', with_cls=True, with_bbox=True),
            dict(type='Resize', img_scale=(800, 1440), keep_ratio=True),
            dict(type='Normalize', mean=[0, 0, 0], std=[255, 255, 255]),
            dict(type='Pad', size_divisor=32),
            dict(type='DefaultFormatBundle'),
            dict(type='Collect', keys=['img', 'gt_bboxes', 'gt_labels']),
        ],
    ),
    test=dict(
        type='MOT17Dataset',
        ann_file='data/custom_mot/annotations/test.json',
        img_prefix='data/custom_mot/images/test/',
        pipeline=[
            dict(type='LoadImageFromFile'),
            dict(type='LoadAnnotations', with_cls=False, with_bbox=True),
            dict(type='Resize', img_scale=(800, 1440), keep_ratio=True),
            dict(type='Normalize', mean=[0, 0, 0], std=[255, 255, 255]),
            dict(type='Pad', size_divisor=32),
            dict(type='DefaultFormatBundle'),
            dict(type='Collect', keys=['img', 'gt_bboxes']),
        ],
    )
)
```

#### 训练脚本

```bash
# 训练
python tools/train.py configs/mot/fairmot/fairmot_custom_dataset.py

# 验证
python tools/test_mot.py \
    configs/mot/fairmot/fairmot_custom_dataset.py \
    work_dirs/fairmot_custom/latest.pth \
    --eval track
```

### 项目 3：多摄像头跟踪

```python
#!/usr/bin/env python
# multi_camera_tracking.py

import cv2
from mmtrack.apis import init_model, inference_mot
from collections import defaultdict

# 初始化模型
config_file = 'configs/mot/fairmot/fairmot_hrnetv2-w18_dw_8x4_620e_coco.py'
checkpoint_file = 'checkpoints/fairmot_hrnetv2-w18_dw_8x4_620e_coco_20211124_124232-0d2b1b3a.pth'
model = init_model(config_file, checkpoint_file, device='cuda:0')

# 多摄像头
cameras = {
    'camera_1': cv2.VideoCapture('rtsp://camera1:554/stream'),
    'camera_2': cv2.VideoCapture('rtsp://camera2:554/stream'),
    'camera_3': cv2.VideoCapture('rtsp://camera3:554/stream'),
}

# 全局跟踪ID
global_tracker = defaultdict(int)
next_id = 1

while True:
    frames = {}

    # 读取所有摄像头
    for cam_id, cap in cameras.items():
        ret, frame = cap.read()
        if ret:
            frames[cam_id] = frame

    # 处理每一帧
    results = {}
    for cam_id, frame in frames.items():
        result = inference_mot(model, frame, frame_id=0)
        results[cam_id] = result

    # 跨摄像头关联（简化版）
    all_detections = []
    for cam_id, result in results.items():
        for det in result['track_bboxes']:
            x1, y1, x2, y2, conf, cls, track_id = det
            all_detections.append({
                'camera': cam_id,
                'bbox': [x1, y1, x2, y2],
                'conf': conf,
                'track_id': track_id
            })

    # 在这里实现跨摄像头ID关联逻辑
    # 例如：使用外观特征匹配、时间一致性等

    # 可视化
    for cam_id, frame in frames.items():
        result = results[cam_id]
        vis_frame = mmtrack_show_result(frame, result)
        cv2.imshow(f'Camera {cam_id}', vis_frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# 释放资源
for cap in cameras.values():
    cap.release()
cv2.destroyAllWindows()
```

## 性能优化

### 1. 推理加速

```python
# 使用 TensorRT 加速（实验性功能）
# 参考：https://github.com/open-mmlab/mmtracking/blob/master/docs_zh_CN/deploy/tensorrt_plugin.md

# 转换为 ONNX
python tools/deployment/pytorch2onnx.py \
    configs/mot/fairmot/fairmot_hrnetv2-w18_dw_8x4_620e_coco.py \
    checkpoints/fairmot.pth \
    --output-file fairmot.onnx

# 使用 TensorRT 推理
# 参考官方文档配置 TensorRT 插件
```

### 2. 内存优化

```python
# 减少批量大小
model = dict(
    train_cfg=dict(
        sampler=dict(num_workers=2),  # 减少数据加载进程
    )
)

# 使用半精度训练
optimizer_config = dict(
    grad_clip=dict(max_norm=35, norm_type=2)
)

# 混合精度训练
fp16 = dict(
    loss_scale=512.
)
```

### 3. 数据处理优化

```python
# 使用高效的数据加载
data = dict(
    train=dict(
        type='MOT17Dataset',
        # ... 其他配置
        sampler=dict(
            type='GroupSampler',
            group_ratio=0.5,
            num_datasets=1,
            samples_per_gpu=2,  # 减少每 GPU 样本数
        ),
        persistent_workers=True,  # 保持 worker 进程
    )
)
```

## 常见问题解决

### 问题 1：CUDA 版本不匹配

```bash
# 错误信息：CUDA mismatch
# 解决：检查 CUDA 和 PyTorch 版本

# 检查 CUDA 版本
nvcc --version
nvidia-smi

# 重新安装匹配的 PyTorch
pip uninstall torch torchvision
pip install torch==1.7.0+cu110 torchvision==0.8.0+cu110 -f https://download.pytorch.org/whl/torch_stable.html
```

### 问题 2：mmcv-full 安装失败

```bash
# 解决方案 1：使用预编译版本
pip install mmcv-full -f https://download.openmmlab.com/mmcv/dist/cu110/torch1.7.0/index.html

# 解决方案 2：从源码编译
git clone https://github.com/open-mmlab/mmcv.git
cd mmcv
MMCV_WITH_OPS=1 pip install -e .

# 解决方案 3：使用 mim
pip install -U openmim
mim install mmcv-full
```

### 问题 3：显存不足

```python
# 解决方案：减少 batch size 或使用梯度累积
optimizer = dict(
    type='SGD',
    lr=0.01,
    momentum=0.9,
    weight_decay=0.0001,
    paramwise_cfg=dict(
        custom_keys={'backbone': dict(lr_mult=0.1)}
    )
)

# 梯度累积
train_cfg = dict(
    type='EpochBasedRunner',
    max_epochs=100,
    accumulative_counts=2,  # 梯度累积
)
```

### 问题 4：检测精度低

```python
# 解决方案：调整检测阈值和跟踪参数
model = dict(
    tracker=dict(
        type='BaseTracker',
        obj_score_thr=0.4,  # 降低检测阈值
        nms_thr=0.6,
        # 调整卡尔曼滤波参数
        motion=dict(
            type='KalmanFilter',
            motion_weight=0.05,
        )
    )
)

# 数据增强
train_pipeline = [
    dict(type='LoadImageFromFile'),
    dict(type='LoadAnnotations', with_cls=True, with_bbox=True),
    dict(type='Resize', img_scale=(800, 1440), keep_ratio=True),
    dict(type='RandomFlip', flip_ratio=0.5),
    dict(type='RandomCrop', crop_size=(640, 640)),
    dict(type='Normalize', mean=[0, 0, 0], std=[255, 255, 255]),
    dict(type='Pad', size_divisor=32),
    dict(type='DefaultFormatBundle'),
    dict(type='Collect', keys=['img', 'gt_bboxes', 'gt_labels']),
]
```

### 问题 5：推理速度慢

```python
# 解决方案：模型压缩和量化

# 1. 使用更轻量的骨干网络
model = dict(
    backbone=dict(
        type='MobileNetV2',
        out_indices=(1, 2, 3),  # 减少输出层
    )
)

# 2. 减少输入尺寸
data = dict(
    train=dict(
        img_scale=(640, 480),  # 减小输入尺寸
    )
)

# 3. 使用 TensorRT 推理（需要转换）
# 参考官方文档
```

## 工具和实用脚本

### 视频分析工具

```python
#!/usr/bin/env python
# analyze_tracking_results.py

import cv2
import json
from collections import defaultdict

def analyze_tracking_results(video_path, track_file):
    # 读取跟踪结果
    with open(track_file, 'r') as f:
        tracks = json.load(f)

    # 分析指标
    total_frames = len(tracks)
    total_tracks = len(set(t['track_id'] for frame in tracks for t in frame))
    avg_track_length = np.mean([len([t for t in frame]) for frame in tracks])

    print(f"总帧数: {total_frames}")
    print(f"总轨迹数: {total_tracks}")
    print(f"平均轨迹长度: {avg_track_length:.2f}")

    # 生成可视化
    cap = cv2.VideoCapture(video_path)
    frame_id = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # 绘制跟踪结果
        for track in tracks[frame_id]:
            bbox = track['bbox']
            track_id = track['track_id']

            cv2.rectangle(frame, (int(bbox[0]), int(bbox[1])),
                         (int(bbox[2]), int(bbox[3])), (0, 255, 0), 2)
            cv2.putText(frame, f'ID: {track_id}',
                       (int(bbox[0]), int(bbox[1]-10)),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        cv2.imshow('Tracking Analysis', frame)
        frame_id += 1

        if cv2.waitKey(30) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    analyze_tracking_results('input.mp4', 'tracking_results.json')
```

### 批量处理脚本

```bash
#!/bin/bash
# batch_track.sh

# 批量处理多个视频
for video in videos/*.mp4; do
    echo "Processing $video..."

    # 提取文件名
    basename=$(basename "$video" .mp4)

    # 运行跟踪
    python demo/demo_mot.py \
        configs/mot/fairmot/fairmot_hrnetv2-w18_dw_8x4_620e_coco.py \
        --input "$video" \
        --output "results/${basename}_tracked.mp4"

    echo "Completed: $basename"
done

echo "All videos processed!"
```

### 数据集转换工具

```python
#!/usr/bin/env python
# convert_dataset.py

import json
import os
from pathlib import Path

def convert_coco_to_mot(coco_ann_file, output_dir):
    """将 COCO 格式转换为 MOT 格式"""

    with open(coco_ann_file, 'r') as f:
        coco_data = json.load(f)

    # 创建输出目录
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    # 转换每个视频
    for video in coco_data['videos']:
        video_id = video['id']
        video_name = video['name']

        # 获取该视频的所有帧
        frames = [img for img in coco_data['images'] if img['video_id'] == video_id]
        frames.sort(key=lambda x: x['frame_id'])

        # 转换为 MOT 格式
        mot_data = []
        for frame in frames:
            frame_id = frame['frame_id']
            img_path = frame['file_name']

            # 获取该帧的所有标注
            anns = [ann for ann in coco_data['annotations']
                   if ann['image_id'] == frame['id']]

            # 转换为 MOT 格式
            for ann in anns:
                bbox = ann['bbox']  # [x, y, w, h]
                track_id = ann.get('track_id', 0)

                mot_data.append({
                    'frame_id': frame_id,
                    'track_id': track_id,
                    'bbox': [bbox[0], bbox[1], bbox[0]+bbox[2], bbox[1]+bbox[3]],
                    'conf': 1.0,
                    'category_id': ann['category_id']
                })

        # 保存转换结果
        output_file = output_dir / f"{video_name}.json"
        with open(output_file, 'w') as f:
            json.dump(mot_data, f, indent=2)

        print(f"Converted {video_name}: {len(mot_data)} annotations")

if __name__ == '__main__':
    convert_coco_to_mot('annotations.json', 'mot_annotations')
```

## 模型部署

### 1. ONNX 转换

```bash
# 转换为 ONNX
python tools/deployment/pytorch2onnx.py \
    configs/mot/fairmot/fairmot_hrnetv2-w18_dw_8x4_620e_coco.py \
    checkpoints/fairmot.pth \
    --output-file fairmot.onnx \
    --input-img demo/demo.jpg \
    --shape 800,1440 \
    --dynamic-export
```

### 2. TensorRT 部署

```python
# onnx2tensorrt.py

import onnx
import tensorrt as trt

def convert_onnx_to_tensorrt(onnx_file, output_file, input_shape):
    logger = trt.Logger(trt.Logger.WARNING)
    builder = trt.Builder(logger)
    config = builder.create_builder_config()

    # 创建网络
    network = builder.create_network()
    parser = trt.OnnxParser(network, logger)

    # 解析 ONNX 文件
    with open(onnx_file, 'rb') as f:
        parser.parse(f.read())

    # 配置输入
    config.max_workspace_size = 1 << 30  # 1GB
    builder.max_batch_size = 1
    config.set_flag(trt.BuilderFlag.FP16)

    # 构建引擎
    engine = builder.build_engine(network, config)

    # 保存引擎
    with open(output_file, 'wb') as f:
        f.write(engine.serialize())

if __name__ == '__main__':
    convert_onnx_to_tensorrt(
        'fairmot.onnx',
        'fairmot.trt',
        [1, 3, 800, 1440]
    )
```

### 3. TensorRT 推理

```python
# trt_inference.py

import tensorrt as trt
import cv2
import numpy as np

class TRTEngine:
    def __init__(self, engine_file):
        self.logger = trt.Logger(trt.Logger.WARNING)
        self.engine = self.load_engine(engine_file)
        self.context = self.engine.create_execution_context()

    def load_engine(self, engine_file):
        with open(engine_file, 'rb') as f:
            engine = trt.Runtime(self.logger).deserialize_cuda_engine(f.read())
        return engine

    def inference(self, image):
        # 预处理
        input_data = self.preprocess(image)

        # 设置输入
        self.context.set_binding_shape(0, input_data.shape)
        self.context.set_input_address(0, input_data.ctypes.data)

        # 推理
        outputs = []
        for i in range(self.engine.num_outputs):
            output = np.empty(self.engine.get_binding_shape(i + 1),
                            dtype=np.float32)
            self.context.set_output_address(i + 1, output.ctypes.data)
            outputs.append(output)

        self.context.execute_v2(
            [input_data.ctypes.data] + [out.ctypes.data for out in outputs]
        )

        return outputs

    def preprocess(self, image):
        # 调整大小、归一化等
        img = cv2.resize(image, (1440, 800))
        img = img.astype(np.float32) / 255.0
        img = img.transpose(2, 0, 1)
        img = np.expand_dims(img, axis=0)
        return img

# 使用示例
engine = TRTEngine('fairmot.trt')
results = engine.inference(cv2.imread('test.jpg'))
```

## 最佳实践

### 1. 模型选择指南

| 算法 | 速度 | 精度 | 适用场景 |
|------|------|------|----------|
| FairMOT | 快 | 中 | 实时应用 |
| DeepSORT | 中 | 高 | 高精度需求 |
| Tracktor | 快 | 低 | 快速原型 |

### 2. 参数调优

```python
# 跟踪器参数优化
model = dict(
    tracker=dict(
        # 检测置信度阈值
        obj_score_thr=0.4,

        # NMS 阈值
        nms_thr=0.6,

        # 跟踪丢失后保留时间（帧数）
        lost_nms_thr=0.7,

        # 运动模型权重
        motion=dict(
            type='KalmanFilter',
            motion_weight=0.05,
        ),

        # 外观特征权重
        appearance=dict(
            type='BaseAppearance',
            norm=True,
        )
    )
)
```

### 3. 数据增强策略

```python
# 高级数据增强
train_pipeline = [
    dict(type='LoadImageFromFile'),
    dict(type='LoadAnnotations', with_cls=True, with_bbox=True),

    # 几何变换
    dict(type='Resize', img_scale=[(800, 1440), (960, 1728), (640, 1152)], keep_ratio=True),
    dict(type='RandomFlip', flip_ratio=0.5),
    dict(type='RandomCrop', crop_size=(800, 1440)),

    # 光照变换
    dict(type='ColorJitter', brightness=0.4, contrast=0.4, saturation=0.4, hue=0.1),

    # 噪声和模糊
    dict(type='GaussianBlur', sigma=(0.1, 1.0)),

    # 归一化和填充
    dict(type='Normalize', mean=[0, 0, 0], std=[255, 255, 255]),
    dict(type='Pad', size_divisor=32),
    dict(type='DefaultFormatBundle'),
    dict(type='Collect', keys=['img', 'gt_bboxes', 'gt_labels']),
]
```

### 4. 评估指标

```python
# 自定义评估指标
def evaluate_tracking(results, gt_file):
    """计算 MOT 指标"""
    from motmetrics import mot

    # 加载真实标注
    gt = mot.io.loadtxt(gt_file, fmt='mot15-2D')

    # 加载预测结果
    res = mot.io.loadtxt(results, fmt='mot15-2D')

    # 计算指标
    acc = mot.utils.compare_to_groundtruth(gt, res, 'iou')
    mh = mot.metrics.create()
    summary = mh.compute(acc, name='acc',
                        metrics=['num_frames', 'mota', 'motp', 'idf1', 'idsw'],
                        generate_overall=True)

    print("\nMOT Metrics:")
    print(f"MOTA: {summary['mota'].iloc[0]:.4f}")
    print(f"MOTP: {summary['motp'].iloc[0]:.4f}")
    print(f"IDF1: {summary['idf1'].iloc[0]:.4f}")
    print(f"IDSW: {summary['idsw'].iloc[0]}")

    return summary
```

## 总结

MMTracking 是功能强大的多目标跟踪框架，具有以下优势：

- **模块化设计**：便于定制和扩展
- **丰富算法**：支持多种跟踪算法
- **易用性强**：提供完整的工具链
- **性能优秀**：工业级应用标准

通过本指南，您已经掌握了：
- 环境搭建和依赖安装
- 基础使用和配置方法
- 实战项目案例
- 性能优化技巧
- 模型部署流程

建议在实际项目中：
1. 根据需求选择合适的算法
2. 使用预训练模型进行迁移学习
3. 充分的数据增强提升泛化能力
4. 定期评估和调优模型性能

## 相关资源

- [官方文档](https://mmtracking.readthedocs.io/)
- [GitHub 仓库](https://github.com/open-mmlab/mmtracking)
- [模型库](https://download.openmmlab.com/mmtracking/)
- [教程视频](https://space.bilibili.com/525345601/channel/seriesdetail?sid=1650)

持续学习和实践，您将能够构建高效的多目标跟踪系统！

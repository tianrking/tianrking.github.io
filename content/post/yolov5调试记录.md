---
title: "Yolov5调试记录"
date: 2022-03-11T15:18:53+08:00
draft: true
---

## Install pytorch

``` for cuda 11.4
pip3 install torch==1.10.1+cu113 torchvision==0.11.2+cu113 torchaudio==0.10.1+cu113

conda install pytorch torchvision torchaudio cudatoolkit=11.3 -c pytorch
```

## 多卡训练

```bash
python -m torch.distributed.launch --nproc_per_node 2 train.py --batch 64 --data coco.yaml --weights yolov5s.pt --device 0,1

python -m torch.distributed.launch --nproc_per_node 2 train.py --img 640 --batch-size 16 --epochs 10 --data data/kitti.yaml --cfg models/yolov5s.yaml --weights yolov5s.pt --device 0,1
```

## 数据解压

出现 error: invalid zip file with overlapped components (possible zip bomb)

```bash
sudo apt-get install p7zip
sudo apt-get install p7zip-full
sudo apt-get install p7zip-rar
7z x abc.zip
```

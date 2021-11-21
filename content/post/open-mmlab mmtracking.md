---
title: "Open mmlab mmtracking"
date: 2021-09-30T20:12:44+08:00
draft: false

tags: ["mmlab"]
categories: ["工具","Python","CV","C++","跟踪"]
author: "w0x7ce"

---

# 环境
```
(mmcv) w0x7ce@w0x7ce-XPS-15-9570:~/Desktop/mmtracking$ nvidia-smi 
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
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
                                                                               
+-----------------------------------------------------------------------------+
| Processes:                                                                  |
|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
|        ID   ID                                                   Usage      |
|=============================================================================|
|    0   N/A  N/A      1308      G   /usr/lib/xorg/Xorg                 45MiB |
|    0   N/A  N/A      1806      G   /usr/lib/xorg/Xorg                173MiB |
|    0   N/A  N/A      1985      G   /usr/bin/gnome-shell              162MiB |
|    0   N/A  N/A      2580      G   ...AAAAAAAAA= --shared-files       33MiB |
|    0   N/A  N/A      4535      G   /usr/lib/firefox/firefox            1MiB |
|    0   N/A  N/A      5113      G   ...AAAAAAAAA= --shared-files       35MiB |
+-----------------------------------------------------------------------------+

```


# Install

```
conda create -n open-mmlab python=3.7 -y
conda activate open-mmlab
```

```
conda install pytorch cudatoolkit=11.0 torchvision -c pytorch
```

```
pip install mmcv-full -f https://download.openmmlab.com/mmcv/dist/cu110/torch1.7.0/index.html
pip install mmdet
```

## mmtracking
```
git clone https://github.com/open-mmlab/mmtracking.git
cd mmtracking
```
```
pip install -r requirements/build.txt
pip install -v -e .  # or "python setup.py develop"
```
### mmtracking Verification
```
python demo/demo_mot.py configs/mot/deepsort/sort_faster-rcnn_fpn_4e_mot17-private.py --input demo/demo.mp4 --output mot.mp4
```
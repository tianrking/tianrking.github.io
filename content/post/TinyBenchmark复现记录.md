---
title: "TinyBenchmark复现记录"
date: 2021-09-21T08:04:54+08:00
draft: false

tags: ["Python","Pytorch","Computer Vision"]
categories: ["軟件"]
author: "w0x7ce"

---

# undefined symbol: _ZN2at18SparseCUDATensorIdEv

```
ImportError: /data/repos/maskrcnn-benchmark/maskrcnn_benchmark/_C.cpython-37m-x86_64-linux-gnu.so: 

undefined symbol:

 _ZN2at18SparseCUDATensorIdEv

```

 <a href="https://github.com/facebookresearch/maskrcnn-benchmark/issues/223">参考链接</a>

## 错误内容

 ```
(maskrcnn_benchmark) user_name@server_name: /data/repos/maskrcnn-benchmark$ python tools/train_net.py
Traceback (most recent call last):
File "train_net.py", line 18, in
from maskrcnn_benchmark.engine.inference import inference
File "/data/repos/maskrcnn-benchmark/maskrcnn_benchmark/engine/inference.py", line 10, in
from maskrcnn_benchmark.data.datasets.evaluation import evaluate
File "/data/repos/maskrcnn-benchmark/maskrcnn_benchmark/data/datasets/evaluation/init.py", line 3, in
from .coco import coco_evaluation
File "/data/repos/maskrcnn-benchmark/maskrcnn_benchmark/data/datasets/evaluation/coco/init.py", line 1, in
from .coco_eval import do_coco_evaluation
File "/data/repos/maskrcnn-benchmark/maskrcnn_benchmark/data/datasets/evaluation/coco/coco_eval.py", line 10, in
from maskrcnn_benchmark.structures.boxlist_ops import boxlist_iou
File "/data/repos/maskrcnn-benchmark/maskrcnn_benchmark/structures/boxlist_ops.py", line 6, in
from maskrcnn_benchmark.layers import nms as _box_nms
File "/data/repos/maskrcnn-benchmark/maskrcnn_benchmark/layers/init.py", line 8, in
from .nms import nms
File "/data/repos/maskrcnn-benchmark/maskrcnn_benchmark/layers/nms.py", line 3, in
from maskrcnn_benchmark import _C
ImportError: /data/repos/maskrcnn-benchmark/maskrcnn_benchmark/_C.cpython-37m-x86_64-linux-gnu.so: undefined symbol: _ZN2at18SparseCUDATensorIdEv

 ```

 ## 解决方法

首先确认在拟定工作环境内 ，然后确认各个软件包安装版本
 ```
$source activate maskrcnn_benchmark
$(maskrcnn_benchmark)$ python
```
```
import torch
torch.__version__

```

## 版本修改
```
this problem result from the version of nvcc, you can run by
conda uninstall pytorch
conda uninstall pytorch-nightly
conda uninstall torch
conda uninstall torchvision
because torchvision 0.3.0 has problem,
then:
conda install -c pytorch pytorch-nightly torchvision cudatoolkit=10.0
pip install torchvision==0.2.2
```
# module 'torch._six' has no attribute 'PY3'

## 错误内容

提示诸如 AttributeError: module 'torch._six' has no attribute 'PY3'

```
Traceback (most recent call last):
  File "mmf/tools/scripts/features/extract_features_vmb.py", line 21, in <module>
    from maskrcnn_benchmark.utils.model_serialization import load_state_dict
  File "/content/vqa-maskrcnn-benchmark/maskrcnn_benchmark/utils/model_serialization.py", line 7, in <module>
    from maskrcnn_benchmark.utils.imports import import_file
  File "/content/vqa-maskrcnn-benchmark/maskrcnn_benchmark/utils/imports.py", line 4, in <module>
    if torch._six.PY3:
AttributeError: module 'torch._six' has no attribute 'PY3'
```

## 解决方法

修改此处代码 把PY3变成PY37

```
 /content/vqa-maskrcnn-benchmark/maskrcnn_benchmark/utils/imports.py, change PY3 to PY37
```



 <a href="https://github.com/facebookresearch/mmf/issues/791">参考链接</a>

# TypeError: smooth_l1_loss() got an unexpected keyword argument 'reduction'

## 错误内容
```
 TypeError: smooth_l1_loss() got an unexpected keyword argument 'reduction'

```
 
## 解决方法 
```
Clone this repository (6cbb3d2) and install the requirements
python setup.py build develop
python tools/train_net.py --config-file configs/e2e_faster_rcnn_R_50_C4_1x.yaml
```

<a href="https://github.com/facebookresearch/maskrcnn-benchmark/issues/363">参考链接</a>
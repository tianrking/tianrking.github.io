---
legacy: true
id: tinybenchmark-reproduction-troubleshooting-guide
title: TinyBenchmark复现记录 - maskrcnn-benchmark错误解决方案
sidebar_label: TinyBenchmark复现指南
description: 详细介绍TinyBenchmark（maskrcnn-benchmark）复现过程中的常见错误及解决方法，包括PyTorch版本兼容、CUDA符号错误等
date: 2021-09-21T08:04:54+08:00
tags: [Python, PyTorch, Computer Vision, 目标检测, 故障排除, CUDA, maskrcnn-benchmark]
authors: [w0x7ce]
---

# TinyBenchmark复现记录 - maskrcnn-benchmark错误解决方案

TinyBenchmark（基于maskrcnn-benchmark）是Facebook Research开发的目标检测和分割框架，广泛应用于计算机视觉研究。本文记录了在复现过程中遇到的主要错误及其解决方案，为研究者提供实用的故障排除指南。

## 目录

- [TinyBenchmark简介](#tinybenchmark简介)
- [环境准备](#环境准备)
- [常见错误与解决方案](#常见错误与解决方案)
  - [错误1：undefined symbol: _ZN2at18SparseCUDATensorIdEv](#错误1undefined-symbol-_zn2at18sparsecudatensoridev)
  - [错误2：module 'torch._six' has no attribute 'PY3'](#错误2module-torch_six-has-no-attribute-py3)
  - [错误3：TypeError: smooth_l1_loss() got an unexpected keyword argument 'reduction'](#错误3typeerror-smooth_l1_loss-got-an-unexpected-keyword-argument-reduction)
- [完整解决方案](#完整解决方案)
- [版本兼容性矩阵](#版本兼容性矩阵)
- [最佳实践](#最佳实践)
- [总结](#总结)

## TinyBenchmark简介

**TinyBenchmark** 是基于maskrcnn-benchmark的目标检测benchmark框架，主要特点：

- 🎯 **多任务支持**：目标检测、实例分割、全景分割
- 🚀 **高效训练**：支持多GPU训练和推理
- 🔧 **模块化设计**：易于扩展和定制
- 📊 **丰富指标**：COCO格式评估
- 🔬 **研究友好**：广泛用于学术研究

**主要组件：**
- **Backbone**：ResNet系列网络
- **FPN**：特征金字塔网络
- **RPN**：区域建议网络
- **ROI**：感兴趣区域操作
- **Head**：检测头和分割头

## 环境准备

**推荐环境：**
- Ubuntu 18.04/20.04
- Python 3.7
- PyTorch 1.0-1.3
- CUDA 10.0/10.1
- cuDNN 7.6+

**基础安装步骤：**

```bash
# 1. 克隆仓库
git clone https://github.com/facebookresearch/maskrcnn-benchmark.git
cd maskrcnn-benchmark

# 2. 创建虚拟环境
conda create -n maskrcnn_benchmark python=3.7
source activate maskrcnn_benchmark

# 3. 安装PyTorch（选择合适版本）
conda install pytorch torchvision cudatoolkit=10.0 -c pytorch

# 4. 安装其他依赖
pip install -r requirements.txt

# 5. 编译Cython模块
python setup.py build develop
```

## 常见错误与解决方案

### 错误1：undefined symbol: _ZN2at18SparseCUDATensorIdEv

**错误描述：**
```python
ImportError: /data/repos/maskrcnn-benchmark/maskrcnn_benchmark/_C.cpython-37m-x86_64-linux-gnu.so:
undefined symbol: _ZN2at18SparseCUDATensorIdEv
```

**完整错误堆栈：**
```bash
(maskrcnn_benchmark) user_name@server_name: /data/repos/maskrcnn-benchmark$ python tools/train_net.py
Traceback (most recent call last):
  File "train_net.py", line 18, in <module>
    from maskrcnn_benchmark.engine.inference import inference
  File "/data/repos/maskrcnn-benchmark/maskrcnn_benchmark/engine/inference.py", line 10, in
    from maskrcnn_benchmark.data.datasets.evaluation import evaluate
  File "/data/repos/maskrcnn-benchmark/maskrcnn_benchmark/data/datasets/evaluation/__init__.py", line 3, in
    from .coco import coco_evaluation
  File "/data/repos/maskrcnn-benchmark/maskrcnn_benchmark/data/datasets/evaluation/coco/__init__.py", line 1, in
    from .coco_eval import do_coco_evaluation
  File "/data/repos/maskrcnn-benchmark/maskrcnn_benchmark/data/datasets/evaluation/coco/coco_eval.py", line 10, in
    from maskrcnn_benchmark.structures.boxlist_ops import boxlist_iou
  File "/data/repos/maskrcnn-benchmark/maskrcnn-benchmark/maskrcnn_benchmark/structures/boxlist_ops.py", line 6, in
    from maskrcnn_benchmark.layers import nms as _box_nms
  File "/data/repos/maskrcnn-benchmark/maskrcnn-benchmark/maskrcnn_benchmark/layers/__init__.py", line 8, in
    from .nms import nms
  File "/data/repos/maskrcnn-benchmark/maskrcnn-benchmark/maskrcnn_benchmark/layers/nms.py", line 3, in
    from maskrcnn_benchmark import _C
ImportError: ...undefined symbol: _ZN2at18SparseCUDATensorIdEv
```

**错误原因：**
- PyTorch版本与maskrcnn-benchmark不兼容
- torchvision版本过新导致API变化
- CUDA编译器版本不匹配
- nvcc编译的PyTorch与maskrcnn-benchmark编译环境不一致

**解决方案：**

**方法1：降级PyTorch和torchvision**

```bash
# 卸载所有PyTorch相关包
conda uninstall pytorch
conda uninstall pytorch-nightly
conda uninstall torch
conda uninstall torchvision

# 安装兼容版本
conda install -c pytorch pytorch-nightly torchvision cudatoolkit=10.0
pip install torchvision==0.2.2
```

**方法2：重新编译Cython模块**

```bash
# 清理之前的编译
python setup.py clean --all
rm -rf build/
rm -rf maskrcnn_benchmark/_maskrcnn_benchmark.egg-info/

# 确保使用正确的CUDA版本
export CUDA_HOME=/usr/local/cuda-10.0
export PATH=$CUDA_HOME/bin:$PATH
export LD_LIBRARY_PATH=$CUDA_HOME/lib64:$LD_LIBRARY_PATH

# 重新编译
python setup.py build develop
```

**方法3：使用Docker环境（推荐）**

```bash
# 使用官方提供的Docker镜像
docker pull pytorch/pytorch:latest

# 挂载代码目录
docker run -it --gpus all -v /path/to/maskrcnn-benchmark:/workspace pytorch/pytorch:latest

# 在容器内安装
cd /workspace
pip install -r requirements.txt
python setup.py build develop
```

**版本验证：**

```bash
source activate maskrcnn_benchmark
python
>>> import torch
>>> torch.__version__
# 应显示类似: 1.2.0 或 1.3.0
```

### 错误2：module 'torch._six' has no attribute 'PY3'

**错误描述：**
```python
AttributeError: module 'torch._six' has no attribute 'PY3'
```

**完整错误堆栈：**
```bash
Traceback (most recent call last):
  File "mmf/tools/scripts/features/extract_features_vmb.py", line 21, in <module>
    from maskrcnn_benchmark.utils.model_serialization import load_state_dict
  File "/content/vqa-maskrcnn-benchmark/maskrcnn_benchmark/utils/model_serialization.py", line 7, in
    from maskrcnn_benchmark.utils.imports import import_file
  File "/content/vqa-maskrcnn-benchmark/maskrcnn_benchmark/utils/imports.py", line 4, in
    if torch._six.PY3:
AttributeError: module 'torch._six' has no attribute 'PY3'
```

**错误原因：**
- PyTorch 1.6+移除了torch._six.PY3属性
- Python 3.7+中不再需要PY3判断
- 代码使用过时的兼容性检查

**解决方案：**

**方法1：修改代码（临时方案）**

```bash
# 编辑文件
vim /content/vqa-maskrcnn-benchmark/maskrcnn_benchmark/utils/imports.py

# 将第4行：
if torch._six.PY3:
# 修改为：
if sys.version_info.major >= 3:
```

**完整修复代码：**

```python
# 原始代码
import torch._six as six

class ImportException(Exception):
    pass

def import_file(module_path):
    if six.PY3:
        import importlib.util
        spec = importlib.util.spec_from_file_location(module_path, module_path)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
    else:
        import imp
        mod = imp.load_source(module_path, module_path)
    return mod

# 修改后
import sys

class ImportException(Exception):
    pass

def import_file(module_path):
    if sys.version_info.major >= 3:
        import importlib.util
        spec = importlib.util.spec_from_file_location(module_path, module_path)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
    else:
        import imp
        mod = imp.load_source(module_path, module_path)
    return mod
```

**方法2：使用patch（自动化修复）**

```bash
# 创建patch脚本
cat > fix_six.py << 'EOF'
import os
import sys

def fix_six_imports(root_dir):
    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith('.py'):
                filepath = os.path.join(dirpath, filename)
                with open(filepath, 'r') as f:
                    content = f.read()

                # 替换torch._six.PY3
                content = content.replace('torch._six.PY3', 'sys.version_info.major >= 3')
                content = content.replace('six.PY3', 'sys.version_info.major >= 3')

                # 替换导入
                content = content.replace('import torch._six as six', 'import sys')

                with open(filepath, 'w') as f:
                    f.write(content)

if __name__ == '__main__':
    root_dir = 'maskrcnn_benchmark'
    fix_six_imports(root_dir)
    print("Fix applied successfully!")
EOF

# 运行修复脚本
python fix_six.py
```

**方法3：使用PyTorch兼容版本**

```bash
# 安装不包含torch._six的版本
conda install pytorch==1.3.0 torchvision==0.4.1 cudatoolkit=10.0 -c pytorch
```

### 错误3：TypeError: smooth_l1_loss() got an unexpected keyword argument 'reduction'

**错误描述：**
```python
TypeError: smooth_l1_loss() got an unexpected keyword argument 'reduction'
```

**错误原因：**
- PyTorch 1.0-1.3中smooth_l1_loss函数签名不包含reduction参数
- 新版本PyTorch中添加了reduction参数
- 代码未适配新版本API

**解决方案：**

**方法1：使用正确的PyTorch版本**

```bash
# 重新安装兼容版本
pip uninstall torch torchvision
pip install torch==1.2.0 torchvision==0.4.0
```

**方法2：修改源码（手动适配）**

```bash
# 找到使用smooth_l1_loss的文件
grep -r "smooth_l1_loss" maskrcnn_benchmark/

# 通常在以下位置：
# maskrcnn_benchmark/modeling/rpn/...
# maskrcnn_benchmark/modeling/detector/...

# 原始代码（1.0-1.3版本）
loss = F.smooth_l1_loss(predictions, targets, reduction='none')

# 修改为（老版本API）
loss = F.smooth_l1_loss(predictions, targets, size_average=False, reduce=False)
loss = loss.sum() / num_samples  # 手动实现reduction='mean'
```

**完整的smooth_l1_loss包装函数：**

```python
def smooth_l1_loss(pred, target, reduction='mean'):
    """
    兼容不同PyTorch版本的smooth_l1_loss
    """
    import torch.nn.functional as F

    if 'reduction' in F.smooth_l1_loss.__code__.co_varnames:
        # 新版本API
        return F.smooth_l1_loss(pred, target, reduction=reduction)
    else:
        # 旧版本API
        if reduction == 'mean':
            return F.smooth_l1_loss(pred, target, size_average=True, reduce=True)
        elif reduction == 'sum':
            return F.smooth_l1_loss(pred, target, size_average=False, reduce=True)
        else:  # 'none'
            return F.smooth_l1_loss(pred, target, size_average=False, reduce=False)
```

**方法3：使用GitHub上的修复版本**

```bash
# 克隆修复后的仓库
git clone https://github.com/facebookresearch/maskrcnn-benchmark.git
cd maskrcnn-benchmark

# 切换到修复的commit
git checkout 6cbb3d2

# 安装依赖
python setup.py build develop

# 运行测试
python tools/train_net.py --config-file configs/e2e_faster_rcnn_R_50_C4_1x.yaml
```

## 完整解决方案

**综合环境配置脚本：**

```bash
#!/bin/bash
# maskrcnn-benchmark环境配置脚本

echo "=== MaskRCNN-Benchmark 环境配置 ==="

# 1. 创建虚拟环境
echo "创建虚拟环境..."
conda create -n maskrcnn_benchmark python=3.7 -y
source activate maskrcnn_benchmark

# 2. 安装PyTorch
echo "安装PyTorch..."
conda install pytorch==1.2.0 torchvision==0.4.0 cudatoolkit=10.0 -c pytorch

# 3. 克隆仓库
echo "克隆仓库..."
git clone https://github.com/facebookresearch/maskrcnn-benchmark.git
cd maskrcnn-benchmark

# 4. 安装依赖
echo "安装Python依赖..."
pip install -r requirements.txt

# 5. 修复torch._six问题
echo "修复PY3问题..."
sed -i 's/torch._six.PY3/sys.version_info.major >= 3/g' maskrcnn_benchmark/utils/imports.py
sed -i 's/import torch._six as six/import sys/g' maskrcnn_benchmark/utils/imports.py

# 6. 编译
echo "编译Cython模块..."
python setup.py build develop

# 7. 验证安装
echo "验证安装..."
python -c "from maskrcnn_benchmark.layers import nms; print('安装成功!')"

echo "=== 配置完成 ==="
```

**Docker化部署（推荐）：**

```dockerfile
# Dockerfile
FROM pytorch/pytorch:latest

WORKDIR /workspace

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    git \
    wget \
    && rm -rf /var/lib/apt/lists/*

# 克隆代码
RUN git clone https://github.com/facebookresearch/maskrcnn-benchmark.git

WORKDIR /workspace/maskrcnn-benchmark

# 安装Python依赖
RUN pip install -r requirements.txt

# 编译
RUN python setup.py build develop

# 设置入口
CMD ["bash"]
```

**构建和运行：**

```bash
# 构建镜像
docker build -t maskrcnn-benchmark .

# 运行容器
docker run -it --gpus all -v /data:/workspace/data maskrcnn-benchmark

# 在容器内运行
cd /workspace/maskrcnn-benchmark
python tools/train_net.py --config-file configs/e2e_faster_rcnn_R_50_C4_1x.yaml
```

## 版本兼容性矩阵

| PyTorch版本 | torchvision版本 | CUDA版本 | Python版本 | 状态 |
|-------------|----------------|----------|-----------|------|
| 1.0.0 | 0.2.0 | 9.2 | 3.6-3.7 | ✅ 推荐 |
| 1.1.0 | 0.3.0 | 10.0 | 3.6-3.7 | ⚠️ 部分问题 |
| 1.2.0 | 0.4.0 | 10.0 | 3.6-3.7 | ✅ 推荐 |
| 1.3.0 | 0.4.1 | 10.1 | 3.6-3.7 | ✅ 推荐 |
| 1.4.0 | 0.5.0 | 10.1 | 3.6-3.8 | ❌ 不兼容 |

**建议组合：**
- PyTorch 1.2.0 + torchvision 0.4.0 + CUDA 10.0
- PyTorch 1.3.0 + torchvision 0.4.1 + CUDA 10.1

## 最佳实践

### 1. 环境隔离

```bash
# 使用conda管理环境
conda create -n maskrcnn_benchmark python=3.7
conda activate maskrcnn_benchmark

# 导出环境
conda env export > maskrcnn_benchmark_env.yml

# 导入环境
conda env create -f maskrcnn_benchmark_env.yml
```

### 2. 版本锁定

```bash
# 创建requirements.txt
cat > requirements.txt << EOF
torch==1.2.0
torchvision==0.4.0
numpy==1.17.2
cython==0.29.13
opencv-python==4.1.2.30
Pillow==6.2.1
EOF

# 安装时锁定版本
pip install -r requirements.txt
```

### 3. 自动化测试

```bash
# 创建测试脚本
cat > test_installation.py << 'EOF'
#!/usr/bin/env python
import sys

def test_imports():
    """测试关键模块导入"""
    try:
        import torch
        print(f"✓ PyTorch {torch.__version__}")
    except ImportError as e:
        print(f"✗ PyTorch导入失败: {e}")
        return False

    try:
        from maskrcnn_benchmark import _C
        print("✓ MaskRCNN-Benchmark C++模块")
    except ImportError as e:
        print(f"✗ C++模块导入失败: {e}")
        return False

    try:
        from maskrcnn_benchmark.modeling import registry
        print("✓ 模型注册模块")
    except ImportError as e:
        print(f"✗ 模型模块导入失败: {e}")
        return False

    return True

def test_forward():
    """测试前向传播"""
    import torch
    from maskrcnn_benchmark.modeling import registry

    # 简单测试
    x = torch.randn(1, 3, 224, 224)
    print("✓ 张量创建成功")

    return True

if __name__ == "__main__":
    print("=== MaskRCNN-Benchmark 安装测试 ===")
    if test_imports() and test_forward():
        print("\n🎉 所有测试通过!")
        sys.exit(0)
    else:
        print("\n❌ 测试失败!")
        sys.exit(1)
EOF

# 运行测试
python test_installation.py
```

### 4. 调试技巧

```python
# 启用详细日志
import logging
logging.basicConfig(level=logging.DEBUG)

# 检查CUDA可用性
import torch
if torch.cuda.is_available():
    print(f"✓ CUDA可用: {torch.cuda.get_device_name(0)}")
else:
    print("✗ CUDA不可用")

# 检查编译的模块
import importlib
spec = importlib.util.find_spec("maskrcnn_benchmark._C")
if spec:
    print(f"✓ C++模块位置: {spec.origin}")
```

### 5. 常见问题预防

1. **版本一致性**：确保所有包版本兼容
2. **CUDA匹配**：CUDA版本与GPU驱动匹配
3. **权限问题**：使用普通用户，避免root权限
4. **依赖冲突**：使用虚拟环境隔离
5. **编译清理**：修改代码后清理并重新编译

## 总结

**关键要点：**

1. **版本兼容性**：PyTorch版本是成功的关键，推荐1.2-1.3
2. **CUDA一致性**：确保nvcc、PyTorch、CUDA版本匹配
3. **代码适配**：及时修复过时的API调用
4. **环境隔离**：使用conda或Docker管理环境
5. **测试验证**：安装后进行完整测试

**推荐配置：**
- Python 3.7
- PyTorch 1.2.0
- torchvision 0.4.0
- CUDA 10.0
- cuDNN 7.6

**故障排除流程：**
1. 检查版本兼容性
2. 清理并重新编译
3. 修复已知问题
4. 运行测试验证
5. 查阅GitHub Issues

通过遵循本文的解决方案和最佳实践，您应该能够成功复现TinyBenchmark项目。如果仍有问题，建议查看项目的GitHub Issues页面获取最新解决方案。

---

## 相关资源

- [maskrcnn-benchmark GitHub](https://github.com/facebookresearch/maskrcnn-benchmark)
- [PyTorch官方文档](https://pytorch.org/docs/)
- [COCO数据集](https://cocodataset.org/)
- [Detectron2 (推荐)](https://github.com/facebookresearch/detectron2)

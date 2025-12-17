---
legacy: true
id: pyqt5-qgraphics-guide
title: PyQt5 QGraphics 图形视图完全指南
sidebar_label: PyQt5 QGraphics 指南
description: 详细介绍 PyQt5 QGraphics 框架的使用方法，包括图形场景、视图、基本图形绘制、图片显示和交互操作
date: 2022-05-25T20:12:44+08:00
tags: [PyQt5, Python, GUI, 图形编程, Qt]
authors: [w0x7ce]
---

# PyQt5 QGraphics 图形视图完全指南

QGraphics 是 PyQt5 提供的强大图形视图框架，用于创建交互式 2D 图形界面。本指南将详细介绍 QGraphics 的核心概念、使用方法和实际应用案例，帮助您快速掌握图形视图开发技能。

## QGraphics 框架简介

### 什么是 QGraphics

QGraphics 是 Qt 图形视图架构的核心组件，提供：
- **场景（Scene）**：管理所有图形项目的容器
- **视图（View）**：用于显示场景的窗口组件
- **项目（Items）**：场景中的可绘制和可交互对象

### 核心优势

- **高性能渲染**：优化的绘制和变换
- **丰富的项目类型**：文本、图像、形状等
- **交互支持**：鼠标、键盘事件处理
- **变换功能**：缩放、旋转、剪切
- **分层管理**：Z-order 和分层绘制

### 应用场景

- 图像编辑器
- 流程图设计工具
- 游戏图形界面
- 数据可视化
- CAD 软件界面
- 图表绘制工具

## 安装与环境配置

### 安装 PyQt5

```bash
# 使用 pip 安装
pip install PyQt5

# 或者使用 conda
conda install pyqt

# 验证安装
python -c "import PyQt5; print(PyQt5.QtCore.PYQT_VERSION_STR)"
```

### 基本框架

创建最简单的图形视图应用：

```python
import sys
from PyQt5.QtWidgets import QApplication, QGraphicsScene, QGraphicsView

app = QApplication(sys.argv)

# 创建场景
scene = QGraphicsScene()
scene.addText("Hello, QGraphics!")

# 创建视图
view = QGraphicsView(scene)
view.show()

sys.exit(app.exec_())
```

## 核心组件详解

### 1. QGraphicsScene - 场景管理

场景是 QGraphics 的核心，管理所有图形项目：

```python
from PyQt5.QtWidgets import QGraphicsScene
from PyQt5.QtCore import QRectF

# 创建场景（指定场景矩形）
scene = QGraphicsScene(0, 0, 800, 600)

# 使用 QRectF 指定场景区域
scene = QGraphicsScene(QRectF(0, 0, 1000, 800))

# 创建无限场景（默认）
scene = QGraphicsScene()
```

#### 场景常用方法

| 方法 | 说明 | 示例 |
|------|------|------|
| `addItem(item)` | 添加项目到场景 | `scene.addItem(rect)` |
| `addText(text)` | 添加文本项目 | `scene.addText("Hello")` |
| `addLine(x1, y1, x2, y2)` | 添加线条 | `scene.addLine(0, 0, 100, 100)` |
| `addRect(x, y, w, h)` | 添加矩形 | `scene.addRect(10, 10, 200, 100)` |
| `addEllipse(x, y, w, h)` | 添加椭圆 | `scene.addEllipse(50, 50, 100, 50)` |
| `addPixmap(pm)` | 添加像素图 | `scene.addPixmap(QPixmap("image.png"))` |
| `clear()` | 清空场景 | `scene.clear()` |
| `removeItem(item)` | 移除项目 | `scene.removeItem(item)` |

### 2. QGraphicsView - 视图组件

视图是显示场景的窗口：

```python
from PyQt5.QtWidgets import QGraphicsView
from PyQt5.QtCore import Qt

# 创建视图
view = QGraphicsView(scene)

# 设置视图属性
view.setRenderHint(QPainter.Antialiasing)  # 抗锯齿
view.setDragMode(QGraphicsView.RubberBandDrag)  # 拖拽模式
view.setInteractive(True)  # 启用交互

# 显示视图
view.show()
```

#### 视图常用方法

| 方法 | 说明 | 示例 |
|------|------|------|
| `setScene(scene)` | 设置场景 | `view.setScene(scene)` |
| `centerOn(x, y)` | 居中显示 | `view.centerOn(100, 100)` |
| `fitInView(item)` | 适配显示 | `view.fitInView(item)` |
| `setTransform()` | 设置变换 | `view.setTransform(transform)` |
| `scale()` | 缩放 | `view.scale(1.5, 1.5)` |
| `rotate()` | 旋转 | `view.rotate(45)` |
| `translate()` | 平移 | `view.translate(100, 50)` |

## 图形项目（Graphics Items）

### 1. 文本项目

```python
from PyQt5.QtWidgets import QGraphicsTextItem
from PyQt5.QtGui import QFont

# 创建文本项目
text_item = QGraphicsTextItem("Hello, World!")

# 设置文本属性
text_item.setFont(QFont("Arial", 16))
text_item.setDefaultTextColor(Qt.red)

# 添加到场景
scene.addItem(text_item)

# 设置位置
text_item.setPos(100, 50)

# 设置 HTML 格式
html_text = """
<h1>标题</h1>
<p>这是一个<font color='red'>红色</font>段落。</p>
"""
html_item = QGraphicsTextItem()
html_item.setHtml(html_text)
scene.addItem(html_item)
```

### 2. 线条项目

```python
from PyQt5.QtCore import QLineF
from PyQt5.QtGui import QPen, QColor

# 创建线条
line = scene.addLine(20, 20, 200, 200)

# 设置线条属性
pen = QPen(QColor.red)
pen.setWidth(3)
pen.setStyle(Qt.DashLine)
line.setPen(pen)

# 使用 QLineF
line_f = QLineF(0, 0, 100, 100)
line2 = scene.addLine(line_f)
```

#### 线条样式

```python
# 不同线条样式
pen = QPen()
pen.setWidth(2)

pen.setStyle(Qt.SolidLine)      # 实线
pen.setStyle(Qt.DashLine)       # 虚线
pen.setStyle(Qt.DotLine)        # 点线
pen.setStyle(Qt.DashDotLine)    # 点划线
pen.setStyle(Qt.DashDotDotLine) # 双点划线
```

### 3. 矩形项目

```python
from PyQt5.QtWidgets import QGraphicsRectItem
from PyQt5.QtGui import QBrush, QPen
from PyQt5.QtCore import Qt

# 创建矩形
rect_item = QGraphicsRectItem(10, 10, 200, 100)

# 设置填充
brush = QBrush(Qt.blue)
rect_item.setBrush(brush)

# 设置边框
pen = QPen(Qt.red)
pen.setWidth(3)
rect_item.setPen(pen)

# 添加到场景
scene.addItem(rect_item)

# 创建并设置
rect = scene.addRect(50, 50, 150, 80)
rect.setBrush(QBrush(Qt.green))
rect.setPen(QPen(Qt.black))
```

### 4. 椭圆项目

```python
from PyQt5.QtWidgets import QGraphicsEllipseItem

# 创建椭圆
ellipse = QGraphicsEllipseItem(0, 0, 100, 100)

# 设置位置
ellipse.setPos(100, 100)

# 设置属性
ellipse.setBrush(QBrush(Qt.yellow))
ellipse.setPen(QPen(Qt.blue, 2))

scene.addItem(ellipse)

# 简写方式
ellipse2 = scene.addEllipse(200, 200, 80, 120)
```

### 5. 图片显示

```python
from PyQt5.QtGui import QImage, QPixmap
from PyQt5.QtWidgets import QGraphicsPixmapItem

# 方法 1：直接从文件加载
pixmap = QPixmap("image.png")
pixmap_item = QGraphicsPixmapItem(pixmap)
scene.addItem(pixmap_item)

# 方法 2：使用 QImage
image = QImage("photo.jpg")
pixmap = QPixmap.fromImage(image)
pixmap_item = QGraphicsPixmapItem(pixmap)
scene.addItem(pixmap_item)

# 设置图片位置
pixmap_item.setPos(50, 50)

# 缩放图片
scaled_pixmap = pixmap.scaled(200, 150, Qt.KeepAspectRatio)
pixmap_item.setPixmap(scaled_pixmap)
```

#### 图片显示完整示例

```python
from PyQt5.QtGui import QImage, QPixmap
from PyQt5.QtWidgets import QGraphicsPixmapItem, QGraphicsScene, QGraphicsView, QApplication
import sys

def show_image():
    app = QApplication(sys.argv)

    # 加载图片
    frame = QImage("btc.png")

    if frame.isNull():
        print("图片加载失败！")
        sys.exit(1)

    # 转换为像素图
    pix = QPixmap.fromImage(frame)

    # 创建项目
    item = QGraphicsPixmapItem(pix)

    # 创建场景
    scene = QGraphicsScene()
    scene.addItem(item)

    # 创建视图
    view = QGraphicsView(scene)
    view.setWindowTitle('PyQt5 图片显示')
    view.resize(800, 600)

    # 居中显示
    view.fitInView(item, Qt.KeepAspectRatio)

    view.show()
    sys.exit(app.exec_())

if __name__ == '__main__':
    show_image()
```

## 高级绘图示例

### 示例 1：综合图形绘制

```python
import sys
from PyQt5.QtCore import Qt, QPointF
from PyQt5.QtGui import QPen, QColor, QBrush, QPainter
from PyQt5.QtWidgets import (QApplication, QGraphicsScene, QGraphicsView,
                             QGraphicsRectItem, QGraphicsEllipseItem,
                             QGraphicsPolygonItem)

def draw_comprehensive_graphics():
    app = QApplication(sys.argv)

    # 创建场景
    scene = QGraphicsScene(0, 0, 800, 600)

    # 绘制网格
    draw_grid(scene, 800, 600, 50)

    # 绘制坐标轴
    draw_axes(scene, 800, 600)

    # 绘制矩形
    rect = scene.addRect(100, 100, 150, 100)
    rect.setBrush(QBrush(Qt.blue))
    rect.setPen(QPen(Qt.red, 2))

    # 绘制椭圆
    ellipse = scene.addEllipse(300, 150, 120, 80)
    ellipse.setBrush(QBrush(Qt.green))
    ellipse.setPen(QPen(Qt.blue, 3))

    # 绘制多边形
    points = [QPointF(500, 200), QPointF(550, 250),
              QPointF(600, 200), QPointF(575, 150)]
    polygon_item = QGraphicsPolygonItem(points)
    polygon_item.setBrush(QBrush(Qt.yellow))
    polygon_item.setPen(QPen(Qt.magenta, 2))
    scene.addItem(polygon_item)

    # 绘制线条
    line1 = scene.addLine(100, 400, 700, 400)
    line1.setPen(QPen(Qt.black, 2))

    line2 = scene.addLine(400, 100, 400, 500)
    line2.setPen(QPen(Qt.black, 2))

    # 添加文本
    text_item = scene.addText("PyQt5 QGraphics 演示")
    text_item.setFont(QFont("Arial", 20))
    text_item.setPos(250, 50)

    # 创建视图
    view = QGraphicsView(scene)
    view.setRenderHint(QPainter.Antialiasing)
    view.setWindowTitle("PyQt5 综合图形绘制")
    view.resize(850, 650)
    view.show()

    sys.exit(app.exec_())

def draw_grid(scene, width, height, spacing):
    """绘制网格线"""
    pen = QPen(Qt.lightgray)
    pen.setWidth(1)

    # 垂直线
    for x in range(0, width, spacing):
        scene.addLine(x, 0, x, height, pen)

    # 水平线
    for y in range(0, height, spacing):
        scene.addLine(0, y, width, y, pen)

def draw_axes(scene, width, height):
    """绘制坐标轴"""
    pen = QPen(Qt.black)
    pen.setWidth(3)

    # X 轴
    scene.addLine(50, height - 50, width - 50, height - 50, pen)

    # Y 轴
    scene.addLine(50, height - 50, 50, 50, pen)

if __name__ == '__main__':
    draw_comprehensive_graphics()
```

### 示例 2：动态图形

```python
import sys
import math
from PyQt5.QtCore import QTimer, Qt
from PyQt5.QtGui import QPen, QColor, QBrush
from PyQt5.QtWidgets import QApplication, QGraphicsScene, QGraphicsView

class DynamicGraphics(QGraphicsView):
    def __init__(self):
        super().__init__()

        # 创建场景
        self.scene = QGraphicsScene(0, 0, 600, 400)
        self.setScene(self.scene)

        # 创建圆形
        self.circle = self.scene.addEllipse(0, 0, 50, 50)
        self.circle.setBrush(QBrush(Qt.red))
        self.circle.setPen(QPen(Qt.blue, 2))

        # 动画变量
        self.angle = 0
        self.center_x = 300
        self.center_y = 200
        self.radius = 100

        # 设置定时器
        self.timer = QTimer()
        self.timer.timeout.connect(self.update_animation)
        self.timer.start(50)  # 50ms 更新一次

        # 设置视图
        self.setRenderHint(Qt.AlphaChannel)
        self.setWindowTitle("PyQt5 动态图形")
        self.resize(650, 450)

    def update_animation(self):
        # 计算新位置
        x = self.center_x + self.radius * math.cos(math.radians(self.angle))
        y = self.center_y + self.radius * math.sin(math.radians(self.angle))

        # 更新圆形位置
        self.circle.setPos(x - 25, y - 25)

        # 增加角度
        self.angle = (self.angle + 5) % 360

if __name__ == '__main__':
    app = QApplication(sys.argv)

    window = DynamicGraphics()
    window.show()

    sys.exit(app.exec_())
```

### 示例 3：交互式绘图

```python
import sys
from PyQt5.QtCore import Qt, QPointF
from PyQt5.QtGui import QPen, QColor
from PyQt5.QtWidgets import QApplication, QGraphicsScene, QGraphicsView, QGraphicsLineItem

class InteractiveDrawing(QGraphicsView):
    def __init__(self):
        super().__init__()

        self.scene = QGraphicsScene(0, 0, 800, 600)
        self.setScene(self.scene)

        # 启用交互
        self.setMouseTracking(True)

        # 当前绘制状态
        self.drawing = False
        self.current_line = None
        self.start_point = None

        # 设置视图
        self.setRenderHint(Qt.Antialiasing)
        self.setWindowTitle("交互式绘图")
        self.resize(850, 650)

        # 设置背景色
        self.setStyleSheet("background-color: white;")

    def mousePressEvent(self, event):
        if event.button() == Qt.LeftButton:
            # 开始绘制
            self.drawing = True
            self.start_point = self.mapToScene(event.pos())

            # 创建新线条
            self.current_line = QGraphicsLineItem()
            self.current_line.setPen(QPen(QColor.red, 2))
            self.scene.addItem(self.current_line)

    def mouseMoveEvent(self, event):
        if self.drawing and self.current_line:
            # 更新线条
            current_point = self.mapToScene(event.pos())
            self.current_line.setLine(
                self.start_point.x(), self.start_point.y(),
                current_point.x(), current_point.y()
            )

    def mouseReleaseEvent(self, event):
        if event.button() == Qt.LeftButton and self.drawing:
            # 结束绘制
            self.drawing = False
            self.current_line = None
            self.start_point = None

    def keyPressEvent(self, event):
        if event.key() == Qt.Key_C:
            # 清空场景
            self.scene.clear()
        elif event.key() == Qt.Key_S:
            # 保存为图片
            pixmap = self.grab()
            pixmap.save("drawing.png")

if __name__ == '__main__':
    app = QApplication(sys.argv)

    window = InteractiveDrawing()
    window.show()

    sys.exit(app.exec_())
```

## 项目属性设置

### 位置和变换

```python
# 设置位置
item.setPos(100, 50)  # 设置 x, y 坐标

# 获取位置
pos = item.pos()

# 设置变换
from PyQt5.QtGui import QTransform

transform = QTransform()
transform.rotate(45)  # 旋转 45 度
transform.scale(1.5, 1.5)  # 缩放
item.setTransform(transform)

# 组合变换
item.setTransform(QTransform().rotate(30).scale(2, 1))

# 重置变换
item.resetTransform()
```

### Z 顺序

```python
# 设置 Z 值（层级）
item.setZValue(1.0)  # 值越大越靠前

# 置于顶层
item.setZValue(999)

# 置于底层
item.setZValue(-999)

# 获取 Z 值
z_value = item.zValue()
```

### 可见性和启用状态

```python
# 设置可见性
item.setVisible(False)  # 隐藏
item.setVisible(True)   # 显示

# 设置启用状态
item.setEnabled(False)  # 禁用
item.setEnabled(True)   # 启用

# 切换可见性
item.setVisible(not item.isVisible())
```

### 几何属性

```python
# 边界矩形
rect = item.boundingRect()
print(f"边界: {rect}")

# 形状（用于碰撞检测）
shape = item.shape()

# 包含测试
if item.contains(point):
    print("点包含在项目内")

# 设置工具提示
item.setToolTip("这是一个矩形")

# 设置状态提示
item.setStatusTip("选中此矩形")
```

## 事件处理

### 鼠标事件

```python
from PyQt5.QtWidgets import QGraphicsRectItem
from PyQt5.QtCore import Qt

class CustomRectItem(QGraphicsRectItem):
    def __init__(self, x, y, w, h):
        super().__init__(x, y, w, h)
        self.setAcceptHoverEvents(True)
        self.setFlag(QGraphicsRectItem.ItemIsSelectable, True)
        self.setFlag(QGraphicsRectItem.ItemIsMovable, True)

    def mousePressEvent(self, event):
        print(f"鼠标按下: {event.pos()}")
        super().mousePressEvent(event)

    def mouseReleaseEvent(self, event):
        print(f"鼠标释放: {event.pos()}")
        super().mouseReleaseEvent(event)

    def mouseMoveEvent(self, event):
        print(f"鼠标移动: {event.pos()}")
        super().mouseMoveEvent(event)

    def hoverEnterEvent(self, event):
        print("鼠标进入")
        self.setBrush(Qt.yellow)

    def hoverLeaveEvent(self, event):
        print("鼠标离开")
        self.setBrush(Qt.blue)

    def contextMenuEvent(self, event):
        print("右键菜单")
        # 显示上下文菜单
        super().contextMenuEvent(event)
```

### 键盘事件

```python
from PyQt5.QtWidgets import QGraphicsView
from PyQt5.QtCore import Qt

class KeyHandlingView(QGraphicsView):
    def __init__(self, scene):
        super().__init__(scene)
        self.setFocusPolicy(Qt.StrongFocus)  # 设置焦点策略

    def keyPressEvent(self, event):
        key = event.key()

        if key == Qt.Key_Delete:
            # 删除选中项目
            items = self.scene().selectedItems()
            for item in items:
                self.scene().removeItem(item)

        elif key == Qt.Key_A:
            # 全选
            for item in self.scene().items():
                item.setSelected(True)

        elif key == Qt.Key_D:
            # 复制选中项目
            for item in self.scene().selectedItems():
                new_item = item.clone()
                new_item.setPos(item.x() + 20, item.y() + 20)
                self.scene().addItem(new_item)

        elif key == Qt.Key_R:
            # 旋转选中项目
            for item in self.scene().selectedItems():
                item.rotate(15)

        elif key == Qt.Key_Plus or key == Qt.Key_Equal:
            # 放大
            self.scale(1.1, 1.1)

        elif key == Qt.Key_Minus:
            # 缩小
            self.scale(0.9, 0.9)

        super().keyPressEvent(event)
```

### 拖放事件

```python
class DraggableItem(QGraphicsRectItem):
    def __init__(self, x, y, w, h):
        super().__init__(x, y, w, h)
        self.setFlag(QGraphicsRectItem.ItemIsMovable, True)
        self.setFlag(QGraphicsRectItem.ItemIsSelectable, True)
        self.setAcceptDrops(True)

    def dragEnterEvent(self, event):
        if event.mimeData().hasText():
            event.acceptProposedAction()
        else:
            event.ignore()

    def dragMoveEvent(self, event):
        event.acceptProposedAction()

    def dropEvent(self, event):
        text = event.mimeData().text()
        print(f"接收到拖放文本: {text}")

        # 在放置位置创建文本项目
        text_item = self.scene().addText(text)
        text_item.setPos(event.pos())

        event.acceptProposedAction()
```

## 性能优化

### 1. 视图优化

```python
# 启用抗锯齿
view.setRenderHint(QPainter.Antialiasing, True)

# 启用平滑变换
view.setRenderHint(QPainter.SmoothPixmapTransform, True)

# 优化视图更新
view.setViewportUpdateMode(QGraphicsView.SmartViewportUpdate)

# 设置缓存模式
view.setCacheMode(QGraphicsView.CacheBackground)

# 禁用抗锯齿（提升性能）
view.setRenderHint(QPainter.Antialiasing, False)
```

### 2. 场景优化

```python
# 使用场景矩形限制绘制区域
scene.setSceneRect(0, 0, 1000, 800)

# 清除未使用的项目
scene.update()

# 移除视图外的项目
def removeOffscreenItems(scene, view):
    viewport_rect = view.mapToScene(view.viewport().rect()).boundingRect()
    for item in scene.items():
        if not viewport_rect.intersects(item.sceneBoundingRect()):
            scene.removeItem(item)
```

### 3. 项目优化

```python
# 设置项目标志
item.setFlag(QGraphicsRectItem.ItemIsSelectable, True)
item.setFlag(QGraphicsRectItem.ItemIsMovable, True)

# 禁用未使用的标志
item.setFlag(QGraphicsRectItem.ItemIsFocusable, False)
item.setFlag(QGraphicsRectItem.ItemIsSelectable, False)
```

## 实际应用案例

### 案例 1：简单的图像浏览器

```python
import os
from PyQt5.QtGui import QPixmap, QImageReader
from PyQt5.QtWidgets import QFileDialog, QVBoxLayout, QHBoxLayout, QWidget, QPushButton, QLabel

class ImageViewer(QWidget):
    def __init__(self):
        super().__init__()

        self.scene = QGraphicsScene()
        self.view = QGraphicsView(self.scene)

        self.setup_ui()
        self.setup_connections()

    def setup_ui(self):
        layout = QVBoxLayout()

        # 按钮栏
        button_layout = QHBoxLayout()

        self.open_btn = QPushButton("打开图片")
        self.zoom_in_btn = QPushButton("放大")
        self.zoom_out_btn = QPushButton("缩小")
        self.fit_btn = QPushButton("适配")
        self.actual_btn = QPushButton("实际大小")

        button_layout.addWidget(self.open_btn)
        button_layout.addStretch()
        button_layout.addWidget(self.zoom_in_btn)
        button_layout.addWidget(self.zoom_out_btn)
        button_layout.addWidget(self.fit_btn)
        button_layout.addWidget(self.actual_btn)

        layout.addLayout(button_layout)
        layout.addWidget(self.view)

        self.setLayout(layout)
        self.setWindowTitle("图像浏览器")
        self.resize(800, 600)

    def setup_connections(self):
        self.open_btn.clicked.connect(self.open_image)
        self.zoom_in_btn.clicked.connect(lambda: self.view.scale(1.2, 1.2))
        self.zoom_out_btn.clicked.connect(lambda: self.view.scale(0.8, 0.8))
        self.fit_btn.clicked.connect(self.fit_view)
        self.actual_btn.clicked.connect(self.actual_size)

    def open_image(self):
        file_path, _ = QFileDialog.getOpenFileName(
            self, "选择图片", "", "图片文件 (*.png *.jpg *.jpeg *.bmp *.gif)"
        )

        if file_path:
            pixmap = QPixmap(file_path)
            if not pixmap.isNull():
                self.scene.clear()
                item = self.scene.addPixmap(pixmap)
                self.fit_view()

    def fit_view(self):
        if self.scene.items():
            self.view.fitInView(self.scene.items()[0], Qt.KeepAspectRatio)

    def actual_size(self):
        if self.scene.items():
            self.view.resetTransform()
```

### 案例 2：流程图设计器

```python
from PyQt5.QtWidgets import (QGraphicsRectItem, QGraphicsEllipseItem,
                             QGraphicsTextItem, QGraphicsLineItem)
from PyQt5.QtCore import Qt, QPointF
from PyQt5.QtGui import QPen, QBrush, QFont

class FlowChartNode(QGraphicsRectItem):
    def __init__(self, text, x, y):
        super().__init__(0, 0, 120, 60)
        self.setPos(x, y)
        self.setBrush(QBrush(Qt.white))
        self.setPen(QPen(Qt.black, 2))

        # 添加文本
        self.text_item = QGraphicsTextItem(text, self)
        self.text_item.setPos(10, 20)
        self.text_item.setFont(QFont("Arial", 10))

        # 设置标志
        self.setFlag(QGraphicsRectItem.ItemIsMovable, True)
        self.setFlag(QGraphicsRectItem.ItemIsSelectable, True)

class FlowChartDesigner(QWidget):
    def __init__(self):
        super().__init__()

        self.scene = QGraphicsScene(0, 0, 1000, 800)
        self.view = QGraphicsView(self.scene)

        self.setup_ui()
        self.setup_scene()

    def setup_ui(self):
        from PyQt5.QtWidgets import QVBoxLayout, QHBoxLayout, QPushButton, QComboBox

        layout = QVBoxLayout()

        # 工具栏
        toolbar = QHBoxLayout()

        self.node_combo = QComboBox()
        self.node_combo.addItems(["开始/结束", "处理", "判断"])
        toolbar.addWidget(self.node_combo)

        self.add_node_btn = QPushButton("添加节点")
        toolbar.addWidget(self.add_node_btn)

        toolbar.addStretch()
        layout.addLayout(toolbar)
        layout.addWidget(self.view)

        self.setLayout(layout)
        self.setWindowTitle("流程图设计器")
        self.resize(1050, 850)

    def setup_scene(self):
        # 绘制网格
        for i in range(0, 1000, 50):
            self.scene.addLine(i, 0, i, 800, QPen(Qt.lightgray))
        for i in range(0, 800, 50):
            self.scene.addLine(0, i, 1000, i, QPen(Qt.lightgray))

        # 添加示例节点
        self.add_node("开始", 400, 100)
        self.add_node("处理", 400, 250)
        self.add_node("判断", 400, 400)

    def add_node(self, node_type, x, y):
        if node_type == "开始/结束":
            # 椭圆形
            node = QGraphicsEllipseItem(0, 0, 120, 60)
            node.setPos(x, y)
            node.setBrush(QBrush(Qt.green))
        else:
            node = FlowChartNode(node_type, x, y)

        node.setPen(QPen(Qt.black, 2))
        self.scene.addItem(node)
        return node

if __name__ == '__main__':
    from PyQt5.QtWidgets import QApplication
    import sys

    app = QApplication(sys.argv)

    window = ImageViewer()
    # window = FlowChartDesigner()
    window.show()

    sys.exit(app.exec_())
```

## 故障排除

### 常见问题

#### 1. 图片不显示

```python
# 问题：图片路径错误
pixmap = QPixmap("nonexistent.png")

# 解决：检查文件是否存在
import os
if os.path.exists("image.png"):
    pixmap = QPixmap("image.png")
else:
    print("图片文件不存在")
```

#### 2. 性能问题

```python
# 问题：场景中项目过多导致卡顿

# 解决：优化渲染
view.setRenderHint(QPainter.Antialiasing, False)
view.setViewportUpdateMode(QGraphicsView.SmartViewportUpdate)
scene.setSceneRect(0, 0, width, height)  # 限制场景大小
```

#### 3. 坐标系统混乱

```python
# 问题：项目位置不符合预期

# 解决：理解坐标系统
# QGraphicsView 使用场景坐标
# item.setPos(x, y) 设置的是项目左上角在场景中的位置
```

#### 4. 事件不响应

```python
# 问题：鼠标事件不触发

# 解决：设置项目标志和启用事件
item.setFlag(QGraphicsItem.ItemIsSelectable, True)
item.setFlag(QGraphicsItem.ItemIsMovable, True)
item.setAcceptHoverEvents(True)
```

### 调试技巧

```python
# 1. 打印项目信息
def print_item_info(item):
    print(f"类型: {type(item)}")
    print(f"位置: {item.pos()}")
    print(f"边界: {item.boundingRect()}")
    print(f"可见: {item.isVisible()}")

# 2. 可视化边界（调试用）
item.setPen(QPen(Qt.red, 1))  # 设置红色边框

# 3. 查看场景中的所有项目
for item in scene.items():
    print(f"项目: {item}, 位置: {item.pos()}")
```

## 最佳实践

### 1. 代码组织

```python
# 使用类封装图形项目
class CustomGraphicsItem(QGraphicsRectItem):
    def __init__(self, width, height):
        super().__init__(0, 0, width, height)
        self.setup_appearance()
        self.setup_flags()

    def setup_appearance(self):
        self.setBrush(QBrush(Qt.white))
        self.setPen(QPen(Qt.black, 1))

    def setup_flags(self):
        self.setFlag(QGraphicsRectItem.ItemIsSelectable, True)
        self.setFlag(QGraphicsRectItem.ItemIsMovable, True)

# 使用工厂方法创建项目
def create_shape(shape_type, x, y):
    if shape_type == "rectangle":
        return scene.addRect(x, y, 100, 50)
    elif shape_type == "ellipse":
        return scene.addEllipse(x, y, 100, 50)
```

### 2. 内存管理

```python
# 及时删除不需要的项目
scene.removeItem(item)
del item

# 使用 weakref 避免循环引用
import weakref
self.item_ref = weakref.ref(item)
```

### 3. 用户体验

```python
# 提供视觉反馈
def mousePressEvent(self, event):
    self.original_brush = self.brush()
    self.setBrush(Qt.yellow)  # 高亮显示
    super().mousePressEvent(event)

def mouseReleaseEvent(self, event):
    self.setBrush(self.original_brush)
    super().mouseReleaseEvent(event)
```

## 总结

本指南全面介绍了 PyQt5 QGraphics 框架的使用方法：

- **核心组件**：QGraphicsScene、QGraphicsView、Graphics Items
- **基本绘图**：文本、线条、矩形、椭圆、图片
- **高级特性**：变换、事件处理、性能优化
- **实际应用**：图像浏览器、流程图设计器

掌握 QGraphics 框架将帮助您：
- 创建复杂的 2D 图形界面
- 开发交互式图形应用
- 实现自定义图形组件
- 优化图形渲染性能

## 进阶学习

### 相关主题

- **QPainter 自定义绘制**：重写 paintEvent 方法
- **动画框架**：QPropertyAnimation 和 QSequentialAnimationGroup
- **模型/视图架构**：QGraphicsScene 的模型支持
- **3D 图形**：Qt 3D 模块
- **OpenGL 集成**：QOpenGLWidget

### 推荐资源

- [Qt 官方文档 - Graphics View Framework](https://doc.qt.io/qt-5/graphicsview.html)
- [PyQt5 教程](https://pythonspot.com/pyqt5/)
- [Qt 图形视图示例](https://doc.qt.io/qt-5/qtgraphicslayouts-qgraphicsgridlayout-example.html)

持续实践这些概念和技巧，您将成为 PyQt5 图形视图开发专家！

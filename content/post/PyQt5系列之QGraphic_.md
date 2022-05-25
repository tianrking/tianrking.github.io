---
title: "PyQt5系列之QGraphic"
date: 2022-05-25T20:12:44+08:00
draft: false
---

## QGraphic

- [笔者练习代码repo(持续更新)](https://github.com/tianrking/learn_pyqt5)
- 参考资料  
  - [http://anh.cs.luc.edu/handsonPythonTutorial/graphics.html](http://anh.cs.luc.edu/handsonPythonTutorial/graphics.html)
  - [QGraphicsView Class](https://doc.qt.io/qt-5/qgraphicsview.html)
  - [QGraphicsView](https://doc.qt.io/qtforpython-5/PySide2/QtWidgets/QGraphicsView.html)
  - [Some examples](https://www.pythonguis.com/tutorials/pyqt-qgraphics-vector-graphics/)

- 基本框架

    要可视化场景，首先构造一个 QGraphicsView 对象，将要可视化的场景的地址传递给 QGraphicsView 的构造函数。或者，您可以调用 setScene（） 在稍后设置场景。调用 后，默认情况下，视图将滚动到场景的中心，并显示此时可见的任何项目。例如：show()

    ```Python
    import sys
    from PyQt5.QtWidgets import (QApplication, QGraphicsScene, QGraphicsView)

    app = QApplication(sys.argv)

    scene = QGraphicsScene()
    scene.addText("Hello, world!")

    view = QGraphicsView(scene)
    view.show()

    sys.exit(app.exec_())
    ```

### 显示图片

```Python3
from PyQt5.QtGui import QImage, QPixmap
from PyQt5.QtWidgets import QGraphicsPixmapItem, QGraphicsScene

import sys
from PyQt5.QtWidgets import (QApplication, QGraphicsScene, QGraphicsView, )
# def showImage(self):

app = QApplication(sys.argv)
frame = QImage("../ui_designer/btc.png")  
pix = QPixmap.fromImage(frame)
item = QGraphicsPixmapItem(pix)
scene = QGraphicsScene()
scene.addItem(item)
view = QGraphicsView(scene)
view.setWindowTitle('w0x7ce')
view.resize(480, 320)
view.show()
sys.exit(app.exec_())
```

### 绘制线条

```Python

import sys
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QPen,QColor
from PyQt5.QtWidgets import (QApplication, QGraphicsScene, QGraphicsView, QGraphicsRectItem)

app = QApplication(sys.argv)
scene = QGraphicsScene()

scene.addLine(20, 20, 200, 200)
scene.addText('Test Graphics View')

scene.addRect(0, 0, 320, 240)
scene.addEllipse(100, 100, 100, 100)

rect = QGraphicsRectItem(99, 99, 102, 102)
rect.setPen(QPen(Qt.red))
scene.addItem(rect)

view = QGraphicsView(scene)
view.setWindowTitle('w0x7ce')
view.resize(480, 320)
view.show()
sys.exit(app.exec_())

```

### 绘制图案

```Python
import sys
from PyQt5.QtWidgets import QGraphicsScene, QGraphicsView, QGraphicsRectItem, QGraphicsEllipseItem, QApplication
from PyQt5.QtGui import QBrush, QPen
from PyQt5.QtCore import Qt

app = QApplication(sys.argv)

# 定义一个 400x200 的场景矩形，它的原点在 0,0。
# 如果我们没有在创建时设置它，我们可以稍后使用 .setSceneRect 设置它
scene = QGraphicsScene(0, 0, 400, 200)

# 绘制一个矩形项目，设置尺寸。
rect = QGraphicsRectItem(0, 0, 200, 50)

# 设置场景中矩形的原点（位置）。
rect.setPos(50, 20)

# 定义画笔（填充颜色）。
brush = QBrush(Qt.red)
rect.setBrush(brush)

# 定义笔（线）
pen = QPen(Qt.cyan)
pen.setWidth(10)
rect.setPen(pen)

ellipse = QGraphicsEllipseItem(0, 0, 100, 100)
ellipse.setPos(75, 30)

brush = QBrush(Qt.blue)
ellipse.setBrush(brush)

pen = QPen(Qt.green)
pen.setWidth(5)
ellipse.setPen(pen)

# 将项目添加到场景中。 项目按添加顺序堆叠。
scene.addItem(ellipse)
scene.addItem(rect)


view = QGraphicsView(scene)
view.show()
app.exec_()
```

---
title: "使用Seaborn进行金融数据可视化"
date: 2020-08-09
tags: ["量化"]
category: "金融"
description: "使用Python的Seaborn和Tushare库可视化股票交易热点数据"
---

:::note Archived University Note
This content is from my university archives and may not be reliable or up-to-date.
:::

## 开篇

想寻找近日的交易热点吗？一起来DIY把枯燥的历史数据可视化吧!

### 选择指标

- 波动幅度
- 交易量
- 交易额

### 不足之处

仅简单使用波动幅度平均值来反映某一（地区、行业）交易活跃程度，计算方式不合理。

### 参考资料

- [Color map颜色映射](https://matplotlib.org/tutorials/colors/colormaps.html)
- [Seaborn 基础](https://seaborn.pydata.org/generated/seaborn.heatmap.html)
- [Pandas 合并表](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.merge.html)

### 致谢

XBX tushare简易的数据接口

## 实现

### 导入库

```python
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import tushare as ts
import seaborn as sns
```

### 设置pandas显示参数

```python
pd.set_option('expand_frame_repr', False)
pd.set_option('display.max_rows', 5000)
```

### 设置matplotlib汉语支持

```python
def set_ch():
    from pylab import mpl
    mpl.rcParams['font.sans-serif'] = ['FangSong']  # 将字体设置为仿宋
    mpl.rcParams['axes.unicode_minus'] = False  # 解决保存负号'-'无法正常显示
set_ch()
```

### 获取历史数据（案例使用的是昨日数据）

```python
pro = ts.pro_api('xxx')  # tushare api
data = pro.query('stock_basic', exchange='', list_status='L', fields='ts_code,symbol,name,area,industry,list_date')
data_temp = pd.DataFrame()  # 创建Series
for stock_code in data['ts_code']:
    df_temp = pro.daily(ts_code=stock_code, trade_date='20200807')
    result = pd.merge(df_temp, data, how='left', on='ts_code')  # 连接表
    data_temp = pd.concat([data_temp, result], axis=0)  # 增添到data_temp

    i = i+1
    print(i)
    if i > 1000:  # 获取股票数目
        break

data_temp.to_csv("data1000.csv")  # 保存文件
```

### 读取保存的股票数据

```python
df = pd.read_csv('data1000.csv')
df = df[['ts_code','name','change','vol','amount','area','industry']]
```

### 为演示方便截取前一百只股票

```python
df_temp = df.copy()
df_temp = df_temp[:100]
```

### 绘图

```python
df_heatmap = pd.DataFrame(columns=['地区','行业','波动率'])  # 创建新表

industry_unique = np.array(df_temp['industry'])
industry_unique = np.unique(industry_unique)  # 去除重复产业
area_unique = np.array(df_temp['area'])
area_unique = np.unique(area_unique)  # 去除重复地区

print(df_heatmap.info())

for industry in industry_unique:
    industry_temp = df_temp[df_temp["industry"] == industry]
    for area in area_unique:
        area_temp = industry_temp[industry_temp['area'] == area]
        change = area_temp['change'].mean()  # 用某一地区、某一产业的平均波动情况反映交易的热度

        df2 = pd.DataFrame([[area, industry, change]], columns=['地区', '行业', '波动率'])
        df_heatmap = pd.concat([df_heatmap, df2], axis=0)

print(df_heatmap)
df_heatmap_safe = df_heatmap.copy()  # 确保原数据安全
df_heatmap_safe = df_heatmap_safe.pivot('行业', '地区', '波动率')

plt.figure("A_Stock_Hmap")  # 创建绘图窗口名称
plt.suptitle('行业 地区 波动率')  # 主标题名称
sns.heatmap(df_heatmap_safe, annot=True, center=0, cmap='hsv', linewidths=.5)

plt.figure("相关性")
sns.pairplot(data=df_temp, hue='area')
plt.show()
```

## 成果

![热力图示例](https://forum.quantclass.cn/assets/files/2020-08-08/1596901058-302640-image.png)

![相关性图示例](https://forum.quantclass.cn/assets/files/2020-08-08/1596901072-970737-image.png)

（案例仅选取了100支股票测试）

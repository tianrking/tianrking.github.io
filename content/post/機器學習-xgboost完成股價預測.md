---
title: "機器學習 Xgboost完成股價預測"
date: 2022-03-27T00:35:19+08:00
draft: true

tags: ["Xgboost","ML","Fintech"]
categories: ["機器學習","量化"]
author: "w0x7ce"

---

## Xgboost 是什麽

XGBoost是boosting算法的其中一种。Boosting算法的思想是将许多弱分类器集成在一起形成一个强分类器。因为XGBoost是一种提升树模型，所以它是将许多树模型集成在一起，形成一个很强的分类器。

## 數據獲取

### 安裝tushare

```bash
pip install tushare
```

### 配置token

```bash
import tushare as ts
pro = ts.pro_api("API_TOKEN")
import pandas as pd
import matplotlib.pyplot as plt

import torch
from torch.autograd import Variable
import torch.nn.functional as F
import torch.utils.data as Data
```

### 數據選擇

```bash
df = pro.daily(ts_code='000001.SZ', start_date='20180701', end_date='20180718')
df['date'] = pd.to_datetime(df['trade_date'])
df['adj_close'] = df['close']
df['volume']=df['vol']
df['month'] =  pd.DatetimeIndex(df['trade_date']).month
df = df[['date','open','high','low','close','adj_close','volume','month']]

print(df.head())

```

## 特徵工程

```bash
def feature_engineer(df):

    df['range_hl'] = df['high'] - df['low']
    df['range_oc'] = df['open'] - df['close']

    lag_cols = ['adj_close', 'range_hl', 'range_oc', 'volume']
    shift_range = [x + 1 for x in range(N)]

    for col in lag_cols:
        for i in shift_range:

            new_col='{}_lag_{}'.format(col, i)  
            df[new_col]=df[col].shift(i)

    return df[N:]
```

```bash
test_size = 0.2         #测试集合分割比例
N = 3                   #设置作为特征的历史天数
df = feature_engineer(df)
print(df.head())
```

## 移動平均線計算

```bash
import numpy as np
import copy
# c = copy.deepcopy(a) 新建datafrrame可以深拷贝

def get_mov_avg_std(df, col, N):
  
    mean_list = df[col].rolling(window=N, min_periods=1).mean() 
    std_list = df[col].rolling(window=N, min_periods=1).std()  
    mean_list = np.concatenate((np.array([np.nan]), np.array(mean_list[:-1])))
    std_list = np.concatenate((np.array([np.nan]), np.array(std_list[:-1])))

    df_out = df.copy()

    df_out[col + '_mean'] = mean_list
    df_out[col + '_std'] = std_list

    return df_out

df_ma = get_mov_avg_std(df,"close",3)
print(df_ma.head())
```

## 標準化

```bash
def scale_row(row, feat_mean, feat_std):

    feat_std = 0.001 if feat_std == 0 else feat_std
    row_scaled = (row - feat_mean) / feat_std

    return row_scaled
```

## 開始work

### 準備數據

### 特徵工程

```bash
df=feature_engineer(data_df)
```

### 數據標準化

```bash
cols_list = [
        "adj_close",
        "range_hl",
        "range_oc",
        "volume"
    ]
for col in cols_list:
  df = get_mov_avg_std(df, col, N)
```

### 生成訓練集和測試集

```bash
num_test = int(test_size * len(df))
num_train = len(df) - num_test
train = df[:num_train]
test = df[num_train:]
```

### 特徵標簽標準化

```bash
from sklearn.preprocessing import StandardScaler
from tqdm import tqdm

cols_to_scale = [
      "adj_close"
  ]
for i in range(1, N + 1):
  cols_to_scale.append("adj_close_lag_" + str(i))
  cols_to_scale.append("range_hl_lag_" + str(i))
  cols_to_scale.append("range_oc_lag_" + str(i))
  cols_to_scale.append("volume_lag_" + str(i))

scaler = StandardScaler()
train_scaled = scaler.fit_transform(train[cols_to_scale])

train_scaled = pd.DataFrame(train_scaled, columns=cols_to_scale)
train_scaled[['date', 'month']] = train.reset_index()[['date', 'month']]

test_scaled = test[['date']]
for col in tqdm(cols_list):
  feat_list = [col + '_lag_' + str(shift) for shift in range(1, N + 1)]
  temp = test.apply(lambda row: scale_row(row[feat_list], row[col + '_mean'], row[col + '_std']), axis=1)
  test_scaled = pd.concat([test_scaled, temp], axis=1)

```

### 建立样本

```bash

features = []
for i in range(1, N + 1):
  features.append("adj_close_lag_" + str(i))
  features.append("range_hl_lag_" + str(i))
  features.append("range_oc_lag_" + str(i))
  features.append("volume_lag_" + str(i))

target = "adj_close"

X_train = train[features]
y_train = train[target]
X_sample = test[features]
y_sample = test[target]

X_train_scaled = train_scaled[features]
y_train_scaled = train_scaled[target]
X_sample_scaled = test_scaled[features]

```

### 开始训练

```bash
from xgboost import XGBRegressor
import math

model_seed = 100

from sklearn.model_selection import GridSearchCV
parameters={'n_estimators':[90],
            'max_depth':[7],
            'learning_rate': [0.2],
            'min_child_weight':range(5, 21, 1)，
            }

model=XGBRegressor(seed=model_seed,
                      n_estimators=100,
                      max_depth=3,
                      eval_metric='rmse',
                      learning_rate=0.1,
                      min_child_weight=1,
                      subsample=1,
                      colsample_bytree=1,
                      colsample_bylevel=1,
                      gamma=0)
gs=GridSearchCV(estimator= model,param_grid=parameters,cv=5,refit= True,scoring='neg_mean_squared_error')

gs.fit(X_train_scaled,y_train_scaled)
print ('最优参数: ' + str(gs.best_params_))

```

### 可视化

```bash
from sklearn.metrics import mean_squared_error
est_scaled = gs.predict(X_train_scaled)
train['est'] = est_scaled * math.sqrt(scaler.var_[0]) + scaler.mean_[0]

pre_y_scaled = gs.predict(X_sample_scaled)
test['pre_y_scaled'] = pre_y_scaled
test['pre_y']=test['pre_y_scaled'] * test['adj_close_std'] + test['adj_close_mean']

plt.figure(figsize=(14,10))
ax = test.plot(x='date', y='adj_close', style='b-', grid=True,figsize=(14,10))
ax = test.plot(x='date', y='pre_y', style='r-', grid=True, ax=ax)

plt.show()

rmse=math.sqrt(mean_squared_error(y_sample, test['pre_y']))
print("RMSE on dev  = %0.3f" % rmse)

```

### 参数打印

```bash 
def get_mape(y_true, y_pred):
    y_true, y_pred = np.array(y_true), np.array(y_pred)
    return np.mean(np.abs((y_true - y_pred) / y_true)) * 100
    
mape = get_mape(y_sample, test['pre_y'])
print("MAPE on dev  = %0.3f%%" % mape)

imp = list(zip(train[features], gs.best_estimator_.feature_importances_))
imp.sort(key=lambda tup: tup[1])
for i in range(-1,-10,-1):
  print(imp[i])
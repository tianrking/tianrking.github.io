---
legacy: true
id: pytorch-stock-prediction-guide
title: PyTorch 股价预测完整指南
sidebar_label: PyTorch 股价预测
description: 使用 PyTorch 进行股价预测的完整教程，包括数据预处理、模型构建、训练优化和实战案例
date: 2022-03-28T22:19:15+08:00
tags: [PyTorch, 机器学习, 股价预测, 金融科技, 深度学习, 量化交易]
authors: [w0x7ce]
---

# PyTorch 股价预测完整指南

股价预测是量化金融和机器学习的重要应用领域。本指南将详细介绍如何使用 PyTorch 构建深度学习模型来预测股价走势。

## 环境配置

### 1. 安装依赖

```bash
# 基础环境
pip install torch torchvision
pip install pandas numpy matplotlib seaborn
pip install tushare akshare yfinance

# 数据处理
pip install scikit-learn
pip install ta-lib  # 技术指标库（可选）

# 可视化
pip install plotly
pip install mplfinance  # 金融图表

# Jupyter 支持
pip install jupyter notebook
```

### 2. 导入必要的库

```python
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset
from torchvision import datasets
from torchvision.transforms import ToTensor
from torch.autograd import Variable

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error
import warnings
warnings.filterwarnings('ignore')

# 设置随机种子保证可重现性
torch.manual_seed(42)
np.random.seed(42)
```

## 数据准备

### 1. 数据获取

```python
# 方法 1：使用 akshare 获取股票数据（推荐）
import akshare as ak

def get_stock_data(symbol, start_date, end_date):
    """获取股票数据"""
    try:
        df = ak.stock_zh_a_hist(
            symbol=symbol,  # 股票代码
            period="daily",
            start_date=start_date,
            end_date=end_date,
            adjust="qfq"  # 前复权
        )
        return df
    except Exception as e:
        print(f"获取数据失败: {e}")
        return None

# 获取平安银行数据
df = get_stock_data('000001', '20220101', '20220326')
print(df.head())

# 方法 2：使用 tushare
import tushare as ts

# ts.set_token('your_token')
# pro = ts.pro_api()
# df = pro.daily(ts_code='000001.SZ', start_date='20220101', end_date='20220326')
```

### 2. 数据预处理

```python
def preprocess_data(df):
    """数据预处理"""
    # 选择需要的列
    df = df[['日期', '开盘', '最高', '最低', '收盘', '成交量', '成交额']].copy()
    df.columns = ['date', 'open', 'high', 'low', 'close', 'volume', 'amount']

    # 转换日期格式
    df['date'] = pd.to_datetime(df['date'])

    # 按日期排序
    df = df.sort_values('date').reset_index(drop=True)

    # 基础统计信息
    print("数据基本信息:")
    print(df.info())
    print("\n数据统计:")
    print(df.describe())

    return df

df = preprocess_data(df)

# 数据可视化
plt.figure(figsize=(15, 10))

plt.subplot(2, 2, 1)
plt.plot(df['date'], df['close'])
plt.title('收盘价走势')
plt.xticks(rotation=45)

plt.subplot(2, 2, 2)
plt.plot(df['date'], df['volume'])
plt.title('成交量走势')
plt.xticks(rotation=45)

plt.subplot(2, 2, 3)
plt.hist(df['close'], bins=30, alpha=0.7)
plt.title('收盘价分布')

plt.subplot(2, 2, 4)
plt.scatter(df['volume'], df['close'], alpha=0.6)
plt.title('成交量 vs 收盘价')
plt.xlabel('成交量')
plt.ylabel('收盘价')

plt.tight_layout()
plt.show()
```

### 3. 特征工程

```python
def create_features(df):
    """创建技术指标特征"""
    # 价格相关特征
    df['price_change'] = df['close'].pct_change()
    df['high_low_ratio'] = df['high'] / df['low']
    df['open_close_ratio'] = df['open'] / df['close']

    # 移动平均线
    df['ma5'] = df['close'].rolling(window=5).mean()
    df['ma10'] = df['close'].rolling(window=10).mean()
    df['ma20'] = df['close'].rolling(window=20).mean()

    # 相对强弱指数 (RSI)
    def calculate_rsi(prices, window=14):
        delta = prices.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        return rsi

    df['rsi'] = calculate_rsi(df['close'])

    # 布林带
    df['bollinger_upper'] = df['ma20'] + (df['close'].rolling(window=20).std() * 2)
    df['bollinger_lower'] = df['ma20'] - (df['close'].rolling(window=20).std() * 2)
    df['bollinger_width'] = df['bollinger_upper'] - df['bollinger_lower']

    # MACD
    exp1 = df['close'].ewm(span=12).mean()
    exp2 = df['close'].ewm(span=26).mean()
    df['macd'] = exp1 - exp2
    df['macd_signal'] = df['macd'].ewm(span=9).mean()
    df['macd_hist'] = df['macd'] - df['macd_signal']

    # 成交量特征
    df['volume_ma5'] = df['volume'].rolling(window=5).mean()
    df['volume_ratio'] = df['volume'] / df['volume_ma5']

    # 价格位置
    df['position_in_range'] = (df['close'] - df['low']) / (df['high'] - df['low'])

    return df

df = create_features(df)

# 删除缺失值
df = df.dropna().reset_index(drop=True)
print(f"处理后数据形状: {df.shape}")
```

### 4. 数据标准化

```python
def prepare_data(df, target_col='close', feature_cols=None, seq_len=60, test_size=0.2):
    """准备训练数据"""
    if feature_cols is None:
        # 默认使用所有数值特征
        feature_cols = [col for col in df.select_dtypes(include=[np.number]).columns
                       if col not in ['close', 'date']]

    # 提取特征和目标
    features = df[feature_cols].values
    target = df[target_col].values.reshape(-1, 1)

    # 数据标准化
    feature_scaler = StandardScaler()
    target_scaler = MinMaxScaler()

    features_scaled = feature_scaler.fit_transform(features)
    target_scaled = target_scaler.fit_transform(target)

    # 创建序列数据
    X, y = [], []
    for i in range(seq_len, len(features_scaled)):
        X.append(features_scaled[i-seq_len:i])
        y.append(target_scaled[i])

    X = np.array(X)
    y = np.array(y)

    # 划分训练集和测试集
    split_idx = int(len(X) * (1 - test_size))

    X_train, X_test = X[:split_idx], X[split_idx:]
    y_train, y_test = y[:split_idx], y[split_idx:]

    return (X_train, X_test, y_train, y_test,
            feature_scaler, target_scaler, feature_cols)

# 准备数据
X_train, X_test, y_train, y_test, feature_scaler, target_scaler, feature_cols = prepare_data(df)
print(f"训练集形状: X_train {X_train.shape}, y_train {y_train.shape}")
print(f"测试集形状: X_test {X_test.shape}, y_test {y_test.shape}")
print(f"特征数量: {len(feature_cols)}")
```

## 模型构建

### 1. 简单神经网络模型

```python
class SimpleNet(nn.Module):
    """简单全连接神经网络"""
    def __init__(self, input_size, hidden_sizes, output_size=1, dropout=0.2):
        super(SimpleNet, self).__init__()

        layers = []
        prev_size = input_size

        for hidden_size in hidden_sizes:
            layers.append(nn.Linear(prev_size, hidden_size))
            layers.append(nn.ReLU())
            layers.append(nn.Dropout(dropout))
            prev_size = hidden_size

        layers.append(nn.Linear(prev_size, output_size))

        self.network = nn.Sequential(*layers)

    def forward(self, x):
        return self.network(x)

# 使用示例
input_size = X_train.shape[2]  # 特征数量
hidden_sizes = [128, 64, 32]
model = SimpleNet(input_size, hidden_sizes)
print(model)
```

### 2. LSTM 模型（推荐用于时间序列）

```python
class LSTMPredictor(nn.Module):
    """LSTM 股价预测模型"""
    def __init__(self, input_size, hidden_size, num_layers, output_size=1, dropout=0.2):
        super(LSTMPredictor, self).__init__()

        self.hidden_size = hidden_size
        self.num_layers = num_layers

        self.lstm = nn.LSTM(input_size, hidden_size, num_layers,
                           batch_first=True, dropout=dropout)
        self.fc1 = nn.Linear(hidden_size, hidden_size // 2)
        self.fc2 = nn.Linear(hidden_size // 2, output_size)
        self.dropout = nn.Dropout(dropout)
        self.relu = nn.ReLU()

    def forward(self, x):
        # LSTM 隐藏状态
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)
        c0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)

        # 前向传播
        out, _ = self.lstm(x, (h0, c0))

        # 取最后一个时间步的输出
        out = out[:, -1, :]

        # 全连接层
        out = self.fc1(out)
        out = self.relu(out)
        out = self.dropout(out)
        out = self.fc2(out)

        return out

# 创建 LSTM 模型
input_size = X_train.shape[2]
hidden_size = 64
num_layers = 2
lstm_model = LSTMPredictor(input_size, hidden_size, num_layers)
print(lstm_model)
```

### 3. GRU 模型

```python
class GRUPredictor(nn.Module):
    """GRU 股价预测模型"""
    def __init__(self, input_size, hidden_size, num_layers, output_size=1, dropout=0.2):
        super(GRUPredictor, self).__init__()

        self.hidden_size = hidden_size
        self.num_layers = num_layers

        self.gru = nn.GRU(input_size, hidden_size, num_layers,
                         batch_first=True, dropout=dropout)
        self.fc1 = nn.Linear(hidden_size, hidden_size // 2)
        self.fc2 = nn.Linear(hidden_size // 2, output_size)
        self.dropout = nn.Dropout(dropout)
        self.relu = nn.ReLU()

    def forward(self, x):
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)

        out, _ = self.gru(x, h0)
        out = out[:, -1, :]

        out = self.fc1(out)
        out = self.relu(out)
        out = self.dropout(out)
        out = self.fc2(out)

        return out
```

### 4. Transformer 模型

```python
class StockTransformer(nn.Module):
    """基于 Transformer 的股价预测模型"""
    def __init__(self, input_size, d_model, nhead, num_layers, output_size=1, dropout=0.1):
        super(StockTransformer, self).__init__()

        self.input_projection = nn.Linear(input_size, d_model)
        self.pos_encoding = PositionalEncoding(d_model, dropout)
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=d_model,
            nhead=nhead,
            dim_feedforward=d_model * 4,
            dropout=dropout,
            batch_first=True
        )
        self.transformer_encoder = nn.TransformerEncoder(encoder_layer, num_layers)
        self.fc = nn.Linear(d_model, output_size)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        x = self.input_projection(x)
        x = self.pos_encoding(x)
        x = self.transformer_encoder(x)
        x = x[:, -1, :]  # 取最后一个时间步
        x = self.dropout(x)
        x = self.fc(x)
        return x

class PositionalEncoding(nn.Module):
    def __init__(self, d_model, dropout=0.1, max_len=5000):
        super(PositionalEncoding, self).__init__()
        self.dropout = nn.Dropout(dropout)

        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, d_model, 2).float() *
                           (-np.log(10000.0) / d_model))
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        pe = pe.unsqueeze(0).transpose(0, 1_buffer('pe',)
        self.register pe)

    def forward(self, x):
        x = x + self.pe[:x.size(0), :]
        return self.dropout(x)
```

## 模型训练

### 1. 训练函数

```python
def train_model(model, X_train, y_train, X_test, y_test,
                epochs=100, batch_size=32, learning_rate=0.001):
    """训练模型"""

    # 转换为 Tensor
    X_train_tensor = torch.FloatTensor(X_train).to(device)
    y_train_tensor = torch.FloatTensor(y_train).to(device)
    X_test_tensor = torch.FloatTensor(X_test).to(device)
    y_test_tensor = torch.FloatTensor(y_test).to(device)

    # 创建 DataLoader
    train_dataset = TensorDataset(X_train_tensor, y_train_tensor)
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)

    # 损失函数和优化器
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)
    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, 'min', patience=10, factor=0.5)

    # 训练历史
    train_losses = []
    val_losses = []
    best_val_loss = float('inf')

    print("开始训练...")
    for epoch in range(epochs):
        # 训练模式
        model.train()
        train_loss = 0.0

        for batch_X, batch_y in train_loader:
            optimizer.zero_grad()

            outputs = model(batch_X)
            loss = criterion(outputs, batch_y)
            loss.backward()

            optimizer.step()

            train_loss += loss.item()

        train_loss /= len(train_loader)
        train_losses.append(train_loss)

        # 验证模式
        model.eval()
        with torch.no_grad():
            val_outputs = model(X_test_tensor)
            val_loss = criterion(val_outputs, y_test_tensor).item()
            val_losses.append(val_loss)

        # 学习率调度
        scheduler.step(val_loss)

        # 保存最佳模型
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save(model.state_dict(), 'best_model.pth')

        # 打印进度
        if (epoch + 1) % 10 == 0:
            print(f'Epoch [{epoch+1}/{epochs}], '
                  f'Train Loss: {train_loss:.6f}, '
                  f'Val Loss: {val_loss:.6f}')

    # 加载最佳模型
    model.load_state_dict(torch.load('best_model.pth'))

    return train_losses, val_losses
```

### 2. 模型训练（示例）

```python
# 选择设备
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"使用设备: {device}")

# 创建和训练 LSTM 模型
lstm_model = LSTMPredictor(input_size, hidden_size, num_layers).to(device)
train_losses, val_losses = train_model(lstm_model, X_train, y_train, X_test, y_test)

# 绘制训练曲线
plt.figure(figsize=(12, 4))
plt.subplot(1, 2, 1)
plt.plot(train_losses, label='训练损失')
plt.plot(val_losses, label='验证损失')
plt.title('训练曲线')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(train_losses, label='训练损失 (对数)')
plt.plot(val_losses, label='验证损失 (对数)')
plt.yscale('log')
plt.title('训练曲线 (对数尺度)')
plt.xlabel('Epoch')
plt.ylabel('Loss (log)')
plt.legend()

plt.tight_layout()
plt.show()
```

## 模型评估

### 1. 预测函数

```python
def evaluate_model(model, X_test, y_test, target_scaler):
    """评估模型"""
    model.eval()

    with torch.no_grad():
        # 预测
        X_test_tensor = torch.FloatTensor(X_test).to(device)
        y_pred_scaled = model(X_test_tensor).cpu().numpy()

        # 反标准化
        y_pred = target_scaler.inverse_transform(y_pred_scaled)
        y_true = target_scaler.inverse_transform(y_test)

        return y_pred, y_true

# 评估 LSTM 模型
lstm_model.eval()
y_pred, y_true = evaluate_model(lstm_model, X_test, y_test, target_scaler)

# 计算评估指标
mse = mean_squared_error(y_true, y_pred)
mae = mean_absolute_error(y_true, y_pred)
rmse = np.sqrt(mse)
mape = np.mean(np.abs((y_true - y_pred) / y_true)) * 100

print(f"模型评估指标:")
print(f"MSE: {mse:.4f}")
print(f"MAE: {mae:.4f}")
print(f"RMSE: {rmse:.4f}")
print(f"MAPE: {mape:.2f}%")
```

### 2. 可视化预测结果

```python
def plot_predictions(y_true, y_pred, title="股价预测结果"):
    """绘制预测结果"""
    plt.figure(figsize=(15, 8))

    # 完整数据
    plt.subplot(2, 1, 1)
    plt.plot(y_true.flatten(), label='真实值', alpha=0.8)
    plt.plot(y_pred.flatten(), label='预测值', alpha=0.8)
    plt.title(f'{title} - 完整视图')
    plt.legend()
    plt.grid(True)

    # 最近 50 个点
    plt.subplot(2, 1, 2)
    recent_true = y_true[-50:].flatten()
    recent_pred = y_pred[-50:].flatten()
    plt.plot(recent_true, label='真实值', marker='o', markersize=4)
    plt.plot(recent_pred, label='预测值', marker='s', markersize=4)
    plt.title(f'{title} - 最近 50 个点')
    plt.legend()
    plt.grid(True)

    plt.tight_layout()
    plt.show()

# 绘制预测结果
plot_predictions(y_true, y_pred, "LSTM 股价预测")

# 计算预测误差分布
errors = y_true.flatten() - y_pred.flatten()
plt.figure(figsize=(12, 4))

plt.subplot(1, 2, 1)
plt.hist(errors, bins=30, alpha=0.7)
plt.title('预测误差分布')
plt.xlabel('误差')
plt.ylabel('频次')

plt.subplot(1, 2, 2)
plt.scatter(y_pred.flatten(), y_true.flatten(), alpha=0.6)
plt.plot([y_true.min(), y_true.max()], [y_true.min(), y_true.max()], 'r--', lw=2)
plt.xlabel('预测值')
plt.ylabel('真实值')
plt.title('预测值 vs 真实值')

plt.tight_layout()
plt.show()
```

## 高级模型

### 1. 多任务学习模型

```python
class MultiTaskPredictor(nn.Module):
    """多任务学习模型 - 预测价格和方向"""
    def __init__(self, input_size, hidden_size, num_layers):
        super(MultiTaskPredictor, self).__init__()

        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True)

        # 价格回归头
        self.price_head = nn.Sequential(
            nn.Linear(hidden_size, hidden_size // 2),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(hidden_size // 2, 1)
        )

        # 方向分类头
        self.direction_head = nn.Sequential(
            nn.Linear(hidden_size, hidden_size // 2),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(hidden_size // 2, 2),  # 上涨/下跌
            nn.Softmax(dim=1)
        )

    def forward(self, x):
        lstm_out, _ = self.lstm(x)
        lstm_out = lstm_out[:, -1, :]

        price_pred = self.price_head(lstm_out)
        direction_pred = self.direction_head(lstm_out)

        return price_pred, direction_pred

# 使用多任务模型
def train_multitask_model(model, X_train, y_train, X_test, y_test):
    """训练多任务模型"""
    # 创建方向标签
    y_train_direction = (y_train[1:] > y_train[:-1]).astype(int)
    y_test_direction = (y_test[1:] > y_test[:-1]).astype(int)

    # 调整数据长度
    X_train = X_train[:-1]
    X_test = X_test[:-1]

    # 转换数据
    X_train_tensor = torch.FloatTensor(X_train).to(device)
    y_train_price = torch.FloatTensor(y_train_price).to(device)
    y_train_direction = torch.LongTensor(y_train_direction).to(device)

    # 训练循环
    criterion_price = nn.MSELoss()
    criterion_direction = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

    for epoch in range(100):
        model.train()
        optimizer.zero_grad()

        price_pred, direction_pred = model(X_train_tensor)

        price_loss = criterion_price(price_pred.squeeze(), y_train_price)
        direction_loss = criterion_direction(direction_pred, y_train_direction)

        # 总损失（可以调整权重）
        total_loss = price_loss + 0.5 * direction_loss

        total_loss.backward()
        optimizer.step()

        if (epoch + 1) % 10 == 0:
            print(f'Epoch {epoch+1}, Loss: {total_loss.item():.4f}')
```

### 2. 注意力机制模型

```python
class AttentionLSTM(nn.Module):
    """带注意力机制的 LSTM"""
    def __init__(self, input_size, hidden_size, num_layers, output_size=1):
        super(AttentionLSTM, self).__init__()

        self.hidden_size = hidden_size
        self.num_layers = num_layers

        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True)
        self.attention = nn.MultiheadAttention(hidden_size, num_heads=8, batch_first=True)
        self.fc = nn.Linear(hidden_size, output_size)
        self.dropout = nn.Dropout(0.2)

    def forward(self, x):
        # LSTM 编码
        lstm_out, (hidden, cell) = self.lstm(x)

        # 注意力机制
        attn_out, attn_weights = self.attention(lstm_out, lstm_out, lstm_out)

        # 取最后一个时间步
        out = attn_out[:, -1, :]
        out = self.dropout(out)
        out = self.fc(out)

        return out
```

## 实战案例

### 案例 1：完整股票预测系统

```python
class StockPredictionSystem:
    """完整的股价预测系统"""

    def __init__(self, model_type='lstm', seq_len=60):
        self.model_type = model_type
        self.seq_len = seq_len
        self.model = None
        self.feature_scaler = None
        self.target_scaler = None
        self.feature_cols = None

    def get_data(self, symbol, start_date, end_date):
        """获取股票数据"""
        df = get_stock_data(symbol, start_date, end_date)
        df = preprocess_data(df)
        df = create_features(df)
        df = df.dropna().reset_index(drop=True)
        return df

    def prepare_data(self, df, test_size=0.2):
        """准备训练数据"""
        X_train, X_test, y_train, y_test, feature_scaler, target_scaler, feature_cols = \
            prepare_data(df, seq_len=self.seq_len, test_size=test_size)

        self.feature_scaler = feature_scaler
        self.target_scaler = target_scaler
        self.feature_cols = feature_cols

        return X_train, X_test, y_train, y_test

    def build_model(self, input_size):
        """构建模型"""
        if self.model_type == 'lstm':
            self.model = LSTMPredictor(input_size, 64, 2).to(device)
        elif self.model_type == 'gru':
            self.model = GRUPredictor(input_size, 64, 2).to(device)
        elif self.model_type == 'transformer':
            self.model = StockTransformer(input_size, d_model=64, nhead=8, num_layers=2).to(device)

        return self.model

    def train(self, X_train, y_train, X_test, y_test):
        """训练模型"""
        train_losses, val_losses = train_model(
            self.model, X_train, y_train, X_test, y_test,
            epochs=100, batch_size=32
        )
        return train_losses, val_losses

    def predict(self, X_test):
        """预测"""
        return evaluate_model(self.model, X_test, y_test, self.target_scaler)

    def backtest(self, df, initial_capital=100000):
        """回测策略"""
        # 获取预测值
        y_pred, y_true = self.predict(X_test)

        # 生成交易信号
        price_diff = np.diff(y_pred.flatten())
        signals = np.where(price_diff > 0, 1, -1)  # 1=买入, -1=卖出

        # 计算收益
        returns = np.diff(y_true.flatten()) / y_true[:-1].flatten()
        strategy_returns = signals[:-1] * returns

        # 计算累积收益
        cumulative_returns = (1 + np.array(strategy_returns)).cumprod()

        # 计算指标
        total_return = cumulative_returns[-1] - 1
        volatility = np.std(strategy_returns) * np.sqrt(252)
        sharpe_ratio = np.mean(strategy_returns) / np.std(strategy_returns) * np.sqrt(252)
        max_drawdown = (cumulative_returns / cumulative_returns.cummax() - 1).min()

        results = {
            'total_return': total_return,
            'annualized_return': (1 + total_return) ** (252 / len(strategy_returns)) - 1,
            'volatility': volatility,
            'sharpe_ratio': sharpe_ratio,
            'max_drawdown': max_drawdown,
            'cumulative_returns': cumulative_returns
        }

        # 绘制回测结果
        plt.figure(figsize=(12, 8))

        plt.subplot(2, 1, 1)
        plt.plot(df['date'].iloc[-len(cumulative_returns):], cumulative_returns)
        plt.title('累积收益曲线')
        plt.ylabel('累积收益')
        plt.grid(True)

        plt.subplot(2, 1, 2)
        plt.plot(y_true.flatten(), label='真实价格', alpha=0.7)
        plt.plot(y_pred.flatten(), label='预测价格', alpha=0.7)
        plt.title('价格预测')
        plt.legend()
        plt.ylabel('价格')

        plt.tight_layout()
        plt.show()

        return results

# 使用示例
system = StockPredictionSystem(model_type='lstm')

# 获取数据
df = system.get_data('000001', '20200101', '20220326')

# 准备数据
X_train, X_test, y_train, y_test = system.prepare_data(df)

# 构建和训练模型
input_size = len(system.feature_cols)
model = system.build_model(input_size)
train_losses, val_losses = system.train(X_train, y_train, X_test, y_test)

# 预测和评估
y_pred, y_true = system.predict(X_test)

# 回测
results = system.backtest(df)
print("\n回测结果:")
for key, value in results.items():
    if key != 'cumulative_returns':
        print(f"{key}: {value:.4f}")
```

### 案例 2：多股票对比

```python
def compare_models_on_multiple_stocks(symbols, start_date, end_date, model_types=['lstm', 'gru']):
    """多股票模型对比"""
    results = {}

    for symbol in symbols:
        print(f"\n处理股票: {symbol}")
        df = get_stock_data(symbol, start_date, end_date)
        df = preprocess_data(df)
        df = create_features(df)
        df = df.dropna().reset_index(drop=True)

        if len(df) < 200:  # 数据太少则跳过
            continue

        X_train, X_test, y_train, y_test, _, _, _ = prepare_data(df)

        symbol_results = {}

        for model_type in model_types:
            print(f"  训练 {model_type} 模型...")

            system = StockPredictionSystem(model_type=model_type)
            input_size = len(system.feature_cols)
            model = system.build_model(input_size)

            try:
                train_losses, val_losses = system.train(X_train, y_train, X_test, y_test)
                y_pred, y_true = system.predict(X_test)

                # 计算指标
                mse = mean_squared_error(y_true, y_pred)
                mae = mean_absolute_error(y_true, y_pred)
                mape = np.mean(np.abs((y_true - y_pred) / y_true)) * 100

                symbol_results[model_type] = {
                    'mse': mse,
                    'mae': mae,
                    'mape': mape
                }

            except Exception as e:
                print(f"    训练失败: {e}")
                continue

        results[symbol] = symbol_results

    # 汇总结果
    summary_df = pd.DataFrame()
    for symbol, symbol_results in results.items():
        for model_type, metrics in symbol_results.items():
            metrics['symbol'] = symbol
            metrics['model'] = model_type
            summary_df = pd.concat([summary_df, pd.DataFrame([metrics])], ignore_index=True)

    # 绘制对比结果
    if not summary_df.empty:
        plt.figure(figsize=(15, 5))

        plt.subplot(1, 3, 1)
        sns.boxplot(data=summary_df, x='model', y='mse')
        plt.title('MSE 对比')

        plt.subplot(1, 3, 2)
        sns.boxplot(data=summary_df, x='model', y='mae')
        plt.title('MAE 对比')

        plt.subplot(1, 3, 3)
        sns.boxplot(data=summary_df, x='model', y='mape')
        plt.title('MAPE 对比')

        plt.tight_layout()
        plt.show()

    return summary_df

# 使用示例
symbols = ['000001', '000002', '600036', '600519']  # 多只股票代码
summary = compare_models_on_multiple_stocks(symbols, '20200101', '20220326')
print(summary.groupby('model').mean())
```

## 常见问题与注意事项

### 1. 数据泄露问题

```python
# ❌ 错误：使用未来信息
df['future_return'] = df['close'].shift(-1)  # 这是数据泄露！
df['future_return'] = df['close'].pct_change(1).shift(-1)

# ✅ 正确：只使用历史信息
df['return'] = df['close'].pct_change(1)
```

### 2. 特征标准化

```python
# 正确做法：在训练集上拟合，然后应用到测试集
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)  # 注意使用 transform 而不是 fit_transform

# ❌ 错误做法：分别标准化
X_train_scaled = StandardScaler().fit_transform(X_train)
X_test_scaled = StandardScaler().fit_transform(X_test)
```

### 3. 时间序列交叉验证

```python
def time_series_cv(data, n_splits=5):
    """时间序列交叉验证"""
    n = len(data)
    fold_size = n // (n_splits + 1)

    scores = []

    for i in range(n_splits):
        # 训练集：开始到 i*fold_size
        # 验证集：i*fold_size 到 (i+1)*fold_size
        train_end = i * fold_size
        val_start = train_end
        val_end = (i + 1) * fold_size

        X_train = data[:train_end]
        X_val = data[val_start:val_end]

        # 训练和评估...
        score = train_and_evaluate(X_train, X_val)
        scores.append(score)

    return scores
```

### 4. 过拟合预防

```python
# 1. 早停策略
class EarlyStopping:
    def __init__(self, patience=10, min_delta=0):
        self.patience = patience
        self.min_delta = min_delta
        self.counter = 0
        self.best_loss = None

    def __call__(self, val_loss):
        if self.best_loss is None:
            self.best_loss = val_loss
        elif val_loss < self.best_loss - self.min_delta:
            self.best_loss = val_loss
            self.counter = 0
        else:
            self.counter += 1
            if self.counter >= self.patience:
                return True
        return False

# 2. Dropout
model = nn.Sequential(
    nn.Linear(64, 32),
    nn.Dropout(0.5),  # 50% dropout
    nn.ReLU(),
    nn.Linear(32, 1)
)

# 3. L2 正则化
optimizer = torch.optim.Adam(model.parameters(), lr=0.001, weight_decay=1e-5)
```

## 性能优化技巧

### 1. GPU 加速

```python
# 检查 GPU
print(f"CUDA available: {torch.cuda.is_available()}")
print(f"GPU count: {torch.cuda.device_count()}")
if torch.cuda.is_available():
    print(f"Current device: {torch.cuda.get_device_name(0)}")

# 使用 GPU 加速训练
model = model.to(device)
X_train_tensor = X_train_tensor.to(device)
y_train_tensor = y_train_tensor.to(device)

# 批量大小优化
batch_size = 64  # 根据 GPU 内存调整
```

### 2. 混合精度训练

```python
from torch.cuda.amp import autocast, GradScaler

scaler = GradScaler()

for epoch in epochs:
    for batch in dataloader:
        optimizer.zero_grad()

        with autocast():
            output = model(input)
            loss = criterion(output, target)

        scaler.scale(loss).backward()
        scaler.step(optimizer)
        scaler.update()
```

### 3. 模型量化

```python
# 动态量化（推理时）
quantized_model = torch.quantization.quantize_dynamic(
    model, {nn.Linear}, dtype=torch.qint8
)

# 静态量化（需要校准数据）
model.qconfig = torch.quantization.get_default_qconfig('fbgemm')
torch.quantization.prepare(model, inplace=True)
# 在校准数据上运行
torch.quantization.convert(model, inplace=True)
```

## 总结

股价预测是一个极具挑战性的任务，需要注意以下几点：

1. **数据质量至关重要**：清洗数据、处理缺失值、异常值
2. **避免数据泄露**：确保只使用历史信息
3. **特征工程**：创建有意义的金融特征
4. **模型选择**：LSTM/GRU 适合时间序列，Transformer 捕捉长距离依赖
5. **正则化**：防止过拟合，提高泛化能力
6. **风险控制**：模型预测只是参考，投资需谨慎

记住：**股市有风险，预测不等于实际，投资需谨慎！**

## 进阶学习

- **深度学习进阶**：学习更复杂的模型架构
- **量化交易**：研究交易策略和风险管理
- **金融工程**：了解衍生品和复杂金融工具
- **算法交易**：学习高频交易和算法策略

持续实践和优化，您将构建更准确的股价预测系统！

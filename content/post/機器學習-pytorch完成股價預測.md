---
title: "機器學習 Pytorch完成股價預測"
date: 2022-03-28T22:19:15+08:00
draft: false

tags: ["Pytorch","ML","Fintech"]
categories: ["機器學習","量化"]
author: "w0x7ce"

---

## 环境配置

```bash
import torch
from torch import nn
from torch.utils.data import DataLoader
from torchvision import datasets
from torchvision.transforms import ToTensor
from torch.autograd import Variable
```

## 数据准备

```bash
df = pro.daily(ts_code='000001.SZ', start_date='20220101', end_date='20220326')
df['date'] = pd.to_datetime(df['trade_date'])
df['adj_close'] = df['close']
df['volume']=df['vol']
df['month'] =  pd.DatetimeIndex(df['trade_date']).month
df = df[['date','open','high','low','close','adj_close','volume','month']]
print(df.head())
```

```bash
import numpy as np

# x = torch.unsqueeze(torch.linspace(-1,1,100),dim=1)
# y = x.pow(4)+0.1*torch.randn(x.size())

x_data = torch.unsqueeze(torch.tensor(df['high'].astype(np.float32).values),dim=1)
x = (x_data-x_data.min())/(x_data.max()-x_data.min())

y_data = torch.unsqueeze(torch.tensor(df['close'].astype(np.float32).values),dim=1)
y = (y_data-y_data.min())/(y_data.max()-y_data.min())

# print(x.shape,y.shape)
# print(type(x),type(y))
# print(x[:10],y[:10])
```

```bash
x , y =(Variable(x),Variable(y))

# plt.figure(figsize=(18,10))
# x_draw = x * (x_data.max()-x_data.min()) + x_data.min()
# plt.plot(df['date'].values,x_draw.numpy(),'g')
# # plt.figure(figsize=(18,10))
# y_draw = y * (y_data.max()-y_data.min()) + y_data.min()
# plt.plot(df['date'].values,y_draw.numpy(),'r')

# # plt.scatter(x.data.numpy(),df['date'])
# # 或者采用如下的方式也可以输出x,y
# # plt.scatter(x.data.numpy(),y.data.numpy())
plt.show()
```

## 网络定义 单输入 单输出

```bash
class Net(nn.Module):
    def __init__(self,n_input,n_hidden,n_output):
        super(Net,self).__init__()
        self.hidden1 = nn.Linear(1,64)
        self.hidden_a = nn.Linear(64,26)
        self.hidden2 = nn.Linear(26,32)
        self.predict = nn.Linear(32,1)
    def forward(self,input):
        out = self.hidden1(input)
        out = torch.relu(out)
        out = self.hidden_a(out)
        out = torch.tanh(out)
        out = self.hidden2(out)
        out = torch.relu(out)
        out = self.predict(out)

        return out

net = Net(1,20,1)
print(net)
```

## 网络定义 Seq2Seq

```bash
class Net(nn.Module):
    def __init__(self,n_input,n_hidden,n_output):
        super(Net,self).__init__()
        # self.hidden1 = nn.Linear(n_input,n_hidden)
        # self.hidden2 = nn.Linear(n_hidden,n_hidden)
        # self.predict = nn.Linear(n_hidden,n_output)
        self.hidden1 = nn.Linear(1,64)
        self.hidden_a = nn.Linear(64,26)
        self.hidden2 = nn.Linear(26,32)
        self.predict = nn.Linear(32,1)
        self.hidden_26_1 = nn.Linear(26,1)

    def forward(self,input1,input2):
        out1 = self.hidden1(input1)
        out1 = torch.relu(out1)
        out1 = self.hidden_a(out1)
        out1 = torch.tanh(out1)
        out1 = self.hidden2(out1)
        out1 = torch.relu(out1)
        out1 = self.predict(out1)

        out2 = self.hidden1(input2)
        out2 = torch.relu(out2)
        out2 = self.hidden_a(out2)
        out2 = torch.tanh(out2)
        out2 = self.hidden_26_1(out2)

        out = torch.cat((out1, out2), dim=1) 

        return out,out1,out2

net = Net(1,20,1)
print(net)

prediction,prediction1,prediction2 = net(input1_input2)
```


### 损失函数，优化函数及训练 

```bash
optimizer = torch.optim.SGD(net.parameters(),lr = 0.02)
loss_func = torch.nn.MSELoss()
for t in range(5000):
    prediction = net(x)
    loss = loss_func(prediction,y)

    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
    if t%20 ==0:
        plt.figure()

        # plt.scatter(x.data.numpy(), y.data.numpy())
        plt.title(loss.data)
 
        y_draw = prediction * (y_data.max()-y_data.min()) + y_data.min()
        plt.plot(df['date'].values,prediction.data.numpy(),'g')

        plt.plot(df['date'].values,y.data.numpy(),'r')

        plt.pause(0.10)
        plt.show()

plt.show()
```

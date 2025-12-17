---
legacy: true
id: python-notes-and-tips
title: Python 实用技巧与杂记
sidebar_label: Python 杂记
description: 收集 Python 开发中的实用技巧、常见问题和最佳实践，包括代码优化、调试技巧和常用工具
date: 2022-03-13T22:11:35+08:00
tags: [Python, 编程技巧, 开发笔记, 最佳实践]
authors: [w0x7ce]
---

# Python 实用技巧与杂记

本文档收集了 Python 开发中的各种实用技巧、常见问题和最佳实践，帮助开发者提高编码效率和代码质量。

## 基础技巧

### 1. 列表操作技巧

```python
# 列表推导式
squares = [x**2 for x in range(10)]

# 带条件的列表推导式
even_squares = [x**2 for x in range(10) if x % 2 == 0]

# 嵌套列表推导
matrix = [[i*j for j in range(1, 4)] for i in range(1, 4)]

# 展平嵌套列表
nested_list = [[1, 2], [3, 4], [5, 6]]
flat = [item for sublist in nested_list for item in sublist]
# 结果: [1, 2, 3, 4, 5, 6]

# 使用 zip 组合多个列表
names = ['Alice', 'Bob', 'Charlie']
ages = [25, 30, 35]
combined = list(zip(names, ages))
# 结果: [('Alice', 25), ('Bob', 30), ('Charlie', 35)]

# 解压缩
unzipped = list(zip(*combined))
# names: ['Alice', 'Bob', 'Charlie']
# ages: [25, 30, 35]
```

### 2. 字典操作技巧

```python
# 字典推导式
squares_dict = {x: x**2 for x in range(5)}

# 合并字典（Python 3.9+）
dict1 = {'a': 1, 'b': 2}
dict2 = {'c': 3, 'd': 4}
merged = dict1 | dict2

# 使用 setdefault
data = {'name': 'Alice'}
data.setdefault('age', 25)

# 获取值并设置默认值
value = data.get('key', 'default')

# 字典排序
sorted_dict = dict(sorted(my_dict.items(), key=lambda x: x[1], reverse=True))

# 从两个列表创建字典
keys = ['a', 'b', 'c']
values = [1, 2, 3]
dict_from_lists = dict(zip(keys, values))

# 字典值求和
total = sum(my_dict.values())

# 检查所有值是否非空
all_filled = all(my_dict.values())
```

### 3. 集合操作

```python
# 创建集合
my_set = {1, 2, 3, 4, 5}

# 集合运算
set1 = {1, 2, 3}
set2 = {3, 4, 5}

union = set1 | set2        # 并集: {1, 2, 3, 4, 5}
intersection = set1 & set2 # 交集: {3}
difference = set1 - set2   # 差集: {1, 2}
sym_diff = set1 ^ set2     # 对称差集: {1, 2, 4, 5}

# 去重
unique_items = list(set(my_list))

# 检查子集和超集
set1.issubset(set2)
set1.issuperset(set2)

# 更新集合
set1.update(set2)  # 等同于 set1 |= set2
```

### 4. 字符串处理技巧

```python
# 字符串格式化
name = 'Alice'
age = 25

# f-strings (Python 3.6+)
message = f'{name} is {age} years old'

# 格式化数字
pi = 3.14159
formatted = f'Pi is approximately {pi:.2f}'

# 字符串对齐
text = 'Hello'
centered = text.center(10, '*')  # ***Hello***

# 拆分和连接
parts = 'apple,banana,cherry'.split(',')
joined = ','.join(parts)

# 移除空白字符
text = '  hello world  '
stripped = text.strip()      # 移除两端空白
left_stripped = text.lstrip() # 移除左边空白
right_stripped = text.rstrip() # 移除右边空白

# 查找和替换
text = 'hello world'
replaced = text.replace('world', 'Python')

# 检查字符串
text.startswith('hello')
text.endswith('world')
'hello' in text

# 字符串反转
reversed_text = text[::-1]
```

### 5. 条件表达式

```python
# 三元运算符
status = 'adult' if age >= 18 else 'minor'

# 多条件检查
if all([condition1, condition2, condition3]):
    # 所有条件都满足

if any([condition1, condition2, condition3]):
    # 至少一个条件满足

# 检查空值
value = some_dict.get('key')
if value is not None:
    print(value)

# 使用 in 操作符
if 'key' in my_dict:
    print(my_dict['key'])
```

## 函数与装饰器

### 1. 实用装饰器

```python
import functools
import time

# 计时装饰器
def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f'{func.__name__} took {end - start:.2f} seconds')
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
    return 'done'

# 日志装饰器
def logger(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f'Calling {func.__name__}')
        result = func(*args, **kwargs)
        print(f'{func.__name__} returned {result}')
        return result
    return wrapper

# 缓存装饰器
def memoize(func):
    cache = {}
    @functools.wraps(func)
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    return wrapper

@memoize
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# 验证参数装饰器
def validate_args(expected_type, expected_name=None):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            if expected_type == 'list' and not isinstance(args[0], list):
                raise TypeError(f'Expected list, got {type(args[0])}')
            return func(*args, **kwargs)
        return wrapper
    return decorator

@validate_args('list')
def process_list(data):
    return sum(data)

# 属性缓存装饰器
def cached_property(func):
    @functools.wraps(func)
    def wrapper(self):
        if not hasattr(self, '_cache'):
            self._cache = {}
        if func.__name__ not in self._cache:
            self._cache[func.__name__] = func(self)
        return self._cache[func.__name__]
    return property(wrapper)

class MyClass:
    @cached_property
    def expensive_property(self):
        # 耗时计算
        return 'result'
```

### 2. 函数参数技巧

```python
# 默认参数陷阱
def append_to(item, target=[]):  # 危险！默认参数在定义时创建
    target.append(item)
    return target

# 正确做法
def append_to(item, target=None):
    if target is None:
        target = []
    target.append(item)
    return target

# 使用 *args 和 **kwargs
def flexible_function(*args, **kwargs):
    print(f'Args: {args}')
    print(f'Kwargs: {kwargs}')
    return sum(args) + sum(kwargs.values())

# 函数组合
def compose(f, g):
    return lambda x: f(g(x))

# 部分应用
from functools import partial

def multiply(x, y):
    return x * y

double = partial(multiply, 2)
print(double(5))  # 10
```

### 3. Lambda 函数

```python
# 简单 lambda 函数
square = lambda x: x ** 2

# 使用 lambda 进行排序
data = [(1, 'b'), (2, 'a'), (3, 'c')]
sorted_data = sorted(data, key=lambda x: x[1])

# 过滤
evens = list(filter(lambda x: x % 2 == 0, range(10)))

# 映射
squares = list(map(lambda x: x**2, range(10)))

# 减少
from functools import reduce
total = reduce(lambda x, y: x + y, range(10))
```

## 文件操作

### 1. 文件读写

```python
# 读取文件
with open('file.txt', 'r', encoding='utf-8') as f:
    content = f.read()

# 逐行读取
with open('file.txt', 'r') as f:
    for line in f:
        print(line.strip())

# 写入文件
with open('output.txt', 'w', encoding='utf-8') as f:
    f.write('Hello, World!')

# 追加文件
with open('log.txt', 'a') as f:
    f.write('New log entry\n')

# JSON 文件操作
import json

# 保存
data = {'name': 'Alice', 'age': 30}
with open('data.json', 'w') as f:
    json.dump(data, f, indent=2)

# 读取
with open('data.json', 'r') as f:
    loaded_data = json.load(f)

# CSV 操作
import csv

# 写入 CSV
with open('data.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['Name', 'Age'])
    writer.writerow(['Alice', 30])
    writer.writerow(['Bob', 25])

# 读取 CSV
with open('data.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row)
```

### 2. 路径操作

```python
import os
from pathlib import Path

# 使用 pathlib (推荐)
p = Path('data/file.txt')
print(p.name)        # file.txt
print(p.suffix)      # .txt
print(p.parent)      # data
print(p.absolute())  # 绝对路径

# 创建目录
Path('new_directory').mkdir(exist_ok=True)

# 遍历目录
for file in Path('.').iterdir():
    print(file.name)

# 查找文件
for py_file in Path('.').rglob('*.py'):
    print(py_file)

# 使用 os 模块
print(os.path.exists('file.txt'))
print(os.path.isfile('file.txt'))
print(os.path.isdir('directory'))

# 路径拼接
full_path = os.path.join('directory', 'subdirectory', 'file.txt')
```

## 数据处理

### 1. JSON 处理

```python
import json
from datetime import datetime

# 自定义 JSON 编码器
class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

# 使用
data = {'date': datetime.now()}
json_str = json.dumps(data, cls=DateTimeEncoder)

# 从 JSON 字符串解析
parsed = json.loads(json_str)

# 美化输出
pretty_json = json.dumps(data, indent=2, sort_keys=True)
```

### 2. 数据验证

```python
from typing import List, Dict, Optional

def validate_user(user_data: Dict) -> bool:
    """验证用户数据"""
    required_fields = ['name', 'email', 'age']

    # 检查必需字段
    for field in required_fields:
        if field not in user_data:
            return False

    # 验证邮箱格式
    import re
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, user_data['email']):
        return False

    # 验证年龄
    if not isinstance(user_data['age'], int) or user_data['age'] < 0:
        return False

    return True

# 使用
user = {'name': 'Alice', 'email': 'alice@example.com', 'age': 30}
is_valid = validate_user(user)
```

### 3. 批量数据处理

```python
# 批量处理文件
import glob

def process_files(pattern):
    """处理匹配模式的所有文件"""
    files = glob.glob(pattern)
    results = []

    for file_path in files:
        with open(file_path, 'r') as f:
            content = f.read()
            results.append(process_content(content))

    return results

# 批量重命名文件
import os

def batch_rename(directory, old_ext, new_ext):
    """批量重命名文件扩展名"""
    for filename in os.listdir(directory):
        if filename.endswith(old_ext):
            old_path = os.path.join(directory, filename)
            new_path = os.path.join(directory,
                                   filename[:-len(old_ext)] + new_ext)
            os.rename(old_path, new_path)
```

## 并发与异步

### 1. 多线程

```python
import threading
import time

def worker(name, delay):
    print(f'Worker {name} starting')
    time.sleep(delay)
    print(f'Worker {name} finished')

# 创建线程
threads = []
for i in range(3):
    t = threading.Thread(target=worker, args=(i, 1))
    threads.append(t)
    t.start()

# 等待所有线程完成
for t in threads:
    t.join()

print('All workers completed')
```

### 2. 线程池

```python
from concurrent.futures import ThreadPoolExecutor

def process_item(item):
    # 模拟处理
    time.sleep(0.5)
    return f'Processed {item}'

# 使用线程池
with ThreadPoolExecutor(max_workers=4) as executor:
    items = [1, 2, 3, 4, 5]
    results = list(executor.map(process_item, items))

print(results)
```

### 3. 异步编程

```python
import asyncio

async def fetch_data(url):
    """模拟异步数据获取"""
    print(f'Fetching {url}')
    await asyncio.sleep(1)  # 模拟网络请求
    return f'Data from {url}'

async def main():
    # 创建任务
    tasks = [
        fetch_data('http://example.com/1'),
        fetch_data('http://example.com/2'),
        fetch_data('http://example.com/3')
    ]

    # 等待所有任务完成
    results = await asyncio.gather(*tasks)
    return results

# 运行
results = asyncio.run(main())
print(results)
```

## 调试与测试

### 1. 调试技巧

```python
import pdb

def debug_function(data):
    pdb.set_trace()  # 设置断点

    # 在调试器中可以：
    # - l: 查看代码
    # - p variable_name: 打印变量
    # - c: 继续执行
    # - q: 退出

    result = process_data(data)
    return result

# 优雅的调试
def debug_print(*args, **kwargs):
    """调试打印函数"""
    import inspect
    frame = inspect.currentframe().f_back
    print(f'DEBUG: {frame.f_code.co_name}:{frame.f_lineno}')
    print('  ', *args, **kwargs)

# 条件调试
DEBUG = True

def debug_msg(msg):
    if DEBUG:
        import traceback
        print(f'DEBUG: {msg}')
        print(traceback.format_stack()[-2])
```

### 2. 单元测试

```python
import unittest

class TestStringMethods(unittest.TestCase):

    def test_upper(self):
        self.assertEqual('hello'.upper(), 'HELLO')

    def test_isupper(self):
        self.assertTrue('HELLO'.isupper())
        self.assertFalse('Hello'.isupper())

    def test_split(self):
        s = 'hello world'
        self.assertEqual(s.split(), ['hello', 'world'])
        with self.assertRaises(TypeError):
            s.split(2)

if __name__ == '__main__':
    unittest.main()

# 使用 pytest (更简洁)
import pytest

def test_upper():
    assert 'hello'.upper() == 'HELLO'

def test_isupper():
    assert 'HELLO'.isupper()
    assert not 'Hello'.isupper()

# 运行测试
# pytest test_file.py
```

### 3. 日志记录

```python
import logging

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

# 使用日志
logger = logging.getLogger('my_app')

def process_data(data):
    logger.info(f'Processing data: {data}')
    try:
        result = complex_operation(data)
        logger.info(f'Success: {result}')
        return result
    except Exception as e:
        logger.error(f'Error: {e}', exc_info=True)
        raise
```

## 性能优化

### 1. 性能分析

```python
import cProfile
import time

def slow_function():
    total = 0
    for i in range(1000000):
        total += i
    return total

# 性能分析
cProfile.run('slow_function()')

# 计时
start = time.time()
result = slow_function()
end = time.time()
print(f'Time: {end - start:.4f} seconds')

# 使用 timeit
import timeit
timeit.timeit('slow_function()', number=1)
```

### 2. 内存优化

```python
import gc

# 手动垃圾回收
gc.collect()

# 使用 __slots__ 减少内存使用
class Point:
    __slots__ = ['x', 'y']

    def __init__(self, x, y):
        self.x = x
        self.y = y

# 生成器（延迟加载）
def large_data_generator():
    for i in range(1000000):
        yield i

# 避免内存泄漏
class ResourceManager:
    def __init__(self):
        self.resources = []

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.cleanup()

    def cleanup(self):
        # 释放资源
        for resource in self.resources:
            resource.close()
        self.resources.clear()
```

## 常用工具函数

### 1. 数据验证

```python
def is_valid_email(email):
    """验证邮箱格式"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def is_valid_phone(phone):
    """验证手机号格式"""
    import re
    pattern = r'^\d{11}$'
    return re.match(pattern, phone) is not None

def is_strong_password(password):
    """验证密码强度"""
    import re
    # 至少8位，包含大小写字母和数字
    pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$'
    return re.match(pattern, password) is not None
```

### 2. 数据转换

```python
def to_snake_case(text):
    """转换为蛇形命名"""
    import re
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', text)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()

def to_camel_case(text):
    """转换为驼峰命名"""
    parts = text.split('_')
    return parts[0] + ''.join(word.capitalize() for word in parts[1:])

def convert_case(text, target='snake'):
    """转换命名格式"""
    if target == 'snake':
        return to_snake_case(text)
    elif target == 'camel':
        return to_camel_case(text)
```

### 3. 实用装饰器

```python
import functools
from typing import Callable

def retry(max_attempts=3, delay=1):
    """重试装饰器"""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    time.sleep(delay)
            return None
        return wrapper
    return decorator

@retry(max_attempts=3, delay=2)
def unstable_function():
    # 可能失败的函数
    import random
    if random.random() > 0.7:
        return 'Success!'
    else:
        raise Exception('Random failure')

# 单例模式装饰器
def singleton(cls):
    instances = {}
    @functools.wraps(cls)
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return get_instance

@singleton
class Database:
    pass
```

## 最佳实践

### 1. 代码风格

```python
# 使用类型提示
from typing import List, Dict, Optional

def process_data(
    data: List[Dict[str, int]],
    threshold: int = 10
) -> Optional[List[int]]:
    """处理数据并返回结果"""
    results = []
    for item in data:
        if item.get('value', 0) > threshold:
            results.append(item['value'])
    return results if results else None

# 使用枚举
from enum import Enum

class Status(Enum):
    PENDING = 'pending'
    PROCESSING = 'processing'
    COMPLETED = 'completed'
    FAILED = 'failed'

# 使用数据类
from dataclasses import dataclass

@dataclass
class User:
    name: str
    email: str
    age: int = 0

    def is_adult(self) -> bool:
        return self.age >= 18
```

### 2. 错误处理

```python
# 自定义异常
class CustomError(Exception):
    def __init__(self, message, error_code=None):
        super().__init__(message)
        self.error_code = error_code

# 优雅的错误处理
def robust_function(data):
    try:
        result = risky_operation(data)
        return {'success': True, 'data': result}
    except ValueError as e:
        return {'success': False, 'error': 'Invalid value', 'details': str(e)}
    except TypeError as e:
        return {'success': False, 'error': 'Type error', 'details': str(e)}
    except Exception as e:
        return {'success': False, 'error': 'Unexpected error', 'details': str(e)}
```

### 3. 配置文件

```python
import json
import os

class Config:
    def __init__(self, config_file='config.json'):
        self.config_file = config_file
        self.load()

    def load(self):
        if os.path.exists(self.config_file):
            with open(self.config_file, 'r') as f:
                self.data = json.load(f)
        else:
            self.data = {}

    def save(self):
        with open(self.config_file, 'w') as f:
            json.dump(self.data, f, indent=2)

    def get(self, key, default=None):
        return self.data.get(key, default)

    def set(self, key, value):
        self.data[key] = value
        self.save()

# 使用
config = Config()
config.set('database_url', 'postgresql://localhost/mydb')
print(config.get('database_url'))
```

## 总结

Python 是一门功能强大的语言，掌握这些实用技巧和最佳实践可以显著提高开发效率：

1. **充分利用内置函数**：map、filter、zip 等
2. **使用合适的工具**：装饰器、生成器、上下文管理器
3. **保持代码清晰**：类型提示、文档字符串、命名规范
4. **重视测试和调试**：单元测试、日志记录、性能分析
5. **关注性能**：选择合适的数据结构和算法

持续学习和实践，您将成为更优秀的 Python 开发者！

---
legacy: true
id: opensearch-complete-guide
title: OpenSearch 完整使用指南
sidebar_label: OpenSearch 指南
description: 详细介绍 OpenSearch 的安装、配置、使用和优化，包括索引管理、查询语法、Python API、向量搜索和实战案例
date: 2022-03-03T18:03:03+08:00
tags: [OpenSearch, 搜索引擎, Python, 大数据, 向量搜索, 全文检索]
authors: [w0x7ce]
---

# OpenSearch 完整使用指南

OpenSearch 是 Amazon 开发的企业级搜索和分析套件，是 Elasticsearch 和 Kibana 的开源分支。本指南将详细介绍 OpenSearch 的安装、配置、使用和优化方法。

## OpenSearch 简介

### 什么是 OpenSearch

OpenSearch 是一个软件系列，由两个主要组件组成：

1. **OpenSearch 搜索引擎**：基于 Apache Lucene 构建的分布式搜索和分析引擎
2. **OpenSearch Dashboards**：数据可视化仪表板，用于搜索、分析和可视化数据

### 核心特性

- **全文搜索**：支持复杂查询和文本分析
- **分布式架构**：水平扩展，支持大数据量
- **实时分析**：近实时数据索引和分析
- **向量搜索**：支持 KNN（K 最近邻）搜索
- **RESTful API**：基于 HTTP 的 API 接口
- **多语言支持**：支持多种编程语言的客户端

### 应用场景

- **日志分析**：ELK/ELK Stack 替代方案
- **全文搜索**：电商、文档搜索
- **实时监控**：系统指标监控和分析
- **安全分析**：SIEM（安全信息与事件管理）
- **向量搜索**：AI 应用、推荐系统

## Docker 安装

### 快速启动

```bash
# 拉取 OpenSearch 镜像
docker pull opensearchproject/opensearch:1.2.4

# 运行单节点集群
docker run -d \
    --name opensearch \
    -p 9200:9200 \
    -p 9600:9600 \
    -e "discovery.type=single-node" \
    -e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
    opensearchproject/opensearch:1.2.4

# 验证运行
curl -XGET --insecure -u 'admin:admin' 'https://localhost:9200'
```

### 生产环境配置

```bash
# 启动生产级集群
docker run -d \
    --name opensearch \
    -p 9200:9200 \
    -p 9600:9600 \
    -e "cluster.name=opensearch-cluster" \
    -e "node.name=opensearch-node" \
    -e "discovery.type=single-node" \
    -e "bootstrap.memory_lock=true" \
    -e "OPENSEARCH_JAVA_OPTS=-Xms2g -Xmx2g" \
    -e "path.logs=/var/log/opensearch" \
    -e "path.data=/var/lib/opensearch" \
    -e "http.cors.enabled=true" \
    -e "http.cors.allow-origin=*" \
    -e "http.cors.allow-headers=*" \
    -e "http.cors.allow-credentials=true" \
    --ulimit nofile=65536:65536 \
    --ulimit memlock=-1 \
    --security-opt seccomp=unconfined \
    opensearchproject/opensearch:1.2.4
```

### 使用 Docker Compose

```yaml
# docker-compose.yml
version: '3'
services:
  opensearch:
    image: opensearchproject/opensearch:1.2.4
    container_name: opensearch
    environment:
      - cluster.name=opensearch-cluster
      - node.name=opensearch-node
      - discovery.type=single-node
      - bootstrap.memory_lock=true
      - "OPENSEARCH_JAVA_OPTS=-Xms2g -Xmx2g"
      - path.logs=/var/log/opensearch
      - path.data=/var/lib/opensearch
    ulimits:
      memlock:
        soft: -1
        hard: -1
      nofile:
        soft: 65536
        hard: 65536
    volumes:
      - opensearch-data:/var/lib/opensearch
      - opensearch-logs:/var/log/opensearch
    ports:
      - 9200:9200
      - 9600:9600
    networks:
      - opensearch-net

  opensearch-dashboards:
    image: opensearchproject/opensearch-dashboards:1.2.0
    container_name: opensearch-dashboards
    ports:
      - 5601:5601
    environment:
      - OPENSEARCH_HOSTS=https://opensearch:9200
      - OPENSEARCH_USERNAME=admin
      - OPENSEARCH_PASSWORD=admin
      - OPENSEARCH_SECURITY_SSL_CERTIFICATEKEY=<path-to-your-pem-file>
    depends_on:
      - opensearch
    networks:
      - opensearch-net

volumes:
  opensearch-data:
  opensearch-logs:

networks:
  opensearch-net:
    driver: bridge
```

启动服务：

```bash
docker-compose up -d
```

## 基本操作

### 创建索引

```bash
# 方式 1：通过 curl
curl -XPUT --insecure -u 'admin:admin' \
    'https://localhost:9200/my-first-index'

# 方式 2：指定设置
curl -XPUT --insecure -u 'admin:admin' \
    'https://localhost:9200/my-index' \
    -H 'Content-Type: application/json' \
    -d '{
        "settings": {
            "index": {
                "number_of_shards": 3,
                "number_of_replicas": 1
            }
        }
    }'
```

### 添加文档

```bash
# 插入文档（自动生成 ID）
curl -XPOST --insecure -u 'admin:admin' \
    'https://localhost:9200/my-index/_doc' \
    -H 'Content-Type: application/json' \
    -d '{
        "title": "First Document",
        "content": "This is the content of the document.",
        "timestamp": "2022-03-03T18:03:03Z"
    }'

# 插入文档（指定 ID）
curl -XPUT --insecure -u 'admin:admin' \
    'https://localhost:9200/my-index/_doc/1' \
    -H 'Content-Type: application/json' \
    -d '{
        "title": "Document with ID 1",
        "content": "This document has a specific ID.",
        "category": "example"
    }'
```

### 检索文档

```bash
# 根据 ID 检索
curl -XGET --insecure -u 'admin:admin' \
    'https://localhost:9200/my-index/_doc/1'

# 搜索所有文档
curl -XGET --insecure -u 'admin:admin' \
    'https://localhost:9200/my-index/_search'

# 条件搜索
curl -XGET --insecure -u 'admin:admin' \
    'https://localhost:9200/my-index/_search?q=title:First'
```

### 删除操作

```bash
# 删除文档
curl -XDELETE --insecure -u 'admin:admin' \
    'https://localhost:9200/my-index/_doc/1'

# 删除索引
curl -XDELETE --insecure -u 'admin:admin' \
    'https://localhost:9200/my-index/'
```

## Python API 使用

### 基础连接

```python
from opensearchpy import OpenSearch

# 配置连接
host = 'localhost'
port = 9200
auth = ('admin', 'admin')

# 创建客户端
client = OpenSearch(
    hosts=[{'host': host, 'port': port}],
    http_compress=True,
    http_auth=auth,
    use_ssl=True,
    verify_certs=False,
    ssl_assert_hostname=False,
    ssl_show_warn=False
)

# 测试连接
print(client.info())
```

### 创建索引（Python）

```python
# 创建索引
index_name = 'products'
index_body = {
    'settings': {
        'index': {
            'number_of_shards': 3,
            'number_of_replicas': 1,
            'knn': True,
            'knn.algo_param.ef_search': 100
        }
    },
    'mappings': {
        'properties': {
            'title': {
                'type': 'text',
                'analyzer': 'standard'
            },
            'description': {
                'type': 'text',
                'analyzer': 'standard'
            },
            'price': {
                'type': 'float'
            },
            'category': {
                'type': 'keyword'
            },
            'tags': {
                'type': 'keyword'
            },
            'created_at': {
                'type': 'date'
            }
        }
    }
}

response = client.indices.create(index_name, body=index_body)
print('\nCreating index:')
print(response)
```

### 批量添加数据

```python
# 准备数据
products = [
    {'_id': 1, 'title': 'iPhone 13', 'description': 'Latest iPhone model',
     'price': 999.99, 'category': 'smartphone', 'tags': ['apple', 'mobile']},
    {'_id': 2, 'title': 'Samsung Galaxy', 'description': 'Android smartphone',
     'price': 899.99, 'category': 'smartphone', 'tags': ['samsung', 'mobile']},
    {'_id': 3, 'title': 'MacBook Pro', 'description': 'Apple laptop',
     'price': 1999.99, 'category': 'laptop', 'tags': ['apple', 'computer']},
]

# 批量索引
for product in products:
    response = client.index(
        index=index_name,
        body=product,
        id=product['_id'],
        refresh=True
    )
    print('\nAdding document:')
    print(response)
```

### 搜索查询

```python
# 1. 全文搜索
query = {
    'query': {
        'match': {
            'title': 'iPhone'
        }
    }
}

response = client.search(
    body=query,
    index=index_name
)

print('\nSearch results:')
for hit in response['hits']['hits']:
    print(hit['_source'])

# 2. 多字段搜索
query = {
    'query': {
        'multi_match': {
            'query': 'iPhone Apple',
            'fields': ['title', 'description']
        }
    }
}

# 3. 布尔查询
query = {
    'query': {
        'bool': {
            'must': [
                {'match': {'title': 'iPhone'}}
            ],
            'filter': [
                {'range': {'price': {'gte': 500}}}
            ]
        }
    }
}

# 4. 聚合查询
query = {
    'aggs': {
        'categories': {
            'terms': {'field': 'category'}
        },
        'avg_price': {
            'avg': {'field': 'price'}
        }
    }
}
```

### 高级搜索示例

```python
# 复杂的电商搜索
def search_products(query_text, filters=None, sort=None, size=10):
    query_body = {
        'query': {
            'bool': {
                'must': []
            }
        },
        'size': size,
        'sort': []
    }

    # 添加全文搜索
    if query_text:
        query_body['query']['bool']['must'].append({
            'multi_match': {
                'query': query_text,
                'fields': ['title^3', 'description', 'tags'],
                'type': 'best_fields',
                'fuzziness': 'AUTO'
            }
        })

    # 添加过滤条件
    if filters:
        query_body['query']['bool']['filter'] = []
        for field, value in filters.items():
            if isinstance(value, list):
                query_body['query']['bool']['filter'].append({
                    'terms': {field: value}
                })
            else:
                query_body['query']['bool']['filter'].append({
                    'term': {field: value}
                })

    # 添加排序
    if sort:
        query_body['sort'] = [sort]

    # 执行搜索
    response = client.search(
        body=query_body,
        index=index_name
    )

    return response

# 使用示例
results = search_products(
    query_text='iPhone',
    filters={'category': 'smartphone'},
    sort=[{'price': {'order': 'desc'}}]
)

print(f"Found {results['hits']['total']['value']} results")
```

## 向量搜索（KNN）

### 创建向量索引

```python
from sentence_transformers import SentenceTransformer

# 创建向量索引
index_name = 'vector_search_index'
index_body = {
    'settings': {
        'index': {
            'knn': True,
            'knn.algo_param.ef_search': 100
        }
    },
    'mappings': {
        'properties': {
            'text': {
                'type': 'text'
            },
            'text_vector': {
                'type': 'knn_vector',
                'dimension': 384,
                'method': {
                    'name': 'hnsw',
                    'space_type': 'l2',
                    'engine': 'nmslib',
                    'parameters': {
                        'ef_construction': 128,
                        'm': 24
                    }
                }
            }
        }
    }
}

client.indices.create(index_name, body=index_body)
```

### 向量数据索引

```python
# 使用 Sentence Transformers 生成向量
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# 文档数据
documents = [
    {'_id': 1, 'text': 'OpenSearch is a powerful search engine'},
    {'_id': 2, 'text': 'Elasticsearch is also a search platform'},
    {'_id': 3, 'text': 'Machine learning is fascinating'},
    {'_id': 4, 'text': 'Natural language processing helps in text analysis'},
    {'_id': 5, 'text': 'Vector search enables semantic understanding'},
]

# 为每个文档生成向量并索引
for doc in documents:
    # 生成向量
    vector = model.encode(doc['text']).tolist()

    # 添加到索引
    client.index(
        index=index_name,
        body={
            'text': doc['text'],
            'text_vector': vector
        },
        id=doc['_id'],
        refresh=True
    )

print("Vector indexing completed!")
```

### 向量搜索查询

```python
# 向量搜索函数
def vector_search(query_text, k=5):
    # 生成查询向量
    query_vector = model.encode(query_text).tolist()

    # 构建查询
    query = {
        'size': k,
        'query': {
            'knn': {
                'text_vector': {
                    'vector': query_vector,
                    'k': k
                }
            }
        }
    }

    # 执行搜索
    response = client.search(
        body=query,
        index=index_name
    )

    return response

# 使用示例
results = vector_search('What is OpenSearch?', k=5)

print(f"\nFound {results['hits']['total']['value']} similar documents:")
for hit in results['hits']['hits']:
    print(f"Score: {hit['_score']:.3f} | Text: {hit['_source']['text']}")

# 混合搜索（向量 + 关键词）
def hybrid_search(query_text, k=10):
    query_vector = model.encode(query_text).tolist()

    query = {
        'size': k,
        'query': {
            'bool': {
                'should': [
                    {
                        'knn': {
                            'text_vector': {
                                'vector': query_vector,
                                'k': 50
                            }
                        }
                    },
                    {
                        'multi_match': {
                            'query': query_text,
                            'fields': ['text^2'],
                            'type': 'best_fields'
                        }
                    }
                ]
            }
        }
    }

    response = client.search(
        body=query,
        index=index_name
    )

    return response

# 使用混合搜索
results = hybrid_search('search engine technology')
```

## 数据管理

### 批量操作

```python
from opensearchpy.helpers import bulk

# 准备数据
actions = []
for i in range(100):
    actions.append({
        '_index': index_name,
        '_id': i,
        'title': f'Document {i}',
        'content': f'This is the content of document {i}',
        'category': 'example',
        'price': i * 10.5
    })

# 批量索引
success, failed = bulk(
    client,
    actions,
    index=index_name,
    refresh=True
)

print(f"Successfully indexed {success} documents")
print(f"Failed to index {failed} documents")
```

### 数据更新

```python
# 更新单个文档
response = client.update(
    index=index_name,
    id=1,
    body={
        'doc': {
            'price': 1099.99,
            'updated_at': '2022-03-03T18:03:03Z'
        }
    },
    refresh=True
)

# 批量更新
def bulk_update(index_name, updates):
    for update in updates:
        client.update(
            index=index_name,
            id=update['id'],
            body={'doc': update['doc']},
            refresh=False
    )

# 使用
updates = [
    {'id': 1, 'doc': {'price': 1099.99}},
    {'id': 2, 'doc': {'price': 999.99}},
]
bulk_update(index_name, updates)
```

### 数据删除

```python
# 删除文档
client.delete(index=index_name, id=1)

# 删除匹配条件的文档
query = {
    'query': {
        'term': {'category': 'old'}
    }
}

response = client.delete_by_query(
    index=index_name,
    body=query
)

print(f"Deleted {response['deleted']} documents")
```

## 索引管理

### 索引别名

```python
# 创建别名
client.indices.put_alias(
    index=index_name,
    name='current_index'
)

# 切换别名（零停机）
client.indices.update_aliases({
    'actions': [
        {'remove': {'index': 'old_index', 'alias': 'current_index'}},
        {'add': {'index': 'new_index', 'alias': 'current_index'}}
    ]
})

# 查看别名
aliases = client.indices.get_alias(name='current_index')
```

### 索引模板

```python
# 创建索引模板
template_body = {
    'index_patterns': ['logs-*'],
    'settings': {
        'number_of_shards': 3,
        'number_of_replicas': 1
    },
    'mappings': {
        'properties': {
            '@timestamp': {'type': 'date'},
            'message': {'type': 'text'},
            'level': {'type': 'keyword'}
        }
    }
}

client.indices.put_template(
    name='logs_template',
    body=template_body
)

# 创建符合模板的索引
client.indices.create(index='logs-2022-03-03')
```

### 索引设置优化

```python
# 更新索引设置
client.indices.put_settings(
    index=index_name,
    body={
        'settings': {
            'number_of_replicas': 2,
            'refresh_interval': '30s'
        }
    }
)

# 查看当前设置
settings = client.indices.get_settings(index=index_name)
print(settings)
```

## 集群管理

### 节点信息

```python
# 查看集群健康状态
health = client.cluster.health()
print(f"Cluster status: {health['status']}")

# 查看节点信息
nodes = client.nodes.info()
for node_id, node_info in nodes['nodes'].items():
    print(f"Node {node_id}: {node_info['name']}")

# 查看集群统计
stats = client.cluster.stats()
print(f"Total indices: {stats['indices']['count']}")
print(f"Total documents: {stats['indices']['total']['docs']['count']}")
```

### 备份与恢复

```bash
# 创建快照仓库
curl -XPUT --insecure -u 'admin:admin' \
    'https://localhost:9200/_snapshot/my_backup' \
    -H 'Content-Type: application/json' \
    -d '{
        "type": "fs",
        "settings": {
            "location": "/path/to/backup/directory"
        }
    }'

# 创建快照
curl -XPUT --insecure -u 'admin:admin' \
    'https://localhost:9200/_snapshot/my_backup/snapshot_1' \
    -d '{
        "indices": "my-index",
        "ignore_unavailable": true,
        "include_global_state": false
    }'

# 恢复快照
curl -XPOST --insecure -u 'admin:admin' \
    'https://localhost:9200/_snapshot/my_backup/snapshot_1/_restore'
```

## 性能优化

### 索引优化

```python
# 关闭副本（批量导入时）
client.indices.put_settings(
    index=index_name,
    body={
        'settings': {
            'number_of_replicas': 0
        }
    }
)

# 执行批量操作...

# 重新开启副本
client.indices.put_settings(
    index=index_name,
    body={
        'settings': {
            'number_of_replicas': 1
        }
    }
)

# 强制合并段
client.indices.forcemerge(
    index=index_name,
    max_num_segments=1
)
```

### 查询优化

```python
# 使用过滤器而不是查询
query = {
    'query': {
        'bool': {
            'must': [{'match': {'title': 'iPhone'}}],
            'filter': [
                {'range': {'price': {'gte': 500, 'lte': 1500}}},
                {'term': {'category': 'smartphone'}}
            ]
        }
    }
}

# 使用时间筛选减少结果集
query = {
    'query': {
        'bool': {
            'must': [{'match': {'content': 'search'}}],
            'filter': [
                {'range': {'@timestamp': {'gte': 'now-7d'}}}
            ]
        }
    }
}

# 使用 source filtering 减少传输数据
query = {
    '_source': ['title', 'price'],
    'query': {'match': {'title': 'iPhone'}}
}
```

### 内存优化

```python
# 调整缓存大小
client.cluster.put_settings(
    body={
        'persistent': {
            'indices.fielddata.cache.size': '30%',
            'indices.queries.cache.size': '10%'
        }
    }
)
```

## 监控与调试

### 性能指标

```python
# 获取集群统计
stats = client.cluster.stats()
print(json.dumps(stats, indent=2))

# 获取索引统计
index_stats = client.indices.stats(index=index_name)
print(f"Index size: {index_stats['indices']['total']['store']['size_in_bytes']} bytes")

# 获取节点统计
node_stats = client.nodes.stats()
for node_id, stats in node_stats['nodes'].items():
    print(f"Node {node_id}: {stats['indices']['search']['query_total']} queries")
```

### 慢查询日志

```python
# 启用慢查询日志
client.cluster.put_settings(
    body={
        'persistent': {
            'index.search.slowlog.threshold.query.warn': '5s',
            'index.search.slowlog.threshold.fetch.warn': '1s'
        }
    }
)

# 查看慢查询
curl -XGET --insecure -u 'admin:admin' \
    'https://localhost:9200/_search?pretty&search_type=dfs_query_then_fetch'
```

## 实战案例

### 案例 1：电商搜索引擎

```python
class EcommerceSearch:
    def __init__(self, client):
        self.client = client
        self.index_name = 'products'

    def index_product(self, product):
        """索引商品"""
        return self.client.index(
            index=self.index_name,
            body=product,
            id=product['id'],
            refresh=True
        )

    def search_products(self, query, filters=None, sort=None):
        """搜索商品"""
        query_body = {
            'query': {
                'bool': {
                    'must': [],
                    'should': []
                }
            },
            'aggs': {
                'categories': {
                    'terms': {'field': 'category', 'size': 10}
                },
                'price_range': {
                    'histogram': {
                        'field': 'price',
                        'interval': 100
                    }
                }
            }
        }

        # 添加全文搜索
        if query:
            query_body['query']['bool']['must'].append({
                'multi_match': {
                    'query': query,
                    'fields': [
                        'title^3',
                        'description',
                        'brand^2',
                        'tags'
                    ],
                    'type': 'best_fields',
                    'fuzziness': 'AUTO'
                }
            })

        # 添加过滤
        if filters:
            query_body['query']['bool']['filter'] = []
            for field, value in filters.items():
                if field == 'price_range':
                    query_body['query']['bool']['filter'].append({
                        'range': {
                            'price': {
                                'gte': value.get('min'),
                                'lte': value.get('max')
                            }
                        }
                    })
                elif field == 'in_stock':
                    query_body['query']['bool']['filter'].append({
                        'term': {'in_stock': value}
                    })
                else:
                    query_body['query']['bool']['filter'].append({
                        'terms': {field: value} if isinstance(value, list) else {'term': {field: value}}
                    })

        # 添加排序
        if sort:
            query_body['sort'] = [sort]

        return self.client.search(
            body=query_body,
            index=self.index_name
        )

    def get_recommendations(self, product_id, size=5):
        """商品推荐（基于类别）"""
        # 获取商品信息
        product = self.client.get(index=self.index_name, id=product_id)
        category = product['_source']['category']

        # 基于类别推荐
        query = {
            'size': size,
            'query': {
                'bool': {
                    'must': [
                        {'term': {'category': category}}
                    ],
                    'must_not': [
                        {'term': {'_id': product_id}}
                    ]
                }
            }
        }

        return self.client.search(
            body=query,
            index=self.index_name
        )

# 使用示例
search = EcommerceSearch(client)

# 索引商品
product = {
    'id': 1001,
    'title': 'iPhone 13 Pro',
    'description': 'Latest iPhone with advanced features',
    'brand': 'Apple',
    'category': 'smartphone',
    'price': 999.99,
    'in_stock': True,
    'tags': ['apple', 'mobile', '5g']
}
search.index_product(product)

# 搜索商品
results = search.search_products(
    query='iPhone Apple',
    filters={'category': ['smartphone'], 'in_stock': True},
    sort=[{'price': {'order': 'desc'}}]
)

print(f"Found {results['hits']['total']['value']} products")
```

### 案例 2：日志分析系统

```python
class LogAnalyzer:
    def __init__(self, client):
        self.client = client
        self.index_name = 'logs-*'

    def index_log(self, log_entry):
        """索引日志"""
        return self.client.index(
            index=f"logs-{log_entry['date']}",
            body=log_entry,
            refresh=False
        )

    def search_logs(self, query, time_range=None, filters=None):
        """搜索日志"""
        query_body = {
            'query': {
                'bool': {
                    'must': []
                }
            },
            'sort': [{'@timestamp': {'order': 'desc'}}],
            'size': 100
        }

        # 添加搜索条件
        if query:
            query_body['query']['bool']['must'].append({
                'multi_match': {
                    'query': query,
                    'fields': ['message', 'level', 'service']
                }
            })

        # 添加时间范围
        if time_range:
            query_body['query']['bool']['filter'] = [{
                'range': {
                    '@timestamp': time_range
                }
            }]

        # 添加其他过滤
        if filters:
            if 'query' not in query_body['query']['bool']:
                query_body['query']['bool']['filter'] = []
            for field, value in filters.items():
                query_body['query']['bool']['filter'].append({
                    'term': {field: value}
                })

        return self.client.search(
            body=query_body,
            index=self.index_name
        )

    def get_error_summary(self, hours=1):
        """获取错误汇总"""
        query = {
            'query': {
                'bool': {
                    'filter': [
                        {'term': {'level': 'ERROR'}},
                        {'range': {'@timestamp': {'gte': f'now-{hours}h'}}}
                    ]
                }
            },
            'aggs': {
                'errors_by_service': {
                    'terms': {'field': 'service', 'size': 10},
                    'aggs': {
                        'error_types': {
                            'terms': {'field': 'level', 'size': 5}
                        }
                    }
                },
                'errors_over_time': {
                    'date_histogram': {
                        'field': '@timestamp',
                        'calendar_interval': 'minute'
                    }
                }
            }
        }

        return self.client.search(
            body=query,
            index=self.index_name
        )

# 使用示例
analyzer = LogAnalyzer(client)

# 索引日志
log = {
    'date': '2022-03-03',
    '@timestamp': '2022-03-03T18:03:03Z',
    'level': 'ERROR',
    'service': 'api-server',
    'message': 'Database connection failed',
    'trace_id': 'abc123'
}
analyzer.index_log(log)

# 搜索日志
results = analyzer.search_logs(
    query='database error',
    time_range={'gte': 'now-1h'},
    filters={'level': 'ERROR'}
)
```

## 最佳实践

### 1. 索引设计

- **选择合适的分片数**：数据量的 1.5-3 倍
- **设置副本数**：生产环境至少 1 个副本
- **使用别名**：方便索引切换和零停机维护
- **字段类型选择**：
  - `keyword`：精确匹配、聚合
  - `text`：全文搜索
  - `date`：时间字段
  - `float/double`：数值

### 2. 查询优化

```python
# 使用过滤器缓存
query = {
    'query': {
        'bool': {
            'must': [{'match': {'title': 'iPhone'}}],
            'filter': [
                {'range': {'price': {'gte': 500}}}  # 会被缓存
            ]
        }
    }
}

# 使用 bool 查询
query = {
    'query': {
        'bool': {
            'should': [
                {'match': {'title': 'iPhone'}},
                {'match': {'brand': 'Apple'}}
            ],
            'minimum_should_match': 1
        }
    }
}
```

### 3. 数据建模

```python
# 避免深度嵌套
bad_mapping = {
    'properties': {
        'user': {
            'properties': {
                'address': {
                    'properties': {
                        'street': {'type': 'text'},
                        'city': {'type': 'text'}
                    }
                }
            }
        }
    }
}

# 使用 join 类型
good_mapping = {
    'properties': {
        'user_name': {'type': 'text'},
        'join_field': {
            'type': 'join',
            'relations': {
                'user': 'address'
            }
        }
    }
}
```

### 4. 监控建议

- **集群健康**：定期检查 `cluster.health`
- **索引大小**：监控 `indices.stats`
- **查询性能**：启用慢查询日志
- **磁盘使用**：关注节点磁盘使用率
- **内存使用**：监控 JVM 堆内存使用

## 常见问题解决

### 问题 1：集群红色状态

```bash
# 查看未分配的分片
curl -XGET --insecure -u 'admin:admin' \
    'https://localhost:9200/_cat/shards?v'

# 查看失败的分片
curl -XGET --insecure -u 'admin:admin' \
    'https://localhost:9200/_cat/recovery?v'
```

### 问题 2：内存不足

```python
# 调整 JVM 堆大小
# 在启动时设置：-Xms2g -Xmx2g

# 清理缓存
client.cluster.post_settings(
    body={'transient': {'action.auto_create_index': False}}
)
```

### 问题 3：查询速度慢

```python
# 1. 添加更多副本
client.indices.put_settings(
    index=index_name,
    body={'settings': {'index.number_of_replicas': 2}}
)

# 2. 使用路由
client.search(
    body=query,
    index=index_name,
    routing='user_id'
)

# 3. 优化查询
# - 使用过滤器
# - 减少返回字段
# - 限制结果数量
```

## 总结

OpenSearch 是一个功能强大的搜索和分析平台，掌握其核心概念和使用方法，能够帮助您构建高效的搜索和分析系统。

通过本指南，您已经学习了：
- OpenSearch 的基本概念和特性
- Docker 安装和配置方法
- RESTful API 的使用
- Python 客户端的高级用法
- 向量搜索和 KNN 查询
- 索引管理和性能优化
- 集群监控和维护
- 实战案例和应用场景

在实际应用中，建议：
1. 根据业务需求设计索引结构
2. 使用模板管理索引
3. 定期监控集群健康
4. 优化查询和索引策略
5. 做好数据备份和恢复

持续实践和探索，您将能够充分发挥 OpenSearch 的强大功能！

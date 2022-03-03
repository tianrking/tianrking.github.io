---
title: "Opensearch使用"
date: 2022-03-03T18:03:03+08:00
draft: false

tags: ["Linux","Search Engine"]
categories: ["軟件","搜索引擎","大數據"]
author: "w0x7ce"

---

## Opensearch是什麽

OpenSearch 是一个软件系列，由搜索引擎（也称为 OpenSearch）和 OpenSearch Dashboards（该搜索引擎的数据可视化仪表板）组成。 该软件始于 2021 年，是 Elasticsearch 和 Kibana 的一个分支，由 Amazon Web Services 领导开发

### Docker 下使用 Opensearch

#### Install

```bash
docker pull opensearchproject/opensearch:1.2.4
docker run -p 9200:9200 -p 9600:9600 -e "discovery.type=single-node" opensearchproject/opensearch:1.2.4
```

#### Test

In a new terminal session, run:

```bash
curl -XGET --insecure -u 'admin:admin' 'https://localhost:9200'
```

Create your first index.

```bash
curl -XPUT --insecure -u 'admin:admin' 'https://localhost:9200/my-first-index'
```

Add some data to your newly created index.

```bash
curl -XPUT --insecure -u 'admin:admin' 'https://localhost:9200/my-first-index/_doc/1' -H 'Content-Type: application/json' -d '{"Description": "To be or not to be, that is the question."}'
```

Retrieve the data to see that it was added properly.

```bash
curl -XGET --insecure -u 'admin:admin' 'https://localhost:9200/my-first-index/_doc/1'
```

After verifying that the data is correct, delete the document.

```bash
curl -XDELETE --insecure -u 'admin:admin' 'https://localhost:9200/my-first-index/_doc/1'
```

Finally, delete the index.

```bash
curl -XDELETE --insecure -u 'admin:admin' 'https://localhost:9200/my-first-index/'
```

### Use Opensearch via python

#### add_data

```python
from opensearchpy import OpenSearch

host = 'localhost'
port = 9200
auth = ('admin', 'admin') # For testing only. Don't store credentials in code.
# ca_certs_path = '/full/path/to/root-ca.pem' # Provide a CA bundle if you use intermediate CAs with your root CA.

# Optional client certificates if you don't want to use HTTP basic authentication.
# client_cert_path = '/full/path/to/client.pem'
# client_key_path = '/full/path/to/client-key.pem'

# Create the client with SSL/TLS enabled, but hostname verification disabled.
client = OpenSearch(
    hosts = [{'host': host, 'port': port}],
    http_compress = True, # enables gzip compression for request bodies
    http_auth = auth,
    # client_cert = client_cert_path,
    # client_key = client_key_path,
    use_ssl = True,
    verify_certs = False,
    ssl_assert_hostname = False,
    ssl_show_warn = False,
    # ca_certs = ca_certs_path
)

# Create an index with non-default settings.
index_name = 'qa_index_384'

# document = {
#   'Q_text':'abc',
#   'Q_vec':[1,2,3,4],
#   'Ans':'ABC',
# }


from sentence_transformers import SentenceTransformer, util
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
embedding = model.encode("朋友圈信息流", convert_to_tensor=True)
Q_vec = embedding.tolist()
document = {
  'Q_text':"朋友圈信息流",
  'Q_vec':Q_vec,
  'Ans':'ABC',
}
print(len(Q_vec))
id = '20'

response = client.index(
    index = index_name,
    body = document,
    id = id,
    refresh = True
)

print('\nAdding document:')
print(response)
```

#### create_index

```python
from opensearchpy import OpenSearch

host = 'localhost'
port = 9200
auth = ('admin', 'admin') # For testing only. Don't store credentials in code.
# ca_certs_path = '/full/path/to/root-ca.pem' # Provide a CA bundle if you use intermediate CAs with your root CA.

# Optional client certificates if you don't want to use HTTP basic authentication.
# client_cert_path = '/full/path/to/client.pem'
# client_key_path = '/full/path/to/client-key.pem'

# Create the client with SSL/TLS enabled, but hostname verification disabled.
client = OpenSearch(
    hosts = [{'host': host, 'port': port}],
    http_compress = True, # enables gzip compression for request bodies
    http_auth = auth,
    # client_cert = client_cert_path,
    # client_key = client_key_path,
    use_ssl = True,
    verify_certs = False,
    ssl_assert_hostname = False,
    ssl_show_warn = False,
    # ca_certs = ca_certs_path
)

# Create an index with non-default settings.
index_name = 'qa_index_768'
index_body = {
    'settings':
    {
        'index': {
            "knn": True,
            "knn.algo_param.ef_search": 100
        }
    },
    "mappings": {
        "properties": {
            "Q_vec": {
                "type": "knn_vector",
                "dimension": 768,
                "method": {
                    "name": "hnsw",
                    "space_type": "l2",
                    "engine": "nmslib",
                    "parameters": {
                        "ef_construction": 128,
                        "m": 24
                    }
                }
            }
        }
    }
}
response = client.indices.create(index_name, body=index_body)
print('\nCreating index:')
print(response)
```

#### delete_data

```python
from opensearchpy import OpenSearch

host = 'localhost'
port = 9200
auth = ('admin', 'admin') # For testing only. Don't store credentials in code.
# ca_certs_path = '/full/path/to/root-ca.pem' # Provide a CA bundle if you use intermediate CAs with your root CA.
index_name = 'qa_index_4'
# Create the client with SSL/TLS enabled, but hostname verification disabled.
client = OpenSearch(
    hosts = [{'host': host, 'port': port}],
    http_compress = True, # enables gzip compression for request bodies
    http_auth = auth,
    # client_cert = client_cert_path,
    # client_key = client_key_path,
    use_ssl = True,
    verify_certs = False,
    ssl_assert_hostname = False,
    ssl_show_warn = False,
    # ca_certs = ca_certs_path
)

response = client.delete(
    index = index_name,
    id = 2
)

print('\nDeleting document:')
print(response)


# response = client.indices.delete(
#     index = index_name
# )

# print('\nDeleting index:')
# print(response)
```

#### delete_index

```bash
from opensearchpy import OpenSearch

host = 'localhost'
port = 9200
auth = ('admin', 'admin') # For testing only. Don't store credentials in code.
# ca_certs_path = '/full/path/to/root-ca.pem' # Provide a CA bundle if you use intermediate CAs with your root CA.

# Optional client certificates if you don't want to use HTTP basic authentication.
# client_cert_path = '/full/path/to/client.pem'
# client_key_path = '/full/path/to/client-key.pem'

# Create the client with SSL/TLS enabled, but hostname verification disabled.
client = OpenSearch(
    hosts = [{'host': host, 'port': port}],
    http_compress = True, # enables gzip compression for request bodies
    http_auth = auth,
    # client_cert = client_cert_path,
    # client_key = client_key_path,
    use_ssl = True,
    verify_certs = False,
    ssl_assert_hostname = False,
    ssl_show_warn = False,
    # ca_certs = ca_certs_path
)

# index_name = ""

response = client.indices.delete(
    index = index_name
)

print('\nDeleting index:')
print(response)
```

#### search_data

```python
from open_search import client, index_name
from encode import encode


def search_qa(query, size=5):
    _Q_vec = encode(query)

    query = {
        '_source': ['Q_text', 'Ans_url', 'Q_vec', "Ans_text"],
        'size': size,
        'query': {
            "bool": {
                "should": [
                    {
                        "knn": {
                            "Q_vec": {
                                "vector": _Q_vec,
                                "k": 2
                            }
                        }
                    },
                    {
                        "match_phrase": {
                            "Q_text": query
                        }
                    },
                    {
                        "match_phrase": {
                            "Ans_text": query
                        }
                    }
                ]
            },
        }
    }

    response = client.search(
        body=query,
        index=index_name
    )
    return 
```

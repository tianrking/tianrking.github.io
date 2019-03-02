---
title: scrapy
date: 2019-01-13 15:44:56
tags:
---
1. 继承scrapy.Sprider
2. 为Sprider取名字
3. 设定起始爬取点
4. 实现页面解析函数


第一个实例
``````
import scrapy
class BooksSpider(scrapy.Spider):
    #标识
    name="books"

    #起始点
    start_urls=['http://books.toscrape.com/']

    def parse(self,response):

        for book in response.css('article.product_pod'):

            name=book.xpath('./h3/a/@title').extract_first()

            price=book.css('p.price_color::text').extract_first()
            yield{
                'name':name,
                'price':price,
            }
        
        next_url=response.css('ul.pager li.next a::attr(href)').extract_first()
        if next_url:
            next_url=response.urljoin(next_url)
            yield scrapy.Request(next_url,callback=self.parse)
```````
运行 
``````
scrapy crawl hw.py -o books.csv
``````

# 使用selector提取数据
创建对象

``````
>>>from scrapy.selector import Selector
>>> text='''
<html>
	<body>
		<h1>hello world</h1>
		<h1>hello scrapy</h1>
		<b>hello python</b>
		<ul>
			<li>c++</li>
			<li>java</li>
			<li>python</li>
		</ul>
	</body>
</html>
'''
``````

选中数据
``````
>>> selector=Selector(text=text)
>>> selector
<Selector xpath=None data='<html>\n\t<body>\n\t\t<h1>hello world</h1>\n\t\t'>

>>> selector_list=selector.xpath('//h1')
>>> selector_list
[<Selector xpath='//h1' data='<h1>hello world</h1>'>, <Selector xpath='//h1' data='<h1>hello scrapy</h1>'>]

``````

提取数据
``````


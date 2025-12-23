---
title: "Vue Hello World"
date: 2019-09-12
tags: ["Vue", "JavaScript", "前端"]
category: "编程练习"
description: "Vue.js 基础入门示例"
---

:::note Archived University Note
This content is from my university archives and may not be reliable or up-to-date.
:::

## Vue Hello World

这是一个基础的 Vue.js 入门示例，展示如何创建一个简单的 Vue 应用。

### 示例代码

```html
<div id="app">
  <p>{{ message }}</p>
</div>

<script src="https://cdn.jsdelivr.net/npm/vue"></script>
<script>
new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue.js!'
  }
})
</script>
```

### 代码说明

1. **HTML 部分**：
   - 创建一个 id 为 `app` 的 div 元素
   - 使用 `{{ message }}` 语法进行数据绑定

2. **Vue 实例**：
   - `el: '#app'` - 指定 Vue 实例挂载的 DOM 元素
   - `data: { message: 'Hello Vue.js!' }` - 定义数据属性

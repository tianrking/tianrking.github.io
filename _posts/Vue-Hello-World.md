---
title: Vue Hello World
date: 2019-09-12 23:12:46
tags:
category:
---



<clientonly>
<script src="https://cdn.jsdelivr.net/npm/vue"></script>


<div id="app">
  <p>{{ message }}</p>
</div>

<div><script>alert("a");</script></div>

<script>
new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue.js!'
  }
})
</script>

</clientonly>
{% aplayer " " ""
 "/media/mp3/.mp3" "autoplay" %}
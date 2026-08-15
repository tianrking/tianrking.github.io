# 微信公眾號文章導入區

这里是本地文章导入入口，不要把公众号后台导出的原始 HTML、Markdown、图片或账号信息提交到 Git。目录已经加入 `.gitignore`。

建议每篇文章使用一个目录，目录名可以是日期或原始文章标识：

```text
wechat-import/
└── 2026-08-15-article-slug/
    ├── article.html       # 或 article.md / article.mdx
    ├── metadata.json       # 可选，但建议补齐日期、标签和原文链接
    └── images/             # 可选；HTML 中的相对图片会被复制到 static/img/wechat/
```

`metadata.json` 支持以下字段：

```json
{
  "title": "文章标题",
  "date": "2026-08-15",
  "slug": "article-slug",
  "authors": ["w0x7ce"],
  "tags": ["嵌入式系统", "BLE"],
  "description": "文章摘要",
  "sourceUrl": "https://mp.weixin.qq.com/s/example"
}
```

先预览文章清单，不会写入博客：

```bash
npm run import:wechat -- --list
```

每次只导入一篇，确认输出后再写入：

```bash
npm run import:wechat -- --article 2026-08-15-article-slug --apply
```

导入器会把 HTML 正文转换为 Docusaurus 可用的 Markdown，保留代码块、表格、引用、视频和图片；本地图片复制到 `static/img/wechat/<date>-<slug>/`。没有随导出文件提供的远程图片会保留原始 URL 并显示警告，不会伪装成本地已保存资源。

导入后应先运行 `npm run build` 和 `git diff --check`，确认无误后再为这一篇创建独立 commit。

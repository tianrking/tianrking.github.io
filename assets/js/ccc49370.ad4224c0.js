"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[6103],{1093:(e,t,a)=>{a.d(t,{Z:()=>m});var n=a(7462),o=a(7294),l=a(1262),r=a(9861),i=a(6668),c=a(2949);const m=()=>{const{giscus:e}=(0,i.L)(),{colorMode:t}=(0,c.I)(),{theme:a="light",darkTheme:m="dark_dimmed"}=e,s="dark"===t?m:a;return o.createElement(l.Z,{fallback:o.createElement("div",null,"Loading Comments...")},(()=>o.createElement("div",{style:{paddingTop:50}},o.createElement(r.Z,(0,n.Z)({id:"comments",mapping:"title",strict:"1",term:"Welcome to @giscus/react component!",reactionsEnabled:"1",emitMetadata:"0",inputPosition:"bottom",lang:"zh-TW",loading:"lazy"},e,{theme:s})))))}},700:(e,t,a)=>{a.r(t),a.d(t,{default:()=>v});var n=a(7294),o=a(6010),l=a(1944),r=a(5281),i=a(9460),c=a(9058),m=a(390),s=a(7462),d=a(5999),p=a(2244);function g(e){const{nextItem:t,prevItem:a}=e;return n.createElement("nav",{className:"pagination-nav docusaurus-mt-lg","aria-label":(0,d.I)({id:"theme.blog.post.paginator.navAriaLabel",message:"Blog post page navigation",description:"The ARIA label for the blog posts pagination"})},a&&n.createElement(p.Z,(0,s.Z)({},a,{subLabel:n.createElement(d.Z,{id:"theme.blog.post.paginator.newerPost",description:"The blog post button label to navigate to the newer/previous post"},"Newer Post")})),t&&n.createElement(p.Z,(0,s.Z)({},t,{subLabel:n.createElement(d.Z,{id:"theme.blog.post.paginator.olderPost",description:"The blog post button label to navigate to the older/next post"},"Older Post"),isNext:!0})))}function u(){const{assets:e,metadata:t}=(0,i.C)(),{title:a,description:o,date:r,tags:c,authors:m,frontMatter:s}=t,{keywords:d}=s,p=e.image??s.image;return n.createElement(l.d,{title:a,description:o,keywords:d,image:p},n.createElement("meta",{property:"og:type",content:"article"}),n.createElement("meta",{property:"article:published_time",content:r}),m.some((e=>e.url))&&n.createElement("meta",{property:"article:author",content:m.map((e=>e.url)).filter(Boolean).join(",")}),c.length>0&&n.createElement("meta",{property:"article:tag",content:c.map((e=>e.label)).join(",")}))}var b=a(9407),h=a(1093);function E(e){let{sidebar:t,children:a}=e;const{metadata:o,toc:l}=(0,i.C)(),{nextItem:r,prevItem:s,frontMatter:d}=o,{hide_table_of_contents:p,toc_min_heading_level:u,toc_max_heading_level:E,hide_comment:v}=d;return n.createElement(c.Z,{sidebar:t,toc:!p&&l.length>0?n.createElement(b.Z,{toc:l,minHeadingLevel:u,maxHeadingLevel:E}):void 0},n.createElement(m.Z,null,a),(r||s)&&n.createElement(g,{nextItem:r,prevItem:s}),!v&&n.createElement(h.Z,null))}function v(e){const t=e.content;return n.createElement(i.n,{content:e.content,isBlogPostPage:!0},n.createElement(l.FG,{className:(0,o.Z)(r.k.wrapper.blogPages,r.k.page.blogPostPage)},n.createElement(u,null),n.createElement(E,{sidebar:e.sidebar},n.createElement(t,null))))}}}]);
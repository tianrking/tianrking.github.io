"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[2142],{3905:(e,n,t)=>{t.d(n,{Zo:()=>p,kt:()=>d});var r=t(7294);function l(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function a(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){l(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function c(e,n){if(null==e)return{};var t,r,l=function(e,n){if(null==e)return{};var t,r,l={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(l[t]=e[t]);return l}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(l[t]=e[t])}return l}var i=r.createContext({}),s=function(e){var n=r.useContext(i),t=n;return e&&(t="function"==typeof e?e(n):a(a({},n),e)),t},p=function(e){var n=s(e.components);return r.createElement(i.Provider,{value:n},e.children)},m={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},u=r.forwardRef((function(e,n){var t=e.components,l=e.mdxType,o=e.originalType,i=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),u=s(t),d=l,g=u["".concat(i,".").concat(d)]||u[d]||m[d]||o;return t?r.createElement(g,a(a({ref:n},p),{},{components:t})):r.createElement(g,a({ref:n},p))}));function d(e,n){var t=arguments,l=n&&n.mdxType;if("string"==typeof e||l){var o=t.length,a=new Array(o);a[0]=u;var c={};for(var i in n)hasOwnProperty.call(n,i)&&(c[i]=n[i]);c.originalType=e,c.mdxType="string"==typeof e?e:l,a[1]=c;for(var s=2;s<o;s++)a[s]=t[s];return r.createElement.apply(null,a)}return r.createElement.apply(null,t)}u.displayName="MDXCreateElement"},3481:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>i,contentTitle:()=>a,default:()=>m,frontMatter:()=>o,metadata:()=>c,toc:()=>s});var r=t(7462),l=(t(7294),t(3905));const o={slug:"/Colly-Spider-Get-CoinMarket-Data",title:"\u6578\u5b57\u8ca8\u5e63\u884c\u60c5\u722c\u53d6 Colly\u5be6\u6230",authors:["w0x7ce"],tags:["\u722c\u866b","\u5be6\u6230","\u6578\u5b57\u8ca8\u5e63","Golang","Spider","Colly"]},a=void 0,c={permalink:"/zh-TW/blog/Colly-Spider-Get-CoinMarket-Data",editUrl:"https://github.com/tianrking/tianrking.github.io/edit/v3.0/blog/2022-03-17-Colly-Spider-Get-CoinMarket-Data.md",source:"@site/blog/2022-03-17-Colly-Spider-Get-CoinMarket-Data.md",title:"\u6578\u5b57\u8ca8\u5e63\u884c\u60c5\u722c\u53d6 Colly\u5be6\u6230",description:"Colly & coinmarket",date:"2022-03-17T00:00:00.000Z",formattedDate:"2022\u5e743\u670817\u65e5",tags:[{label:"\u722c\u866b",permalink:"/zh-TW/blog/tags/\u722c\u866b"},{label:"\u5be6\u6230",permalink:"/zh-TW/blog/tags/\u5be6\u6230"},{label:"\u6578\u5b57\u8ca8\u5e63",permalink:"/zh-TW/blog/tags/\u6578\u5b57\u8ca8\u5e63"},{label:"Golang",permalink:"/zh-TW/blog/tags/golang"},{label:"Spider",permalink:"/zh-TW/blog/tags/spider"},{label:"Colly",permalink:"/zh-TW/blog/tags/colly"}],readingTime:3.72,hasTruncateMarker:!1,authors:[{name:"w0x7ce",title:"Maintainer of w0x7ce.eu",url:"https://github.com/tiarnking",imageURL:"https://github.com/tianrking.png",key:"w0x7ce"}],frontMatter:{slug:"/Colly-Spider-Get-CoinMarket-Data",title:"\u6578\u5b57\u8ca8\u5e63\u884c\u60c5\u722c\u53d6 Colly\u5be6\u6230",authors:["w0x7ce"],tags:["\u722c\u866b","\u5be6\u6230","\u6578\u5b57\u8ca8\u5e63","Golang","Spider","Colly"]},prevItem:{title:"Clean Up Disk Space in Linux",permalink:"/zh-TW/blog/Clean-Up-Disk-Space-in-Linux"},nextItem:{title:"Ab\u538b\u529b\u6d4b\u8bd5",permalink:"/zh-TW/blog/Ab\u538b\u529b\u6d4b\u8bd5"}},i={authorsImageUrls:[void 0]},s=[{value:"Colly &amp; coinmarket",id:"colly--coinmarket",level:2},{value:"Colly \u662f\u4ec0\u4e48\uff0c\u4ec0\u4e48\u8981\u7528\u5b83\uff0c\u600e\u6837\u5229\u7528\u5b83\u8fdb\u884c\u91cf\u5316\u76f8\u5173\u7684\u5e94\u7528",id:"colly-\u662f\u4ec0\u4e48\u4ec0\u4e48\u8981\u7528\u5b83\u600e\u6837\u5229\u7528\u5b83\u8fdb\u884c\u91cf\u5316\u76f8\u5173\u7684\u5e94\u7528",level:3},{value:"Colly\u7684\u4f7f\u7528",id:"colly\u7684\u4f7f\u7528",level:2},{value:"Colly\u7684\u6267\u884c\u987a\u5e8f",id:"colly\u7684\u6267\u884c\u987a\u5e8f",level:3},{value:"Colly \u7684\u5b89\u88c5",id:"colly-\u7684\u5b89\u88c5",level:3},{value:"\u7f51\u7edc\u73af\u5883\u7684\u914d\u7f6e",id:"\u7f51\u7edc\u73af\u5883\u7684\u914d\u7f6e",level:3},{value:"\u5b8c\u6574\u4ee3\u7801",id:"\u5b8c\u6574\u4ee3\u7801",level:3}],p={toc:s};function m(e){let{components:n,...t}=e;return(0,l.kt)("wrapper",(0,r.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,l.kt)("h2",{id:"colly--coinmarket"},"Colly & coinmarket"),(0,l.kt)("h3",{id:"colly-\u662f\u4ec0\u4e48\u4ec0\u4e48\u8981\u7528\u5b83\u600e\u6837\u5229\u7528\u5b83\u8fdb\u884c\u91cf\u5316\u76f8\u5173\u7684\u5e94\u7528"},"Colly \u662f\u4ec0\u4e48\uff0c\u4ec0\u4e48\u8981\u7528\u5b83\uff0c\u600e\u6837\u5229\u7528\u5b83\u8fdb\u884c\u91cf\u5316\u76f8\u5173\u7684\u5e94\u7528"),(0,l.kt)("p",null,"colly \u662f\u7528Go \u8bed\u8a00\u7f16\u5199\u7684\u529f\u80fd\u5f3a\u5927\u7684\u722c\u866b\u6846\u67b6\u3002 \u5b83\u63d0\u4f9b\u7b80\u6d01\u7684API\uff0c\u62e5\u6709\u5f3a\u52b2\u7684\u6027\u80fd\uff0c\u53ef\u4ee5\u81ea\u52a8\u5904\u7406cookie&session\uff0c\u8fd8\u6709\u63d0\u4f9b\u7075\u6d3b\u7684\u6269\u5c55\u673a\u5236"),(0,l.kt)("p",null,"Colly \u672c\u8eab\u4e0d\u80fd\u505a\u91cf\u5316 \u4f46\u662f Colly\u53ef\u4ee5\u66f4\u9ad8\u6548\u7684\u5e2e\u52a9\u6211\u4eec\u91c7\u96c6\u6570\u636e\uff0c\u4e3a\u6211\u4eec\u63d0\u4f9b\u91cf\u5316\u7684\u5f39\u836f"),(0,l.kt)("h2",{id:"colly\u7684\u4f7f\u7528"},"Colly\u7684\u4f7f\u7528"),(0,l.kt)("h3",{id:"colly\u7684\u6267\u884c\u987a\u5e8f"},"Colly\u7684\u6267\u884c\u987a\u5e8f"),(0,l.kt)("p",null,"colly\u51fd\u5f0f\u4f5c\u7528\u9806\u5e8f(Call order of callbacks)"),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},"OnRequest\n\u5728\u53d1\u8d77\u8bf7\u6c42\u524d \u53ef\u4ee5\u8fdb\u884cHeader\u76f8\u5173\u7684\u8bbe\u5b9a"),(0,l.kt)("li",{parentName:"ol"},"OnError\n\u5982\u679c\u8bf7\u6c42\u65f6\u5019\u51fa\u73b0\u9519\u8bef \u5728\u8fd9\u91cc\u6355\u83b7\u5b83"),(0,l.kt)("li",{parentName:"ol"},"OnResponseHeaders\n\u6536\u5230\u54cd\u5e94\u6807\u5934\u65f6\u5019 \u6211\u4eec\u9700\u8981\u505a\u7684\u4e1c\u897f\u5199\u5728\u8fd9\u91cc"),(0,l.kt)("li",{parentName:"ol"},"OnResponse\n\u6536\u5230\u54cd\u5e94\u56de\u590d\u7684\u65f6\u5019 \u6211\u4eec\u8981\u505a\u7684\u4e8b\u60c5 \u5199\u5728\u8fd9\u91cc"),(0,l.kt)("li",{parentName:"ol"},"OnHTML\n\u6536\u5230\u76f8\u5e94\u4e3aHTML\u683c\u5f0f\u65f6\u5019\uff08\u665a\u4e8eOnResponse\uff09\uff0c\u8fdb\u884cgoquerySelector\u7be9\u9078"),(0,l.kt)("li",{parentName:"ol"},"OnXML\n\u6536\u5230\u76f8\u5e94\u4e3aXML\u683c\u5f0f\u65f6\u5019\uff08\u665a\u4e8eOnHTML\uff09\uff0c\u8fdb\u884cxpathQuery\u7b5b\u9009"),(0,l.kt)("li",{parentName:"ol"},"OnScraped\n\u6293\u53d6\u7f51\u9875\uff08\u7c7b\u4f3c\u4e8eOnResponse\uff09\uff0c\u4f46\u5728\u6700\u540e\u624d\u8fdb\u884c\u8c03\u7528")),(0,l.kt)("h3",{id:"colly-\u7684\u5b89\u88c5"},"Colly \u7684\u5b89\u88c5"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},'``bash     # \u5b89\u88c5Golang     wget "https://go.dev/dl/go1.18.linux-amd64.tar.gz"     rm -rf /usr/local/go && tar -C /usr/local -xzf go1.18.linux-amd64.tar.gz     export PATH=$PATH:/usr/local/go/bin     go version     ``\n\n``bash     # \u542f\u7528 Go Modules \u529f\u80fd     go env -w GO111MODULE=on     # 1. \u4e03\u725b CDN     go env -w  GOPROXY=https://goproxy.cn,direct     # 2. \u963f\u91cc\u4e91     go env -w GOPROXY=https://mirrors.aliyun.com/goproxy/,direct     # 3. \u5b98\u65b9     go env -w  GOPROXY=https://goproxy.io,direct     ``\n\n``bash     mkdir Crawl && pushd Crawl     go mod init     go get -u github.com/gocolly/colly/v2     go mod tidy     ``\n')),(0,l.kt)("h3",{id:"\u7f51\u7edc\u73af\u5883\u7684\u914d\u7f6e"},"\u7f51\u7edc\u73af\u5883\u7684\u914d\u7f6e"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"\u56e0\u4e3a\u5728\u56fd\u5185 \u65e0\u6cd5\u76f4\u63a5\u8fde\u63a5\u4e0a\u6570\u5b57\u8d27\u5e01\u7684\u7f51\u7ad9 \u6240\u4ee5 \u6211\u4eec\u9700\u8981\u914d\u7f6e\u4ee3\u7406, \u6211\u4eec\u7684\u672c\u5730\u4ee3\u7406\u4e3a socks5:/127.0.0.1:12999\n\n\u5982\u679c\u6ca1\u6709\u642d\u5efa \u53ef\u4ee5 \u5c1d\u8bd5\u5728\u670d\u52a1\u5668\u4e0a\u7528snap \u5b89\u88c5 shadowsocks\n\n``bash     sudo apt-get update && sudo apt-get upgrade -y     sudo apt install snapd     sudo snap install shadowsocks-libev     sudo snap run shadowsocks-libev.ss-local -s server_ip -p server_port -l local_port -b 0.0.0.0 -k passwd -m method     ``\n")),(0,l.kt)("h3",{id:"\u5b8c\u6574\u4ee3\u7801"},"\u5b8c\u6574\u4ee3\u7801"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},'```golang\n    package main\n\nimport (\n        "fmt"\n        "log"\n        "strconv"\n\ncolly "github.com/gocolly/colly/v2"\n        "github.com/gocolly/colly/v2/proxy"\n        excelize "github.com/xuri/excelize/v2"\n    )\n\ntype GG struct {\n        _url       string\n        _name      string\n        _now_price string\n    }\n\nfunc main() {\n\nnum := 0\n        f := excelize.NewFile()\n\n// Instantiate default collector\n        c := colly.NewCollector()\n        // Rotate two socks5 proxies\n        rp, err := proxy.RoundRobinProxySwitcher("socks5://127.0.0.1:12999", "socks5://127.0.0.1:12999")\n        if err != nil {\n            log.Fatal(err)\n        }\n        // \u3010\u8bbe\u7f6e\u4ee3\u7406IP\u3011 \uff0c\u8fd9\u91cc\u4f7f\u7528\u7684\u662f\u8f6e\u8be2ip\u65b9\u5f0f\n        c.SetProxyFunc(rp)\n\nc.OnRequest(func(r *colly.Request) {\n            r.Headers.Set("Authority", "coinmarketcap.com")\n            r.Headers.Set("Cache-Control", "max-age=0")\n            r.Headers.Set("Sec-Ch-Ua", "\\" Not A;Brand\\";v=\\"99\\", \\"Chromium\\";v=\\"99\\", \\"Microsoft Edge\\";v=\\"99\\"")\n            r.Headers.Set("Sec-Ch-Ua-Mobile", "?0")\n            r.Headers.Set("Sec-Ch-Ua-Platform", "\\"Windows\\"")\n            r.Headers.Set("Upgrade-Insecure-Requests", "1")\n            r.Headers.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36 Edg/99.0.1150.39")\n            r.Headers.Set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9")\n            r.Headers.Set("Sec-Fetch-Site", "same-origin")\n            r.Headers.Set("Sec-Fetch-Mode", "navigate")\n            r.Headers.Set("Sec-Fetch-User", "?2")\n            r.Headers.Set("Sec-Fetch-Dest", "document")\n            r.Headers.Set("Referer", "https://coinmarketcap.com/all/views/all/")\n            r.Headers.Set("Accept-Language", "zh-TW,zh-HK;q=0.9,zh;q=0.8,en;q=0.7,zh-CN;q=0.6,en-GB;q=0.5,en-US;q=0.4")\n\n})\n\nc.OnResponse(func(r *colly.Response) {\n\n})\n\nc.OnHTML(".cmc-table__table-wrapper-outer tbody tr", func(e *colly.HTMLElement) {\n\nDOGE := GG{}\n            if len(e.ChildText("td[class=\'name-cell\']")) == 0 {\n                DOGE._url = "https://coinmarketcap.com" + e.ChildAttr("a[class=\'cmc-link\']", "href")\n                DOGE._name = e.ChildText("a[class=\'cmc-table__column-name--name cmc-link\']")\n            } else {\n                DOGE._url = "https://coinmarketcap.com" + e.ChildAttr("a[class=\'cmc-link\']", "href")\n                DOGE._name = e.ChildText("td[class=\'name-cell\']")\n            }\n\nc_coin := colly.NewCollector()\n            c_coin.SetProxyFunc(rp)\n            c_coin.OnRequest(func(r *colly.Request) {\n                r.Headers.Set("Authority", "coinmarketcap.com")\n                r.Headers.Set("Cache-Control", "max-age=0")\n                r.Headers.Set("Sec-Ch-Ua", "\\" Not A;Brand\\";v=\\"99\\", \\"Chromium\\";v=\\"99\\", \\"Microsoft Edge\\";v=\\"99\\"")\n                r.Headers.Set("Sec-Ch-Ua-Mobile", "?0")\n                r.Headers.Set("Sec-Ch-Ua-Platform", "\\"Windows\\"")\n                r.Headers.Set("Upgrade-Insecure-Requests", "1")\n                r.Headers.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36 Edg/99.0.1150.39")\n                r.Headers.Set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9")\n                r.Headers.Set("Sec-Fetch-Site", "same-origin")\n                r.Headers.Set("Sec-Fetch-Mode", "navigate")\n                r.Headers.Set("Sec-Fetch-User", "?2")\n                r.Headers.Set("Sec-Fetch-Dest", "document")\n                r.Headers.Set("Referer", "https://coinmarketcap.com/all/views/all/")\n                r.Headers.Set("Accept-Language", "zh-TW,zh-HK;q=0.9,zh;q=0.8,en;q=0.7,zh-CN;q=0.6,en-GB;q=0.5,en-US;q=0.4")\n            })\n            c_coin.OnResponse(func(r *colly.Response) {\n            })\n            c_coin.OnHTML("div[class=\'priceValue \']", func(r *colly.HTMLElement) {\n                DOGE._now_price = string(r.Text)\n            })\n            c_coin.Visit(DOGE._url)\n\nfmt.Print(DOGE._name, "     ")\n            fmt.Print(DOGE._now_price, "     ")\n            fmt.Println(DOGE._url)\n\nvar A_num string = "A" + strconv.Itoa(num)\n            B_price := "B" + strconv.Itoa(num)\n            C_url := "C" + strconv.Itoa(num)\n\nf.SetCellValue("Sheet1", A_num, DOGE._name)\n            f.SetCellValue("Sheet1", B_price, DOGE._now_price)\n            f.SetCellValue("Sheet1", C_url, DOGE._url)\n\nif err := f.SaveAs("Coin_price.xlsx"); err != nil {\n                fmt.Println(err)\n            }\n            num += 1\n\n})\n\nc.Visit("https://coinmarketcap.com/all/views/all/")\n\n}\n```\n')))}m.isMDXComponent=!0}}]);
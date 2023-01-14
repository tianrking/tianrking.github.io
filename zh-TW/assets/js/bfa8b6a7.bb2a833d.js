"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[634],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>m});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var p=n.createContext({}),d=function(e){var t=n.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},u=function(e){var t=d(e.components);return n.createElement(p.Provider,{value:t},e.children)},l={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},c=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,p=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),c=d(r),m=o,f=c["".concat(p,".").concat(m)]||c[m]||l[m]||a;return r?n.createElement(f,i(i({ref:t},u),{},{components:r})):n.createElement(f,i({ref:t},u))}));function m(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=c;var s={};for(var p in t)hasOwnProperty.call(t,p)&&(s[p]=t[p]);s.originalType=e,s.mdxType="string"==typeof e?e:o,i[1]=s;for(var d=2;d<a;d++)i[d]=r[d];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}c.displayName="MDXCreateElement"},1806:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>p,contentTitle:()=>i,default:()=>l,frontMatter:()=>a,metadata:()=>s,toc:()=>d});var n=r(7462),o=(r(7294),r(3905));const a={description:"Seeeduino_Lotus_Cortex-M0",title:"Seeeduino_Lotus_Cortex-M0",tags:["embedded","samd","platformio"],keywords:["embedded","samd","platformio"],image:"https://github.com/tianrking.png",last_update:{date:"12/6/2022",author:"w0x7ce"}},i=void 0,s={unversionedId:"samd/Seeeduino_Lotus_Cortex-M0",id:"samd/Seeeduino_Lotus_Cortex-M0",title:"Seeeduino_Lotus_Cortex-M0",description:"Seeeduino_Lotus_Cortex-M0",source:"@site/docs/samd/Seeeduino_Lotus_Cortex-M0.md",sourceDirName:"samd",slug:"/samd/Seeeduino_Lotus_Cortex-M0",permalink:"/zh-TW/samd/Seeeduino_Lotus_Cortex-M0",draft:!1,editUrl:"https://github.com/tianrking/tianrking.github.io/edit/v3.0/docs/samd/Seeeduino_Lotus_Cortex-M0.md",tags:[{label:"embedded",permalink:"/zh-TW/tags/embedded"},{label:"samd",permalink:"/zh-TW/tags/samd"},{label:"platformio",permalink:"/zh-TW/tags/platformio"}],version:"current",lastUpdatedBy:"w0x7ce",lastUpdatedAt:1670284800,formattedLastUpdatedAt:"2022\u5e7412\u67086\u65e5",frontMatter:{description:"Seeeduino_Lotus_Cortex-M0",title:"Seeeduino_Lotus_Cortex-M0",tags:["embedded","samd","platformio"],keywords:["embedded","samd","platformio"],image:"https://github.com/tianrking.png",last_update:{date:"12/6/2022",author:"w0x7ce"}},sidebar:"tutorialSidebar",previous:{title:"Zephyr on RP2040 Getting started",permalink:"/zh-TW/rp2040/Zephyr-on-RP2040-get-start"},next:{title:"terminator",permalink:"/zh-TW/Software/terminator"}},p={},d=[],u={toc:d};function l(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://wiki.seeedstudio.com/Seeeduino_Lotus_Cortex-M0-"},"SAMD21G18A Seeeduino_Lotus_Cortex-M0"),"\n",(0,o.kt)("a",{parentName:"p",href:"https://wiki.seeedstudio.com/Wio-Lite-W600/"},"Wio Lite W600")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"pio project init --board seeed_zero\ntouch src/main.cpp\n")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-cxx",metastring:'title="src/main.cpp"',title:'"src/main.cpp"'},"#include<Arduino.h>\nvoid setup()\n{\n\n}\n\nvoid loop(){\n\n}\n")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"pio run\npio run --target upload\n")))}l.isMDXComponent=!0}}]);
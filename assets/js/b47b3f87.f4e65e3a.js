"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[2963],{3905:(e,t,r)=>{r.d(t,{Zo:()=>l,kt:()=>d});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var c=n.createContext({}),p=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},l=function(e){var t=p(e.components);return n.createElement(c.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),u=p(r),d=o,f=u["".concat(c,".").concat(d)]||u[d]||m[d]||a;return r?n.createElement(f,i(i({ref:t},l),{},{components:r})):n.createElement(f,i({ref:t},l))}));function d(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=u;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s.mdxType="string"==typeof e?e:o,i[1]=s;for(var p=2;p<a;p++)i[p]=r[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}u.displayName="MDXCreateElement"},5687:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>m,frontMatter:()=>a,metadata:()=>s,toc:()=>p});var n=r(7462),o=(r(7294),r(3905));const a={description:"micro ROS on ESP32",title:"micro ROS on ESP32",tags:["embedded","esp"],keywords:["embedded","esp"],image:"https://github.com/tianrking.png",last_update:{date:"12/2/2022",author:"w0x7ce"}},i=void 0,s={unversionedId:"esp/micro-ROS-on-ESP32",id:"esp/micro-ROS-on-ESP32",title:"micro ROS on ESP32",description:"micro ROS on ESP32",source:"@site/docs/esp/micro-ROS-on-ESP32.md",sourceDirName:"esp",slug:"/esp/micro-ROS-on-ESP32",permalink:"/esp/micro-ROS-on-ESP32",draft:!1,editUrl:"https://github.com/tianrking/tianrking.github.io/edit/v3.0/docs/esp/micro-ROS-on-ESP32.md",tags:[{label:"embedded",permalink:"/tags/embedded"},{label:"esp",permalink:"/tags/esp"}],version:"current",lastUpdatedBy:"w0x7ce",lastUpdatedAt:1669939200,formattedLastUpdatedAt:"Dec 2, 2022",frontMatter:{description:"micro ROS on ESP32",title:"micro ROS on ESP32",tags:["embedded","esp"],keywords:["embedded","esp"],image:"https://github.com/tianrking.png",last_update:{date:"12/2/2022",author:"w0x7ce"}}},c={},p=[],l={toc:p};function m(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},l,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"git clone https://github.com/espressif/esp-idf\ngit submodule update --init --recursive\nrm -rf ~/.espressif\n")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"git clone https://github.com/micro-ROS/micro_ros_espidf_component\n. $IDF_PATH/export.sh\npip3 install catkin_pkg lark-parser empy colcon-common-extensions\n")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"docker run -it --rm espressif/idf:release-v4.4\n")),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"esp32 success"),(0,o.kt)("li",{parentName:"ul"},"esp32s3 success"),(0,o.kt)("li",{parentName:"ul"},"esp32c3 fail")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"idf.py set-target esp32c3\nidf.py menuconfig\nidf.py build\n")))}m.isMDXComponent=!0}}]);
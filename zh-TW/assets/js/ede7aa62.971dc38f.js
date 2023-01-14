"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[9395],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>d});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function l(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?l(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},l=Object.keys(e);for(n=0;n<l.length;n++)r=l[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)r=l[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var p=n.createContext({}),s=function(e){var t=n.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},c=function(e){var t=s(e.components);return n.createElement(p.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,l=e.originalType,p=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),m=s(r),d=a,_=m["".concat(p,".").concat(d)]||m[d]||u[d]||l;return r?n.createElement(_,o(o({ref:t},c),{},{components:r})):n.createElement(_,o({ref:t},c))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=r.length,o=new Array(l);o[0]=m;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i.mdxType="string"==typeof e?e:a,o[1]=i;for(var s=2;s<l;s++)o[s]=r[s];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},9401:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>p,contentTitle:()=>o,default:()=>u,frontMatter:()=>l,metadata:()=>i,toc:()=>s});var n=r(7462),a=(r(7294),r(3905));const l={description:"micro-ROS-RP2040",title:"micro-ROS on RP2040 Getting started",tags:["embedded","rp2040","micro-ROS"],keywords:["embedded","rp2040","micro-ROS"],image:"https://github.com/tianrking.png",last_update:{date:"12/29/2022",author:"w0x7ce"}},o=void 0,i={unversionedId:"rp2040/micro-ROS-on-RP2040",id:"rp2040/micro-ROS-on-RP2040",title:"micro-ROS on RP2040 Getting started",description:"micro-ROS-RP2040",source:"@site/docs/rp2040/micro-ROS-on-RP2040.md",sourceDirName:"rp2040",slug:"/rp2040/micro-ROS-on-RP2040",permalink:"/zh-TW/rp2040/micro-ROS-on-RP2040",draft:!1,editUrl:"https://github.com/tianrking/tianrking.github.io/edit/v3.0/docs/rp2040/micro-ROS-on-RP2040.md",tags:[{label:"embedded",permalink:"/zh-TW/tags/embedded"},{label:"rp2040",permalink:"/zh-TW/tags/rp-2040"},{label:"micro-ROS",permalink:"/zh-TW/tags/micro-ros"}],version:"current",lastUpdatedBy:"w0x7ce",lastUpdatedAt:1672272e3,formattedLastUpdatedAt:"2022\u5e7412\u670829\u65e5",frontMatter:{description:"micro-ROS-RP2040",title:"micro-ROS on RP2040 Getting started",tags:["embedded","rp2040","micro-ROS"],keywords:["embedded","rp2040","micro-ROS"],image:"https://github.com/tianrking.png",last_update:{date:"12/29/2022",author:"w0x7ce"}},sidebar:"tutorialSidebar",previous:{title:"PlatformIO on RP2040 Getting started",permalink:"/zh-TW/rp2040/PlatformIO-on-RP2040-get-start"},next:{title:"Zephyr on RP2040 Getting started",permalink:"/zh-TW/rp2040/Zephyr-on-RP2040-get-start"}},p={},s=[{value:"\u51c6\u5907",id:"\u51c6\u5907",level:2},{value:"\u786c\u4ef6",id:"\u786c\u4ef6",level:3},{value:"\u63a5\u7ebf\u65b9\u5f0f",id:"\u63a5\u7ebf\u65b9\u5f0f",level:3},{value:"\u62f7\u8d1d\u4ee3\u7801",id:"\u62f7\u8d1d\u4ee3\u7801",level:2},{value:"\u5173\u952e\u90e8\u5206\u89e3\u6790",id:"\u5173\u952e\u90e8\u5206\u89e3\u6790",level:3},{value:"CMakeList",id:"cmakelist",level:4},{value:"\u4ee3\u7801\u90e8\u5206",id:"\u4ee3\u7801\u90e8\u5206",level:4},{value:"\u4f9d\u8d56\u5b89\u88c5",id:"\u4f9d\u8d56\u5b89\u88c5",level:3},{value:"Build",id:"build",level:3},{value:"Flash",id:"flash",level:3},{value:"\u8fd0\u884c Micro-ROS \u670d\u52a1",id:"\u8fd0\u884c-micro-ros-\u670d\u52a1",level:3},{value:"\u8fdc\u7aef\u63a7\u5236",id:"\u8fdc\u7aef\u63a7\u5236",level:2},{value:"\u4e0a\u4f4d\u673a\u63a7\u5236",id:"\u4e0a\u4f4d\u673a\u63a7\u5236",level:3},{value:"\u5feb\u901f\u6d4b\u8bd5",id:"\u5feb\u901f\u6d4b\u8bd5",level:3},{value:"\u547d\u4ee4\u884c",id:"\u547d\u4ee4\u884c",level:4},{value:"rclpy",id:"rclpy",level:4},{value:"Thanks",id:"thanks",level:2}],c={toc:s};function u(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"PR2040 \u662f\u4e00\u6b3e\u9ad8\u6027\u80fd\uff0c\u7075\u6d3b\u7684I/O\uff0c\u4f4e\u6210\u672c\u7684\u63a7\u5236\u5668\u3002\u5728\u8fd9\u91cc\u6211\u4eec\u5c06\u4ecb\u7ecd\u5229\u7528 Raspberry Pi Pico \u5b9e\u73b0\u57fa\u4e8eROS\u7684\u7535\u673a\u63a7\u5236\u3002 "),(0,a.kt)("h2",{id:"\u51c6\u5907"},"\u51c6\u5907"),(0,a.kt)("h3",{id:"\u786c\u4ef6"},"\u786c\u4ef6"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://www.raspberrypi.com/products/raspberry-pi-pico/"},"Pi Pico")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://lastminuteengineers.com/l298n-dc-stepper-driver-arduino-tutorial/"},"L298N motor Driver"))),(0,a.kt)("h3",{id:"\u63a5\u7ebf\u65b9\u5f0f"},"\u63a5\u7ebf\u65b9\u5f0f"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"Encoder"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"GPIO 10"),(0,a.kt)("li",{parentName:"ul"},"GPIO 11"))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"PWM for L298N motor control"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"GPIO 6")))),(0,a.kt)("h2",{id:"\u62f7\u8d1d\u4ee3\u7801"},"\u62f7\u8d1d\u4ee3\u7801"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://me.w0x7ce.eu/rp2040/micro-ROS-on-RP2040"},"Detailed Tutorial")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"git clone https://github.com/tianrking/MicroROS_RP2040.git ~/MicroROS_RP2040\n")),(0,a.kt)("h3",{id:"\u5173\u952e\u90e8\u5206\u89e3\u6790"},"\u5173\u952e\u90e8\u5206\u89e3\u6790"),(0,a.kt)("h4",{id:"cmakelist"},"CMakeList"),(0,a.kt)("p",null,"\u8fd9\u91cc\u5229\u7528 CMakeLists \u81ea\u52a8\u68c0\u7d22\u5e76\u5173\u8054\u76f8\u5173\u7684\u5934\u6587\u4ef6 \u5229\u7528 quadrature_encoder/quadrature_encoder.pio \u5feb\u901f\u5b9e\u73b0pico\u5bf9\u7f16\u7801\u5668\u6570\u503c\u89e3\u6790\uff0c\u4ee5\u4fbf\u83b7\u5f97\u76f8\u5bf9\u8f6c\u901f"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp",metastring:'title="CMakeLists.txt"',title:'"CMakeLists.txt"'},"include($ENV{PICO_SDK_PATH}/external/pico_sdk_import.cmake)\n\nadd_executable(pico_micro_ros_motor_control\n    pico_micro_ros_motor_control.c\n    $ENV{micro_ROS_SDK_PATH}/pico_uart_transport.c\n)\n\npico_generate_pio_header(pico_micro_ros_motor_control $ENV{pico_examples_PATH}/pio/quadrature_encoder/quadrature_encoder.pio)\n")),(0,a.kt)("p",null,"\u8fd9\u91cc\u6211\u4eec\u6dfb\u52a0\u4e86 micro ros \u5f00\u53d1\u5305"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp",metastring:'title="CMakeLists.txt"',title:'"CMakeLists.txt"'},"link_directories($ENV{micro_ROS_SDK_PATH}/libmicroros)\n")),(0,a.kt)("p",null,"\u5982\u679c\u6211\u4eec\u9700\u8981\u4f7f\u7528 FreeRTOS \u9700\u8981\u6dfb\u52a0\u76ee\u5f55\u94fe\u63a5 \u5e76\u786e\u4f9d\u8d56\u5b89\u88c5 FreeRTOS SMP \u7248\u672c\uff0c\u540c\u65f6\u5b8c\u6210\u73af\u5883\u53d8\u91cf\u7684\u8bbe\u5b9a"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp",metastring:'title="CMakeLists.txt"',title:'"CMakeLists.txt"'},"target_link_libraries(pico_micro_ros_motor_control\n    pico_multicore\n    FreeRTOS-Kernel \n    FreeRTOS-Kernel-Heap4\n)\n")),(0,a.kt)("p",null,"\u914d\u7f6e\u662f\u5426\u4f7f\u7528 usb(\u6570\u636e\u7ebf\u4e32\u53e3) uart(GPIO\u4e32\u53e3)"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp",metastring:'title="CMakeLists.txt"',title:'"CMakeLists.txt"'},"# Configure Pico\npico_enable_stdio_usb(pico_micro_ros_motor_control 1)\npico_enable_stdio_uart(pico_micro_ros_motor_control 0)\nadd_compile_definitions(PICO_UART_ENABLE_CRLF_SUPPORT=0)\nadd_compile_definitions(PICO_STDIO_ENABLE_CRLF_SUPPORT=0)\nadd_compile_definitions(PICO_STDIO_DEFAULT_CRLF=0)\n")),(0,a.kt)("p",null,"\u751f\u6210 UF2 \u56fa\u4ef6 \u540e\u7eed\u6211\u4eec\u53ef\u4ee5\u76f4\u63a5\u590d\u5236\u7c98\u8d34\u5230 pico \u4e2d (\u70e7\u5f55\u6a21\u5f0f)"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp",metastring:'title="CMakeLists.txt"',title:'"CMakeLists.txt"'},"pico_add_extra_outputs(pico_micro_ros_motor_control)\n")),(0,a.kt)("h4",{id:"\u4ee3\u7801\u90e8\u5206"},"\u4ee3\u7801\u90e8\u5206"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u521d\u59cb\u5316\u8282\u70b9")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},'rcl_node_t node;\nrclc_support_t support;\nrcl_allocator_t allocator;\nrclc_support_init(&support, 0, NULL, &allocator);\nrclc_node_init_default(&node, "pico_node", "", &support);\n')),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u8bdd\u9898\u53d1\u5e03")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-c"},'rclc_publisher_init_default(\n        &publisher,\n        &node,\n        ROSIDL_GET_MSG_TYPE_SUPPORT(std_msgs, msg, Int32),\n        "pico_publisher");\n\nmsg_publisher_encoder.data = 123 ;  // \u6bd4\u5982\u6211\u4eec\u8981\u53d1\u5e03123 \u5728\u6211\u4eec\u7684\u4ee3\u7801\u4e2d \u5229\u7528\u5b9a\u65f6\u5668\u505a\u56de\u8c03\u51fd\u6570 \u5b9a\u65f6\u53d1\u9001 \u7f16\u7801\u5668\u83b7\u53d6\u5230\u7684\u8f6c\u901f\u6570\u503c\nrcl_ret_t ret = rcl_publish(&publisher, &msg, NULL);\nret = rcl_publish(&publisher_encoder, &msg_publisher_encoder, NULL); \n')),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u8bdd\u9898\u8ba2\u9605")),(0,a.kt)("p",null,"\u5728\u8fd9\u91cc\u6211\u4eec\u6bcf\u6b21\u63a5\u6536\u5230\u6570\u636e\uff0c\u90fd\u4f1a\u4f20\u5230\u56de\u8c03\u51fd\u6570\u4e2d\uff0c\u5f53\u6211\u4eec\u53d1\u9001\u8f6c\u901f\uff0cPWM \u968f\u4e4b\u6539\u53d8\uff0c \u901a\u8fc7\u56de\u8c03\u51fd\u6570\u5b9e\u73b0\u8f6c\u901f\u63a7\u5236"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-c"},'// \u521d\u59cb\u5316\nrclc_subscription_init_default(\n      &subscriber_speed_change,\n      &node,\n      ROSIDL_GET_MSG_TYPE_SUPPORT(std_msgs, msg, Int32),\n      "speed_change");\n\n// \u56de\u8c03\u51fd\u6570\nfloat speed_value;\nvoid subscription_callback_speed_change(const void *msgin_diy)\n{\n    // Cast received message to used type\n    const std_msgs__msg__Int32 *msg_diy = (const std_msgs__msg__Int32 *)msgin_diy;\n    speed_value = (float)msg_diy->data / 100 ;\n    // pwm_set_chan_level(slice_num, PWM_CHAN_A, _value * 62500);\n\n}\n')),(0,a.kt)("h3",{id:"\u4f9d\u8d56\u5b89\u88c5"},"\u4f9d\u8d56\u5b89\u88c5"),(0,a.kt)("p",null,"\u9996\u5148\uff0c \u786e\u4fdd Pico SDK \u6b63\u786e\u5b89\u88c5\u5e76\u4e14\u914d\u7f6e\u5230\u73af\u5883\u53d8\u91cf:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},'# Install dependencies\nsudo apt install cmake g++ gcc-arm-none-eabi doxygen libnewlib-arm-none-eabi git python3\ngit clone --recurse-submodules https://github.com/raspberrypi/pico-sdk.git $HOME/pico-sdk\n\n# Configure environment\necho "export PICO_SDK_PATH=$HOME/pico-sdk" >> ~/.bashrc\nsource ~/.bashrc\n')),(0,a.kt)("p",null,"\u7136\u540e, \u786e\u4fdd microros \u548c pico-example \u88ab\u6b63\u786e\u914d\u7f6e\uff0c \u6211\u4eec\u5c06\u8c03\u7528 pico-example \u91cc\u9762\u7684\u51fd\u6570\u5feb\u901f\u5b9e\u73b0\u7f16\u7801\u5668\u6570\u503c\u83b7\u53d6"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"git clone https://github.com/micro-ROS/micro_ros_raspberrypi_pico_sdk ~/micro_ROS_SDK_PATH\nexport micro_ROS_SDK_PATH=~/micro_ROS_SDK_PATH\n\ngit clone https://github.com/raspberrypi/pico-examples ~/pico-examples\nexport pico_examples_PATH=~/pico-examples\n")),(0,a.kt)("p",null,"\u5982\u679c\u60f3\u652f\u6301 FreeRTOS \u53ef\u4ee5\u6dfb\u52a0 smp \u7248\u672c\u7684 FreeRTOS \uff0c\u56e0\u4e3a RP2040 \u662f\u5bf9\u79f0\u591a\u5904\u7406\u5668"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"git clone -b smp https://github.com/FreeRTOS/FreeRTOS-Kernel --recurse-submodules ~/FreeRTOS-Kernel-SMP \nexport FREERTOS_KERNEL_PATH=~/FreeRTOS-Kernel-SMP/FreeRTOS-Kernel\n")),(0,a.kt)("p",null,"\u7136\u540e\u6211\u4eec\u5f00\u59cb\u7f16\u8bd1\u4ee3\u7801"),(0,a.kt)("h3",{id:"build"},"Build"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"cd ~/MicroROS_RP2040\nmkdir build\ncd build\ncmake ..\nmake\n")),(0,a.kt)("h3",{id:"flash"},"Flash"),(0,a.kt)("p",null,"\u6309\u4f4f boot \u952e\uff0c\u5c06 pico \u63d2\u5165\u7535\u8111\uff0c \u7136\u540e\u677e\u5f00boot\u952e"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"cp pico_micro_ros_example.uf2 /media/$USER/RPI-RP2\n")),(0,a.kt)("h3",{id:"\u8fd0\u884c-micro-ros-\u670d\u52a1"},"\u8fd0\u884c Micro-ROS \u670d\u52a1"),(0,a.kt)("p",null,"Micro-ROS \u9075\u5faaC/S\u67b6\u6784\uff0c\u6240\u4ee5\u9700\u8981\u5728Linux\u7aef\u542f\u52a8Micro-ROS\u4ee3\u7406\uff0c\u89e3\u6790\u5355\u7247\u673a\u7aef\u4f20\u56de\u7684\u6570\u636e\u3002 "),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Docker \u65b9\u5f0f")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"docker run -it --rm -v /dev:/dev --privileged --net=host microros/micro-ros-agent:humble serial --dev /dev/ttyACM0 -b 115200\n")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"snap \u65b9\u5f0f")),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},"\u5b89\u88c5")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"sudo snap install micro-ros-agent\n")),(0,a.kt)("ol",{start:2},(0,a.kt)("li",{parentName:"ol"},"\u542f\u52a8\u70ed\u63d2\u62d4")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"sudo snap set core experimental.hotplug=true\nsudo systemctl restart snapd\n")),(0,a.kt)("ol",{start:3},(0,a.kt)("li",{parentName:"ol"},"\u8fd0\u884c")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"sudo micro-ros-agent serial --dev /dev/ttyACM0 baudrate=115200\n")),(0,a.kt)("h2",{id:"\u8fdc\u7aef\u63a7\u5236"},"\u8fdc\u7aef\u63a7\u5236"),(0,a.kt)("h3",{id:"\u4e0a\u4f4d\u673a\u63a7\u5236"},"\u4e0a\u4f4d\u673a\u63a7\u5236"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"git clone -b GUI https://github.com/tianrking/MicroROS_RP2040.git ~/MicroROS_RP2040_GUI\ncd ~/MicroROS_RP2040_GUI \npip install -r requirements.txt\nsource /opt/ros/humble/setup/bash\npython3 main.py\n")),(0,a.kt)("h3",{id:"\u5feb\u901f\u6d4b\u8bd5"},"\u5feb\u901f\u6d4b\u8bd5"),(0,a.kt)("h4",{id:"\u547d\u4ee4\u884c"},"\u547d\u4ee4\u884c"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u67e5\u770b Topic")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"ros2 topic list\n")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u8c03\u8282\u8f6c\u901f")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},'ros2 topic pub /speed_change std_msgs/Int32 "data: 28" -t 1\n')),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u83b7\u53d6\u8f6c\u901f")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"ros2 topic echo /pico_publisher_encoder\n")),(0,a.kt)("h4",{id:"rclpy"},"rclpy"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},"\u7f16\u8bd1")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"cd ~/MicroROS_RP2040/PC_Control/\ncolcon build\nsource install/setup.bash\n")),(0,a.kt)("ol",{start:2},(0,a.kt)("li",{parentName:"ol"},"\u8fd0\u884c")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"ros2 run motor_control_rclpy change_speed\nros2 run motor_control_rclpy get_speed\n")),(0,a.kt)("h2",{id:"thanks"},"Thanks"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/micro-ROS/micro-ROS-demos"},"https://github.com/micro-ROS/micro-ROS-demos")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/raspberrypi/pico-examples"},"https://github.com/raspberrypi/pico-examples"))))}u.isMDXComponent=!0}}]);
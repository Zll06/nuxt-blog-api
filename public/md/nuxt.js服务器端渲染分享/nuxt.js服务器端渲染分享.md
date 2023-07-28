## nuxt.js服务器端渲染分享

#### 一、介绍

​		服务器端渲染（Server-Side Rendering）是指由服务侧完成页面的 HTML 结构拼接的页面处理技术，发送到[浏览器](https://baike.baidu.com/item/浏览器/213911?fromModule=lemma_inlink)，然后为其绑定状态与事件，成为完全可交互页面的过程。

#### 二、渲染过程

![nuxt-schema](C:\Users\zhangjiaqi24\Documents\ssr分享\nuxt-schema.svg)

**1、传入请求**

**2、Nuxt服务器初始化**

**3、执行中间件**

​		3.1、首先执行配置文件、获取配置信息

​		3.2、寻找layout组件、初始化全局layout

​		3.3、寻找page文件及其子文件

**4、根据请求的URL地址解析出相应的路由信息，获取符合条件的Vue的组件**

**5、在获取到路由信息和组件后，Nuxt.js 会根据组件的 `asyncData` 方法或 `fetch` 方法获取需要渲染的数据。如果组件定义了这些方法，它们会在服务器端调用，并将数据添加到渲染上下文对象（context）中，在需要的时候将这些数据作为组件的 props 传递给组件**

**6、在注入数据完成后，Nuxt.js 会使用生成的 HTML 代码作为响应内容返回给浏览器**

**7、切换路由时重新执行3-6步**
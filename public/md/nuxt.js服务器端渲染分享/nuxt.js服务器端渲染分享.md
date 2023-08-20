## Nuxt.js服务器端渲染分享

#### 一、介绍

1、背景

​		随着各大领域与行业互联网的普及，各大行业都在争取，自家品牌或产品的曝光率多一些，**SEO**已经成为前端领域必须考虑的一个问题。而**SPA**架构的普及，使得**SPA**的弊端也逐步凸显出来。就目前而言，**SPA**架构的弊端是不利于搜索引擎优化，首屏慢等问题。此时，各大框架，都在考虑自己的"服务端渲染"方案。于是，在React推出Next.js之后，Vue也推出了Nuxt.js。

2、服务器端渲染是什么

​		服务器端渲染（Server-Side Rendering）是指由服务端完成页面的 HTML 结构拼接及页面处理，然后发送到浏览器，最后为其绑定状态与事件，成为完全可交互页面的过程。

#### 二、渲染过程

![nuxt-schema](/api/nuxt.js服务器端渲染分享/nuxt-schema.svg)

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

#### 三、Nuxt框架分析

1、目录结构

与Vue-cli 大同小异，其最大的区别，就是一个**在根目录中**，另一个**在src的二级目录中**。

因为Nuxt需要同时考虑客户端及服务端，目录结构更类似koa或express等服务端框架。

<table><thead><tr><th align="left">名称</th><th align="left">vue-cli</th><th align="left">nuxt</th></tr></thead><tbody><tr><td align="left">页面</td><td align="left">src/views</td><td align="left">pages&nbsp;</td></tr><tr><td align="left">组件</td><td align="left">src/components</td><td align="left">components&nbsp;</td></tr><tr><td align="left">vuex</td><td align="left">src/store&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td align="left">store&nbsp;</td></tr><tr><td align="left">静态资源</td><td align="left">src/static&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td align="left">static&nbsp;</td></tr><tr><td align="left">公用方法</td><td align="left">src/${js}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td align="left">plugins&nbsp;</td></tr><tr><td align="left">路由</td><td align="left">src/${自定义}</td><td align="left">/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td></tr><tr><td align="left">布局</td><td align="left">/</td><td align="left">layout&nbsp;</td></tr><tr><td align="left">中间层</td><td align="left">/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td align="left">middleware&nbsp;</td></tr><tr><td align="left">配置文件</td><td align="left">vue.config.js&nbsp;&nbsp;</td><td align="left">nuxt.config.js&nbsp;</td></tr></tbody></table>

(1)、pages目录下必须有一个index.vue文件作为入口文件。

(2)、pages目录下创建的文件会被编译为路由存在；如，

```bash
pages/
--| user/
-----| index.vue
-----| one.vue
--| index.vue
```

会被编译为

```js
router: {
  routes: [
    {
      name: 'index',
      path: '/',
      component: 'pages/index.vue'
    },
    {
      name: 'user',
      path: '/user',
      component: 'pages/user/index.vue'
    },
    {
      name: 'user-one',
      path: '/user/one',
      component: 'pages/user/one.vue'
    }
  ]
}
```

(3)、plugins目录

在传统的spa页面，执行顺序，是优先生成了实例，再执行对应的js。此时所有的js，想获取到对应的实例，是十分简单的，直接js，或者import vue form 'vue'引入接口。

但是在ssr中，服务端跟客户端是无法同时使用同一个实例的。而nuxt帮我们处理了这个事情，引入了plugins。让在server的生明周期，也可以获取到对应的实例。

给plugins一个简单的理解的话，就是： 需要在根vue.js应用实例化之前需要运行的JavaScript插件

值得注意的是，在配置 plugins 的时候，如果 ssr：false ，将会在asyncData。 

或者mode: 'client' || 'server'控制终端。

(4)、layouts目录

layouts分为全局及自定义layout

主要区别为全局layout的文件名必须为default.vue；

而自定义layout则可以随意定义文件名。

(5)、middleware目录

简单理解：存放应用的中间件

有点类似我们的"路由钩子函数"。但前端"路由钩子函数"已经进入的页面进行加载，而nuxt，此时还在服务端，会进行中断。

该场景最典型的，**鉴权**，**终端判断**，**埋点**等场景。

此外，nuxt中的middleware可分为，全局middleware与布局middleware，布局匿名middleware，页面middleware，以及页面匿名middleware。

他们的执行顺序是：**全局(config) >  布局(middleware) > 页面（page）**

2、实例

服务器端渲染https://www.nancal.com/?columnId=1&template=home

https://www.liruan.cn/



非服务器端渲染https://juejin.cn/

#### #注意事项

1、加入环境变量后，打印process.env是空对象，但是可以正常访问.env.*文件中定义的变量。

2、引入sass时对版本有要求，最好是sass-loader7.1.0，sass-loader1.42.1。

3、定义路由文件时，目录下的文件必须是index.vue；如，定义home路由，则定义为pages/home/index.vue。
## Nuxt.js服务器端渲染分享

#### 一、介绍

1、背景

​		随着**SPA**架构的普及，使得SPA的弊端也逐步凸显出来。因为SPA架构实现的页面是通过监听router进行路由分发，结合ajax加载数据进行渲染的，但是搜索引擎爬虫识别不了js，所以就不会有一个好的排名，而且，如果打包后js文件过大时，普通客户端渲染加载所有所需文件时间较长，首页就会有一个很长的白屏等待时间。于是，各大框架，都在考虑自己的"服务端渲染"方案，在React推出Next.js之后，Vue也推出了Nuxt.js。

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

#### #实用知识点

###### asyncData 服务端请求异步数据 (pages)

asyncData 主要做服务端数据请求渲染,在它上下文能够解构出axios,route,params...参数，要解构出axios,route,params...参数，要解构出axios,route,params...参数，要解构出axios，还需要做一些额外配置，往下拉有讲到。解构出$axios，就可以做ajax请求，最后把要渲染的数据return出去就行。

```javascript
javascript复制代码export default { 
  async asyncData({$axios,route}){ 
    let data = await $axios('xxx/xxx/xx') 
    return { 
      data 
    } 
  } 
}
```

###### 扩展路由（nuxt.config）

在nuxt默认为约定是路由，就是在pages在创建一个文件，或者一个文件夹就会自动创建对应的路由，无需手动配置什么，方便极了，这里就不多说，这里只要说一下，当我们要对某个地址做一个特殊操作的时候，或者全面接管约定式路由的时候，就需要用扩展路由了。

```css
css复制代码router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'custom',
        path: '*',
        component: resolve(__dirname, 'pages/404.vue')
      })
    }
  }
```

###### 定制错误页面 （layout）

默认情况下，nuxt提供了一个默认的错误页面，如果你嫌它错的哇，也可以自己定制一个风骚的错误页面，直接下`layout目录下定义一个error.vue文件`就可以定制自己喜欢的错误页面了，它会代替默认的错误页面，在`error.vue的prop有个error属于是包含错误信息的`

```xml
xml复制代码<template>
  <div> 错误页面{{ error }} </div> 
</template>
<script> 
export default { 
  props:['error'] 
}
</script>
```

###### 数据请求 (nuxt.config)

- 第一步 `npm i -D @nuxtjs/axois`
- 第二步在nuxt.config引入就可以

```arduino
arduino复制代码export default{
  modules: [
   '@nuxtjs/axios'
  ],
}
```

然后重启，就可以在plugin,aysncData...的上下文解构到`$axios`参数

###### 开启代理

- 第一步 `npm i -D @nuxtjs/proxy`
- 第二步 nuxt.config 下配置
- @nuxtjs/proxy
- nuxt.config 下配置 axios和proxy

```css
css复制代码export default {
  axios:{
     proxy:true
   }，
   proxy:{
     'api/':{
       target:'http://localhost:3000'
     }
   }
}
```

###### axios拦截

在平时开发中请求异步数据，少不了请求前，请求后做一些拦截，在nuxt中也很容易实现，只需定义一个`axios拦截plugin`。

- 第一步 在`plugins目录`，起一个性感的插件名，比如叫`axios.js`

```javascript
javascript复制代码export default function ({ store, redirect, req, router, $axios }) {
  $axios.interceptors.request.use(
    config => {},
    error => {}
  )
  $axios.interceptors.response.use(
    response => {},
    error => {}
  )
}
```

- 第二步 在`nuxt.config`中引入插件

```bash
bash复制代码export default { 
  plugins: [ 
    { src:'~/plugins/axios', ssr:true // 默认为true，会同时在服务端（asyncData（{$axios}））和客户端（this.$axios）同时拦截axios请求，设为false就只会拦截客户端 } 
  ] 
}
```

###### 定制meta（nuxt.config,pages）

定制可以在nuxt.config中定义全局，也可以在pages下定制单独的。

**nuxt**

```css
css复制代码export default {
  head: {
    title: 'test',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  }
}
```

#### #注意事项

1、加入环境变量后，打印process.env是空对象，但是可以正常访问.env.*文件中定义的变量。

2、引入sass时对版本有要求，最好是sass-loader7.1.0，sass-loader1.42.1。

3、定义路由文件时，目录下的文件必须是index.vue；如，定义home路由，则定义为pages/home/index.vue。
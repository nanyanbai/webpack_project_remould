# ZBestPC（之前的传统老项目）

该项目是一个专门卖家装家饰的商城，主要功能模块分为首页、商品分类、个人中心、订单中心、购物车功能以及在线购买等一条龙服务。用户能够足不出户实现在线购买家装家饰用品，可以随时随地浏览商品信息、加入购物车、在线购买、编辑个人资料等，页面采用 Html,CSS, 、JQuery，Swipper.js、SuperSlide.js 等插件和技术，很好的实现了商城的主要功能。

# 源码问题分析：

- css 和 js 资源多，且全部采用同步加载，渲染需要多次请求和加载，降低页面加载性能
- css 和 js 没有进行压缩，导致文件体积过大，影响页面加载速度
- 开发摸模式陈旧，需要同时维护 html、css、js 文件，代码多级和结构部清晰，迭代困难

# 项目需求：

- 第一阶段： 项目 webpack 改造，使原生 js 项目能够支持模块开发及打包
- 第二阶段： vue spa(单页面应用)改造，使项目能够使用 vue 进行单页面应用开发
- 第三阶段： vue mpa(多页面应用)改造，使项目能够使用 vue 进行多页面应用开发

# 改造方案：

## 1. 项目初始化

- 创建 npm 项目 `npm init -y`
- 安装 webpack 依赖 `npm install webpack webpack-cli -D`
- 创建 js 入口文件 `src/index.js`
- 创建 webpack 配置文件 `webpack.config.js`
- 配置 package.json 的 build 打包命令 `"build": "webpack"`
- 执行 npm run build 打包项目

#### 首页移植

1. 资源文件拷贝到源码中： html, css, js, img 拷贝至新项目中

- 将 index.html 拷贝至 新项目 src/index.html
- 将 js 拷贝至 新项目 src/js
- 将 css 拷贝至 新项目 src/css
- 将 img 拷贝至 新项目 src/img

2. 删除 index.html 中所有 script 和 link 的引用
3. 安装 html-webpack-plugin 插件
   > html-webpack-plugin 该插件将为你生成一个 HTML5 文件， 在 body 中使用 script 标签引入你所有 webpack 生成的 bundle
   ```bash
    npm install html-webpack-plugin -D
   ```
4. 配置 webpack.config.js 文件添加 html-webpack-plugin 插件的配置信息：

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    bundle: "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
  },
  module: {
    rules: [],
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html", //  模板名称
      template: "./src/index.html", // 模板路径
    }),
  ],
};
```

重新 npm run build 后发现 dist 目录下生成了 index.html 文件，并且 index.html 中引入了 bundle.js 文件

```html
<!DOCTYPE html>
<html>
  <head lang="en">
    <meta charset="utf-8" />
    <title>项目改造</title>
    <script defer src="bundle.js"></script></head>
  <body>
</html>
```

5. 在 src/index.js 中添加 css 引用：

```js
import "./css/public.css";
import "./css/index.css";
```

安装 style-loader 和 css-loader

```bash
npm install style-loader css-loader -D
```

配置 webpack.config.js 文件添加 style-loader 和 css-loader 的配置信息：

```js
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
```

完成后重新执行 npm run build，发现 css 已经打包为 js 文件， 但由于 css 中存在图片引用资源，所以需要对图片进行打包
注意： 在 webpack5 之前对图片的处理需要使用 file-loader、url-loader，而在 webpack5 之后对图片的处理需要使用 ModuleAssets

```js
module: {
    rules: [
      // ...
      {
        test: /\.(png| jpg|gif|jpeg)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8kb
          },
        },
        generator: {
          filename: "imgs/[name]_[hash:8][ext][query]",
        },
      },
    ],
  },
```

6. 在 src/index.js 中添加 js 引用：

```js
// 注意： 这些js是没有模块化的，没有输出的， 没有 import 导入的, 而是直接在页面中引用的
import "./js/jquery-1.12.4.min.js";
import "./js/public.js";
import "./js/nav";
import "./js/jquery.flexslider-min.js";
```

然后执行 npm run build 后，打包能成功， 但在打包后的 index.html 中发现，会报错

`index.html:436 
 Uncaught ReferenceError: $ is not defined
    at index.html:436:7
`

如何解决这个 $ 的问题呢？

1. 安装 jquery 和 flexslider

```bash
npm install jquery  flexslider
```

2. 把原来 index.html 中的删除

```js
<script >
$(function () {
  $("#home_slider").flexslider({
    animation: "slide",
    controlNav: true,
    directionNav: true,
    animationLoop: true,
    slideshow: true,
    slideshowSpeed: 2000,
    useCSS: false,
  });
});
</script>
```

然后放到 src/nav.js 中, 并把 flexslider 的引用放到 nav.js 中

```js
import "flexslider";
//	导航固定顶部
$(function () {
  $(window).scroll(function () {
    var ws = $(window).scrollTop();
    if (ws > 60) {
      $(".head")
        .addClass("ding")
        .css({ background: "rgba(255,255,255," + ws / 300 + ")" });
    } else {
      $(".head").removeClass("ding").css({ background: "#fff" });
    }
  });
});

$(function () {
  $("#home_slider").flexslider({
    animation: "slide",
    controlNav: true,
    directionNav: true,
    animationLoop: true,
    slideshow: true,
    slideshowSpeed: 2000,
    useCSS: false,
  });
});
```

3. 再进行 `webpack.config.js` 的配置

```js
const webpack = require("webpack");
// ...
 plugins: [
    // ...
    // ProvidePlugin 作用 是自动加载模块，而不必到处 import 或 require
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
  ],
```

然后修改 `src/index.js` 中的引用

```js
// import "./js/jquery-1.12.4.min.js";
import "jquery";
import "./js/public.js";
import "./js/nav";
// import "./js/jquery.flexslider-min.js";
```

然后进行打包， 发现 $ is not defined 的问题就会解决了

# 项目优化阶段

## 现在存在的问题，就是如果有很多页面，每个页面都引入了 bundle.js，引发的问题就是，bundle.js的容量会变得很大，导致页面加载速度变慢
> 目前 index.html , login.html, reg.html, forget.html 同样都引入了 bundle.js， bundle.js 对应 src/index.js， 该文件同时引入了 index.html , login.html, reg.html, forget.html 依赖的资源，这样会导致 src/index.js 随着项目规模扩大越来越臃肿，要解决这个需要指定 index.html , login.html, reg.html, forget.html分别引入不同的 js 文件，而不是都引入 bundle.js，  这就需要涉及webpack多入口的配置了

## 解决方案

1. 把js 分离

## 初始化项目

### 安装依赖

```
pnpm init
pnpm add typescript rollup rollup-plugin-dts rollup-plugin-typescript2 -D
npx tsc --init
```

### 设计项目结构

- src
  - core
  - types
  - utils
- package.json
- rollup.config.js
- tsconfig.json
- server.js # 模拟数据上报接口服务

### 配置 rollup.config.js

> 打包输出 es/cjs/umd 三种格式

### package.json 配置编译脚本

```
# pnpm build 打包
"scripts": {
    "build": "rollup -c --bundleConfigAsCjs"
  },
```

### 核心思想

> 1 pv 数据 要监听页面 url 变化 单页应用时要重写 history 上的几个方法
> 2 数据发送通过 navigator.sendBeacon(页面关闭也会发送请求)。 而不是通过传统的 fetch/XHR
> 3 DOM 事件监听通过自定义 scctag 属性设置
> 4 错误上报通过监听 window 的 erro 及 promise 的 unhandledrejection 事件

### 使用

```
<!-- js引入 -->
<script src="./dist/index.js"></script>
<script>
  // 实例化
  const track = new SccTracker({
    requestUrl: " http://localhost:8888/api/tracker",
    hashTracker: true,
    uuid: "uuid_xxxx",
  })

  // js手动上报
  track.sendTracker({})
</script>

<!-- dom设置上报属性数据 -->
<button id="bnt2" scctag="gggg|ffff">scctag上报</button>

```

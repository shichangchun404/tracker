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

### 配置 rollup.config.js

### package.json 配置编译脚本

```
# pnpm build 打包
"scripts": {
    "build": "rollup -c --bundleConfigAsCjs"
  },
```

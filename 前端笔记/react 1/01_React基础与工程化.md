# 01 React 基础与工程化 (扩充版)

## 前言：写在一切开始之前

### 0.1 核心公式：`UI = f(state)` (深度解读)
这是 React 的灵魂。
*   **f (函数/组件)**：就像是一个**汉堡制作流程**。
*   **state (数据)**：就像是**原材料**（面包、牛肉、生菜）。
*   **UI (界面)**：就是最后出来的**汉堡**。

**关键点**：
如果你想改汉堡的味道（UI），你**不能**直接去抠做好的汉堡（DOM 操作），你必须**换原材料**（修改 State），然后重新走一遍制作流程（Re-render）。

### 0.2 语法扫盲：箭头函数 (Arrow Function)
很多新手会被 `() => {}` 绕晕。
```javascript
// 传统写法
function add(a, b) {
  return a + b;
}

// 箭头函数写法
// 1. 去掉 function 关键字
// 2. 参数和函数体之间加 =>
const add = (a, b) => {
  return a + b;
};

// 3. 极简写法（如果是单行返回，连 {} 和 return 都可以省）
const add = (a, b) => a + b;
```

### 0.3 语法扫盲：ES Modules (模块化)
*   `export default`: 一个文件只能有一个“主角”。导入时名字随便起。
*   `export const`: 配角，可以有很多个。导入时必须用 `{}` 包住，名字要对上。

---

## 1. 工程化基础 (Node.js & NPM)

### 1.1 `npm init` 与 `package.json` 全字段解析
当你运行 `npm init` 时，它会问你很多问题，生成身份证 `package.json`。

| 字段 | 含义 | 解释 |
| :--- | :--- | :--- |
| `name` | 项目名 | 也就是你在 `npm install xxx` 时用的名字。 |
| `version` | 版本 | `1.0.0` (主版本.次版本.补丁)。 |
| `main` | 入口文件 | 别人引用你的包时，默认找的文件（通常是 `index.js`）。 |
| `scripts`| **脚本** | `npm run dev` 这种命令就是在这里定义的别名。 |
| `license`| **许可协议** | **MIT**: 随便用，最宽松。**ISC**: 和 MIT 差不多。**GPL**: 传染性，你用了它你也得开源。 |

### 1.2 依赖管理：Dependencies vs DevDependencies
*   `dependencies` (`-S`): **生存必须**。比如 `react`，没它项目跑不起来。上线也要带。
*   `devDependencies` (`-D`): **开发工具**。比如 `typescript`, `vite`, `eslint`。只在还没打包代码的时候干活，上线打包完就不需要它们了。

---

## 2. 构建工具风云：Webpack vs Vite

### 2.1 Webpack (老大哥)
*   **工作原理**：**打包 (Bundle)**。
    *   它像一个勤劳的搬运工。启动时，它要从入口文件开始，顺藤摸瓜找到所有 1000 个文件，把它们编译、压缩、打包成一个大文件 `bundle.js`，然后才启动服务器。
    *   **痛点**：项目越大，启动越慢 (30s+)。

### 2.2 Vite (新挑战者)
*   **工作原理**：**按需编译 (Native ESM)**。
    *   它利用现代浏览器直接看懂 `import` 语法的能力。
    *   启动时，它啥也不干，直接启动服务器。
    *   当你打开浏览器，请求 `main.js` 时，它才去编译这**一个文件**给你。
    *   **优势**：闪电启动 (<1s)。

---

## 3. 手动搭建 Vite React 项目 (实战)

### 3.1 `vite.config.ts` 深度配置
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Node.js 内置模块

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 设置路径别名：以后用 @ 代替 src，不用写 ../../../
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    // 代理跨域配置 (Proxy)
    proxy: {
      '/api': {
        target: 'http://backend-api.com',
        changeOrigin: true
      }
    }
  }
})
```

### 3.2 严谨的 TS 类型定义 (tsconfig.json)
为什么代码里经常飘红？通常是 `tsconfig.json` 没配好。
*   `"strict": true`: 开启所有严格检查（如 `noImplicitAny`，即使你不写类型，它也不准你是 `any`）。
*   `"jsx": "react-jsx"`: 告诉 TS 怎么编译 JSX。

---

## 4. 总结
1.  **心法**：`UI = f(state)`，不要碰 DOM。
2.  **基石**：`package.json` 是项目的说明书。
3.  **利器**：Vite 利用浏览器原生能力实现了极速开发通过。

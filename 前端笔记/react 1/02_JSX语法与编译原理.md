# 02 JSX 语法与编译原理 (深度解析版)

## 0. 语法预热 (Prerequisites)

### 0.1 变量声明：const vs let
*   **const** (Constant): 常量。一旦赋值，内存地址就不能改。
    *   **推荐**: 90% 的情况都用 `const`。
    *   *误区*: `const a = { b: 1 }; a.b = 2` 是合法的！因为 `a` 指向的对象的内存地址没变。
*   **let**: 变量。如果你后面要写 `a = 2`，就用 `let`。
*   **var**: ❌ **永远别用**。它的作用域机制很混乱（变量提升）。

### 0.2 对象字面量 (Object Literal)
React 组件的 Props 本质就是一个对象。
```javascript
const user = { 
  name: "Jack",  // key: value
  age: 18,
  sayHi() { console.log("Hi") } // 方法简写
};
```

### 0.3 表达式 (Expression) 与 语句 (Statement)
*   **表达式 (Expression)**: 一段会**产生值**的代码。你可以把它放在赋值符号 `=` 的右边，或者函数的参数里。
    *   `1 + 1` (产生 2)
    *   `"hello"` (产生字符串)
    *   `user.name` (产生值)
    *   `map()` 函数调用 (产生新数组)
    *   **JSX 也是表达式！** (`<h1>Hi</h1>` 最终会产生一个对象)
    *   **三元运算符** (`condition ? A : B`) 是表达式！
*   **语句 (Statement)**: 一段执行操作的代码，不一定产生值，通常用于控制逻辑。
    *   `if (true) { ... }` (这是语句，不能在 JSX 的 {} 里写)
    *   `for (...) { ... }`
    *   `switch (...)`

---

## 1. 什么是 JSX？

**JSX (JavaScript and XML)** 是 JS 的语法糖。
你可能会问：*“为什么要在 JS 里写 HTML？这不符合关注点分离（Separation of Concerns）吗？”*

React 的回答是：**组件的渲染逻辑和 UI 结构本身就是紧密耦合的**。与其把它们人为分开（一个 HTML 文件，一个 JS 文件），不如把它们放在一起（组件）。

### 1.1 核心特点
1.  **不是字符串**: `<div />` 不是字符串，它最终变成一个 JS 对象。
2.  **表达式插值**: 使用 `{}` 包裹 JS 表达式。
3.  **属性命名**: 使用驼峰 (`className`, `onClick`)，因为它是 JS，`class` 是保留字。

### 1.2 逻辑控制：三元运算符 (Ternary Operator)
因为 JSX 不能写 `if`，我们用 `? :` 来做条件判断。
```tsx
// 语法: 条件 ? 真值 : 假值
<div>
  {isLoggedIn ? <UserAvatar /> : <LoginBtn />}
</div>
```
如果只需要“真就显示，假就拉倒”，用 `&&`：
```tsx
// 语法: 条件 && 真值
// 如果条件为 false，JS 引擎会直接短路，不看后面，直接返回 false (React 不渲染 false)
<div>
  {hasError && <ErrorMessage />}
</div>
```

---

## 2. 编译原理：浏览器看不懂 JSX

浏览器只认识标准的 JavaScript。JSX 代码必须经过 **编译器 (Compiler)** 转换。

### 2.1 编译流程 (Pipeline)

1.  **源码 (Source)**: 开发者编写包含 JSX 的 `.tsx` 文件。
2.  **解析 (Parse)**: Babel 读取代码，将其转换成 **抽象语法树 (AST - Abstract Syntax Tree)**。AST 是代码的树状结构表示。
3.  **转换 (Transform)**: Babel 插件 (`@babel/plugin-transform-react-jsx`) 遍历 AST，将 JSX 节点替换为 React 的函数调用。
4.  **生成 (Generate)**: 输出浏览器可执行的标准 JS 代码。

#### 补充：Babel 配置文件 (.babelrc)
虽然 Vite 帮我们配好了，但了解 Babel 配置有助于你“自己动手”。
```json
{
  "presets": [
    // 预设：一组插件的集合，帮你把 ES6+ 转 ES5
    "@babel/preset-env", 
    // 预设：帮你处理 React JSX 代码
    ["@babel/preset-react", {
      "runtime": "automatic" // React 17+ 自动导入运行时，不用手动 import React
    }]
  ]
}
```

### 2.2 深度对比：React vs Vue 的编译差异

*   **React (JSX)**:
    *   *灵活性*: 极高。你可以用 JS 的 `map`, `filter`, `if-else` 随意组合 UI。
    *   *代价*: 编译器很难优化。因为 JS太 灵活了，编译器不敢假设这块 DIV 永远不变。
*   **Vue (Templates)**:
    *   *灵活性*: 受限。必须用 `v-if`, `v-for`。
    *   *优势*: **编译优化**。Vue 编译器能一眼看出哪些节点是静态的（永远不变），并打上标记（PatchFlag）。更新时，Vue 直接跳过这些静态节点，性能起飞。
    *   *现状*: 早期 Vue 不支持 JSX，现在两者都支持，但 Vue 推荐模板以换取性能。

---

## 3. 运行时 (Runtime)：代码转换解密

让我们看看代码到底变成了什么。

### 3.1 源代码 (JSX)

```tsx
const name = "Antigravity";
const element = (
  <div id="wrapper">
    <h1 className="title">Hello, {name}</h1>
    <p>This is a text.</p>
  </div>
);
```

### 3.2 转换后的代码 (React 17+ 新版转换)

React 17 引入了 `react/jsx-runtime`，不再依赖全局 `React` 变量。

```javascript
// 1. 自动引入运行时函数
// jsx: 用于创建没有子节点或动态子节点的元素
// jsxs: 用于创建有多个静态子节点的元素 (Static children)
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

const name = "Antigravity";

// 2. 函数调用代替了 JSX 标签
const element = _jsxs("div", { // 参数 1: 标签名 'div'
  id: "wrapper",               // 参数 2: 属性对象 (Props)
  children: [                  // 参数 2 的 children 属性
    _jsx("h1", {               // 子节点 1: h1
      className: "title",
      children: ["Hello, ", name] // 文本和变量拼接，也是 children 数组
    }),
    _jsx("p", {                // 子节点 2: p
      children: "This is a text."
    })
  ]
});
```

### 3.3 虚拟 DOM 对象的真面目

上面的 `_jsx` 函数在一顿操作后，返回的 **React Element** 对象大概长这样：

```javascript
const reactElement = {
  $$typeof: Symbol.for('react.element'), // 标记这是个 React 元素，防止 XSS 攻击
  type: 'div',                           // 标签名
  key: null,                             // 用于列表 Diff 的 key
  props: {                               // 所有的属性和子节点都在这里
    id: 'wrapper',
    children: [ ... ]
  },
  ref: null,
  // ... 其他内部属性
};
```

**关键点**：这就是 **虚拟 DOM (Virtual DOM)**。
它只是一个普通的 JS 对象！创建它非常快，比创建真实的 DOM 节点（带有几百个属性）快得多。

---

## 4. 总结与思考

*   **JSX 其实就是 JS**：它让你用写 HTML 的手感写 JS 对象。
*   **编译器的角色**：Babel 把 JSX "翻译" 成 `_jsx()` 函数调用。
*   **VDOM 本质**：`_jsx()` 返回的普通对象。React 拿这个对象去跟上次的对象比对（Diff），找出不同的地方，然后只更新那一点点真实的 DOM。

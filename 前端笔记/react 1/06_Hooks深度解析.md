# 06 Hooks 深度解析 (深度解析版)

## 0. 语法预热 (Prerequisites)

### 0.1 闭包 (Closure)
Hooks 的灵魂就是闭包。
简而言之：**函数可以“记住”它被创建时所处的环境（变量）**，即使它在其他地方被调用。
React 中的组件函数每次渲染都在重新创建，而 Hooks 帮我们在多次渲染之间“记住”了某些变量。

#### 0.1.1 闭包的“背包”比喻
想象你是 React 组件。每次渲染，你都背着一个新的背包（Closure）。
这里的变量（比如 `const count = 1`）就放在背包里。
当 `useEffect` 里的函数执行时，它只能伸手到**当时背着的那个背包**里拿东西。如果背包已经换了（下一次渲染），而函数还去旧背包里拿，拿到的就是旧值 (`Stale Closure`)。
所以我们需要依赖数组 `[count]` 告诉 React：“背包换了，这个 Effect 也得重做，别用旧背包里的东西了！”

### 0.2 依赖项数组与浅比较 (Shallow Compare)
`useEffect`, `useMemo`, `useCallback` 的第二个参数 `[]`。
React 怎么知道要不要重新运行 Hook？它会把新数组里的每一项和旧数组里的每一项进行对比 (`===`)。
*   `[1]` vs `[1]` -> 相等，不运行。
*   `[1]` vs `[2]` -> 不等，运行。
*   `[{a:1}]` vs `[{a:1}]` -> **不等！** 因为对象引用不同。这就是为什么依赖项里放对象要小心的原因。

---

## 1. useReducer：复杂状态管家

当 `useState` 处理不了复杂的逻辑（比如：改一个状态需要同时改另一个状态，或者下一个状态依赖上一个状态）时，就找 `useReducer`。

### 1.1 Redux 思想速成
*   **Store**: 仓库，存数据的地方。
*   **Action**: 指令，一张纸条，写着“我要干嘛”（如 `{ type: 'ADD' }`）。
*   **Reducer**: 管理员，只接收指令，**不能**修改仓库，只能**返回一个新的仓库**给 CEO (React)。

### 1.2 代码逐行解析：超级计数器

```tsx
import React, { useReducer } from 'react';

// 1. 定义状态和指令的类型 (TS)
interface State { count: number; }
// 联合类型：动作可能是增、减、重置
type Action = { type: 'inc' } | { type: 'dec' } | { type: 'reset' };

// 2. Reducer 纯函数
// 接收 (旧状态, 动作) -> 返回 (新状态)
// 绝对不能直接修改 state.count++ ！！
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'inc':
      return { count: state.count + 1 }; // 返回新对象
    case 'dec':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      return state;
  }
};

const Counter = () => {
  // 3. 初始化 Hook
  // dispatch: 发送指令的函数（就像遥控器）
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <>
      <h1>Count: {state.count}</h1>
      {/* 点击按钮 -> 发送 'inc' 指令 -> Reducer 计算 -> UI 更新 */}
      <button onClick={() => dispatch({ type: 'inc' })}>+</button>
      <button onClick={() => dispatch({ type: 'dec' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>0</button>
    </>
  );
};
```

---

## 2. useContext：穿越层级的传送门

不想一层层传 Props (`Props Drilling`)？用 Context。

### 2.1 使用三步走
1.  **Create**: `createContext`
2.  **Provide**: `Context.Provider` (在顶层发广播)
3.  **Consume**: `useContext` (在底层接广播)

### 2.2 代码逐行解析

```tsx
import React, { createContext, useContext, useState } from 'react';

// 1. 创建上下文，默认值是 'light'
const ThemeContext = createContext('light');

const App = () => {
  const [theme, setTheme] = useState('light');
  
  return (
    // 2. Provider 包裹，value 里的值就是广播出去的数据
    // 只要 value 变了，下面所有用 useContext 的组件都会强制刷新
    <ThemeContext.Provider value={theme}>
      <Toolbar />
      <button onClick={() => setTheme('dark')}>变黑</button>
    </ThemeContext.Provider>
  );
}

// 中间组件：完全不需要知道 theme 的存在，不用透传 props
const Toolbar = () => {
  return <ThemedButton />;
}

const ThemedButton = () => {
  // 3. 消费者：直接获取最近 Provider 的 value
  const theme = useContext(ThemeContext);
  
  return <button style={{ background: theme === 'dark' ? '#333' : '#fff' }}>我用了 Context</button>;
}
```

---

## 3. 性能优化：useMemo & useCallback

这两个 Hook 只有一个目的：**避免不必要的计算和渲染**。

### 3.1 useMemo (缓存值)
想象你在做一个复杂的数学题（耗时 1秒）。你不想每次组件刷新都重算一遍。

```tsx
// 只有当 a 或 b 变化时，才重新计算 complexValue
// 否则直接返回上次算好的结果（缓存）
const complexValue = useMemo(() => {
  return a * b * 10000; 
}, [a, b]);
```

### 3.2 useCallback (缓存函数)
**只要组件重新渲染，组件里定义的函数就会被重新创建。**
这通常没问题。但如果这个函数要传给子组件 (`React.memo` 包裹的)，子组件会发现：“通过 Props 传进来的函数引用变了！”，于是子组件也跟着刷新。

```tsx
// 只有当 count 变化时，才创建新的 handleClick 函数
// 否则 handleClick 永远指向同一个函数引用
const handleClick = useCallback(() => {
  console.log(count);
}, [count]);
```

### 3.3 罕见但重要：useLayoutEffect
它和 `useEffect` 的写法一模一样。唯一的区别是**执行时机**。
*   **useEffect**: 浏览器把 DOM 画到屏幕上**之后**执行。（不阻塞视觉渲染）
*   **useLayoutEffect**: 浏览器计算好布局，但还没画到屏幕上**之前**执行。（阻塞视觉渲染）

**使用场景**：如果你需要在 Effect 里测量 DOM 元素的大小（`getBoundingClientRect`），并根据大小修改样式。
*   如果用 `useEffect`：用户会看到元素闪一下（先是位置 A，然后闪现到位置 B）。
*   如果用 `useLayoutEffect`：React 会等你改完样式，再一次性把最终结果画出来，用户不会看到闪烁。

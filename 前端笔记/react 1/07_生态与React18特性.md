# 07 生态体系与 React 18 新特性 (深度解析版)

## 0. 语法预热 (Prerequisites)

### 0.1 模板字符串 (Template Literals)
CSS-in-JS 库常用这个语法。
```javascript
const name = 'world';
const str = `hello ${name}`; // hello world
// 标签模板字符串 (Tagged Templates) - styled-components 的魔法
// styled.div`color: red` 实际上是一个函数调用
```

---

## 1. 样式方案：百家争鸣

React 没有官方样式方案，全靠社区。

*   **CSS Modules** (推荐小项目): 解决 class 命名冲突。
    *   `import styles from './App.module.css'` -> `styles.container` 编译后变成 `App_container__x9d2s`。
*   **CSS-in-JS** (Styled Components / Emotion): 
    *   *理念*: 把 CSS 写在 JS 里，利用 JS 的变量控制样式。
    *   *缺点*: 运行时有性能开销，增加了 bundle 体积。
*   **Tailwind CSS** (推荐大项目):
    *   *理念*: 原子类 (Atomic CSS)。不再想 class 名字，直接写 `class="flex justify-center p-4"`。
    *   *优点*: 极快，文件体积极小（生产环境只打包用到的类）。

---

## 2. 状态管理：Redux 还是其他？

*   **Redux (Toolkit)**: 老牌霸主。
    *   *特点*: 单向数据流，DevTools 调试最强。
    *   *缺点*: 概念多 (Action, Reducer, Thunk, Saga...)，代码啰嗦。
*   **Zustand** (新贵):
    *   *特点*: 极其简单。不需要 Provider 包裹，像 Hooks 一样用。
    *   *代码感受*:
    ```tsx
    const useStore = create((set) => ({
      bears: 0,
      increase: () => set((state) => ({ bears: state.bears + 1 })),
    }))
    ```

---

## 3. React 18：并发模式 (Concurrent)

这是 React 历史上的最大更新。

### 3.1 自动批处理 (Automatic Batching)
*   **React 17 及以前**: SETSTATE 只有在 React 事件回调里才会合并。在 `setTimeout` 或 `Promise` 里是**改一次渲染一次**。
*   **React 18**: **全部合并**。不管你在哪改状态，React 都会攒在一起，只渲染一次。

```javascript
// React 18 行为
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // 只触发一次 Render！
}, 1000);
```

### 3.2 useTransition：让页面不再卡顿

**场景**: 用户在输入框打字，列表要根据输入过滤（耗时计算）。
*   **过去**: 输入变了 -> 列表计算 -> 页面卡死 -> 显示字符。用户感觉打字卡顿。
*   **现在**: 把“列表计算”标记为低优先级。输入变了 -> 先更新输入框（高优先级） -> 浏览器空闲了再算列表（低优先级）。

```tsx
import React, { useState, useTransition } from 'react';

const App = () => {
  const [isPending, startTransition] = useTransition();
  const [input, setInput] = useState('');
  const [list, setList] = useState([]);

  const handleChange = (e) => {
    // 1. 紧急更新：立刻回显用户输入的字
    setInput(e.target.value);

    // 2. 非紧急更新：过滤列表可以慢一点
    startTransition(() => {
      // 这里的更新会被“打断”
      // 如果用户一直在打字，React 会优先处理打字，等用户停了再处理这里的过滤
      const filtered = heavyFilter(e.target.value);
      setList(filtered);
    });
  };

  return (
    <div>
      <input value={input} onChange={handleChange} />
      {/* 我们可以利用 isPending 给用户一个提示 */}
      {isPending ? '列表加载中...' : null}
    </div>
  );
};
```

### 3.3 严格模式 (Strict Mode) 的双渲染

如果在开发环境 (`dev`)，你发现 `useEffect` 打印了两次，**不要惊慌，这是特性！**

*   **原因**: React 18 为了未来做准备（比如组件卸载后状态保留），要求你的 Effect 必须不仅能 Create，还能 Destroy 再 Create 而不出 Bug。
*   **测试方法**: React 故意把你的组件 Mount -> Unmount -> Mount 一遍。
*   **目的**: 帮你检查 `useEffect` 的清理函数 (`return () => ...`) 有没有写好。

### 3.4 Suspense：不仅仅是懒加载
以前 `Suspense` 只能用来配合 `React.lazy` 做代码分割。
现在（及未来），它可以配合**数据获取**。
*   **概念**: 组件可以“挂起” (Suspend)，告诉 React：“我数据还没好，先把渲染权交回去，显示 fallback”。
*   **优势**: 不再需要每个组件里写 `if (loading) return <Spinner />`。

```tsx
<Suspense fallback={<Loading />}>
  <ProfileDetails /> {/* 内部抛出一个 Promise，React 捕获后显示 Loading */}
  <Suspense fallback={<SmallSkeleton />}>
    <ProfileTimeline />
  </Suspense>
</Suspense>
```

### 3.5 新 Hook：useId
解决 SSR (服务端渲染) 水合不匹配的问题。
*   **问题**: 如果你用 `Math.random()` 生成 ID，服务端生成的随机数和客户端生成的肯定不一样 -> 报错 `Hydration failed`。
*   **解决**: `const id = useId()`。React 保证在服务端和客户端生成一模一样的 ID 字符串（比如 `:r1:`）。

```tsx
const PasswordField = () => {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>Password</label>
      <input id={id} type="password" />
    </>
  );
};
```

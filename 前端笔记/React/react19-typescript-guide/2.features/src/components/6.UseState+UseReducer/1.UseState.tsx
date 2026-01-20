import { useState } from "react";

export const UseState = () => {
  const [count, setCount] = useState(() => 0);
  // 1. 基础用法
  // 2. 就近取值
  // 3. 函数式初始化数据

  return (
    <div>
      <p>count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
      <button onClick={() => setCount((c) => c - 1)}>-</button>
    </div>
  );
};

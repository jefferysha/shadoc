import { useLocalStorageState } from "./useLocalStorageState";

export const CustomHooks = () => {
  const [count, setCount] = useLocalStorageState("count", 0);
  return (
    <div>
      <h1>自定义 Hook</h1>
      <p>当前计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
      <button onClick={() => setCount(count - 1)}>减少</button>
    </div>
  );
};

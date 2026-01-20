import { useEffect, useRef, useState } from "react";

export const Hooks = () => {
  const [count, setCount] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMounted = useRef<boolean>(false);

  const handleAdd = () => {
    setCount((c) => c + 1);
  };

  useEffect(() => {
    console.log(count);
    document.title = `当前计数: ${count}`;

    console.log(inputRef.current?.focus());

    console.log(isMounted.current);
  }, [count]);

  useEffect(() => {
    console.log("组件挂载完成"); // 类比于类组件的 onComponentDidMount

    // 标志组件已经挂载了
    isMounted.current = true;

    return () => {
      console.log("组件卸载完成"); // 类比于类组件的 onComponentWillUnmount
    };
  }, []);

  useEffect(() => {
    console.log("组件更新完成"); // 类比于类组件的 onComponentDidUpdate
  });

  // 在函数式编程思想里面，订阅和取消订阅就是标准化结构
  // const unsubscribe = () =>{
  //   return () => {
  //     console.log('组件卸载完成'); // 类比于类组件的 onComponentWillUnmount
  //   }
  // }

  return (
    <div>
      <div>当前计数: {count}</div>
      <button onClick={handleAdd}>增加</button>
      <input ref={inputRef} />
    </div>
  );
};

import { useState } from "react";

export const AutoMemo = () => {
  const [count, setCount] = useState(0);

  const doubleCount = count * 200;
  const handleClick = () => {
    setCount(count + 1);
    console.log("妙码学院");
  };
  return (
    <div>
      <p>count: {count}</p>
      <p>doubleCount: {doubleCount}</p>
      <button onClick={handleClick}>click</button>
    </div>
  );
};

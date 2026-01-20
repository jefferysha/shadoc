import { useState } from "react";

interface HelloWorldProps {
  title: string;
  render?: (count: number) => React.ReactNode;
  onChange?: (count: number) => void;
}

export const HelloWorld = (props: HelloWorldProps) => {
  const { title, render, onChange } = props;
  const [count, setCount] = useState(0);

  const handleAdd = () => {
    setCount(count + 1);
    onChange?.(count + 1);
  };

  return (
    <div>
      Hello World {title}---{count}
      <button onClick={handleAdd}>+</button>
      {render?.(count)}
    </div>
  );
};

// const HelloWorld = () => {
//   return <div>Hello World</div>;
// };

// export default HelloWorld;

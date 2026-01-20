import { useState } from "react";

export const List = () => {
  const [list, setList] = useState<number[]>([]);

  return (
    <div>
      {list.map((item) =>
        item % 2 === 0 ? <div key={item}>{item}</div> : null
      )}
      <button
        onClick={() => {
          //   list.push(list.length);
          setList([...list, list.length]);
        }}
      >
        追加元素
      </button>
    </div>
  );
};

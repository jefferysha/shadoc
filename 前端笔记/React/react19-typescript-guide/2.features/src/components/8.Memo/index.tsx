import { useCallback, useMemo, useState } from "react";

export const Memo = () => {
  const [count, setCount] = useState(0);

  // 缓存当前数值，double，派生状态
  const doubleInfo = useMemo(() => ({ info: count * 2 }), [count]);

  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  return (
    <div>
      {doubleInfo.info}
      <div onClick={handleClick}>点击</div>
    </div>
  );
};

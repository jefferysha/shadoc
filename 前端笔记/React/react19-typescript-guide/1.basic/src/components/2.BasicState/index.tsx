import { useCallback, useState } from "react";

export const BasicState = () => {
  const [info, setInfo] = useState({
    age: 0,
  });

  const handleAdd = useCallback(() => {
    // info.age++;
    // setInfo(info);

    // setInfo({
    //   ...info,
    //   age: info.age + 1,
    // });

    setInfo((prevInfo) => ({ // 就近原则，prevInfo 是最新的状态
      ...prevInfo,
      age: prevInfo.age + 1,
    }));
  }, []);

  return (
    <div>
      {info.age}
      <button onClick={handleAdd}>+</button>
    </div>
  );
};

// const BasicState = () => {
//   return <div>Hello World</div>;
// };

// export default BasicState;

import { useReducer, useState } from "react";

// export const UseReducer = () => {
//   const [info, setInfo] = useState({
//     name: "heyi",
//     age: 18,
//   });

//   return (
//     <div>
//       <p>info: {info.name}</p>
//       <p>info: {info.age}</p>

//       <input
//         value={info.name}
//         onChange={(ev) =>
//           setInfo({
//             ...info,
//             name: ev.target.value,
//           })
//         }
//       />
//       <input
//         value={info.age}
//         onChange={(ev) =>
//           setInfo({
//             ...info,
//             age: Number(ev.target.value),
//           })
//         }
//       />
//     </div>
//   );
// };

// redux 的设计思想，useReducer 是同一个作者设计的
// 对于状态的操作，我们需要提取出来，叫做 action
// 然后 action 需要有专门的方法来完成状态值的更新，reducer
// 结果 state，驱动视图更新

const initialState = {
  name: "heyi",
  age: 18,
};

const reducer = (
  state: typeof initialState,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "changeName":
      return {
        ...state,
        name: action.payload,
      };
    case "changeAge":
      return {
        ...state,
        age: Number(action.payload),
      };
    default:
      return state;
  }
};

export const UseReducer = () => {
  const [info, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>info: {info.name}</p>
      <p>info: {info.age}</p>

      <input
        value={info.name}
        onChange={(ev) =>
          dispatch({
            type: "changeName",
            payload: ev.target.value,
          })
        }
      />
      <input
        value={info.age}
        onChange={(ev) =>
          dispatch({
            type: "changeAge",
            payload: ev.target.value,
          })
        }
      />
    </div>
  );
};

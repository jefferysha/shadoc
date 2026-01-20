import { useState } from "react";
import "./App.css";
// import { HelloWorld } from "./components/1.HelloWorld";
// import { BasicState } from "./components/2.BasicState";
// import { List } from "./components/3.List";
import { Hooks } from "./components/4.Hooks";

function App() {
  const [isShow, setIsShow] = useState(true);
  const handleClick = () => {
    setIsShow(!isShow);
  };
  return (
    <>
      {/* <HelloWorld
        title="hello world"
        render={(count) => <div style={{ color: "red" }}>你好{count}</div>} // render props
        onChange={(count) => console.log(count)}
      />
      <HelloWorld
        title="hello world"
        render={(count) => <div style={{ color: "red" }}>你好{count}</div>} // render props
        onChange={(count) => console.log(count)}
      /> */}
      {/* <BasicState /> */}
      {/* <List /> */}
      {/* {isShow ? <Hooks /> : null}  */}
      {isShow && <Hooks />}
      <button onClick={handleClick}>显示和隐藏的切换</button>
    </>
  );
}

// function App() {
//   const [count, setCount] = useState(0);
//   return <div onClick={() => setCount(count + 1)}>{count}</div>;
// }
// class App extends React.Component {
//   state = {
//     count: 0,
//   };
//   render() {
//     return (
//       <div
//         onClick={() =>
//           this.setState({
//             count: this.state.count + 1,
//           })
//         }
//       >
//         {this.state.count}
//       </div>
//     );
//   }
// }

export default App;

import { Suspense, use } from "react";

const delay = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const fetchMessage = async () => {
  await delay(1000);
  return "hello world";
};

// const Message = () => {
//   // 状态
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   // 副作用
//   useEffect(() => {
//     setLoading(true);
//     fetchMessage().then((message) => {
//       setMessage(message);
//     }).finally(() => {
//       setLoading(false);
//     });
//   }, []);
//   return <div>{loading ? "loading..." : message}</div>;
// };
// Message 组件在渲染时“读取”Promise
const Message = ({ messagePromise }: { messagePromise: Promise<string> }) => {
  // 在渲染期间直接 use(promise)
  const message = use(messagePromise);
  return <p>Message: {message}</p>;
};

export const SuspenseNew = () => {
  // 在渲染开始前就创建 Promise
  const messagePromise = fetchMessage();
  return (
    <div>
      <Suspense fallback={<div>loading...</div>}>
        <Message messagePromise={messagePromise} />
      </Suspense>
    </div>
  );
};

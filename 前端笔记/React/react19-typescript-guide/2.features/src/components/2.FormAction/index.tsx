import { useActionState } from "react";
import { useFormStatus } from "react-dom";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const SubmitButton = () => {
  const { pending, data, method } = useFormStatus();
  console.log("🚀 ~ SubmitButton ~ pending:", pending);
  console.log("🚀 ~ SubmitButton ~ data:", data);
  console.log("🚀 ~ SubmitButton ~ method:", method);
  return <button type="submit">{pending ? "提交中..." : "提交"}</button>;
};

export const FormAction = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAction = async (previousState: any, formData: FormData) => {
    console.log("🚀 ~ handleAction ~ previousState:", previousState);
    console.log([...formData.keys()]);
    console.log([...formData.values()]);

    await delay(1000);

    return {
      success: true,
      data: {
        username: formData.get("username"),
        password: formData.get("password"),
      },
    };
  };
  const [state, submitAction, isPending] = useActionState(handleAction, null);
  console.log("🚀 ~ FormAction ~ isPending:", isPending);
  console.log("🚀 ~ FormAction ~ state:", state);
  return (
    <form action={submitAction}>
      <label>
        用户名：
        <input type="text" name="username" />
      </label>
      <label>
        密码：
        <input type="password" name="password" />
      </label>
      {/* <button type="submit">{isPending ? "提交中..." : "提交"}</button> */}
      {/* 深层状态，context 而不是 props 传值 */}
      <SubmitButton />
    </form>
  );
};

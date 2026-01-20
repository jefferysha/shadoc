import React, { useState } from "react";

export const Form = () => {
  // 自己来管理状态
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    console.log(formData);
  };
  return (
    <form onSubmit={handleSubmit}>
      <label>
        用户名：
        <input
          type="text"
          name="username"
          onChange={(ev) =>
            setFormData({ ...formData, username: ev.target.value })
          }
        />
      </label>
      <label>
        密码：
        <input
          type="password"
          name="password"
          onChange={(ev) =>
            setFormData({ ...formData, password: ev.target.value })
          }
        />
      </label>
      <button type="submit">提交</button>
    </form>
  );
};

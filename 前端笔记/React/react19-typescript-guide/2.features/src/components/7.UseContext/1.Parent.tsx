import { useState } from "react";
import { Child } from "./2.Child";
import { ThemeContext } from "./ThemeContext";

export const Parent = () => {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  return (
    <div>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {/* <Child theme={theme} /> */}
        <Child />
        <button onClick={toggleTheme}>切换主题</button>
      </ThemeContext.Provider>
    </div>
  );
};

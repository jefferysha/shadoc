// import { useContext } from "react";
// import { ThemeContext } from "./ThemeContext";
import { useTheme } from "./useTheme";

export const GrandChild = () => {
  //   const { theme } = useContext(ThemeContext);
  //   return <div>GrandChild {theme}</div>;
  //   return (
  //     <ThemeContext.Consumer>
  //       {({ theme }) => <div>GrandChild {theme}</div>}
  //     </ThemeContext.Consumer>
  //   );
  const theme = useTheme();
  return <div>GrandChild {theme}</div>;
};

import { memo } from "react";
import { GrandChild } from "./3.GrandChild";

export const Child = memo(() => {
  return <GrandChild />;
});

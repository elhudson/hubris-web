import { createContext, useContext } from "react";

export const ruleContext = createContext({
  location: "wiki",
  table: null,
  icon: null
});

export const useRule = () => useContext(ruleContext);

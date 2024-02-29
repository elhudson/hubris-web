import { createContext, useContext } from "react";

export const optionsContext = createContext(null);
export const limitsContext = createContext({
  limiter: null
});
export const handlerContext = createContext({ handler: null, table: null });

export const useOptions = () => {
  return useContext(optionsContext);
};

export const useLimiter = () => {
  return useContext(limitsContext);
};

export const useHandler = () => {
  return useContext(handlerContext);
};

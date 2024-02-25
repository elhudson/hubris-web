import { createContext, useContext } from "react";

export const itemContext = createContext(null);
export const useItem = () => useContext(itemContext);

import { createContext, useContext } from "react";

export const powerContext = createContext(null);
export const usePower = () => useContext(powerContext);

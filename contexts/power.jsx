import { createContext, useContext } from "react";

export const powerContext = createContext({ power: null, update: null });
export const usePower = () => useContext(powerContext);

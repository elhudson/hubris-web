import { createContext, useContext } from "react";

export const characterContext = createContext(null);

export const useCharacter = () => {
  return useContext(characterContext);
};
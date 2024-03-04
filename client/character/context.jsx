import { createContext, useContext } from "react";

export const characterContext = createContext({character: null});

export const useCharacter = () => {
  return useContext(characterContext);
};
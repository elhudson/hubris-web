import { createContext, useContext } from "react";

export const textContext = createContext({ size: 14, color: null, font: "iosevka" });
export const useText = () => useContext(textContext);


export default {}
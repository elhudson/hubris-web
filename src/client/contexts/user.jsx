import { createContext, useContext } from "react";

export const userContext = createContext({ logged_in: false });

export const useUser=()=>{
    return useContext(userContext)
}
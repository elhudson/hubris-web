import { createContext, useContext } from "react";

export const userContext = createContext({ logged_in: false });
export const useUser = () => {
  return useContext(userContext);
};

export const filterContext = createContext({
  update: null,
  filters: {
    trees: [],
    tags: [],
    tiers: []
  }
});

export const useFilters = () => useContext(filterContext);

export const campaignContext = createContext(null);
export const useCampaign = () => {
  return useContext(campaignContext);
};

export const itemContext = createContext(null);
export const useItem = () => useContext(itemContext);

export const characterContext = createContext({ character: null });
export const useCharacter = () => {
  return useContext(characterContext);
};

export const optionsContext = createContext({
  data: []
});

export const handlerContext = createContext({ handler: null, table: null });

export const useOptions = () => {
  return useContext(optionsContext);
};

export const useHandler = () => {
  return useContext(handlerContext);
};

export const ruleContext = createContext({
  location: "wiki",
  table: null,
  icon: null
});
export const useRule = () => useContext(ruleContext);

export const powerContext = createContext({ power: null, update: null });
export const usePower = () => useContext(powerContext);
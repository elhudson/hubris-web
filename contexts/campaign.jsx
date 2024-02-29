import { createContext, useContext } from "react";

export const campaignContext = createContext(null);

export const useCampaign = () => {
  return useContext(campaignContext);
};

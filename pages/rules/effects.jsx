import { ruleContext } from "@contexts/rule";
import Effects from "@components/categories/effects";

export default () => {
  return <ruleContext.Provider
    value={{
      location: "wiki",
      table: "effects",
    }}>
    <Effects />
  </ruleContext.Provider>;
};

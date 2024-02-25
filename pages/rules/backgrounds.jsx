import { ruleContext } from "@contexts/rule";
import Backgrounds from "@components/categories/backgrounds";

export default () => {
  return <ruleContext.Provider
    value={{
      location: "wiki",
      table: "backgrounds",
    }}>
    <Backgrounds />
  </ruleContext.Provider>;
};
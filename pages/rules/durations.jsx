import { ruleContext } from "@contexts/rule";
import Durations from "@components/categories/durations";

export default () => {
  return <ruleContext.Provider
    value={{
      location: "wiki",
      table: "durations",
    }}>
    <Durations />
  </ruleContext.Provider>;
};

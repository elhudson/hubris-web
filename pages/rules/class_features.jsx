import { ruleContext } from "@contexts/rule";
import Class_Features from "@components/categories/class_features";

export default () => {
  return <ruleContext.Provider
    value={{
      location: "wiki",
      table: "class_features",
    }}>
    <Class_Features />
  </ruleContext.Provider>;
};

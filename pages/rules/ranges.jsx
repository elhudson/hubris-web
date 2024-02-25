import { ruleContext } from "@contexts/rule";
import Ranges from "@components/categories/ranges";

export default () => {
  return <ruleContext.Provider
    value={{
      location: "wiki",
      table: "ranges",
    }}>
    <Ranges />
  </ruleContext.Provider>;
};

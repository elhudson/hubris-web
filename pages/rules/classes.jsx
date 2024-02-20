import Classes from "@components/categories/classes";

import { ruleContext } from "@contexts/rule";

export default () => {
  return <ruleContext.Provider
    value={{
      location: "wiki",
      table: "classes",
    }}>
    <Classes />
  </ruleContext.Provider>;
};

import { ruleContext } from "@contexts/rule";
import Tag_Features from "@components/categories/tag_features";

export default () => {
  return (
    <ruleContext.Provider
      value={{
        location: "wiki",
        table: "tag_features",
      }}>
      <Tag_Features />
    </ruleContext.Provider>
  );
};

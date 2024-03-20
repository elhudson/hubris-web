import { optionsContext, ruleContext } from "contexts";
import { Optionset } from "@client/options";
import { TagFeatures } from "@client/rules";
import _ from "lodash";
import { useLoaderData } from "react-router-dom";

export default () => {
  const data = useLoaderData().options.tag_features;
  return (
    <ruleContext.Provider
      value={{
        location: "levelup",
        table: "tag_features"
      }}>
      <optionsContext.Provider
        value={{
          data: data,
        }}>
        <Optionset component={<TagFeatures />} />
      </optionsContext.Provider>
    </ruleContext.Provider>
  );
};

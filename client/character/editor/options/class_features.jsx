import { optionsContext, ruleContext } from "contexts";

import { ClassFeatures } from "@client/rules";
import { Optionset } from "@client/options";
import _ from "lodash";
import { useLoaderData } from "react-router-dom";

export default () => {
  return (
    <ruleContext.Provider
      value={{
        location: "levelup",
        table: "class_features"
      }}>
      <optionsContext.Provider
        value={{ data: useLoaderData().options.class_features }}>
        <Optionset component={<ClassFeatures />} />
      </optionsContext.Provider>
    </ruleContext.Provider>
  );
};

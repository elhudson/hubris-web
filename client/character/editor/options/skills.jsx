import { Option, Optionset } from "@client/options";
import { optionsContext, ruleContext } from "contexts";

import { Skills } from "@client/rules";
import _ from "lodash";
import { useLoaderData } from "react-router-dom";

export default () => {
  const { skills } = useLoaderData().options;
  return (
    <ruleContext.Provider
      value={{
        location: "levelup",
        table: "skills"
      }}>
      <optionsContext.Provider
        value={{
          data: skills,
        }}>
        <Optionset
          component={<Skills checkbox={(item) => <Option data={item} />} />}
        />
      </optionsContext.Provider>
    </ruleContext.Provider>
  );
};

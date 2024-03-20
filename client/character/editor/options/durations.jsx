import { optionsContext, ruleContext, useCharacter } from "contexts";

import { Durations } from "@client/rules";
import { Optionset } from "@client/options";
import _ from "lodash";
import { useLoaderData } from "react-router-dom";

export default () => {
  return (
    <ruleContext.Provider
      value={{
        location: "levelup",
        table: "durations"
      }}>
      <optionsContext.Provider value={{data: useLoaderData().options.durations}}>
        <Optionset component={<Durations />} />
      </optionsContext.Provider>
    </ruleContext.Provider>
  );
};

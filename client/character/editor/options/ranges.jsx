import { optionsContext, ruleContext } from "contexts";
import { useLoaderData } from "react-router-dom";
import { Optionset } from "@client/options";
import { Ranges } from "@client/rules";
import _ from "lodash";

export default () => {
  const data = useLoaderData().options.ranges;
  return (
    <ruleContext.Provider
      value={{
        location: "levelup",
        table: "ranges"
      }}>
      <optionsContext.Provider
        value={{
          data: data,
        }}>
        <Optionset component={<Ranges />} />
      </optionsContext.Provider>
    </ruleContext.Provider>
  );
};

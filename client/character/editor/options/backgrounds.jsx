import { Option, Optionset } from "@client/options";
import { optionsContext, ruleContext } from "contexts";
import { Backgrounds } from "@client/rules";
import _ from "lodash";
import { useLoaderData } from "react-router-dom";

export default () => {
  return (
    <optionsContext.Provider
      value={{
        data: useLoaderData().options.backgrounds,
        limiter: ({ draft, feature }) => {
          if (draft.backgrounds.length >= 2) {
            return false;
          }
          if (
            feature.settings.title != "Core" &&
            draft.backgrounds
              .map((b) => b?.settings.id)
              .includes(feature.settings.id)
          ) {
            return false;
          } else {
            return true;
          }
        },
        adder: ({ feat, draft, e }) => {
          if (e) {
            draft[feat.attributes.code] += 1;
          } else {
            draft[feat.attributes.code] -= 1;
          }
        }
      }}>
      <ruleContext.Provider
        value={{
          location: "create",
          table: "backgrounds"
        }}>
        <Optionset
          component={
            <Backgrounds checkbox={(item) => <Option data={item} />} />
          }
        />
      </ruleContext.Provider>
    </optionsContext.Provider>
  );
};

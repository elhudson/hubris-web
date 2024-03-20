import { optionsContext, ruleContext, useCharacter } from "context";

import { Effects } from "@client/rules";
import { Optionset } from "@client/options";
import _ from "lodash";
import { useLoaderData } from "react-router-dom";

export default () => {
  return (
    <ruleContext.Provider
      value={{
        location: "levelup",
        table: "effects"
      }}>
      <optionsContext.Provider
        value={{
          data: useLoaderData().options.effects,
          adder: ({ feat, draft, e }) => {
            if (e) {
              _.isUndefined(draft.ranges) && (draft.ranges = []);
              _.isUndefined(draft.durations) && (draft.durations = []);
              if (
                draft.ranges.map((f) => f.id).includes(feat.range.id) == false
              ) {
                draft.ranges.push(feat.range);
              }
              if (
                draft.durations.map((f) => f.id).includes(feat.duration.id) ==
                false
              ) {
                draft.durations.push(feat.duration);
              }
            } else {
              if (!has_tree(feat.trees, current(draft))) {
                _.remove(draft.ranges, feat.range);
                _.remove(draft.durations, feat.duration);
              }
            }
          }
        }}>
        <Optionset component={<Effects />} />
      </optionsContext.Provider>
    </ruleContext.Provider>
  );
};

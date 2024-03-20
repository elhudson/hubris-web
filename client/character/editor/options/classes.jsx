import { Option, Optionset } from "@client/options";
import { optionsContext, ruleContext } from "contexts";

import { Classes } from "@client/rules";
import { useLoaderData } from "react-router-dom";
import _ from "lodash"

export default () => {
  return (
    <optionsContext.Provider
      value={{
        data: useLoaderData().options.classes,
        limiter: ({ draft }) => {
          if (window.location.href.includes("create")) {
            return draft.classes.length == 0;
          } else {
            return true;
          }
        },
        adder: ({ feat, draft, e }) => {
          const die = feat.hit_dice;
          if (e) {
            if (_.isUndefined(draft.HD)) {
              draft.HD = [];
            }
            if (draft.HD.map((d) => d.die.id).includes(die.id)) {
              _.find(draft.HD, (d) => d.die.id == die.id).max += 1;
            } else {
              draft.HD.push({
                max: 0,
                used: 0,
                die: die
              });
            }
          } else {
            const old_hd = _.find(draft.HD, (d) => d.die.id);
            if (old_hd.max == 0) {
              _.remove(draft.HD, (d) => d.die.id == old_hd.die.id);
            } else {
              old_hd.max -= 1;
            }
          }
        }
      }}>
      <ruleContext.Provider
        value={{
          location: window.location.href.includes("create")
            ? "create"
            : "levelup",
          table: "classes"
        }}>
        <Optionset
          component={<Classes checkbox={(item) => <Option data={item} />} />}
        />
      </ruleContext.Provider>
    </optionsContext.Provider>
  );
};

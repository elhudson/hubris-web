import { optionsContext, ruleContext, useCharacter } from "contexts";

import { Durations } from "@client/rules";
import { Loading } from "@interface/ui";
import { Optionset } from "@client/options";
import _ from "lodash";
import { get_tier } from "utilities";

export default () => {
  const { character } = useCharacter();
  const options = async () =>
    await fetch(
      `/data/rules?table=trees&query=${JSON.stringify({
        select: {
          title: true,
          id: true,
          durations: {
            where: {
              tier: {
                lte: get_tier(character),
              },
            },
            include: {
              requires: true,
              required_for: true,
              trees: true,
            },
          },
        },
      })}`
    ).then((t) => t.json());

  return (
    <Loading
      getter={options}
      render={(options) => (
        <ruleContext.Provider
          value={{
            location: "levelup",
            table: "durations",
          }}
        >
          <optionsContext.Provider
            value={{
              searchable: _.flatten(data.map((c) => c.durations)),
              options: options,
            }}
          >
            <Optionset component={<Durations />} />
          </optionsContext.Provider>
        </ruleContext.Provider>
      )}
    />
  );
};

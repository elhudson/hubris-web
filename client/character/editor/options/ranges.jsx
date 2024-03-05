import { optionsContext, ruleContext, useCharacter } from "contexts";

import { Loading } from "@interface/ui";
import { Optionset } from "@client/options";
import { Ranges } from "@client/rules";
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
          ranges: {
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
            table: "ranges",
          }}
        >
          <optionsContext.Provider
            value={{
              searchable: _.flatten(options.map((c) => c.ranges)),
              options: options,
            }}
          >
            <Optionset component={<Ranges />} />
          </optionsContext.Provider>
        </ruleContext.Provider>
      )}
    />
  );
};

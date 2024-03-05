import { optionsContext, ruleContext, useCharacter } from "context";

import { Effects } from "@client/rules";
import { Loading } from "@interface/ui";
import { Optionset } from "@client/options";
import _ from "lodash";
import { get_tier } from "utilities";

export default () => {
  const { character } = useCharacter();
  const tags = _.flatten(character.classes.map((c) => c.tags));
  const options = async () =>
    await fetch(
      `/data/rules?table=trees&query=${JSON.stringify({
        include: {
          effects: {
            where: {
              tags: {
                some: {
                  OR: tags.map((c) => ({
                    id: c.id,
                  })),
                },
              },
              tier: {
                lte: get_tier(character),
              },
            },
            include: {
              tags: true,
              requires: true,
              required_for: true,
              trees: true,
              range: true,
              duration: true,
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
            table: "effects",
          }}
        >
          <optionsContext.Provider
            value={{
              searchable: _.flatten(options.map((c) => c.effects)),
              options: options,
            }}
          >
            <Optionset component={<Effects />} />
          </optionsContext.Provider>
        </ruleContext.Provider>
      )}
    />
  );
};

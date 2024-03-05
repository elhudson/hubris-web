import { optionsContext, ruleContext, useCharacter } from "contexts";

import { ClassFeatures } from "@client/rules";
import { Loading } from "@interface/ui";
import { Optionset } from "@client/options";
import _ from "lodash";
import { get_tier } from "utilities";

export default () => {
  const { character } = useCharacter();
  const options = async () =>
    await fetch(
      `/data/rules?table=classes&query=${JSON.stringify({
        where: {
          OR: character.classes.map((c) => ({
            id: c.id,
          })),
        },
        select: {
          title: true,
          id: true,
          class_paths: true,
          class_features: {
            where: {
              tier: {
                lte: get_tier(character),
              },
            },
            include: {
              requires: true,
              required_for: true,
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
            table: "class_features",
          }}
        >
          <optionsContext.Provider
            value={{
              searchable: _.flatten(options.map((c) => c.class_features)),
              options: options,
            }}
          >
            <Optionset component={<ClassFeatures />} />
          </optionsContext.Provider>
        </ruleContext.Provider>
      )}
    />
  );
};

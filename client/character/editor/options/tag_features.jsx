import { optionsContext, ruleContext, useCharacter } from "contexts";

import { Loading } from "@interface/ui";
import { Optionset } from "@client/options";
import { TagFeatures } from "@client/rules";
import _ from "lodash";
import { get_tier } from "utilities";

export default () => {
  const { character } = useCharacter();
  const options = async () =>
    await fetch(
      `/data/rules?table=tags&query=${JSON.stringify({
        where: {
          tag_features: {
            some: {},
          },
          classes: {
            some: {
              OR: character.classes.map((c) => ({
                id: c.id,
              })),
            },
          },
        },
        select: {
          title: true,
          id: true,
          tag_features: {
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
            table: "tag_features",
          }}
        >
          <optionsContext.Provider
            value={{
              searchable: _.flatten(cps.map((c) => c.tag_features)),
              options: options,
            }}
          >
            <Optionset component={<TagFeatures />} />
          </optionsContext.Provider>
        </ruleContext.Provider>
      )}
    />
  );
};

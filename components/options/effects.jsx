import { useCharacter } from "@contexts/character";
import { useState } from "react";
import { useAsync } from "react-async-hook";
import { get_tier } from "utilities";
import _ from "lodash";
import Optionset from "./optionset";
import { optionsContext } from "@contexts/options";
import { ruleContext } from "@contexts/rule";
import Effects from "@components/categories/effects"

export default () => {
  const { character } = useCharacter();
  const [searchable, setSearchable] = useState(null);
  const tags = _.flatten(character.classes.map((c) => c.tags));
  const options = useAsync(async () => {
    const data = await fetch(
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
    data.forEach((tree) => {
      tree.effects.forEach((effect) => {
        effect.meta = {
          ranges: tree.ranges,
          durations: tree.durations,
        };
      });
    });
    setSearchable(_.flatten(data.map((c) => c.effects)));
    return data;
  }).result;
  return (
    <>
      {options && (
        <ruleContext.Provider value={{
          location: "levelup",
          table: "effects"
        }}>
          <optionsContext.Provider
            value={{
              searchable: searchable,
              table: "effects",
              options: options,
            }}>
            <Optionset component={<Effects />} />
          </optionsContext.Provider>
        </ruleContext.Provider>
      )}
    </>
  );
};

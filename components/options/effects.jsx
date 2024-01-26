import { useCharacter } from "@contexts/character";
import { useState } from "react";
import { useAsync } from "react-async-hook";
import { get_tier } from "utilities";
import _ from "lodash";
import Optionset from "./optionset";
import { optionsContext } from "@contexts/options";

export default () => {
  const { character } = useCharacter();
  const [searchable, setSearchable] = useState(null);
  const tags = _.flatten(character.classes.map((c) => c.tags));
  const options = useAsync(async () => {
    const data = await fetch(
      `/data/rules?table=trees&query=${JSON.stringify({
        include: {
          ranges: {
            where: {
              tier: get_tier(character),
              xp: 1
            }
          },
          durations: {
            where: {
              tier: get_tier(character),
              xp: 1
            }
          },
          effects: {
            where: {
              tags: {
                some: {
                  OR: tags.map((c) => ({
                    id: c.id
                  }))
                }
              },
              tier: {
                lte: get_tier(character)
              }
            },
            include: {
              requires: true,
              required_for: true,
              trees: true
            }
          }
        }
      })}`
    ).then((t) => t.json());
    data.forEach((tree) => {
      tree.effects.forEach((effect) => {
        effect.meta = {
          ranges: tree.ranges,
          durations: tree.durations
        };
      });
    });
    setSearchable(_.flatten(data.map((c) => c.effects)));
    return data;
  }).result;
  return (
    <>
      {options && (
        <optionsContext.Provider
          value={{
            searchable: searchable,
            table: "effects",
            options: options
          }}>
          <Optionset />
        </optionsContext.Provider>
      )}
    </>
  );
};

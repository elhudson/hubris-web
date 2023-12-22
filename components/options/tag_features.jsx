import { useCharacter } from "@contexts/character";
import { useState } from "react";
import { useAsync } from "react-async-hook";
import { get_tier } from "utilities";
import _ from "lodash";
import { optionsContext } from "@contexts/options";
import Optionset from "./optionset";

export default () => {
  const { character } = useCharacter();
  const [searchable, setSearchable] = useState(null);
  const options = useAsync(async () => {
    const cps = await fetch(
      `/data/rules?table=tags&query=${JSON.stringify({
        where: {
          classes: {
            some: {
              OR: character.classes.map((c) => ({
                id: c.id
              }))
            }
          }
        },
        select: {
          title: true,
          tag_features: {
            where: {
              tier: get_tier(character)
            },
            include: {
              requires: true,
              required_for: true
            }
          }
        }
      })}`
    ).then((t) => t.json());
    setSearchable(_.flatten(cps.map((c) => c.tag_features)));
    return cps;
  }).result;
  return (
    <>
      {options && (
        <optionsContext.Provider
          value={{
            searchable: searchable,
            table: "tag_features",
            options: options
          }}>
          <Optionset />
        </optionsContext.Provider>
      )}
    </>
  );
};

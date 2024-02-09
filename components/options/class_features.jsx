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
  const options = useAsync(async () => {
    const cps = await fetch(
      `/data/rules?table=classes&query=${JSON.stringify({
        where: {
          OR: character.classes.map((c) => ({
            id: c.id
          }))
        },
        select: {
          title: true,
          id: true,
          class_paths: true,
          class_features: {
            where: {
              tier: {
                lte: get_tier(character)
              }
            },
            include: {
              requires: true,
              required_for: true
            }
          }
        }
      })}`
    ).then((t) => t.json());
    setSearchable(_.flatten(cps.map((c) => c.class_features)));
    return cps;
  }).result;
  return (
    <>
      {options && (
        <optionsContext.Provider
          value={{
            searchable: searchable,
            table: "class_features",
            options: options
          }}>
          <Optionset />
        </optionsContext.Provider>
      )}
    </>
  );
};

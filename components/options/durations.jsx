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
    const data = await fetch(
      `/data/rules?table=trees&query=${JSON.stringify({
        select: {
          title: true,
          id: true,
          durations: {
            where: {
              tier: get_tier(character)
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
    setSearchable(_.flatten(data.map((c) => c.durations)));
    return data;
  }).result;
  return (
    <>
      {options && (
        <optionsContext.Provider
          value={{
            searchable: searchable,
            table: "durations",
            options: options
          }}>
          <Optionset />
        </optionsContext.Provider>
      )}
    </>
  );
};

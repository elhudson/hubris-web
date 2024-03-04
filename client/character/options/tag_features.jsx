import { useCharacter } from "@contexts/character";
import { useState } from "react";
import { useAsync } from "react-async-hook";
import { get_tier } from "utilities";
import _ from "lodash";
import { optionsContext } from "@contexts/options";
import Optionset from "./optionset";
import Tag_Features from "@components/categories/tag_features";
import { ruleContext } from "@contexts/rule";

export default () => {
  const { character } = useCharacter();
  const [searchable, setSearchable] = useState(null);
  const options = useAsync(async () => {
    const cps = await fetch(
      `/data/rules?table=tags&query=${JSON.stringify({
        where: {
          tag_features: {
            some: {}
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
    setSearchable(_.flatten(cps.map((c) => c.tag_features)));
    return cps;
  }).result;
  return (
    <>
      {options && (
        <ruleContext.Provider
          value={{
            location: "levelup",
            table: "tag_features",
          }}>
          <optionsContext.Provider
            value={{
              searchable: searchable,
              options: options,
            }}>
            <Optionset component={<Tag_Features />} />
          </optionsContext.Provider>
        </ruleContext.Provider>
      )}
    </>
  );
};

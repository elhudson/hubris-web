import { useCharacter } from "@contexts/character";
import { useAsync } from "react-async-hook";
import _ from "lodash";
import { get_tier } from "utilities";
import { useState } from "react";
import Optionset from "./optionset";
import { optionsContext } from "@contexts/options";
import Skills from "@components/categories/skills";
import { ruleContext } from "@contexts/rule";
import Option from "@components/options/option";

export default () => {
  const { update } = useCharacter();
  const [searchable, setSearchable] = useState(null);
  const skills = useAsync(async () => {
    const opts = await fetch("/data/rules?table=skills&relations=true").then(
      (k) => k.json()
    );
    setSearchable(opts);
    return opts;
  }).result;
  return (
    <>
      {skills && (
        <ruleContext.Provider
          value={{
            location: "levelup",
            table: "skills"
          }}>
          <optionsContext.Provider
            value={{
              searchable: searchable,
              options: skills
            }}>
            <Optionset
              component={<Skills checkbox={(item) => <Option data={item} />} />}
            />
          </optionsContext.Provider>
        </ruleContext.Provider>
      )}
    </>
  );
};

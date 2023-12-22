import { optionsContext, limitsContext } from "@contexts/options";
import { useAsync } from "react-async-hook";
import _ from "lodash";
import { useState } from "react";
import Optionset from "./optionset";

export default () => {
  const [searchable, setSearchable] = useState(null);
  const bgs = useAsync(async () => {
    const d = await fetch("/data/rules?table=backgrounds&relations=true").then(
      (j) => j.json()
    );
    setSearchable(d);
    return [...new Set(d.map((s) => s.setting))].map((s) => ({
      'title': s,
      'backgrounds': d.filter((f) => f.setting == s)
    }));
  }).result;
  const limiter = ({draft, feature}) => {
    if (draft.backgrounds.length >= 2) {
      return false;
    }
    if (
      feature.setting != "Core" &&
      draft.backgrounds.map((b) => b.setting).includes(feature.setting)
    ) {
      return false;
    } else {
      return true;
    }
  };
  return (
    <>
      {bgs && (
        <optionsContext.Provider
          value={{
            searchable: searchable,
            table: "backgrounds",
            options: bgs
          }}>
          <limitsContext.Provider
            value={{
              limiter: limiter
            }}>
            <Optionset />
          </limitsContext.Provider>
        </optionsContext.Provider>
      )}
    </>
  );
};

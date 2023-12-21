import { useAsync } from "react-async-hook";
import _ from "lodash";
import { optionsContext, limitsContext } from "@contexts/options";
import Optionset from "./optionset";

export default () => {
  const classes = useAsync(async () => {
    const classes = await fetch(
      `/data/rules?table=classes&relations=true&query=${JSON.stringify({
        include: {
          hit_dice: {
            die: true
          }
        }
      })}`
    ).then((j) => j.json());
    if (!window.location.href.includes("create")) {
      classes.forEach((item) => {
        item.xp = 4;
      });
    }
    return classes;
  }).result;
  const limiter = (draft) => {
    if (window.location.href.includes("create")) {
      return draft.classes.length == 0;
    } else {
      return true;
    }
  };
  return (
    <>
      {classes && (
        <optionsContext.Provider
          value={{
            searchable: classes,
            table: "classes",
            options: classes
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

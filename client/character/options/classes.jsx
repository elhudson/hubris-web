import { useAsync } from "react-async-hook";
import { optionsContext, limitsContext } from "@contexts/options";
import Optionset from "./optionset";
import { ruleContext } from "@contexts/rule";
import Classes from "@components/categories/classes";
import Option from "./option";

export default () => {
  const classes = useAsync(async () => {
    const classes = await fetch(
      `/data/rules?table=classes&relations=true&query=${JSON.stringify({
        include: {
          hit_dice: {
            die: true,
          },
        },
      })}`
    ).then((j) => j.json());
    if (!window.location.href.includes("create")) {
      classes.forEach((item) => {
        item.xp = 4;
      });
    }
    return classes;
  }).result;
  const limiter = ({ draft: draft }) => {
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
            options: classes,
          }}>
          <limitsContext.Provider
            value={{
              limiter: limiter,
            }}>
            <ruleContext.Provider
              value={{
                location: "create",
                table: "classes",
              }}>
              <Optionset
                component={<Classes checkbox={(item)=> <Option data={item} />} />}
              />
            </ruleContext.Provider>
          </limitsContext.Provider>
        </optionsContext.Provider>
      )}
    </>
  );
};

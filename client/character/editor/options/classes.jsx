import { Option, Optionset } from "@client/options";
import { limitsContext, optionsContext, ruleContext } from "contexts";

import { Classes } from "@client/rules";
import { Loading } from "@interface/ui";

export default () => {
  const classes = async () => {
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
  };
  const limiter = ({ draft: draft }) => {
    if (window.location.href.includes("create")) {
      return draft.classes.length == 0;
    } else {
      return true;
    }
  };
  return (
    <Loading
      getter={classes}
      render={(classes) => (
        <optionsContext.Provider
          value={{
            searchable: classes,
            options: classes,
          }}
        >
          <limitsContext.Provider
            value={{
              limiter: limiter,
            }}
          >
            <ruleContext.Provider
              value={{
                location: window.location.href.includes("create") ? "create" : "levelup",
                table: "classes",
              }}
            >
              <Optionset
                component={
                  <Classes checkbox={(item) => <Option data={item} />} />
                }
              />
            </ruleContext.Provider>
          </limitsContext.Provider>
        </optionsContext.Provider>
      )}
    />
  );
};

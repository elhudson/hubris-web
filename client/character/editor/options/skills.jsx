import { Option, Optionset } from "@client/options";
import { optionsContext, ruleContext, useCharacter } from "contexts";

import { Loading } from "@interface/ui";
import { Skills } from "@client/rules";
import _ from "lodash";

export default () => {
  const skills = async () =>
    await fetch("/data/rules?table=skills&relations=true").then((k) =>
      k.json()
    );

  return (
    <Loading
      getter={skills}
      render={(skills) => (
        <ruleContext.Provider
          value={{
            location: "levelup",
            table: "skills",
          }}
        >
          <optionsContext.Provider
            value={{
              searchable: skills,
              options: skills,
            }}
          >
            <Optionset
              component={<Skills checkbox={(item) => <Option data={item} />} />}
            />
          </optionsContext.Provider>
        </ruleContext.Provider>
      )}
    />
  );
};

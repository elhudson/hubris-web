import { optionsContext, limitsContext } from "@contexts/options";
import { ruleContext } from "@contexts/rule";
import { useAsync } from "react-async-hook";
import _ from "lodash";
import { useState } from "react";
import Optionset from "./optionset";
import Option from "./option";
import Backgrounds from "@components/categories/backgrounds";

export default () => {
  const [searchable, setSearchable] = useState(null);
  const bgs = useAsync(async () => {
    const ret = await fetch(
      `/data/rules?table=settings&query=${JSON.stringify({
        select: {
          title: true,
          id: true,
          backgrounds: {
            include: {
              background_features: true,
              skills: true,
              attributes: true,
              settings: true
            },
          },
        },
      })}`
    ).then((t) => t.json());
    const search = _.concat(...ret.map((r) => r.backgrounds));
    setSearchable(search);
    return ret;
  }).result;
  const limiter = ({ draft, feature }) => {
    if (draft.backgrounds.length >= 2) {
      return false;
    }
    if (
      feature.settings.title != "Core" &&
      draft.backgrounds.map((b) => b.settings?.map(s=> s.id)).includes(feature.settings.id)
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
            options: bgs,
          }}>
          <limitsContext.Provider
            value={{
              limiter: limiter,
            }}>
            <ruleContext.Provider
              value={{
                location: "create",
                table: "backgrounds",
              }}>
              <Optionset
                component={
                  <Backgrounds checkbox={(item) => <Option data={item} />} />
                }
              />
            </ruleContext.Provider>
          </limitsContext.Provider>
        </optionsContext.Provider>
      )}
    </>
  );
};

import { Option, Optionset } from "@client/options";
import { limitsContext, optionsContext, ruleContext } from "contexts";

import { Backgrounds } from "@client/rules";
import { Loading } from "@interface/ui";
import _ from "lodash";
import { useState } from "react";

export default () => {
  const bgs = async () =>
    await fetch(
      `/data/rules?table=settings&query=${JSON.stringify({
        select: {
          title: true,
          id: true,
          backgrounds: {
            include: {
              background_features: true,
              skills: true,
              attributes: true,
              settings: true,
            },
          },
        },
      })}`
    ).then((t) => t.json());

  const limiter = ({ draft, feature }) => {
    if (draft.backgrounds.length >= 2) {
      return false;
    }
    if (
      feature.settings.title != "Core" &&
      draft.backgrounds
        .map((b) => b.settings?.map((s) => s.id))
        .includes(feature.settings.id)
    ) {
      return false;
    } else {
      return true;
    }
  };
  return (
    <Loading
      getter={bgs}
      render={(bgs) => (
        <optionsContext.Provider
          value={{
            searchable: _.concat(...bgs.map((r) => r.backgrounds)),
            options: bgs,
          }}
        >
          <limitsContext.Provider
            value={{
              limiter: limiter,
            }}
          >
            <ruleContext.Provider
              value={{
                location: "create",
                table: "backgrounds",
              }}
            >
              <Optionset
                component={
                  <Backgrounds checkbox={(item) => <Option data={item} />} />
                }
              />
            </ruleContext.Provider>
          </limitsContext.Provider>
        </optionsContext.Provider>
      )}
    />
  );
};

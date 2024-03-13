import * as Campaign from "@client/campaign";

import { Layouts, Metadata, Tabs } from "@interface/ui";
import { css, useTheme } from "@emotion/react";

import { Link } from "@interface/components";
import { campaignContext } from "contexts";
import { useImmer } from "use-immer";
import { useLoaderData } from "react-router-dom";

export default ()=> {
  const { colors, classes } = useTheme();
  const [campaign, update] = useImmer(useLoaderData());
  return (
    <campaignContext.Provider value={{ campaign: campaign, update: update }}>
      <Campaign.Menu>
        <div
          css={css`
            section,
            h2 {
              background-color: ${colors.background};
              border: 1px solid ${colors.accent};
              padding: 10px;
              margin-bottom: 10px;
            }
          `}>
          <h2>{campaign.name}</h2>
          <Layouts.Row>
            <section>
              <Metadata
                pairs={[
                  [
                    "Settings",
                    <span css={classes.layout.inline}>
                      {campaign.settings.map((s) => (
                        <Link
                          feature={s}
                          table="settings"
                        />
                      ))}
                    </span>,
                  ],
                  ["DM", <span>{campaign.dm.username}</span>],
                ]}
              />
            </section>
            <section>
              <Layouts.Row>
                <Campaign.Xp />
                <Campaign.Sessions />
              </Layouts.Row>
            </section>
          </Layouts.Row>
        </div>

        <Tabs
          css={css`
            background-color: ${colors.background};
          `}
          names={["Characters", "Log"]}
          def="Characters">
          <Campaign.Characters />
          <Campaign.Summaries />
        </Tabs>
        <span
          css={css`
            background-color: ${colors.background};
          `}>
          <Campaign.Save />
        </span>
      </Campaign.Menu>
    </campaignContext.Provider>
  );
};

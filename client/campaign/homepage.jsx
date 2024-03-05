import { campaignContext } from "contexts";
import { useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import * as Campaign from "@client/campaign";
import { useTheme, css } from "@emotion/react";

import { Link } from "@interface/components";
import { Metadata, Tabs, Loading, Layouts } from "@interface/ui";

export default () => {
  const { id } = useParams();
  const campaign = async () =>
    await fetch(`/data/campaign?id=${id}`).then((j) => j.json());
  return (
    <Loading
      getter={campaign}
      render={(campaign) => <Homepage cpg={campaign} />}
    />
  );
};

const Homepage = ({ cpg }) => {
  const { colors, palette, classes } = useTheme();
  const [campaign, update] = useImmer(cpg);
  return (
    <campaignContext.Provider value={{ campaign: campaign, update: update }}>
      <Campaign.Actions>
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
      </Campaign.Actions>
    </campaignContext.Provider>
  );
};

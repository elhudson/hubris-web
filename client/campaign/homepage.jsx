import { campaignContext } from "@contexts/campaign";
import { useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import { useAsync } from "react-async-hook";
import Actions from "@campaigns/actions";
import Campaign from "@packages/campaigns";
import { useTheme, css } from "@emotion/react";
import Notepad from "@ui/notepad";
import Color from "color";
import { FaPlusCircle } from "react-icons/fa";
import Notif from "@ui/notif";
import Link from "@components/link";
import Metadata from "@ui/metadata";
import Tabs from "@ui/tabs";
import { Sections, Row } from "@ui/layouts";
import Loading from "@ui/loading";

export default () => {
  const { id } = useParams();
  const campaign = async () =>
    await fetch(`/data/campaign?id=${id}`).then((j) => j.json());
  return (
    <Loading
      getter={campaign}
      render={(campaign) => <Cpg cpg={campaign} />}
    />
  );
};

const Cpg = ({ cpg }) => {
  const { colors, palette, classes } = useTheme();
  const [campaign, update] = useImmer(cpg);
  return (
    <campaignContext.Provider value={{ campaign: campaign, update: update }}>
      <Actions>
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
          <Row>
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
                    </span>
                  ],
                  ["DM", <span>{campaign.dm.username}</span>]
                ]}
              />
            </section>
            <section>
              <Row>
                <Campaign.xp />
                <Campaign.sessions />
              </Row>
            </section>
          </Row>
        </div>

        <Tabs
          css={css`
            background-color: ${colors.background};
          `}
          names={["Characters", "Log"]}
          def="Characters">
          <Campaign.characters />
          <Campaign.summaries />
        </Tabs>
        <span
          css={css`
            background-color: ${colors.background};
          `}>
          <Campaign.save />
        </span>
      </Actions>
    </campaignContext.Provider>
  );
};

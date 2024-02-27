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
                  </span>,
                ],
                ["DM", <span>{campaign.dm.username}</span>],
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
      <Campaign.save />
    </campaignContext.Provider>
  );
  // return (
  //   <div
  //     css={css`
  //       max-height: 100vh;
  //       overflow: scroll;
  //       section:not(.profile section),
  //       > * > button {
  //         margin: 5px 0px;
  //         padding: 5px;
  //         background-color: ${Color(colors.background).toString()};
  //         border: 1px solid ${colors.accent};
  //       }
  //       .profile > div {
  //         background-color: ${palette.accent1};
  //       }
  //     `}>
  //     {campaign != null && (
  //       <>

  //             <h2>{campaign.name}</h2>
  //             <div
  //               css={css`
  //                 width: 100%;
  //                 display: flex;
  //                 gap: 10px;
  //                 > * {
  //                   flex-grow: 1;
  //                 }
  //               `}>
  //               <section>
  //
  //               </section>
  //               <section>
  //                 <Campaign.xp />
  //                 <Campaign.sessions />
  //               </section>
  //             </div>
  //             <section>
  //               <Notepad text={campaign.description} />
  //             </section>
  //             <div
  //               css={css`
  //                 display: flex;
  //                 gap: 10px;
  //                 > section {
  //                   &:first-child {
  //                     max-width: fit-content;
  //                   }
  //                   &:nth-child(2) {
  //                     flex-grow: 1;
  //                   }
  //                   position: relative;
  //                   > h3 {
  //                     text-align: center;
  //                     text-transform: uppercase;
  //                     max-height: fit-content;
  //                   }
  //                   > button {
  //                     position: absolute;
  //                     top: 5px;
  //                     right: 10px;
  //                   }
  //                 }
  //               `}>
  //               <Sections>
  //                 <section>
  //                   <h3>Our Intrepid Heroes</h3>
  //                   <Campaign.characters />
  //                 </section>
  //                 <section>
  //                   <h3>The Journey So Far</h3>
  //                   <button>
  //                     <a
  //                       href={`/campaign/${campaign.id}/summaries/${
  //                         campaign.logbook.length + 1
  //                       }`}>
  //                       <FaPlusCircle />
  //                     </a>
  //                   </button>
  //                   <Campaign.summaries />
  //                 </section>
  //               </Sections>
  //             </div>
  //
  //           </Actions>
  //         </campaignContext.Provider>
  //       </>
  //     )}
  //   </div>
  // );
};

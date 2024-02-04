import { campaignContext } from "@contexts/campaign";
import { useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import { useAsync } from "react-async-hook";
import Actions from "@campaigns/actions";
import Campaign from "@packages/campaigns";
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";
import Notepad from "@ui/notepad";
import Color from "color";
import { FaPlusCircle } from "react-icons/fa";
import Notif from "@ui/notif";

import query from "@database/queries/campaign";

export default () => {
  const { id } = useParams();
  const { colors, palette } = useTheme();
  const [campaign, update] = useImmer(null);
  useAsync(
    async () =>
      await fetch(`/data/campaign?id=${id}`)
        .then((j) => j.json())
        .then((ch) => update(ch))
  );
  return (
    <div
      className={css`
        max-height: 100vh;
        overflow: scroll;
        margin: -5px;
        section,
        > button {
          margin: 5px;
          background-color: ${Color(colors.background).toString()};
          border: 1px solid ${colors.accent};
        }
        .profile > div {
          background-color: ${palette.accent1};
        }
      `}>
      {campaign != null && (
        <>
          <campaignContext.Provider
            value={{ campaign: campaign, update: update }}>
            <Actions>
              <section>
                <h2 className="pagetitle">{campaign.name}</h2>
              </section>
              <section>
                <Notepad text={campaign.description} />
              </section>
              <div
                className={css`
                  display: flex;
                  > section {
                    &:first-child {
                      max-width: fit-content;
                    }
                    &:nth-child(2) {
                      flex-grow: 1;
                    }
                    position: relative;
                    > h3 {
                      text-align: center;
                      text-transform: uppercase;
                    }
                    > button {
                      position: absolute;
                      top: 5px;
                      right: 5px;
                    }
                  }
                `}>
                <section>
                  <h3>Our Intrepid Heroes</h3>
                  <Campaign.recruiter />
                  <Campaign.characters />
                </section>
                <section>
                  <h3>The Journey So Far</h3>
                  <button>
                    <a
                      href={`/campaign/${id}/summaries/${
                        campaign.logbook.length + 1
                      }`}>
                      <FaPlusCircle />
                    </a>
                  </button>
                  <Campaign.summaries />
                </section>
              </div>
              <Notif
                btn="Save"
                func={async () =>
                  await fetch(`/data/campaign?id=${id}`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(query(campaign))
                  }).then((res) => res.text())
                }
              />
            </Actions>
          </campaignContext.Provider>
        </>
      )}
    </div>
  );
};

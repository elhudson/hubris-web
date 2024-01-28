import { campaignContext } from "@contexts/campaign";
import { useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import { useAsync } from "react-async-hook";
import Characters from "@components/campaigns/characters";
import Summaries from "@components/campaigns/summaries";
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";
import Notepad from "@ui/notepad";

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
        width: 100vw;
        overflow: scroll;
      `}>
      {campaign != null && (
        <div
          className={css`
            padding: 10px;
            > div {
              margin-top: 5px;
              margin-bottom: 5px;
            }
          `}>
          <campaignContext.Provider
            value={{ campaign: campaign, update: update }}>
            <div
              className={css`
                background-color: ${colors.background};
                border: 1px solid ${colors.accent};
              `}>
              <h2 className="pagetitle">{campaign.name}</h2>
            </div>
            <div>
              <Notepad text={campaign.description} />
              <div
                className={css`
                  display: flex;
                  .profile>div {
                    background-color: ${palette.accent1};
                  }
                  > div {
                    width: 100%;
                    &:first-child {
                      max-width: fit-content;
                    }
                    margin: 5px;
                    padding: 5px;
                    border: 1px solid ${colors.text};
                    background-color: ${colors.background};
                    > h3 {
                      text-align: center;
                      text-transform: uppercase;
                    }
                  }
                `}>
                <div>
                  <h3>Our Intrepid Heroes</h3>
                  <Characters />
                </div>
                <div>
                  <h3>The Journey So Far</h3>
                  <Summaries />
                </div>
              </div>
            </div>
          </campaignContext.Provider>
        </div>
      )}
      <div
        className={css`
          z-index: -2;
          position: absolute;
          top: 0;
          right: 0;
          img {
            object-fit: cover;
            opacity: 0.5;
            height: 100vh;
            width: 100vw;
          }
        `}>
        <img src={`/campaigns/${id}.jpg`} />
      </div>
    </div>
  );
};

import ui from "interface";
import { css, useTheme } from "@emotion/react";
import { useCampaign } from "@contexts/campaign";

export default () => {
  const { campaign } = useCampaign();
  const { colors, classes } = useTheme();
  return (
    <div
      css={css`
        position: relative;
        width: fit-content;
        padding: 5px;
        border: 1px solid ${colors.accent};
        .icons {
            position: absolute;
            top: 5px;
        }
        h4 {
          font-size: 17px;
          text-align: center;
          margin-bottom: 5px;
        }
        label {
          font-weight: bold;
        }
        .campaign-cover {
          ${classes.elements.frame};
          img {
            height: 250px;
            object-fit: cover;
          }
        }
      `}>
      <h4>
        <a href={`/campaign/${campaign.id}`}>{campaign.name}</a>
      </h4>
      <div className="campaign-cover">
        <img src={`/public/campaigns/${campaign.id}.png`} />
      </div>
      <ui.Notepad text={campaign.description} />
      <ui.Array data={campaign.settings.map(c=> ({name: c.title, id: c.id}))} />
    </div>
  );
};

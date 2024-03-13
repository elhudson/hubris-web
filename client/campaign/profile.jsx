import { Array, Notepad } from "@interface/ui";
import { css, useTheme } from "@emotion/react";

import { Menu } from "@client/character";
import { useCampaign } from "context";

export default () => {
  const { campaign } = useCampaign();
  const { colors, classes } = useTheme();
  return (
    <Menu>
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
        <Notepad text={campaign.description} />
        <Array data={campaign.settings.map(c=> ({name: c.title, id: c.id}))} />
      </div>
    </Menu>
  );
};

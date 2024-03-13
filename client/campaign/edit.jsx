import { Metadata, Notepad, Upload } from "@interface/ui";
import { Recruiter, Settings } from "@client/campaign";
import { css, useTheme } from "@emotion/react";

import _ from "lodash";
import { useCampaign } from "contexts";

export default () => {
  const { campaign, update } = useCampaign();
  const { colors, palette } = useTheme();
  return (
    <span
      className={css`
        .quill {
          border: 1px solid ${colors.accent};
          background-color: ${palette.accent1};
        }
        label {
          font-weight: bold;
        }
        .pic {
          display: unset;
        }
      `}>
      <EditCover />
      <Metadata
        pairs={[
          [
            "Title",
            <input
              type="text"
              value={campaign.name}
              onChange={(e) =>
                update((draft) => {
                  draft.name = e.currentTarget.value;
                })
              }
            />,
          ],
          ["Characters", <Recruiter />],
          ["Settings", <Settings />],
        ]}
      />

      <div>
        <label>Description</label>
        <Notepad
          text={campaign.description}
          onChange={(e) =>
            update((draft) => {
              draft.description = e;
            })
          }
        />
      </div>
    </span>
  );
};

const EditCover = () => {
  const { campaign } = useCampaign();
  const url = `/campaigns/${campaign.id}.png`;
  const endpoint = `/data/campaign/cover?id=${campaign.id}`;
  return (
    <Upload
      path={url}
      endpoint={endpoint}
      sz={300}
    />
  );
};

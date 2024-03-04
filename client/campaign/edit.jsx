import { useCampaign } from "@contexts/campaign";
import Notepad from "@ui/notepad";
import Multi from "@ui/multi";
import Upload from "@ui/upload";
import _ from "lodash";
import { css, useTheme } from "@emotion/react";
import { useAsync } from "react-async-hook";
import Recruiter from "./recruiter";
import Settings from "./settings";
import Metadata from "@ui/metadata";
export default () => {
  const { campaign, update } = useCampaign();
  const settings = useAsync(
    async () =>
      await fetch(`/data/rules?table=settings`).then((res) => res.json())
  ).result;
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
            />
          ],
          ["Characters", <Recruiter />],
          ["Settings", <Settings />]
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

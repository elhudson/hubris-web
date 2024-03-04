import { useCampaign } from "@contexts/campaign";
import Notepad from "@ui/notepad";
import Multi from "@ui/multi";
import Upload from "@ui/upload";
import _ from "lodash";
import { css, useTheme } from "@emotion/react";
import { useAsync } from "react-async-hook";
import Recruiter from "./recruiter";

export default () => {
  const { campaign, update } = useCampaign();
  const settings = useAsync(
    async () =>
      await fetch(`/data/rules?table=settings`).then((res) => res.json())
  ).result;
  const { colors, palette } = useTheme();
  return (
    <>
      {settings && (
        <Multi
          items={settings}
          currents={campaign.settings}
          valuePath="id"
          labelPath="title"
          onChange={(e) => {
            update((draft) => {
              draft.settings = e.map((v) =>
                _.find(settings, (c) => c.id == v.value)
              );
            });
          }}
        />
      )}
    </>
  );
};

import { useCampaign } from "context";
import _ from "lodash";
import { css, useTheme } from "@emotion/react";
import { useAsync } from "react-async-hook";

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

import { useTheme, css } from "@emotion/react";
import { Notif } from "@interface/ui";
import { useCampaign } from "context";

export default () => {
  const { classes } = useTheme();
  const { campaign } = useCampaign();
  return (
    <Notif
      css={classes.elements.post}
      btn="Save"
      func={async () =>
        await fetch(`/data/campaign?id=${campaign.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(campaign),
        }).then((res) => res.text())
      }
    />
  );
};

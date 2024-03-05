import { useCampaign } from "contexts";
import Summary from "@campaigns/summary";
import { useTheme, css } from "@emotion/react";
import { Layouts } from "@interface/ui";

export default () => {
  const { campaign } = useCampaign();
  const { colors } = useTheme();
  return (
    <Layouts.Sections>
      {campaign.logbook.map((summary) => (
        <Summary
          {...summary}
          campaign={campaign}
        />
      ))}
    </Layouts.Sections>
  );
};

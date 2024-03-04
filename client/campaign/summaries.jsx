import { useCampaign } from "@contexts/campaign";
import Summary from "@campaigns/summary";
import { useTheme, css } from "@emotion/react";
import { Sections } from "@ui/layouts";
export default () => {
  const { campaign } = useCampaign();
  const { colors } = useTheme();
  return (
    <Sections>
      {campaign.logbook.map((summary) => (
        <Summary
          {...summary}
          campaign={campaign}
        />
      ))}
    </Sections>
  );
};

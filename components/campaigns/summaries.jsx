import { useCampaign } from "@contexts/campaign";
import Summary from "@campaigns/summary";
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";
export default () => {
  const { campaign } = useCampaign();
  const {colors}=useTheme()
  return (
    <div className={css`
    padding: 10px;
    >div {
        border-bottom: 1px solid ${colors.accent};
        padding-bottom: 10px;
    }
    `}>
      {campaign.logbook.map((summary) => (
        <Summary {...summary} campaign={campaign} />
      ))}
    </div>
  );
};

import { css, useTheme } from "@emotion/react";

import { Layouts } from "@interface/ui";
import { Summary } from "@client/campaign";
import { useCampaign } from "contexts";

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

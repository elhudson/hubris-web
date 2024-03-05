import { Counter, NumberBox } from "@interface/ui";

import { useCampaign } from "contexts";

export default () => {
  const { campaign, update } = useCampaign();
  const inc = () => {
    update((draft) => {
      draft.xp += 1;
    });
  };
  const dec = () => {
    update((draft) => {
      draft.xp -= 1;
    });
  };
  return (
    <NumberBox label="XP">
      <Counter
        item={campaign}
        valuePath="xp"
        inc={inc}
        dec={dec}
      />
    </NumberBox>
  );
};

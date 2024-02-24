import { useCampaign } from "@contexts/campaign";
import Counter from "@ui/counter";
import NumberBox from "@ui/numberBox";

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

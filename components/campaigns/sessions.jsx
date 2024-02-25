import { useCampaign } from "@contexts/campaign";
import Counter from "@ui/counter";
import NumberBox from "@ui/numberBox";

export default () => {
  const { campaign, update } = useCampaign();
  const inc = () => {
    update((draft) => {
      draft.sessionCount += 1;
    });
  };
  const dec = () => {
    update((draft) => {
      draft.sessionCount -= 1;
    });
  };
  return (
    <NumberBox label="Sessions">
      <Counter
        item={campaign}
        valuePath="sessionCount"
        inc={inc}
        dec={dec}
      />
    </NumberBox>
  );
};

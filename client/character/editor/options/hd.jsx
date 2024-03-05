import { Counter } from "@interface/ui";
import { Die } from "@client/character";
import _ from "lodash";
import { useCharacter } from "contexts";
export default () => {
  const { character, update } = useCharacter();
  const incrementDie = (id) => {
    update((draft) => {
      const item = _.find(draft.HD, (i) => i.id == id);
      const cost = item.die.cost + (item.max - 1);
      if (draft.xp_spent + cost < draft.xp_earned) {
        item.max += 1;
        draft.xp_spent += cost;
      }
    });
  };
  const decrementDie = (id) => {
    update((draft) => {
      const item = _.find(draft.HD, (i) => i.id == id);
      const refund = item.die.cost + (item.max - 2);
      if (item.max > 1) {
        item.max -= 1;
        draft.xp_spent -= refund;
      }
    });
  };
  return (
    <div>
      {character.HD.map((h) => (
        <div>
          <Die die={h.die} />
          <Counter
            item={h}
            valuePath="max"
            inc={() => incrementDie(h.id)}
            dec={() => decrementDie(h.id)}
          />
        </div>
      ))}
    </div>
  );
};

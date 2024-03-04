import { useCharacter } from "@contexts/character";
import _ from "lodash";
import ui from "interface";
import Die from "@components/character/die";

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
          <ui.Counter
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

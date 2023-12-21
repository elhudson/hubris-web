import { useCharacter } from "@contexts/character";
import Die from "./die";
import Counter from "@ui/counter";

export default ({ index }) => {
  const { character, update } = useCharacter();
  const incrementUsed = (e) => {
    update((draft) => {
      if (draft.HD[index].used < draft.HD[index].max) {
        draft.HD[index].used += 1;
      }
    });
  };
  const decrementUsed = (e) => {
    update((draft) => {
      if (draft.HD[index].used > 0) {
        draft.HD[index].used -= 1;
      }
    });
  };
  const current = character.HD[index].die;
  return (
    <>
      <Counter
        item={character.HD[index]}
        valuePath={"used"}
        inc={incrementUsed}
        dec={decrementUsed}
        max={character.HD[index].max}
      />
      <Die die={current} />
    </>
  );
};

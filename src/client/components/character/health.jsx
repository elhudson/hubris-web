import { useCharacter } from "@contexts/character";
import HD from "./hd";
import Injuries from "./injury";
import { get_max_hp } from "utilities";
import _ from "lodash";
import Counter from "@ui/counter";
import { useTheme } from "@emotion/react";

const Health = () => {
  const { character, update } = useCharacter();
  const { colors } = useTheme();
  const incrementHealth = (e) => {
    update((draft) => {
      if (draft.health.hp < get_max_hp(draft)) {
        draft.health.hp += 1;
      }
    });
  };
  const decrementHealth = (e) => {
    update((draft) => {
      if (draft.health.hp > 0) {
        draft.health.hp -= 1;
      }
    });
  };
  return (
    <div>
      <div>
        <h4>HP</h4>
        <Counter
          item={character.health}
          valuePath={"hp"}
          inc={incrementHealth}
          dec={decrementHealth}
          max={get_max_hp(character)}
        />
      </div>
      <div>
        <h4>HD</h4>
        {character.HD.map((h) => (
          <HD index={_.indexOf(character.HD, h)} />
        ))}
      </div>
      <Injuries injury={character.health.injuries} />
    </div>
  );
};

export default Health;

import { useCharacter } from "@contexts/character";
import HD from "./hd";
import Injuries from "./injury";
import { get_max_hp } from "utilities";
import _ from "lodash";
import Counter from "@ui/counter";
import { useTheme } from "@emotion/react";
import { css } from "@emotion/css";
import { Row } from "@ui/layouts";

const Health = () => {
  const { character, update } = useCharacter();
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
    <Row>
      <div>
        <h4>HP</h4>
        <Counter
          item={character.health}
          valuePath={"hp"}
          inc={incrementHealth}
          dec={decrementHealth}
          max={get_max_hp(character)}
        />
        <Injuries injury={character.health.injuries} />
      </div>
      <div>
        <h4>HD</h4>
        {character.HD.map((h) => (
          <HD index={_.indexOf(character.HD, h)} />
        ))}
      </div>
    </Row>
  );
};

export default Health;

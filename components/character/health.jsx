import { useCharacter } from "@contexts/character";
import HD from "./hd";
import Injuries from "./injury";
import { get_max_hp } from "utilities";
import _ from "lodash";
import Counter from "@ui/counter";
import NumberBox from "@ui/numberBox";
import { css, useTheme } from "@emotion/react";
import { Row } from "@ui/layouts";

const Health = () => {
  const { character, update } = useCharacter();
  const { colors, classes} = useTheme();
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
        <NumberBox label="hp">
          <Counter
            item={character.health}
            valuePath={"hp"}
            inc={incrementHealth}
            dec={decrementHealth}
            max={get_max_hp(character)}
          />
        </NumberBox>
        <div
          css={css`
            ${classes.elements.selectbox}
            button[role="combobox"] {
              flex-grow: 1;
              border: unset;
            }
          `}>
          <label>Injuries</label>
          <Injuries injury={character.health.injuries} />
        </div>
      </div>
      {character.HD.map((h) => (
        <HD index={_.indexOf(character.HD, h)} />
      ))}
    </Row>
  );
};

export default Health;

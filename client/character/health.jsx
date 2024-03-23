import { Counter, Layouts, NumberBox } from "@interface/ui";
import { Hd, Injury } from "@client/character";
import { css, useTheme } from "@emotion/react";

import _ from "lodash";
import { get_max_hp } from "utils";
import { useCharacter } from "contexts";

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
    <Layouts.Row>
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
          <Injury injury={character.health.injuries} />
        </div>
      </div>
      {character.HD.map((h) => (
        <Hd index={_.indexOf(character.HD, h)} />
      ))}
    </Layouts.Row>
  );
};

export default Health;

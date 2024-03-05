import { Counter, NumberBox } from "@interface/ui";
import { css, useTheme } from "@emotion/react";

import { Die } from "@client/character";
import { useCharacter } from "contexts";

export default ({ index }) => {
  const { colors } = useTheme();
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
    <div
      css={css`
        .die-type {
          border: 1px solid ${colors.accent};
          border-top: none;
          > div {
            margin-top: 3px;
            width: 100%;
            justify-content: space-around;
          }
        }
      `}
    >
      <NumberBox label="HD">
        <Counter
          item={character.HD[index]}
          valuePath={"used"}
          inc={incrementUsed}
          dec={decrementUsed}
          max={character.HD[index].max}
        />
      </NumberBox>

      <div className="die-type">
        <Die die={current} />
      </div>
    </div>
  );
};

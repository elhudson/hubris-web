import { NumberBox, Toggles } from "@interface/ui";
import { css, useTheme } from "@emotion/react";

import { calc_xp } from "utilities";
import { useCharacter } from "contexts";

export default () => {
  const { character, update } = useCharacter();
  const { colors, classes } = useTheme();

  const inc = () => {
    update((draft) => {
      draft.xp_earned += 1;
    });
  };
  const dec = () => {
    update((draft) => {
      if (draft.xp_earned > calc_xp(character)) {
        draft.xp_earned -= 1;
      }
    });
  };

  return (
    <NumberBox label="XP">
      <div
        css={css`
          position: relative;
        `}
      >
        <div css={classes.elements.number}>
          {calc_xp(character)} / {character.xp_earned}
        </div>
        <div
          css={css`
            border-left: 1px solid ${colors.accent};
            width: 30px;
            position: absolute;
            top: 0;
            right: 0;
            > div {
              height: unset;
              width: unset;
              height: 100%;
            }
            > * > button {
              display: block;
              border: unset !important;
              border-left: 1px solid ${colors.accent};
              &:first-child {
                border-bottom: 1px solid ${colors.accent} !important;
              }
              position: relative !important;
              height: 15px;
              width: 100% !important;
            }
          `}
        >
          <Toggles
            inc={inc}
            dec={dec}
          />
        </div>
      </div>
    </NumberBox>
  );
};
import { useCharacter } from "@contexts/character";
import Toggles from "@ui/toggles";
import { useTheme, css } from "@emotion/react";
import NumberBox from "@ui/numberBox";

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
      if (draft.xp_earned > draft.xp_spent) {
        draft.xp_earned -= 1;
      }
    });
  };
  return (
    <NumberBox label="XP">
      <div
        css={css`
          position: relative;
        `}>
        <div css={classes.elements.number}>
          {character.xp_spent} / {character.xp_earned}
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
          `}>
          <Toggles
            inc={inc}
            dec={dec}
          />
        </div>
      </div>
    </NumberBox>
  );
};

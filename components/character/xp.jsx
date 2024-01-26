import { useCharacter } from "@contexts/character";
import Toggles from "@ui/toggles";
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";

export default () => {
  const { character, update } = useCharacter();
  const { colors } = useTheme();

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
    <div>
      <h4>XP</h4>
      <div
        className={css`
          border: 1px solid ${colors.text};
          text-align: center;
          font-size: 20px;
          height: 30px;
        `}>
        {character.xp_spent} / {character.xp_earned}
        <div
          className={css`
            border-left: 1px solid ${colors.text};
            position: relative;
            width: 30px;
            float: right;
            > div {
              bottom: 0;
              height: unset;
              width: unset;
            }
            > * > button {
              display: block;
              border: unset !important;
              border-left: 1px solid ${colors.text};
              &:first-child {
                border-bottom: 1px solid ${colors.text} !important;
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
    </div>
  );
};

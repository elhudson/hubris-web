import { useCharacter } from "@contexts/character";
import Toggles from "@ui/toggles"
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
        `}>
        {character.xp_spent} / {character.xp_earned}
        <Toggles
          inc={inc}
          dec={dec}
        />
      </div>
    </div>
  );
};



import { useCharacter } from "@contexts/character";
import { Toggles } from "@ui/counter";
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";
import { Radio } from "@ui/radio";
import { get_tier, get_proficiency } from "utilities";

export default ({}) => {
  return (
    <>
      <XP />
      <Proficiency />
      <Tier />
    </>
  );
};

export const Proficiency = () => {
  const { character } = useCharacter();
  return (
    <div>
      <h4>Proficiency</h4>
      <div className="number">+ {get_proficiency(character)}</div>
    </div>
  );
};

export const XP = () => {
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

export const Tier = () => {
  const { character } = useCharacter();
  const data = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 }
  ];
  return (
    <div className="inline">
      <h4>Tier</h4>
      <Radio
        data={data}
        current={{ value: get_tier(character) }}
        valuePath="value"
        labelPath="label"
      />
    </div>
  );
};

import { get_bonus, is_proficient } from "utils";

import { Checkbox } from "@interface/ui";
import { css } from "@emotion/css";
import { useCharacter } from "contexts";
import { useTheme } from "@emotion/react";

export default ({ skill, onCheck = null, editable = false }) => {
  const { character } = useCharacter();
  const {colors}=useTheme()
  return (
    <div
      className={css`
        display: flex;
        > div {
          margin-right: 5px;
        }
        > div:nth-child(2) {
          border-bottom: 1px solid ${colors.accent};
          padding-left: 3px;
          padding-right: 3px;
        }
      `}>
      <Checkbox
        checked={is_proficient(character, skill)}
        disabled={!editable}
        onChange={onCheck}
      />
      <div>
        {get_bonus(character, skill) >= 0 && <>+</>}
        {get_bonus(character, skill)}
      </div>
      <div>{skill.title}</div>
    </div>
  );
};

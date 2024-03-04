import { useCharacter } from "@contexts/character";
import { useTheme, css } from "@emotion/react";
import { get_proficiency } from "utilities";
import NumberBox from "@ui/numberBox"

export default () => {
  const { character } = useCharacter();
  const { classes } = useTheme();
  return (
    <NumberBox label="Proficiency">
      <div
        css={css`
          ${classes.elements.number};
        `}>
        + {get_proficiency(character)}
      </div>
    </NumberBox>
  );
};

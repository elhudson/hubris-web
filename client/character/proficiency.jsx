import { css, useTheme } from "@emotion/react";

import { NumberBox } from "@interface/ui";
import { get_proficiency } from "utilities";
import { useCharacter } from "contexts";

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

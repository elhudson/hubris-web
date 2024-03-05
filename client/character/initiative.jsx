import { css, useTheme } from "@emotion/react";

import { NumberBox } from "@interface/ui";
import { useCharacter } from "contexts";

export default () => {
  const { character } = useCharacter();
  const { classes } = useTheme();
  return (
    <NumberBox label="Initiative">
      <div css={classes.elements.number}>+ {character.dex}</div>
    </NumberBox>
  );
};

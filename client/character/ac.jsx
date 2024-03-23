import { css, useTheme } from "@emotion/react";

import { NumberBox } from "@interface/ui";
import _ from "lodash";
import { get_ac } from "utils";
import { useCharacter } from "contexts";

export default () => {
  const { character } = useCharacter();
  const { classes } = useTheme();
  const armor = _.find(character.inventory.armor, (f) => f.equipped);
  const ac = get_ac(character, armor);
  return (
    <NumberBox label="AC">
      <div css={classes.elements.number}>{ac}</div>
    </NumberBox>
  );
};

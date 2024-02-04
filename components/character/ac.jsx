import { useCharacter } from "@contexts/character";
import { get_ac } from "utilities";
import _ from "lodash";
import NumberBox from "@ui/numberBox";
import { useTheme, css } from "@emotion/react";

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

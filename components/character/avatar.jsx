import { useCharacter } from "@contexts/character";
import Upload from "@ui/upload";
import { css, useTheme } from "@emotion/react";
import Color from "color";

export default ({ id = null, sz = 100 }) => {
  const { character } = useCharacter();
  const endpt = `/data/character/avatar?id=${character.id}`;
  const url = `/portraits/${id}.png`;
  const { colors, classes } = useTheme();
  return (
    <div
      className="character-avatar"
      css={css`
        ${classes.elements.frame};
      `}>
      <Upload
        endpoint={endpt}
        path={url}
        sz={sz}
      />
    </div>
  );
};

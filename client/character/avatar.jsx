import { css, useTheme } from "@emotion/react";

import { Upload } from "@interface/ui";
import { useCharacter } from "contexts";

export default ({ id = null, sz = 100 }) => {
  const { character } = useCharacter();
  const endpt = `/data/character/avatar?id=${character.id}`;
  const url = `/portraits/${id}.png`;
  const { classes } = useTheme();
  return (
    <div
      className="character-avatar"
      css={classes.elements.frame}
    >
      <Upload
        endpoint={endpt}
        path={url}
        sz={sz}
      />
    </div>
  );
};

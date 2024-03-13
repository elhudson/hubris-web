import { css, useTheme } from "@emotion/react";

import { Profile } from "@client/character";
import _ from "lodash";
import { characterContext } from "contexts";
import { useLoaderData } from "react-router-dom";

const Characters = () => {
  const { classes } = useTheme();
  const { characters } = useLoaderData();
  return (
    <div
      css={css`
        ${classes.layout.container};
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        > * {
          flex-shrink: 1;
        }
      `}
    >
      {characters.map((c) => (
        <characterContext.Provider value={{ character: c, update: null }}>
          <Profile />
        </characterContext.Provider>
      ))}
    </div>
  );
};

export default Characters;

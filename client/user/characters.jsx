import { css, useTheme } from "@emotion/react";

import { Loading } from "@interface/ui";
import { Profile } from "@client/character";
import _ from "lodash";
import { characterContext } from "contexts";

const Characters = () => {
  const { classes } = useTheme();
  const characters = async () =>
    await fetch(`/data/characters`)
      .then((j) => j.json())
      .then((a) => (!_.isNull(a) ? [a].flat() : a));
  return (
    <Loading
      getter={characters}
      render={(chars) => (
        <div css={css`
          ${classes.layout.container};
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          >* {
            flex-shrink: 1;
          }
        `}>
          {chars.map((c) => (
            <characterContext.Provider value={{ character: c, update: null }}>
              <Profile />
            </characterContext.Provider>
          ))}
        </div>
      )} />
  );
};

export default Characters;

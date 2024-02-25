import { useAsync } from "react-async-hook";
import { characterContext } from "@contexts/character";
import Profile from "@components/character/profile";
import { useTheme, css } from "@emotion/react";
import _ from "lodash";

const Characters = () => {
  const { classes } = useTheme();
  const characters = useAsync(
    async () =>
      await fetch(`/data/characters`)
        .then((j) => j.json())
        .then((a) => (!_.isNull(a) ? [a].flat() : a))
  );
  return (
    <>
      {characters.result && (
        <div css={classes.layout.container}>
          {characters.result.map((c) => (
            <characterContext.Provider value={{ character: c, update: null }}>
              <Profile />
            </characterContext.Provider>
          ))}
        </div>
      )}
    </>
  );
};

export default Characters;

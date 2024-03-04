import { useAsync } from "react-async-hook";
import { characterContext } from "@contexts/character";
import Loading from "@ui/loading";
import Profile from "@components/character/profile";
import { useTheme, css } from "@emotion/react";
import _ from "lodash";

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

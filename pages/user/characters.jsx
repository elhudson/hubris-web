import { useAsync } from "react-async-hook";
import { userContext } from "@contexts/user";
import { useContext } from "react";
import { characterContext } from "@contexts/character";
import Profile from "@components/character/profile";
import { useTheme, css } from "@emotion/react";

const Characters = () => {
  const user = useContext(userContext);
  const { classes } = useTheme();
  const characters = useAsync(
    async () =>
      await fetch(`/data/characters?user=${user.username}&detailed=true`).then((j) =>
        j.json()
      )
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

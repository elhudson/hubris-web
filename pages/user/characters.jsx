import { useAsync } from "react-async-hook";
import { userContext } from "@contexts/user";
import { useContext } from "react";
import { characterContext, useCharacter } from "@contexts/character";
import { css } from "@emotion/css";
import Profile from "@components/character/profile";

const Characters = () => {
  const user = useContext(userContext);
  const characters = useAsync(
    async () =>
      await fetch(`/data/characters?user=${user.username}`).then((j) =>
        j.json()
      )
  );
  return (
    <>
      {characters.result && (
        <div className="container">
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

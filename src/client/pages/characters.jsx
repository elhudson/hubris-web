import { useAsync } from "react-async-hook";
import { userContext } from "../user";
import { useContext } from "react";

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
      <h1>Characters</h1>
      {characters.result &&
        characters.result.map((c) => (
          <ul>
            <li>
              <a href={`/${user.username}/${c.biography.name}/${c.id}`}>
                {c.biography.name}
              </a>
            </li>
          </ul>
        ))}
    </>
  );
};

export default Characters;

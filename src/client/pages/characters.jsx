import { useAsync } from "react-async-hook";
import { userContext } from "@contexts/user";
import { useContext } from "react";
import Grid from "@ui/grid";

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
        <Grid>
          {characters.result.map((c) => (
            <a
              className="center"
              href={`/character/${c.id}`}>
              {c.biography.name}
            </a>
          ))}
        </Grid>
      )}
    </>
  );
};

export default Characters;

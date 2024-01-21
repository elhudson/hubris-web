import { useCharacter } from "@contexts/character";
import Create from "@components/catalog/powers/create";
import Power from "@components/catalog/powers/power";
import { css } from "@emotion/css";
export default () => {
  const { character } = useCharacter();
  return (
    <div>
      <div
        className={css`
          display: inline-flex;
          margin-bottom:5px;
          h3 {
            margin-right: 10px;
          }
        `}>
        <h3>Favorite Powers</h3>
        <Create />
      </div>
      <div>
        {character.powerset.powers.map((p) => (
          <Power power={p} />
        ))}
      </div>
    </div>
  );
};

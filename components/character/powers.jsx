import { useCharacter } from "@contexts/character";
import { Effect } from "./ability";

const Powers = () => {
  const { character } = useCharacter();
  return (
    <>
      <div>
        <h3>Effects</h3>
        <div className="abilities">
          {character.effects.map((c) => (
            <Effect
              data={c}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Powers;

import { useCharacter } from "@contexts/character";
import { get_proficiency } from "utilities";

export default () => {
  const { character } = useCharacter();
  return (
    <div>
      <h4>Proficiency</h4>
      <div className="number">+ {get_proficiency(character)}</div>
    </div>
  );
};



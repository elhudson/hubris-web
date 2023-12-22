import { useCharacter } from "@contexts/character";

export default () => {
  const { character } = useCharacter();
  return (
    <div>
      <h4>Initiative</h4>
      <div className="bordered number">+ {character.dex}</div>
    </div>
  );
};

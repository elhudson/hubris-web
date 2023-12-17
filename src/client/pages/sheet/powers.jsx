import { useCharacter } from "@contexts/character";
import Feature from "@components/feature";

const Powers = () => {
  const { character } = useCharacter();
  return (
    <>
      <div>
        <h4>Effects</h4>
        {character.effects.map((c) => (
          <Feature
            feature={c.id}
            table="effects"
          />
        ))}
      </div>
      <div>
        <h4>Ranges</h4>
        {character.ranges.map((c) => (
          <Feature
            feature={c.id}
            table="ranges"
          />
        ))}
      </div>
      <div>
        <h4>Durations</h4>
        {character.durations.map((c) => (
          <Feature
            feature={c.id}
            table="durations"
          />
        ))}
      </div>
    </>
  );
};

export default Powers;

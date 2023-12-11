import { useCharacter } from "@contexts/character";


const Powers = () => {
  const { character } = useCharacter()
  return (
    <>
      <h3>Powers</h3>
      <div>
        <h4>Effects</h4>
        {character.effects.map((c) => (
          <div>
            <b>{c.title}</b>: {c.description}
          </div>
        ))}
      </div>
      <div>
        <h4>Ranges</h4>
        {character.ranges.map((c) => (
          <div>
            <b>{c.title}</b>: {c.description}
          </div>
        ))}
      </div>
      <div>
        <h4>Durations</h4>
        {character.durations.map((c) => (
          <div>
            <b>{c.title}</b>: {c.description}
          </div>
        ))}
      </div>
    </>
  );
};

export default Powers;

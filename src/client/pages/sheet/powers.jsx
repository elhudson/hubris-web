import { useCharacter } from "@contexts/character";
import { FeatureTooltip } from "@components/feature";

const Powers = () => {
  const { character } = useCharacter();
  return (
    <>
      <div>
        <h4>Effects</h4>
        <ul>
          {character.effects.map((c) => (
            <FeatureTooltip
              icon={c.id}
              feature={c}
              table="effects"
            />
          ))}
        </ul>
      </div>
      <div>
        <h4>Ranges</h4>
        <ul>
          {character.ranges.map((c) => (
            <FeatureTooltip
              icon={c.trees[0].id}
              feature={c}
              table="ranges"
            />
          ))}
        </ul>
      </div>
      <div>
        <h4>Durations</h4>
        <ul>
          {character.durations.map((c) => (
            <FeatureTooltip
              icon={c.trees[0].id}
              feature={c}
              table="durations"
            />
          ))}
        </ul>
      </div>
    </>
  );
};

export default Powers;

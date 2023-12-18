import { useCharacter } from "@contexts/character";
import Feature, { FeatureTooltip } from "@components/feature";

const Features = () => {
  const { character } = useCharacter();
  return (
    <>
      <div>
        <div>
          <h4>Background</h4>
          <ul>
            {character.backgrounds
              .filter((f) => f.background_features != null)
              .map((c) => (
                <FeatureTooltip
                  icon={c.id}
                  feature={c.background_features}
                  table="background_features"
                />
              ))}
          </ul>
        </div>
        <div>
          <h4>Class</h4>
          <ul>
            {character.class_features.map((c) => (
              <FeatureTooltip 
                icon={c.classes.id}
                feature={c}
                table="class_features"
              />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Features;

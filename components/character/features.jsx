import { useCharacter } from "@contexts/character";
import Ability from "./ability";

const Features = () => {
  const { character } = useCharacter();
  return (
    <>
      <div>
        <div>
          <h3>Background</h3>
          <div className="abilities">
            {character.backgrounds
              .filter((f) => f.background_features != null)
              .map((c) => (
                <Ability data={c.background_features} />
              ))}
          </div>
        </div>
        <div>
          <h3>Class</h3>
          <div className="abilities">
            {character.class_features.map((c) => (
              <Ability
                data={c}
                table="class_features"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Features;

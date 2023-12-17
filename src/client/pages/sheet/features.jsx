import { useCharacter } from "@contexts/character";
import Feature from "@components/feature";


const Features = () => {
  const { character } = useCharacter();
  return (
    <>
      <div>
        <div>
          <h4>Background</h4>
          {character.backgrounds.filter(f=>f.background_features!=null).map((c) => (
            <Feature feature={c.background_features.id} table="background_features" />
          ))}
        </div>
        <div>
          <h4>Class</h4>
          {character.class_features.map((c) => (
            <Feature feature={c.id} table="class_features" />
          ))}
        </div>
      </div>
    </>
  );
};

export default Features;

import { useContext } from "react";
import { characterContext } from "../../user";

const Features = () => {
  const { character } = useContext(characterContext);
  return (
    <>
      <h3>Features</h3>
      <div>
        <div>
          <h4>Background</h4>
          {character.backgrounds.filter(f=>f.background_features!=null).map((c) => (
            <div>
              <b>{c.background_features.title}:</b>{" "}
              {c.background_features.description}
            </div>
          ))}
        </div>
        <div>
          <h4>Class</h4>
          {character.class_features.map((c) => (
            <div>
              <b>{c.title}:</b> {c.description}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Features;

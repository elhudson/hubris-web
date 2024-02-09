import { useCharacter } from "@contexts/character";
import Ability from "./ability";
import { css, useTheme } from "@emotion/react";
const Features = () => {
  const { character } = useCharacter();
  const { classes } = useTheme();
  return (
    <div
      css={css`
        > section > div {
          ${classes.layout.gallery};
        }
        h3 {
          ${classes.elements.subhead};
        }
      `}>
      <section>
        <h3>Background</h3>
        <div>
          {character.backgrounds
            .filter((f) => f.background_features != null)
            .map((c) => (
              <Ability
                table={"background_features"}
                data={c.background_features}
              />
            ))}
        </div>
      </section>
      <section>
        <h3>Class</h3>
        <div>
          {character.class_features.map((c) => (
            <Ability
              data={c}
              table="class_features"
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Features;

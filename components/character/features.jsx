import { useCharacter } from "@contexts/character";
import Ability from "./ability";
import { css, useTheme } from "@emotion/react";
import { Sections } from "@ui/layouts";

const Features = () => {
  const { character } = useCharacter();
  const { classes } = useTheme();
  return (
    <Sections
      css={css`
        > section > div {
          ${classes.layout.gallery};
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
    </Sections>
  );
};

export default Features;

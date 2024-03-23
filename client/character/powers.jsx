import { Counter, Layouts, NumberBox } from "@interface/ui";
import { Create, Power } from "@client/power";
import { css, useTheme } from "@emotion/react";

import { Parts } from "@client/character";
import _ from "lodash";
import { get_proficiency } from "utils";
import { useCharacter } from "contexts";

const Powers = () => {
  const { classes } = useTheme();
  const { character, update } = useCharacter();
  const inc = () => {
    update((draft) => {
      draft.burn += 1;
    });
  };
  const dec = () => {
    update((draft) => {
      draft.burn > 0 && (draft.burn -= 1);
    });
  };
  const abilities = [
    ...new Set(
      _.flatten(character.classes.map((c) => c.attributes)).map((a) => a.code)
    ),
  ];
  return (
    <Layouts.Sections>
      <section>
        <Layouts.Row>
          <NumberBox label="Powers Used">
            <Counter
              item={character}
              valuePath="burn"
              inc={inc}
              dec={dec}
            />
          </NumberBox>
          <NumberBox label="Bonus">
            {abilities.map((d) => (
              <div css={classes.elements.number}>
                +{character[d] + get_proficiency(character)}
              </div>
            ))}
          </NumberBox>
          <NumberBox label="Base DC">
            <div css={classes.elements.number}>{10 + character.burn}</div>
          </NumberBox>
        </Layouts.Row>
      </section>
      <section
        css={css`
          position: relative;
          > button {
            position: absolute;
            top: 0;
            right: 0;
          }
        `}
      >
        <h3>Favorite Powers</h3>
        <Create />
        {character.powers.map((p) => (
          <Power pwr={p} />
        ))}
      </section>
      <section>
        <h3>Power Components</h3>
        <Parts />
      </section>
    </Layouts.Sections>
  );
};

export default Powers;

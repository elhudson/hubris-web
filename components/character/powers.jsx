import { useCharacter } from "@contexts/character";
import Numberbox from "@ui/numberBox";
import Counter from "@ui/counter";
import { get_proficiency } from "utilities";
import _ from "lodash";
import { useTheme, css } from "@emotion/react";
import { Row, Sections } from "@ui/layouts";
import Create from "@components/catalog/powers/create";
import Power from "@components/catalog/powers/power";
import Parts from "@components/character/parts";

const Powers = () => {
  const { colors, classes } = useTheme();
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
    <Sections>
      <section>
        <Row>
          <Numberbox label="Powers Used">
            <Counter
              item={character}
              valuePath="burn"
              inc={inc}
              dec={dec}
            />
          </Numberbox>
          <Numberbox label="Bonus">
            {abilities.map((d) => (
              <div css={classes.elements.number}>
                +{character[d] + get_proficiency(character)}
              </div>
            ))}
          </Numberbox>
          <Numberbox label="Base DC">
            <div css={classes.elements.number}>{10 + character.burn}</div>
          </Numberbox>
        </Row>
      </section>

      <section
        css={css`
          position: relative;
          > button {
            position: absolute;
            top: 0;
            right: 0;
          }
        `}>
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
    </Sections>
  );
};

export default Powers;

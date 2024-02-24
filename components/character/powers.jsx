import { useCharacter } from "@contexts/character";
import Ability, { Effect } from "./ability";
import Favs from "./favorites";
import Numberbox from "@ui/numberBox";
import Counter from "@ui/counter";
import { get_proficiency } from "utilities";
import Collapsible from "@ui/collapsible";
import _ from "lodash";
import { useTheme, css } from "@emotion/react";
import Tabs from "@ui/tabs";
import { Row } from "@ui/layouts";

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
    <>
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

      <section>
        <Favs />
      </section>
      <section>
        <Tabs
          names={["Effects", "Ranges", "Durations"]}
          def="Effects">
          <div>
            {character.effects.map((c) => (
              <Effect
                data={c}
                withHeader={false}
              />
            ))}
          </div>
          <div>
            {character.ranges.map((c) => (
              <Ability
                data={c}
                table="ranges"
              />
            ))}
          </div>
          <div>
            {character.durations.map((c) => (
              <Ability
                data={c}
                table="durations"
              />
            ))}
          </div>
        </Tabs>
      </section>
    </>
  );
};

export default Powers;

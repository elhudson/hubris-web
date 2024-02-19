import { useCharacter } from "@contexts/character";
import Ability, { Effect } from "./ability";
import Option from "@components/options/option";
import Favs from "./favorites";
import Counter from "@ui/counter";
import { css } from "@emotion/css";
import { get_proficiency } from "utilities";
import Collapsible from "@ui/collapsible";
import _ from "lodash";
import { useTheme } from "@emotion/react";

const Powers = () => {
  const { colors } = useTheme();
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
    )
  ];
  return (
    <div
      className={css`
        margin: 5px;
        > div {
          margin: 5px;
        }
      `}>
      <div
        className={css`
          display: grid;
          grid-template-columns: repeat(3, 33%);
          > div {
            margin: 10px;
          }
        `}>
        <div>
          <h4>Powers Used</h4>
          <Counter
            item={character}
            valuePath="burn"
            inc={inc}
            dec={dec}
          />
        </div>
        <div>
          <h4>Bonus</h4>
          {abilities.map((d) => (
            <div className="number">
              +{character[d] + get_proficiency(character)}
            </div>
          ))}
        </div>
        <div>
          <h4>Base DC</h4>
          <div className="number">{10 + character.burn}</div>
        </div>
      </div>

      <div>
        <Favs />
      </div>
      <div
        className={css`
          border: 1px solid ${colors.accent};
          padding: 5px;
          display: grid;
          grid-template-columns: repeat(3, 33%);
          > div > div > div {
            margin-bottom: 10px;
          }
          button>div>button[role="checkbox"] {
            display: none;
          }
        `}>
        <div>
          <h3>Effects</h3>
          <div>
            {character.effects.map((c) => (
              <Collapsible
                preview={
""
                }>
                <Effect
                  data={c}
                  withHeader={false}
                />
              </Collapsible>
            ))}
          </div>
        </div>
        <div>
          <h3>Ranges</h3>
          <div>
          {character.ranges.map((c) => (
              <Collapsible
                preview={
                  ""
                }>
                <Ability
                  data={c}
                  table="ranges"
                  withHeader={false}
                />
              </Collapsible>
            ))}
            </div>
        </div>
        <div>
          <h3>Durations</h3>
          <div>
          {character.durations.map((c) => (
              <Collapsible
                preview={
                  ""
                }>
                <Ability
                  data={c}
                  table="durations"
                  withHeader={false}
                />
              </Collapsible>
            ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Powers;

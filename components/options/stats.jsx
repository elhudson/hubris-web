import { useCharacter } from "@contexts/character";
import Counter from "@ui/counter";
import { useAsync } from "react-async-hook";
import _ from "lodash";
import { useTheme } from "@emotion/react";
import { css } from "@emotion/css";
import { useState } from "react";
import { boost } from "utilities";

export const cost = (score) => {
  return score == -2
    ? 0
    : score == -1
    ? 1
    : score == 0
    ? 2
    : score == 1
    ? 3
    : score == 2
    ? 5
    : score == 3
    ? 8
    : 12;
};

const getCost = ({ code, character }) => {
  const bonus = boost(character, code);
  const current = bonus ? character[code] - 1 : character[code];
  const refund = cost(current);
  const next = cost(current + 1);
  const diff = next - refund;
  return diff;
};

const getPointsSpent = ({ char }) => {
  var spent = 0;
  ["str", "dex", "con", "int", "wis", "cha"].forEach((item) => {
    spent += getCost({ code: item, character: char });
  });
  return spent;
};

export default () => {
  const [points, setPoints] = useState(28);
  const { colors } = useTheme();
  const { character, update } = useCharacter();
  const abilities = useAsync(
    async () =>
      await fetch("/data/rules?table=attributes&relations=true").then((j) =>
        j.json()
      )
  ).result;
  const inc = (code) => {
    update((draft) => {
      if (_.isUndefined(draft[code])) {
        draft[code] = boost(draft, code) ? -1 : -2;
      }
      const bonus = boost(draft, code);
      const max = bonus ? 5 : 4;
      const price = getCost({ code: code, character: draft });
      if (draft[code] + 1 <= max && points - price >= 0) {
        draft[code] += 1;
        setPoints(points - price);
      }
    });
  };
  const dec = (code) => {
    update((draft) => {
      if (_.isUndefined(draft[code])) {
        draft[code] = boost(draft, code) ? -1 : -2;
      }
      const bonus = boost(draft, code);
      const min = bonus ? -1 : -2;
      const price = getCost({ code: code, character: draft });
      if (draft[code] - 1 >= min && points + price <= 28) {
        draft[code] -= 1;
        setPoints(points + price);
      }
    });
  };

  return (
    <>
      <div className="number">{points} / 28</div>
      {abilities && (
        <div
          className={css`
            display: grid;
            grid-gap: 10px;
            grid-template-areas:
              "str dex con"
              "int wis cha";
          `}>
          {abilities.map((a) => (
            <div
              className={css`
                h4 {
                  border: 1px solid ${colors.accent};
                  border-bottom: none;
                  text-align: center;
                }
              `}>
              <h4>{a.title}</h4>
              <Counter
                item={character}
                valuePath={a.code}
                prefill={
                  !_.isUndefined(character.backgrounds) &&
                  character.backgrounds
                    .map((c) => c.attributes.code)
                    .includes(a.code)
                    ? -1
                    : -2
                }
                inc={() => inc(a.code)}
                dec={() => dec(a.code)}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

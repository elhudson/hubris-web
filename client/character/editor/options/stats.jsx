import { Counter, Loading } from "@interface/ui";
import { boost, getCost, getPointsSpent } from "utilities";
import { css, useTheme } from "@emotion/react";

import _ from "lodash";
import { useCharacter } from "contexts";

export default () => {
  const { colors, classes } = useTheme();
  const { character, update } = useCharacter();
  const abilities = async () =>
    await fetch("/data/rules?table=attributes&relations=true").then((j) =>
      j.json()
    );
  const inc = (code) => {
    update((draft) => {
      if (_.isUndefined(draft[code])) {
        draft[code] = boost(draft, code) ? -1 : -2;
      }
      const bonus = boost(draft, code);
      const max = bonus ? 5 : 4;
      const price = getCost({ code: code, character: draft });
      if (
        draft[code] + 1 <= max &&
        getPointsSpent({ char: character }) + price <= 28
      ) {
        draft[code] += 1;
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
      if (
        draft[code] - 1 >= min &&
        getPointsSpent({ char: character }) - price >= 0
      ) {
        draft[code] -= 1;
      }
    });
  };
  return (
    <>
      <div css={classes.elements.number}>
        {getPointsSpent({ char: character })} / 28
      </div>
      <Loading
        getter={abilities}
        render={(abilities) => (
          <div
            css={css`
              display: grid;
              grid-gap: 10px;
              grid-template-areas:
                "str dex con"
                "int wis cha";
            `}
          >
            {abilities.map((a) => (
              <div
                css={css`
                  h4 {
                    border: 1px solid ${colors.accent};
                    border-bottom: none;
                    text-align: center;
                  }
                `}
              >
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
      />
    </>
  );
};

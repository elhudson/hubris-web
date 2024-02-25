import { useImmer } from "use-immer";
import _ from "lodash";
import { Effects, Ranges, Durations } from "./selections";
import { useAsync } from "react-async-hook";
import { get_power_cost } from "utilities";
import { css, useTheme } from "@emotion/react";

export default () => {
  const { colors, classes } = useTheme();
  const [power, update] = useImmer({
    effects: [],
    ranges: [],
    durations: [],
  });
  const options = useAsync(async () => {
    const effects = await fetch(
      `/data/rules?table=effects&relations=true`
    ).then((e) => e.json());
    const ranges = await fetch(`/data/rules?table=ranges&relations=true`).then(
      (e) => e.json()
    );
    const durations = await fetch(
      `/data/rules?table=durations&relations=true`
    ).then((e) => e.json());
    return { effects, durations, ranges };
  }).result;
  const treeable = (meta) => {
    return (
      _.intersectionBy(
        meta.trees.map((t) => t.id),
        power.effects.map((e) => e.trees.id)
      ).length > 0
    );
  };
  const addOption = (table) => {
    return (e) => {
      update((draft) => {
        if (table == "effects") {
          draft[table] = e.map((f) =>
            _.find(options[table], (a) => a.id == f.value)
          );
        } else {
          draft[table] = e
            .filter((f) =>
              treeable(_.find(options[table], (a) => a.id == f.value))
            )
            .map((f) => _.find(options[table], (a) => a.id == f.value));
        }
      });
    };
  };
  return (
    <>
      {options && (
        <main
          css={css`
            ${classes.layout.center};
            border: 1px solid ${colors.accent};
            padding: 5px;
            display: flex;
            width: fit-content;
            gap: 10px;
          `}>
          <section
            css={css`
              width: fit-content;
            `}>
            <div
              css={css`
                label {
                  display: none;
                }
                display: flex;
                gap: 10px;
              `}>
              <Effects
                power={power}
                options={options}
                add={addOption}
              />
              x
              <Ranges
                power={power}
                options={options}
                add={addOption}
              />
              x
              <Durations
                power={power}
                options={options}
                add={addOption}
              />
            </div>
            <div
              css={css`
                margin-top: 5px;
                border-top: 1px solid ${colors.accent};
                text-align: center;
              `}>
              5
            </div>
          </section>
          <section>=</section>
          <section>
            <div>{get_power_cost(power)}</div>
          </section>
        </main>
      )}
    </>
  );
};

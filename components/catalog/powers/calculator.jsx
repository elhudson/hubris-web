import { useImmer } from "use-immer";
import _ from "lodash";
import { Effects, Ranges, Durations } from "./selections";
import Filters from "./filters";
import { get_power_cost } from "utilities";
import { css, useTheme } from "@emotion/react";
import Loading from "@ui/loading";
import { FaTimes, FaEquals } from "react-icons/fa";
import { usePower } from "@contexts/power";
import { useCharacter } from "@contexts/character";

export default ({ filters = true }) => {
  const { character } = useCharacter();
  var { power, update } = usePower();
  power == null &&
    ([power, update] = useImmer({
      effects: [],
      ranges: [],
      durations: [],
    }));
  const options = async () => {
    const effects =
      character?.effects ??
      (await fetch(`/data/rules?table=effects&relations=true`).then((e) =>
        e.json()
      ));
    const ranges =
      character?.ranges ??
      (await fetch(`/data/rules?table=ranges&relations=true`).then((e) =>
        e.json()
      ));
    const durations =
      character?.durations ??
      (await fetch(`/data/rules?table=durations&relations=true`).then((e) =>
        e.json()
      ));
    return { effects, durations, ranges };
  };
  const addOption = (options) => (table) => {
    return (e) => {
      update((draft) => {
        draft[table] = e.map((f) =>
          _.find(options[table], (a) => a.id == f.value)
        );
      });
    };
  };
  return (
    <Loading
      getter={options}
      render={(options) => (
        <Filters collapsible={filters}>
          <Equation>
            <Effects
              power={power}
              options={options}
              add={addOption(options)}
            />
            <Ranges
              power={power}
              options={options}
              add={addOption(options)}
            />
            <Durations
              power={power}
              options={options}
              add={addOption(options)}
            />
            {get_power_cost(power)}
          </Equation>
        </Filters>
      )}
    />
  );
};

const Equation = ({ children }) => {
  const { colors, classes } = useTheme();
  const [effects, ranges, durations, total] = children;
  return (
    <main
      css={css`
        position: relative;
        display: flex;
        align-items: center;
        gap: 10px;
        .operator {
          color: ${colors.accent};
        }
        .denominator,
        .result {
          ${classes.elements.number};
          border: unset;
        }
        [direction="left"] {
          flex-grow: 1;
          .numerator {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            border-bottom: 1px solid ${colors.accent};
            padding-bottom: 5px;
            width: 100%;
            justify-content: center;
          }
        }
      `}>
      <div direction="left">
        <div className="numerator">
          {effects}
          <span className="operator">
            <FaTimes />
          </span>
          {ranges}
          <span className="operator">
            <FaTimes />
          </span>
          {durations}
        </div>
        <div className="denominator">5</div>
      </div>
      <span className="operator">
        <FaEquals />
      </span>
      <div
        direction="right"
        className="result">
        {total}
      </div>
    </main>
  );
};

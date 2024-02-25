import { useCharacter } from "@contexts/character";
import { useUser } from "@contexts/user";
import ui from "interface";
import { useImmer } from "use-immer";
import _ from "lodash";
import { get_power_cost } from "utilities";
import { FaPlus } from "react-icons/fa6";
import { css, useTheme } from "@emotion/react";
import { usePower } from "@contexts/power";
import { forwardRef, useEffect } from "react";
import { useAsync } from "react-async-hook";
import { Effects, Ranges, Durations } from "./selections";

export default () => {
  const { classes } = useTheme();
  const { character } = useCharacter() ?? { character: null };
  const { power, update } = usePower();
  const options = useAsync(async () => {
    const effects =
      character?.effects ??
      (await fetch(`/data/rules?table=effects&relations=true`).then((e) => e.json()));
    const ranges =
      character?.ranges ??
      (await fetch(`/data/rules?table=ranges&relations=true`).then((e) => e.json()));
    const durations =
      character?.durations ??
      (await fetch(`/data/rules?table=durations&relations=true`).then((e) => e.json()));
    return { effects, durations, ranges };
  }).result;
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
  const treeable = (meta) => {
    return (
      _.intersectionBy(
        meta.trees.map((t) => t.id),
        power.effects.map((e) => e.trees.id)
      ).length > 0
    );
  };
  return (
    <main>
      <section>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={power.name}
            onChange={(e) =>
              update((draft) => {
                draft.name = e.target.value;
              })
            }
          />
        </div>
        <div>
          <label>Description</label>
          <ui.Notepad
            text={power.flavortext}
            onChange={(e) => {
              update((draft) => {
                draft.flavortext = e;
              });
            }}
          />
        </div>
        <div>
          <ui.Numberbox label="Power">
            <div css={classes.elements.number}>{get_power_cost(power)}</div>
          </ui.Numberbox>
        </div>
        {options && (
          <section>
            <Effects power={power} options={options} add={addOption}/>
            <Ranges power={power} options={options} add={addOption} />
            <Durations power={power} options={options} add={addOption} />
          </section>
        )}
      </section>
      <section>
        <ui.Notif
          func={async () => {
            await fetch(`/data/powers/save?character=${character.id}`, {
              method: "POST",
              body: JSON.stringify(power),
              headers: {
                "Content-Type": "application/json",
              },
            });
          }}
          btn={"Create"}
        />
      </section>
    </main>
  );
};

export const PowerOption = ({
  option,
  options,
  checked,
  disabled,
  onClick,
}) => {
  const all = _.flatten([options.ranges, options.durations, options.effects]);
  const item = _.find(all, (f) => f.id == option.value);
  const tooltip = Array.isArray(item.trees)
    ? item.trees[0].title
    : item.trees.title;
  return (
    <div
      css={css`
        position: relative;
        > button:last-child {
          position: absolute;
          right: 0;
          ::after {
            z-index: 1000;
          }
        }
      `}>
      <ui.Checkbox
        checked={checked}
        disabled={disabled}
        onChange={onClick}
      />
      {option.label}
      <ui.Tooltip
        preview={
          <ui.Switch
            src={
              <ui.Icon
                id={option.value}
                sz={15}
              />
            }
          />
        }>
        {tooltip}
      </ui.Tooltip>
    </div>
  );
};

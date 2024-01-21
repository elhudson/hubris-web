import { useCharacter } from "@contexts/character";
import { useUser } from "@contexts/user";
import ui from "interface";
import { useImmer } from "use-immer";
import { v4 } from "uuid";
import _ from "lodash";
import { css } from "@emotion/css";
import { get_power_cost } from "utilities";
import { FaPlus } from "react-icons/fa6";

export default () => {
  const { character } = useCharacter();
  const { username } = useUser();
  const [power, edit] = useImmer({
    id: v4(),
    name: `${username}'s Power`,
    description: "",
    effects: [],
    ranges: [],
    durations: []
  });
  const addOption = (table) => {
    return (e) => {
      edit((draft) => {
        if (table == "effects") {
          draft[table] = e.map((f) =>
            _.find(character[table], (a) => a.id == f.value)
          );
        } else {
          draft[table] = e
            .filter((f) =>
              treeable(_.find(character[table], (a) => a.id == f.value))
            )
            .map((f) => _.find(character[table], (a) => a.id == f.value));
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
    <ui.Dialog trigger={<FaPlus />}>
      <h2>Create Power</h2>
      <div
        className={css`
          display: grid;
          grid-template-areas:
            "name name description description"
            "cost cost description description"
            "cost cost description description"
            "effect effect effect effect"
            "range range duration duration";
        `}>
        <div style={{ gridArea: "name" }}>
          <label>Name</label>
          <input
            type="text"
            value={power.name}
            onChange={(e) =>
              edit((draft) => {
                draft.name = e.target.value;
              })
            }
          />
        </div>
        <div style={{ gridArea: "description" }}>
          <label>Description</label>
          <ui.Notepad
            text={power.description}
            onChange={(e) => {
              edit((draft) => {
                draft.description = e;
              });
            }}
          />
        </div>
        <div style={{ gridArea: "cost" }}>
          <label>Cost</label>
          <div>{get_power_cost(power)}</div>
        </div>
        <div style={{ gridArea: "effect" }}>
          <label>Effects</label>
          <ui.Multi
            items={character.effects}
            labelPath={"title"}
            valuePath={"id"}
            currents={power.effects}
            onChange={addOption("effects")}
            render={(props) => <PowerOption {...props} />}
          />
        </div>
        <div style={{ gridArea: "range" }}>
          <label>Range</label>
          <ui.Multi
            items={character.ranges}
            labelPath={"title"}
            valuePath={"id"}
            currents={power.ranges}
            onChange={addOption("ranges")}
            render={(props) => <PowerOption {...props} />}
          />
        </div>
        <div style={{ gridArea: "duration" }}>
          <label>Duration</label>
          <ui.Multi
            items={character.durations}
            labelPath={"title"}
            valuePath={"id"}
            currents={power.durations}
            onChange={addOption("durations")}
            render={(props) => <PowerOption {...props} />}
          />
        </div>
      </div>
      <div>
        <ui.Notif
          func={async () => {
            await fetch(`/data/powers/create?character=${character.id}`, {
              method: "POST",
              body: JSON.stringify(power),
              headers: {
                "Content-Type": "application/json"
              }
            });
          }}
          btn={"Create"}
        />
      </div>
    </ui.Dialog>
  );
};

export const PowerOption = ({ option, checked, disabled, onClick }) => {
  const { character } = useCharacter();
  const all = _.flatten([
    character.ranges,
    character.durations,
    character.effects
  ]);
  const item = _.find(all, (f) => f.id == option.value);
  const tooltip = Array.isArray(item.trees)
    ? item.trees[0].title
    : item.trees.title;
  return (
    <div
      className={css`
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

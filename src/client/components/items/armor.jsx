import { useCharacter } from "@contexts/character";
import { get_ac } from "utilities";
import { Radio } from "@ui/radio";
import _ from "lodash";
import { rename, ItemProperty } from "@components/items/ui";

const Armor = ({ item, editable = false, update = null }) => {
  const { character } = useCharacter();
  const handleRename = editable ? rename(update) : null;
  const handleClass = editable
    ? (e) => {
        update((draft) => {
          draft.class = e;
        });
      }
    : null;
  const armors = [
    { label: "None", value: "None" },
    { label: "Light", value: "Light" },
    { label: "Medium", value: "Medium" },
    { label: "Heavy", value: "Heavy" }
  ];
  const current = _.find(armors, (a) => a.value == item.class);
  return (
    <>
      <input
        type="text"
        id={item.id}
        value={item.name == undefined ? `${item.class} Armor` : item.name}
        onChange={handleRename}
      />
      <div>
        <ItemProperty title="AC">{get_ac(character, item)}</ItemProperty>
        <ItemProperty title="Class">
          <Radio
            data={armors}
            current={current}
            valuePath={"value"}
            labelPath={"label"}
            onChange={handleClass}
          />
        </ItemProperty>
      </div>
    </>
  );
};

export default Armor;

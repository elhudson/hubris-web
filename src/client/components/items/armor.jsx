import { useCharacter } from "@contexts/character";
import { get_ac } from "utilities";
import { Radio } from "@ui/radio";
import _ from "lodash";
import { rename, ItemProperty } from "@components/items/ui";
import { Base } from "@components/items/item";

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
    <Base
      name={item.name == undefined ? `${item.class} Armor` : item.name}
      id={item.id}
      handleRename={handleRename}>
      <ItemProperty title="Class">
        <Radio
          data={armors}
          current={current}
          valuePath={"value"}
          labelPath={"label"}
          onChange={handleClass}
        />
      </ItemProperty>
    </Base>
  );
};

export default Armor;

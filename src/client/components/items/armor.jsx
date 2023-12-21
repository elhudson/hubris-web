import { useCharacter } from "@contexts/character";
import { get_ac } from "utilities";
import Radio from "@ui/radio";
import _ from "lodash";
import { ItemProperty } from "@components/items/item";
import { Base } from "@components/items/item";

const Armor = ({ item, editable, update }) => {
  const classMatch = (draft, e) => {
    return e;
  };
  const handleClass=update("class", classMatch)
  const armors = [
    { label: "None", value: "None" },
    { label: "Light", value: "Light" },
    { label: "Medium", value: "Medium" },
    { label: "Heavy", value: "Heavy" }
  ];
  const current = _.find(armors, (a) => a.value == item.class);
  return (
    <>
      <ItemProperty title="Class">
        <Radio
          data={armors}
          current={current}
          valuePath={"value"}
          labelPath={"label"}
          onChange={handleClass}
        />
      </ItemProperty>
    </>
  );
};

export default Armor;

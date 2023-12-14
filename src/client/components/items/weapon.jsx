import { Radio } from "@ui/radio";
import { rename, ItemProperty } from "@components/items/ui";

const Weapon = ({ item, editable = false, update = null }) => {
  const handleRename = editable ? rename(update) : null;
  const handleWeight = editable
    ? (e) => {
        update((draft) => {
          draft.heavy = e == "Heavy";
        });
      }
    : null;
  const handleClass = editable
    ? (e) => {
        update((draft) => {
          draft.martial = e == "Martial";
        });
      }
    : null;
  return (
    <div>
      <input
        type="text"
        id={item.id}
        value={item.name}
        onChange={handleRename}
      />
      <div>
        <Class
          handler={handleClass}
          item={item}
        />
        <Weight
          handler={handleWeight}
          item={item}
        />
      </div>
    </div>
  );
};

const Class = ({ handler, item }) => {
  const data = [
    { label: "Martial", value: "Martial" },
    { label: "Simple", value: "Simple" }
  ];
  const current = item.martial ? data[0] : data[1];
  return (
    <ItemProperty title={"Class"}>
      <Radio
        data={data}
        current={current}
        valuePath={"value"}
        labelPath={"label"}
        onChange={handler}
      />
    </ItemProperty>
  );
};

const Weight = ({ handler, item }) => {
  const data = [
    {
      label: "Heavy",
      value: "Heavy"
    },
    {
      label: "Light",
      value: "Light"
    }
  ];
  const current = item.heavy ? data[0] : data[1];
  return (
    <ItemProperty title={"Weight"}>
      <Radio
        data={data}
        current={current}
        valuePath={"value"}
        labelPath={"label"}
        onChange={handler}
      />
    </ItemProperty>
  );
};

export default Weapon
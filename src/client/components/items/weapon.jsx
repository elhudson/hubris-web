import { Radio } from "@ui/radio";
import { ItemProperty } from "@components/items/item";
import _ from "lodash";
import { useAsync } from "react-async-hook";
import Tag from "@components/tag";

const Weapon = ({ item, editable, update }) => {
  const dmgs = useAsync(
    async () =>
      await fetch(
        "/data/rules?table=damage_types&relations"
      ).then((d) => d.json())
  );
  const weightMatch = (draft, e) => {
    return e == "Heavy";
  };
  const classMatch = (draft, e) => {
    return e == "Martial";
  };
  const abMatch = (draft, e) => {
    return e;
  };
  const tagMatch = (draft, e) => {
    return _.find(dmgs.result, (t) => t.id == e);
  };
  const handleWeight = update("heavy", weightMatch);
  const handleClass = update("martial", classMatch);
  const handleAbility = update("uses", abMatch);
  const handleDamage = update("damage_types", tagMatch);
  return (
    <>
      <Class
        handler={editable ? handleClass : null}
        item={item}
      />
      <Weight
        handler={editable ? handleWeight : null}
        item={item}
      />
      <Ability
        handler={editable ? handleAbility : null}
        item={item}
      />
      {dmgs.result && (
        <Damage
          item={item}
          opts={dmgs.result}
          handler={editable ? handleDamage : null}
        />
      )}
    </>
  );
};

const Damage = ({ opts, handler, item }) => {
  const ic = opts.map((item) => (
    <Tag
      id={item.tagsId}
      name={item.title}
    />
  ));
  var current =
    item.damage_types != null ? _.find(opts, (f) => f.id == item.damage_types.id) : opts[0];
  return (
    <ItemProperty title="Damage">
      <Radio
        data={opts}
        current={current}
        valuePath={"id"}
        icons={ic}
        onChange={handler}
      />
    </ItemProperty>
  );
};

const Ability = ({ handler, item }) => {
  const data = [
    { label: "Strength", value: "str" },
    { label: "Dexterity", value: "dex" }
  ];
  var current = _.find(data, (d) => d.value == item.uses);
  _.isUndefined(current) && (current = data[0]);
  return (
    <ItemProperty title={"Ability"}>
      <Radio
        data={data}
        current={current}
        valuePath="value"
        labelPath="label"
        onChange={handler}
      />
    </ItemProperty>
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

export default Weapon;

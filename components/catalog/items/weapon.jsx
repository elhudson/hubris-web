import Radio from "@ui/radio";
import Icon from "@ui/icon";
import { useItem } from "@contexts/item";
import _ from "lodash";
import { useAsync } from "react-async-hook";
import Metadata from "@ui/metadata";

export default () => {
  const { item, edit } = useItem();
  const { enabled } = edit;
  const dmgs = useAsync(
    async () =>
      await fetch("/data/rules?table=damage_types&relations").then((d) =>
        d.json()
      )
  ).result;
  return (
    <Metadata
      pairs={[
        [
          "Class",
          <Class
            handler={enabled ? edit.generator("martial", (e) => e=="Martial") : null}
            item={item}
          />
        ],
        [
          "Weight",
          <Weight
            handler={enabled ? edit.generator("heavy", (e) => e=="Heavy") : null}
            item={item}
          />
        ],
        [
          "Ability",
          <Ability
            handler={enabled ? edit.generator("uses", (e) => e) : null}
            item={item}
          />
        ],
        [
          "Damage",
          dmgs && (
            <Damage
              item={item}
              opts={dmgs}
              handler={
                enabled
                  ? edit.generator("damage_types", (e) => {
                      return _.find(dmgs, (t) => t.id == e);
                    })
                  : null
              }
            />
          )
        ]
      ]}
    />
  );
};

const Damage = ({ opts, handler, item }) => {
  var current =
    item.damage_types != null
      ? _.find(opts, (f) => f.id == item.damage_types.id)
      : opts[0];
  return (
    <Radio
      data={opts}
      current={current}
      valuePath={"id"}
      labelPath="title"
      getIcon={(dtype) => (
        <Icon
          sz={14}
          id={dtype.tagsId}
        />
      )}
      onChange={handler}
    />
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
    <Radio
      data={data}
      current={current}
      valuePath="value"
      labelPath="label"
      onChange={handler}
    />
  );
};

const Class = ({ handler, item }) => {
  const data = [
    { label: "Martial", value: "Martial" },
    { label: "Simple", value: "Simple" }
  ];
  const current = item.martial ? data[0] : data[1];
  return (
    <Radio
      data={data}
      current={current}
      valuePath={"value"}
      labelPath={"label"}
      onChange={handler}
    />
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
    <Radio
      data={data}
      current={current}
      valuePath={"value"}
      labelPath={"label"}
      onChange={handler}
    />
  );
};

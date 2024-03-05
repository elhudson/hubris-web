import { Icon, Loading, Metadata, Radio, Switch } from "@interface/ui";

import _ from "lodash";
import { useItem } from "contexts";

export default () => {
  const { item, edit } = useItem();
  const { enabled } = edit;
  const dmgs = async () =>
    await fetch("/data/rules?table=tags&relations").then((d) => d.json());
  return (
    <Metadata
      pairs={[
        [
          "Class",
          <Class
            handler={
              enabled ? edit.generator("martial", (e) => e == "Martial") : null
            }
            item={item}
          />,
        ],
        [
          "Weight",
          <Weight
            handler={
              enabled ? edit.generator("heavy", (e) => e == "Heavy") : null
            }
            item={item}
          />,
        ],
        [
          "Ability",
          <Ability
            handler={enabled ? edit.generator("uses", (e) => e) : null}
            item={item}
          />,
        ],
        [
          "Damage",
          <Loading
            getter={dmgs}
            render={(dmgs) => (
              <Damage
                item={item}
                opts={dmgs}
                handler={
                  enabled
                    ? edit.generator("tags", (e) => {
                        return e;
                      })
                    : null
                }
              />
            )}
          />,
        ],
      ]}
    />
  );
};

const Damage = ({ opts, handler, item }) => {
  return (
    <span>
      {opts.map((o) => (
        <Switch
          onChange={(e) => {
            if (e) {
              handler([...item.tags, _.find(opts, (opt) => opt.id == o.id)]);
            } else {
              handler(item.tags.filter((f) => f.id != o.id));
            }
          }}
          checked={item.tags?.map((t) => t.id).includes(o.id)}
          src={
            <Icon
              id={o.id}
              sz={14}
            />
          }
        />
      ))}
    </span>
  );
};

const Ability = ({ handler, item }) => {
  const data = [
    { label: "Strength", value: "str" },
    { label: "Dexterity", value: "dex" },
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
    { label: "Simple", value: "Simple" },
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
      value: "Heavy",
    },
    {
      label: "Light",
      value: "Light",
    },
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

import Radio from "@ui/radio";
import _ from "lodash";
import { css, useTheme } from "@emotion/react";
import Item from "@items/item";
import { useState } from "react";
import { GiBroadDagger } from "react-icons/gi";
import { GiHeartArmor } from "react-icons/gi";
import { GiFlatPlatform } from "react-icons/gi";

export default ({ items, type, update }) => {
  const [editable, setEditable] = useState(false);
  var equipped = _.find(items, (w) => w.equipped);
  _.isUndefined(equipped) && (equipped = items[0]);
  const equip = (e) => {
    update((draft) => {
      draft.inventory[type].forEach((item) => {
        item.equipped = false;
      });
      _.find(draft.inventory[type], (f) => f.id == e).equipped = true;
    });
  };
  const getIcon = (table) => {
    return table == "weapons" ? (
      <GiBroadDagger />
    ) : table == "armor" ? (
      <GiHeartArmor />
    ) : (
      <GiFlatPlatform />
    );
  };
  return (
    <>
      <button onClick={() => setEditable(!editable)}>
        {editable ? "Stop Editing" : "Edit"}
      </button>
      <div
        css={css`
          min-height: 1em;
        `}>
        {items.length > 0 && (
          <Radio
            css={css``}
            inline={false}
            current={equipped}
            valuePath={"id"}
            labelPath={"component"}
            getIcon={() => getIcon(type)}
            data={items}
            onChange={equip}>
            {items.map((c) => (
              <Item
                data={c}
                type={type}
                editable={editable}
              />
            ))}
          </Radio>
        )}
      </div>
    </>
  );
};

import { useCharacter } from "@contexts/character";
import Dialog from "@ui/dialog";
import Radio from "@ui/radio";
import _ from "lodash";
import { css } from "@emotion/css";
import { Item } from "@items";

const Add = ({ table }) => {
  var add;
  if (table == "weapons") {
    add = {
      name: "",
      martial: false,
      heavy: false
    };
  }
  if (table == "armor") {
    add = {
      name: "",
      class: "None"
    };
  }
  if (table == "items") {
    add = { name: "" };
  }
  return (
    <Dialog trigger={"+"}>
      <Item item={add} table={table} />
    </Dialog>
  );
};

const Inventory = () => {
  return (
    <div>
      <List title="Weapons" />
      <List title="Armor" />
      <List title="Items" />
    </div>
  );
};

const List = ({ title }) => {
  const { character, update } = useCharacter();
  var equipped = _.find(
    character.inventory[title.toLowerCase()],
    (w) => w.equipped
  );
  _.isUndefined(equipped) &&
    (equipped = character.inventory[title.toLowerCase()][0]);
  const equip = (e) => {
    update((draft) => {
      draft.inventory[title.toLowerCase()].forEach((item) => {
        item.equipped = false;
      });
      _.find(
        draft.inventory[title.toLowerCase()],
        (f) => f.id == e
      ).equipped = true;
    });
  };
  return (
    <>
      <div
        className={css`
          width: 100%;
          position: relative;
          [role="radiogroup"] {
            display: block !important;
          }
          > button {
            position: absolute;
            float: right;
            top: 0;
            right: 0;
          }
          h3 {
            margin: unset;
          }
        `}>
        <h3>{title}</h3>
        <Add table={title.toLowerCase()} />
      </div>
      {character.inventory[title.toLowerCase()].length > 0 && (
        <Radio
          current={equipped}
          valuePath={"id"}
          labelPath={"component"}
          data={character.inventory[title.toLowerCase()]}
          onChange={equip}>
          {character.inventory[title.toLowerCase()].map((c) => (
            <Item item={c} table={title.toLowerCase()} />
          ))}
        </Radio>
      )}
    </>
  );
};

export default Inventory;

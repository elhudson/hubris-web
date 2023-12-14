import { useCharacter } from "@contexts/character";
import { Dialog } from "@ui/dialog";
import { useImmer } from "use-immer";
import { Radio } from "@ui/radio";
import _ from "lodash";
import { v4 } from "uuid";
import { css } from "@emotion/css";
import { Armor, Weapon, Item } from "@items";

const Add = ({ table }) => {
  const { character, update } = useCharacter();
  var add, Elem;
  if (table == "weapons") {
    add = {
      name: "",
      martial: false,
      heavy: false
    };
    Elem = Weapon;
  }
  if (table == "armor") {
    add = {
      name: "",
      class: "None"
    };
    Elem = Armor;
  }
  if (table == "items") {
    add = { name: "" };
    Elem = Item;
  }
  const [item, setItem] = useImmer(add);
  return (
    <Dialog trigger={"+"}>
      <Elem
        editable={true}
        item={item}
        update={setItem}
      />
      <button
        onClick={() => {
          update(async () => {
            await fetch(
              `/data/inventory/add?character=${character.id}&table=${table}&method=create`,
              {
                method: "POST",
                body: JSON.stringify({
                  ...item,
                  id: v4()
                }),
                headers: {
                  "Content-Type": "application/json"
                }
              }
            );
          });
        }}>
        Add
      </button>
    </Dialog>
  );
};

const Inventory = () => {
  return (
    <>
      <h3>Inventory</h3>
      <div>
        <List title="Weapons" />
        <List title="Armor" />
        <List title="Items" />
      </div>
    </>
  );
};

const List = ({ title }) => {
  const map = {
    armor: Armor,
    weapons: Weapon,
    items: Item
  };
  const Component = map[title.toLowerCase()];
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
          >button {
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
            <Component item={c} />
          ))}
        </Radio>
      )}
    </>
  );
};

export default Inventory;

import { css } from "@emotion/css";
import { useState } from "react";
import { IoTrash } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { IoIosSave } from "react-icons/io";
import { useImmer } from "use-immer";
import _ from "lodash";
import { v4 } from "uuid";

import { useContext, createContext } from "react";
import { useCharacter } from "@contexts/character";
import { Armor, Weapon } from "@items";
import Switch from "@ui/switch";

export const itemContext = createContext(null);

const Item = ({ item, table }) => {
  return (
    <itemContext.Provider
      value={{
        data: item,
        table: table
      }}>
      <Base />
    </itemContext.Provider>
  );
};

export default Item;

export const Add = ({ item }) => {
  const { character, update } = useCharacter();
  const { table } = useContext(itemContext);
  return (
    <button
      onClick={async () => {
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
        update((draft) => {
          draft.inventory[table].push(item);
        });
      }}>
      Add
    </button>
  );
};

export const Base = () => {
  const { data, table } = useContext(itemContext);
  const [item, editItem] = useImmer(data);
  const owned = !_.isUndefined(item.id);
  const [editable, setEditable] = useState(!owned);
  const { update } = useCharacter();
  const toggleEdit = () => {
    setEditable(!editable);
  };
  const handleUpdate = (path, match) => {
    const upd = (e) => {
      editItem((draft) => {
        _.set(draft, path, match(draft, e));
      });
      owned &&
        update((draft) => {
          const i = _.find(draft.inventory[table], (d) => d.id == item.id);
          _.set(i, path, match(i, e));
        });
    };
    return upd;
  };
  const nameMatch = (draft, e) => {
    return e.target.value;
  };
  const handleRename = handleUpdate("name", nameMatch);
  return (
    <div
      className={css`
        button[data-active="true"] {
          background-color: rgba(0, 0, 0, 0);
        }
      `}>
      <div className="inline">
        <input
          type="text"
          value={item.name}
          onChange={editable ? handleRename : null}
        />
        {owned && (
          <ItemButtons
            table={table}
            item={item}
            editable={editable}
            toggleEdit={toggleEdit}
          />
        )}
      </div>
      <div
        className={css`
          [role="radiogroup"] {
            display: flex;
          }
        `}>
        {table == "weapons" && (
          <Weapon
            item={item}
            update={handleUpdate}
            editable={editable}
          />
        )}
        {table == "armor" && (
          <Armor
            item={item}
            update={handleUpdate}
            editable={editable}
          />
        )}
      </div>
      <p>{item.description}</p>
      {!owned && <Add item={item} />}
    </div>
  );
};

export const ItemButtons = ({ table, editable, toggleEdit, item }) => {
  const onDelete = async () => {
    await fetch(`/data/inventory/drop?table=${table}`, {
      method: "POST",
      body: JSON.stringify(item),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const { update } = useCharacter();
    update((draft) => {
      _.remove(draft.inventory[table], (i) => i.id == item.id);
    });
  };
  return (
    <div>
      <Switch
        checked={editable}
        onChange={toggleEdit}
        src={<FaRegEdit />}
      />
      <Switch
        checked={false}
        onChange={onDelete}
        src={<IoTrash />}
      />
    </div>
  );
};

export const ItemProperty = ({ title, children }) => {
  return (
    <div
      className={
        "offset " +
        css`
          display: flex;
        `
      }>
      <h6>{title}</h6>
      <div>{children}</div>
    </div>
  );
};

import { useState } from "react";
import { useImmer } from "use-immer";
import _ from "lodash";
import { useCharacter } from "@contexts/character";
import Armor from "@items/armor";
import Weapon from "@items/weapon";
import Actions from "@items/actions";
import { itemContext } from "@contexts/item";
import { css, useTheme } from "@emotion/react";
import Save from "@items/save";
import Action from "@components/action";

export default ({ data, type, editable }) => {
  const { classes } = useTheme();
  const isDraft = _.isUndefined(data.id);
  const [item, editItem] = useImmer(data);
  const { update } = useCharacter();
  const makeUpdater = (path, match = (e) => e.target.value) => {
    const upd = (e) => {
      const value = match(e);
      editItem((draft) => _.set(draft, path, value));
      update((draft) => {
        const i = _.findIndex(draft.inventory[type], (d) => d.id == item.id);
        _.set(draft.inventory[type][i], path, value);
      });
    };
    return upd;
  };
  return (
    <itemContext.Provider
      value={{
        edit: {
          enabled: editable || isDraft,
          generator: makeUpdater
        },
        type: type,
        item: item
      }}>
      <Actions>
        <div
          css={css`
            button[data-active="true"] {
              background-color: rgba(0, 0, 0, 0);
            }
          `}>
          <Action
            css={css`
              section {
                margin-left: -10px;
              }
            `}
            title={
              <h4 css={classes.layout.inline}>
                <input
                  type="text"
                  disabled={!(editable || isDraft)}
                  value={item.name}
                  onChange={editable || isDraft ? makeUpdater("name") : null}
                />
              </h4>
            }>
            <section
              className={css`
                [role="radiogroup"] {
                  display: flex;
                }
              `}>
              {type == "weapons" && <Weapon />}
              {type == "armor" && <Armor />}
            </section>
            <section>{item.description}</section>
          </Action>
        </div>
      </Actions>
      {isDraft && <Save />}
    </itemContext.Provider>
  );
};

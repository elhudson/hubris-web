import { Armor, Menu, Save, Weapon } from "@client/item";
import { css, useTheme } from "@emotion/react";
import { itemContext, useCharacter } from "contexts";

import { Action } from "@interface/components";
import _ from "lodash";
import { useImmer } from "use-immer";

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
          generator: makeUpdater,
        },
        type: type,
        item: item,
      }}
    >
      <Menu>
        <div
          css={css`
            button[data-active="true"] {
              background-color: rgba(0, 0, 0, 0);
            }
          `}
        >
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
            }
          >
            <section
              className={css`
                [role="radiogroup"] {
                  display: flex;
                }
              `}
            >
              {type == "weapons" && <Weapon />}
              {type == "armor" && <Armor />}
            </section>
            <section>{item.description}</section>
          </Action>
        </div>
      </Menu>
      {isDraft && <Save />}
    </itemContext.Provider>
  );
};

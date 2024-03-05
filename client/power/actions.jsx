import { forwardRef, useRef } from "react";
import { useCharacter, usePower, useUser } from "contexts";

import { Alert } from "@interface/ui";
import { Maker } from "@client/power";
import _ from "lodash";

export default () => {
  const { character } = useCharacter() ?? { character: null };
  const edit = useCharacter()?.update;
  const user = useUser();
  const { power } = usePower();
  const editRef = useRef(null);
  const menu = [];
  if (character) {
    menu.push({
      label: "Remove",
      action: async () => {
        await fetch("/data/query?table=characters&method=update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            where: {
              id: character.id,
            },
            data: {
              powers: {
                disconnect: {
                  id: power.id,
                },
              },
            },
          }),
        }).then(
          (c) =>
            edit &&
            edit((draft) => {
              _.remove(draft.powers, (p) => p.id == power.id);
            })
        );
      },
    });
  }
  if (power.creatorId == user.user_id) {
    menu.push({
      label: "Delete",
      action: async () => {
        await fetch("/data/query?table=powers&method=delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            where: {
              id: power.id,
            },
          }),
        }).then(
          (c) =>
            edit &&
            edit((draft) => {
              _.remove(draft.powers, (p) => p.id == power.id);
            })
        );
      },
    });
    menu.push({
      label: "Edit",
      action: () => editRef.current.click(),
      render: <Edit ref={editRef} />,
    });
  }
  return menu;
};

const Edit = forwardRef(function Func(props = {}, ref) {
  const { power } = usePower();
  return (
    <Alert
      button={
        <button
          ref={ref}
          style={{ display: "none" }}
        />
      }
      confirm={async () =>
        await fetch("/data/powers/save", {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(power),
        })
      }
    >
      <Maker />
    </Alert>
  );
});

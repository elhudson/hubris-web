import { useCharacter } from "@contexts/character";
import { useUser } from "@contexts/user";
import { usePower } from "@contexts/power";
import Make from "@components/catalog/powers/maker";
import Dialog from "@ui/dialog";
import { useRef, forwardRef } from "react";
import _ from "lodash";

export default () => {
  const { character } = useCharacter() ?? { character: null };
  const edit=useCharacter()?.update
  const user = useUser();
  const { power, update } = usePower();
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
        }).then((c) =>
          edit && edit((draft) => {
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
        }).then((c) =>
          edit && edit((draft) => {
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
  return (
    <Dialog
      trigger={
        <button
          ref={ref}
          style={{ display: "none" }}
        />
      }>
      <Make />
    </Dialog>
  );
});

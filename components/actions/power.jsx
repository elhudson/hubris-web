import { useCharacter } from "@contexts/character";
import { useUser } from "@contexts/user";
import { useTheme } from "@emotion/react";
import { usePower } from "@contexts/power";
import Make from "@components/catalog/powers/maker";
import Dialog from "@ui/dialog";
import { useRef, createRef, forwardRef } from "react";

export default () => {
  const { character } = useCharacter();
  const user = useUser();
  const { power, update } = usePower();
  const { colors } = useTheme();
  const { classes } = useTheme();
  const editRef = useRef(null);
  const menu = [
    {
      label: "Remove",
      action: async () => {
        await fetch("/data/query?table=characters&method=update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            where: {
              id: character.id
            },
            data: {
              powers: {
                disconnect: {
                  id: power.id
                }
              }
            }
          })
        });
      }
    }
  ];
  if (power.creatorId == user.user_id) {
    menu.push({
      label: "Delete",
      action: async () => {
        await fetch("/data/query?table=powers&method=delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            where: {
              id: power.id
            }
          })
        });
      }
    });
    menu.push({
      label: "Edit",
      action: () => editRef.current.click(),
      render: <Edit ref={editRef} />
    });
  }
  return menu;
};

const Edit = forwardRef(function Func(props={}, ref) {
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

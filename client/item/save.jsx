import { useCharacter, useItem } from "contexts";

import { Notif } from "@interface/ui";
import { v4 } from "uuid";

export default () => {
  const { character, update } = useCharacter();
  const { item, type } = useItem();
  return (
    <Notif
      btn="Save"
      func={async () => {
        await fetch(
          `/data/inventory/add?character=${character.id}&table=${type}&method=create`,
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
        )
          .then((res) => res.json())
          .then((item) =>
            update((draft) => {
              draft.inventory[type].push(item);
            })
          );
        return "Item added to inventory.";
      }}
    />
  );
};

import { useCharacter, useItem } from "contexts";

import _ from "lodash";

export default () => {
  const { item, type } = useItem();
  const { update } = useCharacter();
  return [
    {
      label: "Remove Item from Inventory",
      action: async () => {
        await fetch(`/data/inventory/drop?table=${type}`, {
          method: "POST",
          body: JSON.stringify(item),
          headers: {
            "Content-Type": "application/json"
          }
        });
        update((draft) => {
          _.remove(draft.inventory[type], (i) => i.id == item.id);
        });
      }
    }
  ];
};

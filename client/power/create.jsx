import { powerContext, useCharacter, useUser } from "@contexts/power";

import { Alert } from "@interface/ui";
import { FaPlus } from "react-icons/fa6";
import { Maker } from "@client/power";
import { useImmer } from "use-immer";
import { v4 } from "uuid";

export default () => {
  const user = useUser();
  const { character } = useCharacter() ?? { character: null };
  const edit = useCharacter()?.update;
  const [power, update] = useImmer({
    id: v4(),
    name: `${user.username}'s Power`,
    flavortext: "",
    effects: [],
    ranges: [],
    durations: [],
    characters: character ? [character] : [],
    creator: {
      id: user.user_id,
    },
  });
  return (
    <Alert
      button={
        <button>
          <FaPlus />
        </button>
      }
      confirm={async () => {
        await fetch(`/data/powers/save`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(power),
        }).then(
          (c) =>
            edit &&
            edit((draft) => {
              draft.powers.push(power);
            })
        );
      }}
    >
      <powerContext.Provider value={{ power: power, update: update }}>
        <Maker />
      </powerContext.Provider>
    </Alert>
  );
};

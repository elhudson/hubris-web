import Dialog from "@ui/dialog";
import Maker from "./maker";
import { v4 } from "uuid";
import { useUser } from "@contexts/user";
import { useCharacter } from "@contexts/character";
import { useImmer } from "use-immer";
import { powerContext } from "@contexts/power";
import { useRef } from "react";
import { FaPlus } from "react-icons/fa6";
import Alert from "@ui/alert";

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
      }}>
      <powerContext.Provider value={{ power: power, update: update }}>
        <Maker />
      </powerContext.Provider>
    </Alert>
  );
};

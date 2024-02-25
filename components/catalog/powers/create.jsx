import Dialog from "@ui/dialog";
import Maker from "./maker";
import { v4 } from "uuid";
import { useUser } from "@contexts/user";

import { useImmer } from "use-immer";
import { powerContext } from "@contexts/power";

import { FaPlus } from "react-icons/fa6";

export default () => {
  const { username } = useUser();
  const [power, update] = useImmer({
    id: v4(),
    name: `${username}'s Power`,
    flavortext: "",
    effects: [],
    ranges: [],
    durations: [],
  });
  return (
    <Dialog
      trigger={
        <button>
          <FaPlus />
        </button>
      }>
      <powerContext.Provider value={{ power: power, update: update }}>
        <Maker />
      </powerContext.Provider>
    </Dialog>
  );
};

import { useCharacter } from "@contexts/character";
import { get_ac } from "utilities";
import _ from "lodash";

export default () => {
  const { character } = useCharacter();
  const armor = _.find(character.inventory.armor, (f) => f.equipped);
  const ac = get_ac(character, armor);
  return (
    <div>
      <h4>AC</h4>
      <div className="bordered number">{ac}</div>
    </div>
  );
};

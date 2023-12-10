import { useContext } from "react";
import { characterContext } from "../../user";
import { get_max_hp } from "utilities";

const Health = () => {
  const { character } = useContext(characterContext);
  return (
    <>
      <h3>Health</h3>
      <div>
        <h4>HP</h4>
        <div>
          <b>Current:</b> {character.health.hp}
        </div>
        <div>
          <b>Max:</b> {get_max_hp(character)}
        </div>
      </div>
      <div>
        <h4>HD</h4>
        {character.HD.map((h) => (
          <div>
            
          </div>
        ))}
      </div>
    </>
  );
};

export default Health;

import { useCharacter } from "@contexts/character";

const Inventory = () => {
  const { character } = useCharacter();
  return (
    <>
      <h3>Inventory</h3>
      <div>
        <div>
          <h4>Weapons</h4>
          <div>
            {character.inventory.weapons.map((w) => (
              <Weapon wpn={w} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const Weapon = (wpn) => {
  return (
    <>
      <h6>{wpn.name}</h6>
      <div>
        <div>
          <b>Class:</b> {wpn.martial ? "Martial" : "Simple"}
        </div>
        <div>
          <b>Weight:</b> {wpn.heavy ? "Heavy" : "Light"}
        </div>
      </div>
    </>
  );
};

export default Inventory;

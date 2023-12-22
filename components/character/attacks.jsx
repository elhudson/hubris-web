import { useCharacter } from "@contexts/character";
import { WeaponAttack, FeatureAttack } from "./attack";

export default () => {
  const { character } = useCharacter();
  return (
    <div>
      <h4>Attacks</h4>
      <div>
        {character.inventory.weapons.map((w) => (
          <WeaponAttack using={w} />
        ))}
        {character.class_features
          .filter((c) => c.damage_types.length > 0)
          .map((c) => (
            <FeatureAttack using={c} />
          ))}
      </div>
    </div>
  );
};

import { useCharacter } from "@contexts/character";
import { WeaponAttack, FeatureAttack } from "./attack";
import { css, useTheme } from "@emotion/react";
export default () => {
  const { character } = useCharacter();
  const {classes}=useTheme()
  return (
    <div>
      <h3
        css={classes.elements.subhead}>
        Attacks
      </h3>
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

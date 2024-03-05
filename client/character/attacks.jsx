import { FeatureAttack, WeaponAttack } from "./attack";
import { css, useTheme } from "@emotion/react";

import { useCharacter } from "contexts";

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
          .filter((c) => c.tags?.length > 0)
          .map((c) => (
            <FeatureAttack using={c} />
          ))}
      </div>
    </div>
  );
};

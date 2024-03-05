import { useCharacter, usePower } from "contexts";

import { Tag } from "@interface/components";
import _ from "lodash";
import { css } from "@emotion/react";

export default () => {
  const { power } = usePower();
  const { character } = useCharacter();
  const tags = _.intersectionBy(
    _.flatten(character.classes.map((f) => f.tags)),
    _.flatten(power.effects.map((t) => t.tags)),
    "id"
  );
  return (
    <div
      css={css`
        margin-left: 5px;
        svg {
          height: 15px;
          width: 15px;
        }
      `}>
      {tags.map((t) => (
        <Tag {...t} />
      ))}
    </div>
  );
};

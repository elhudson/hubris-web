import { css, useTheme } from "@emotion/react";

import { BiTargetLock } from "react-icons/bi";
import { IoHourglassOutline } from "react-icons/io5";
import { Tooltip } from "@interface/ui";
import _ from "lodash";
import { useCharacter } from "contexts";

export default ({ effect }) => {
  return (
    <div
      css={css`
        display: flex;
        flex-wrap:wrap;
        .metadata {
          white-space:nowrap;
          overflow:scroll;
        }
        > div {
          display: flex;
          margin: 5px;
          overflow:scroll;
        }
      `}>
      <Ranges effect={effect} />
      <Durations effect={effect} />
    </div>
  );
};

const Ranges = ({ effect }) => {
  const { character } = useCharacter();
  const ranges = getEffectMetadata(effect, character, "ranges");
  return (
    <div>
      <BiTargetLock size={20} />
      <div className="metadata">
        {ranges.map((r) => (
          <Item data={r} />
        ))}
      </div>
    </div>
  );
};

const Durations = ({ effect }) => {
  const { character } = useCharacter();
  const durations = getEffectMetadata(effect, character, "durations");
  return (
    <div>
      <IoHourglassOutline size={20} />
      <div className="metadata">
        {durations.map((r) => (
          <Item data={r} />
        ))}
      </div>
    </div>
  );
};

const Item = ({ data }) => {
  const { colors } = useTheme();
  return (
    <Tooltip
      preview={
        <div
          className={css`
            border: 1px solid ${colors.text};
            width: fit-content;
            padding: 1px 3px;
            margin: 0px 3px;
            border-radius: 5px;
          `}>
          {data.title}
        </div>
      }>
      <div>{data.description}</div>
    </Tooltip>
  );
};

function getEffectMetadata(effect, character, table) {
  return character[table].filter(
    (f) => _.intersectionBy(f.trees, [effect.trees], "id").length > 0
  );
}

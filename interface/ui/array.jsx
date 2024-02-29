import Tooltip from "@ui/tooltip";
import Icon from "@ui/icon";
import { css } from "@emotion/react";

export default ({ data }) => {
  return (
    <div className="icons" 
    css={css`
      button {
        height: 20px;
        width: 30px;
      }
    `}>
      {data.map((d) => (
        <Tooltip preview={<Icon id={d.id} />}>{d.name}</Tooltip>
      ))}
    </div>
  );
};

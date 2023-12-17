import _ from "lodash";
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";
export default ({ item, valuePath, labelPath, inc, dec, max = null }) => {
  const { colors } = useTheme();
  return (
    <div
      className={css`
        border: 1px solid ${colors.text};
        font-size: 20px;
        text-align:center;
      `}>
      <div>
        {_.get(item, valuePath)} / {max}
      </div>
      <Toggles
        inc={inc}
        dec={dec}
      />
    </div>
  );
};

export const Toggles = ({ inc, dec }) => {
  const { colors } = useTheme();
  return (
    <div
      className={css`
        width: 100%;
        button {
          width: 50%;
          text-align: center;
          border: unset;
          border-top: 1px solid ${colors.text};
          &:first-child {
            border-right: 1px solid ${colors.text};
          }
        }
      `}>
      <button onClick={inc}>+</button>
      <button onClick={dec}>-</button>
    </div>
  );
};

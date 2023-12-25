import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";

export default ({ inc, dec }) => {
  const { colors } = useTheme();
  return (
    <div
      className={css`
        width: 100%;
        height:20px;
        position:relative;
        button {
          position:absolute;
          bottom:0;
          width: 50%;
          border: unset;
          border-top: 1px solid ${colors.text};
          &:first-child {
            left:0;
            border-right: 1px solid ${colors.text};
          }
        }
      `}>
      <button onClick={inc}>+</button>
      <button onClick={dec}>-</button>
    </div>
  );
};

import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";

export default ({ inc, dec }) => {
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

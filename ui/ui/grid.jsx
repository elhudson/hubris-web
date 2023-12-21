import { useTheme } from "@emotion/react";
import { css } from "@emotion/css";

export default ({ children }) => {
  const { colors } = useTheme();
  return (
    <div
      className={css`
        display: grid;
        grid-template-columns: repeat(4, 20%);
        grid-gap: 10px;
      `}>
      {children.map((c) => (
        <div
          className={
            "button " +
            css`
              position: relative;
              height: 100px;
              width: 100%;
              border: 1px solid ${colors.text};
            `
          }>
          {c}
        </div>
      ))}
    </div>
  );
};

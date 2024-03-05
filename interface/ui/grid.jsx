import { css, useTheme } from "@emotion/react";

export default ({ children }) => {
  const { colors, classes } = useTheme();
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: repeat(4, 20%);
        grid-gap: 10px;
      `}>
      {children.map((c) => (
        <div
          css={css`
            ${classes.elements.button};
            position: relative;
            height: 100px;
            width: 100%;
            border: 1px solid ${colors.text};
          `}>
          {c}
        </div>
      ))}
    </div>
  );
};

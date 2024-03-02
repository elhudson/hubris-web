import Calculator from "@components/catalog/powers/calculator";
import { css, useTheme } from "@emotion/react";

export default () => {
  const { classes, colors } = useTheme();
  return (
    <main
      css={css`
        ${classes.layout.center};
        > * {
          border: 1px solid ${colors.accent};
          padding: 5px;
          margin-bottom: 10px;
        }
      `}>
      <Calculator filters={false}/>
    </main>
  );
};

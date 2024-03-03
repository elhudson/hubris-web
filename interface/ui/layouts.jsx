import { css, useTheme } from "@emotion/react";

export const Row = ({children, ...props}) => {
  return (
    <div
      css={css`
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        gap: 10px;
        > * {
          flex-grow: 1;
        }
      `}
      {...props}>
      {children}
    </div>
  );
};

export const Sections = ({children, ...props}) => {
  const { classes } = useTheme();
  return (
    <main
      css={css`
        > section {
          margin-bottom: 20px;
          > h3 {
            ${classes.elements.subhead};
          }
        }
        > section:last-child {
          margin-bottom: unset;
        }
      `}
      {...props}>
      {children}
    </main>
  );
};

export default {};

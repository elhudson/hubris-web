import { useTheme, css } from "@emotion/react";

export default (props) => {
  const { title, children } = props;
  const { classes, colors } = useTheme();
  return (
    <details
      open
      css={css`
        width: 100%;
        summary {
          display: inline-flex;
          width: 100%;
          border: 1px solid ${colors.accent};
          svg {
            padding-right: 5px;
          }
          &::marker {
            content: "";
          }
        }
        section {
          margin: 3px;
          margin-left: 10px;
          &:first-of-type {
            padding-left: 10px;
            border-left: 1px solid ${colors.accent};
          }
        }
        h4 {
          ${classes.decorations.interactable};
          width: 100%;
        }
      `}
      {...props}>
      <summary>{title}</summary>
      {children}
    </details>
  );
};

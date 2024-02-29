import { useTheme, css } from "@emotion/react";

export default ({ label, children }) => {
  const { colors } = useTheme();
  return (
    <div
      css={css`
        label {
          text-transform: uppercase;
          font-weight: bold;
          text-align: center;
          padding: unset;
          margin: unset;
          display: block;
          border: 1px solid ${colors.accent};
          border-bottom: none;
        }
      `}>
      <label>{label}</label>
      <div>{children}</div>
    </div>
  );
};

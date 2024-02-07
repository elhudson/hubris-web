import { useTheme, css } from "@emotion/react";
import _ from "lodash";

export default (params) => {
  const { pairs } = params;
  const { colors, classes } = useTheme();
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: min-content auto;
        label {
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        input {
          padding-bottom: 2px;
        }
      `}
      {...params}>
      {pairs.map((pair) => (
        <>
          <label>{pair[0]}</label>
          <span>{pair[1]}</span>
        </>
      ))}
    </div>
  );
};

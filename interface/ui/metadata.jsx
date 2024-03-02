import { useTheme, css } from "@emotion/react";
import _ from "lodash";

export default ({ pairs, ...props }) => {
  const { colors, classes } = useTheme();
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: min-content auto;
        grid-row-gap: 2px;
        label {
          text-decoration: underline;
          text-underline-offset: 2px;
          white-space: nowrap;
        }
        span {
          > *:not(*:last-child):not(button):after {
            content: ", ";
          }
        }
        
      `}
      {...props}>
      {_.without(pairs, null, undefined).map((pair) => (
        <>
          <label>{pair[0]}</label>
          <span>{pair[1]}</span>
        </>
      ))}
    </div>
  );
};

import * as select from "@radix-ui/react-select";
import _ from "lodash";
import { useTheme } from "@emotion/react";
import { css } from "@emotion/css";
import Color from "color";

export default ({ current, options, displayPath, valuePath, onChange }) => {
  const chosen = _.get(current, valuePath);
  const disp = _.get(current, displayPath);
  const { colors, palette, classes } = useTheme();
  return (
    <select.Root
      onValueChange={onChange}
      value={chosen}>
      <select.Trigger>{disp}</select.Trigger>
      <select.Content
        position="popper"
        className={css`
          ${classes.decorations.shadowed}
          position: relative;
          max-height: 50ch;
          font-size: 12px;
          background-color: ${colors.background};
          z-index: 2;
          border: 1px solid ${colors.accent};
          color: ${colors.text};
          div[role="option"] {
            padding: 2px;
            margin: 3px;
            background-color: ${palette.accent1};
            border: 1px solid ${colors.accent};
            &[data-state="checked"] {
              background-color: ${palette.accent2};
            }
            &:hover {
              cursor: pointer;
              font-style: italic;
              background-color: ${palette.accent2};
              text-decoration: underline;
              text-underline-offset: 2px;
            }
          }
        `}>
        <select.ScrollUpButton>^</select.ScrollUpButton>
        <select.Viewport>
          {options.map((d) => (
            <select.Item value={_.get(d, valuePath)}>
              {_.get(d, displayPath)}
            </select.Item>
          ))}
        </select.Viewport>
      </select.Content>
    </select.Root>
  );
};

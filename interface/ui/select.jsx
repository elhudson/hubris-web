import * as select from "@radix-ui/react-select";
import _ from "lodash";
import { useTheme } from "@emotion/react";
import { css } from "@emotion/css";
import Color from "color";

export default ({ current, options, displayPath, valuePath, onChange }) => {
  const chosen = _.get(current, valuePath);
  const disp = _.get(current, displayPath);
  const { colors, palette } = useTheme();
  return (
    <select.Root
      onValueChange={onChange}
      value={chosen}>
      <select.Trigger>{disp}</select.Trigger>
      <select.Content
        position="popper"
        className={css`
          position: relative;
          max-height:50ch;
          font-size: 14px;
          background-color: ${colors.background};
          z-index: 2;
          border: 1px solid ${colors.accent};
          color: ${colors.text};
          div[role="option"] {
            padding: 2px;
            margin:3px;
            background-color: ${Color(colors.accent).fade(0.6).toString()};
            border: 1px solid ${colors.accent};
            &:hover {
              font-style: italic;
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

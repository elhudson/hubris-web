import * as select from "@radix-ui/react-select";
import _ from "lodash";
import { useTheme } from "@emotion/react";
import { css } from "@emotion/css";

export default ({ current, options, displayPath, valuePath, onChange }) => {
  const chosen = _.get(current, valuePath);
  const disp = _.get(current, displayPath);
  const { colors } = useTheme();
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
          background-color: ${colors.background};
          z-index: 2;
          border: 1px solid ${colors.text};
          color: ${colors.text};
          div[role="option"] {
            padding: 2px;
            margin:3px;
            border: 1px dashed ${colors.text};
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

import * as select from "@radix-ui/react-select";
import _ from "lodash";
import { useTheme, css } from "@emotion/react";

export default ({ current, options, displayPath, valuePath, onChange }) => {
  const chosen = _.get(current, valuePath);
  const disp = _.get(current, displayPath);
  const { classes } = useTheme();
  return (
    <select.Root
      onValueChange={onChange}
      value={chosen}>
      <select.Trigger>{disp}</select.Trigger>
      <select.Content
        position="popper"
        css={css`
          ${classes.elements.listbox};
          div[role="option"] {
            ${classes.elements.list_item};
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

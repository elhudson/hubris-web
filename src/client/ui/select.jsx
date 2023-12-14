import * as select from "@radix-ui/react-select";
import _ from "lodash";
import { useTheme } from "@emotion/react";
import { css } from "@emotion/css";

export const Select = ({
  current,
  options,
  displayPath,
  valuePath,
  onChange
}) => {
  const chosen = _.get(current, valuePath);
  const disp = _.get(current, displayPath);
  const { colors } = useTheme();
  return (
    <select.Root
      onValueChange={onChange}
      value={chosen}>
      <select.Trigger>{disp}</select.Trigger>
      <select.Portal>
        <select.Content position="popper">
          <select.Viewport
            className={css`
              background-color: ${colors.background};
              border: 1px solid ${colors.text};
            `}>
            {options.map((d) => (
              <select.Item value={_.get(d, valuePath)}>
                {_.get(d, displayPath)}
              </select.Item>
            ))}
          </select.Viewport>
        </select.Content>
      </select.Portal>
    </select.Root>
  );
};

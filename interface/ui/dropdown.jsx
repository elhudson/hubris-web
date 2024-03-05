import * as dropdown from "@radix-ui/react-dropdown-menu";

import { css, useTheme } from "@emotion/react";

import { BsThreeDots } from "react-icons/bs";

export default ({ children, trigger = <BsThreeDots />, dir="right"}) => {
  const { colors } = useTheme();
  return (
    <dropdown.Root>
      <dropdown.Trigger>{trigger}</dropdown.Trigger>
      <dropdown.Portal>
        <dropdown.Content
          side={dir}
          css={css`
            &[data-side="left"],
            &[data-side="right"] {
              display: flex;
              background-color: ${colors.background};
            }
          `}>
          {children.map((i) => (
            <dropdown.Item>{i}</dropdown.Item>
          ))}
        </dropdown.Content>
      </dropdown.Portal>
    </dropdown.Root>
  );
};

import * as dropdown from "@radix-ui/react-dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";

export default ({ children, trigger = <BsThreeDots />, dir="right"}) => {
  const { colors } = useTheme();
  return (
    <dropdown.Root>
      <dropdown.Trigger>{trigger}</dropdown.Trigger>
      <dropdown.Portal>
        <dropdown.Content
          side={dir}
          className={css`
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

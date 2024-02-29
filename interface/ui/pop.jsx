import * as popover from "@radix-ui/react-popover";
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";

export default ({ trigger, children }) => {
  const { colors } = useTheme();
  return (
    <popover.Root>
      <popover.Trigger asChild>
        <button>{trigger}</button>
      </popover.Trigger>
      <popover.Content
        className={"shadow "+css`
          z-index: 3;
          background-color: ${colors.background};
          padding: 5px;
          border: 1px solid ${colors.accent};
        `}>
        {children}
      </popover.Content>
    </popover.Root>
  );
};

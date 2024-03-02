import * as popover from "@radix-ui/react-popover";
import { useTheme, css } from "@emotion/react";

export default ({ trigger, children }) => {
  const { colors, classes } = useTheme();
  return (
    <popover.Root>
      <popover.Trigger asChild>
        <button>{trigger}</button>
      </popover.Trigger>
      <popover.Content
        css={css`
          ${classes.decorations.shadowed};
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

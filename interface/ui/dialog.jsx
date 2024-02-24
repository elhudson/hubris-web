import * as dialog from "@radix-ui/react-dialog";
import { useTheme } from "@emotion/react";
export default ({ trigger, children }) => {
  const { classes } = useTheme();
  return (
    <dialog.Root>
      <dialog.Trigger asChild>{trigger}</dialog.Trigger>
      <dialog.Portal>
        <dialog.Overlay css={classes.layout.overlay} />
        <dialog.Content
          css={[classes.decorations.shadowed, classes.elements.popup]}>
          {children}
        </dialog.Content>
      </dialog.Portal>
    </dialog.Root>
  );
};

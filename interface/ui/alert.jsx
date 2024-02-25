import * as alert from "@radix-ui/react-alert-dialog";
import { useState } from "react";

import { css, useTheme } from "@emotion/react";
export default ({ button, confirm, children, open = null, setOpen = null }) => {
  const {classes}=useTheme()
  open == null && ([open, setOpen] = useState(false));
  return (
    <alert.Root
      open={open}
      onOpenChange={setOpen}>
      <alert.Trigger asChild>{button}</alert.Trigger>
      <alert.Portal>
        <alert.Overlay css={classes.layout.overlay} />
        <alert.Content css={classes.elements.popup}>
          {children}
          <alert.Cancel>Never mind</alert.Cancel>
          <alert.Action
            css={classes.qualities.danger}
            onClick={() => {
              confirm();
              setOpen(false);
            }}>
            Confirm
          </alert.Action>
        </alert.Content>
      </alert.Portal>
    </alert.Root>
  );
};

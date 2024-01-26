import * as alert from "@radix-ui/react-alert-dialog";
import { useState } from "react";
export default ({ button, confirm, children, open = null, setOpen = null }) => {
  open == null && ([open, setOpen] = useState(false));
  return (
    <alert.Root
      open={open}
      onOpenChange={setOpen}>
      <alert.Trigger>{button}</alert.Trigger>
      <alert.Portal>
        <alert.Overlay className="overlay" />
        <alert.Content className="popup">
          {children}
          <alert.Cancel className="cancel">Never mind</alert.Cancel>
          <alert.Action
            className="danger"
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

import * as dialog from "@radix-ui/react-dialog";
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";

export const Dialog = ({ trigger, children }) => {
  const {colors}=useTheme()
  return (
    <dialog.Root>
      <dialog.Trigger>{trigger}</dialog.Trigger>
      <dialog.Portal>
        <dialog.Overlay
          className={css`
            background-color: rgba(0, 0, 0, 0.5);
            position: fixed;
            inset: 0;
            animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
          `}
        />
        <dialog.Content
          className={"shadow "+css`
            border: 1px solid ${colors.text};
            position: fixed;
            background-color: ${colors.background};
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90vw;
            max-width: 450px;
            max-height: 85vh;
            padding: 25px;
            animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
          `}>
          {children}
        </dialog.Content>
      </dialog.Portal>
    </dialog.Root>
  );
};

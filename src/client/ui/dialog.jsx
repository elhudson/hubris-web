import * as dialog from "@radix-ui/react-dialog";
import { css } from "@emotion/css";

export const Dialog = ({ trigger, children }) => {
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
          className={css`
            background-color: white;
            border-radius: 6px;
            box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
              hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
            position: fixed;
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

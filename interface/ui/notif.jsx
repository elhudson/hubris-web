import * as notif from "@radix-ui/react-toast";
import { useState, useRef, useEffect } from "react";
import { useTheme, css } from "@emotion/react";

const Notification = ({ func, btn, msg = null, ...props }) => {
  const { colors, classes } = useTheme();
  const [message, setMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const timerRef = useRef(0);
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);
  const handleClick = async () => {
    const post = msg ? msg : await func();
    setMessage(post);
    setOpen(true);
    timerRef.current = window.setTimeout(() => {
      setOpen(false);
    }, 3000);
  };
  return (
    <notif.Provider {...props}>
      <button
        onClick={handleClick}
        {...props}>
        {btn}
      </button>
      <notif.Root
        open={open}
        onOpenChange={setOpen}>
        <notif.Description>{message}</notif.Description>
      </notif.Root>
      {open && (
        <notif.Viewport
          css={css`
            ${classes.decorations.shadowed}
            position: fixed;
            top: 0;
            right: 10px;
            z-index: 8;
            background-color: ${colors.background};
            list-style: none;
            padding: 5px;
            width: fit-content;
            border: 1px solid ${colors.accent};
          `}
        />
      )}
    </notif.Provider>
  );
};

export default Notification;

import * as notif from "@radix-ui/react-toast";
import { useState, useRef, useEffect } from "react";
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";

const Notification = ({ func, btn, msg = null }) => {
  const { colors } = useTheme();
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
    }, 1000);
  };
  return (
    <notif.Provider>
      <button onClick={handleClick}>{btn}</button>
      <notif.Root
        className={css`
          box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
            hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
        `}
        open={open}
        onOpenChange={setOpen}>
        <notif.Description>{message}</notif.Description>
      </notif.Root>
      <notif.Viewport
        className={
          "shadow " +
          css`
            position: fixed;
            top: 0;
            right: 10px;
            z-index: 8;
            background-color: ${colors.background};
            list-style: none;
            ${open &&
            css`
              border: 1px solid ${colors.text};
            `}
          `
        }
      />
    </notif.Provider>
  );
};

export default Notification;

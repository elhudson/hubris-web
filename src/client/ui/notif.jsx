import * as notif from "@radix-ui/react-toast";
import { useState, useRef, useEffect } from "react";

const Notification = ({ func, msg }) => {
  const [message, setMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const timerRef = useRef(0);
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);
  const handlePost = async () => {
    const post = await func().then((result) => result.text());
    setMessage(post);
    setOpen(false);
    timerRef.current = window.setTimeout(() => {
      setOpen(true);
    }, 100);
  };
  return (
    <notif.Provider>
      <button onClick={handlePost}>{msg}</button>
      <notif.Root
        open={open}
        onOpenChange={setOpen}>
        <notif.Description>{message}</notif.Description>
      </notif.Root>
      <notif.Viewport />
    </notif.Provider>
  );
};

export default Notification
import ReactQuill from "react-quill";
import { useEffect, useRef } from "react";
import "react-quill/dist/quill.snow.css";
import { css } from "@emotion/css";
export default ({ text, onChange = null }) => {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.editor.root.setAttribute("spellcheck", false);
  }, []);
  return (
    <ReactQuill
      theme={null}
      className={css`
        p {
          max-width: 99%;
        }
      `}
      ref={ref}
      value={text}
      onChange={onChange}
      readOnly={onChange == null}
    />
  );
};

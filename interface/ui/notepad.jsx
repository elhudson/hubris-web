import "react-quill/dist/quill.snow.css";

import { useEffect, useRef } from "react";

import ReactQuill from "react-quill";
import { css } from "@emotion/react";

export default ({ text, onChange = null }) => {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.editor.root.setAttribute("spellcheck", false);
  }, []);
  return (
    <ReactQuill
      theme={null}
      css={css`
        p {
          font-family: "Iosevka";
        }
      `}
      ref={ref}
      value={text}
      onChange={onChange}
      readOnly={onChange == null}
    />
  );
};

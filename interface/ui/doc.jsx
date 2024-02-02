import { css } from "@emotion/css";
import ReactQuill from "react-quill";
import { useEffect, useRef } from "react";
import "react-quill/dist/quill.snow.css";
import { useTheme } from "@emotion/react";

export default ({ text, onChange }) => {
  const ref = useRef(null);
  const { colors, palette } = useTheme();
  useEffect(() => {
    ref.current?.editor.root.setAttribute("spellcheck", false);
  }, []);
  return (
    <ReactQuill
      theme={"snow"}
      className={css`
        height: 80vh;
        .ql-toolbar,
        .ql-container {
          border: 1px solid ${colors.accent};
        }
        .ql-formats button {
          border: 1px solid ${colors.accent};
          &:hover {
            background-color: ${palette.accent1};
          }
          &.ql-active {
            background-color: ${colors.accent};
            .ql-stroke {
              stroke: ${colors.background};
            }
            .ql-fill {
              fill: ${colors.background};
            }
          }
        }
        p {
          max-width: 99%;
          font-family: 'Iosevka';
        }
      `}
      ref={ref}
      value={text}
      onChange={onChange}
      readOnly={onChange == null}
      modules={{
        toolbar: ["bold", "italic", "underline", "strike"]
      }}
    />
  );
};

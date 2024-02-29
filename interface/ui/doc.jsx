import ReactQuill, { Quill } from "react-quill";
import { useEffect, useRef } from "react";
import "react-quill/dist/quill.snow.css";
import { useTheme, css } from "@emotion/react";

var Font = Quill.import("attributors/class/font");
Font.whitelist = ["roboto", "aref ruqaa", "mirza"];
Quill.register(Font, true);

export default ({ text, onChange }) => {
  const ref = useRef(null);
  const { colors, palette } = useTheme();
  useEffect(() => {
    ref.current?.editor.root.setAttribute("spellcheck", false);
  }, []);
  return (
    <main
      css={css`
        #toolbar {
          display: ${onChange == null ? "none" : "block"};
        }
        .ql-toolbar,
        .ql-container {
          border: 1px solid ${colors.accent};
        }
      `}>
      <Toolbar />
      <ReactQuill
        theme={"snow"}
        css={css`
          .ql-font-mirza {
            font-family: "Mirza";
          }
          .ql-font-roboto {
            font-family: "Roboto";
          }
          .ql-editor {
            font-family: "Aref Ruqaa";
            font-size: 16px;
          }
          max-height: 80vh;
          p {
            max-width: 99%;
          }
        `}
        ref={ref}
        value={text}
        onChange={onChange}
        readOnly={onChange == null}
        modules={{
          toolbar: {
            container: "#toolbar",
          },
        }}
      />
    </main>
  );
};

const Toolbar = () => {
  const { colors, palette, classes } = useTheme();
  return (
    <div
      id="toolbar"
      css={css`
        margin-bottom: 10px;
        .ql-stroke {
          stroke: ${colors.text_accent};
        }
        .ql-fill {
          fill: ${colors.text_accent};
        }
        button,
        .ql-picker,
        .ql-picker-label {
          &:hover {
            background-color: ${palette.accent1};
            color: ${colors.accent} !important;
            .ql-stroke {
              stroke: ${colors.accent} !important;
            }
            .ql-fill {
              fill: ${colors.accent} !important;
            }
          }
          &.ql-active {
            background-color: ${colors.accent} !important;
            color: ${colors.background} !important;
            .ql-stroke {
              stroke: ${colors.background} !important;
            }
            .ql-fill {
              fill: ${colors.background} !important;
            }
          }
        }
        .ql-picker-options {
          background-color: ${colors.background};
          border: 1px solid ${colors.accent} !important;
          ${classes.decorations.shadowed};
        }
        .ql-picker.ql-expanded {
          .ql-picker-label {
            color: ${colors.text_accent};
            border: 1px solid ${colors.accent} !important;
            .ql-stroke {
              stroke: ${colors.accent} !important;
            }
          }
          .ql-picker-item {
            color: ${colors.text_accent};
            &:hover {
              color: ${colors.accent};
            }
          }
        }
        .ql-font {
          span[data-label="Aref Ruqaa"]::before {
            font-family: "Aref Ruqaa";
          }
          span[data-label="Mirza"]::before {
            font-family: "Mirza";
          }
          span[data-label="Roboto"]::before {
            font-family: "Roboto";
          }
        }
      `}>
      <button className="ql-bold"></button>
      <button className="ql-italic"></button>
      <select className="ql-color">
        <option value="red"></option>
        <option value="green"></option>
        <option value="blue"></option>
        <option value="orange"></option>
        <option value="violet"></option>
        <option value="#d0d1d2"></option>
        <option selected></option>
      </select>
      <select class="ql-font">
        <option selected>Aref Ruqaa</option>
        <option value="mirza">Mirza</option>
        <option value="roboto">Roboto</option>
      </select>
    </div>
  );
};

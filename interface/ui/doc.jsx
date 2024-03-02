import ReactQuill, { Quill } from "react-quill";
import { useEffect, useRef } from "react";
import "react-quill/dist/quill.snow.css";
import { useTheme, css } from "@emotion/react";
import _ from "lodash";
const fonts = {
  iosevka: "Iosevka Web",
  tangerine: "Tangerine",
  "aref-ruqaa": "Aref Ruqaa",
  roboto: "Roboto",
  "kode-mono": "Kode Mono"
};

const sizes = _.range(10, 31, 2).map((s) => `${s}px`);

var Font = Quill.import("attributors/class/font");
var Size = Quill.import("attributors/style/size");
Font.whitelist = Object.keys(fonts);
Size.whitelist = sizes;
Quill.register(Font, true);
Quill.register(Size, true);

export default ({
  text,
  onChange,
  options = {
    font: "iosevka",
    size: 14,
    update: null
  }
}) => {
  const ref = useRef(null);
  const { colors } = useTheme();
  useEffect(() => {
    ref.current?.editor.root.setAttribute("spellcheck", false);
  }, []);
  return (
    <main
      css={css`
        #toolbar {
          display: ${onChange == null ? "none" : "flex"};
          gap: 5px;
        }
        .ql-toolbar,
        .ql-container {
          border: 1px solid ${colors.accent};
        }
      `}>
      <Toolbar {...options} />
      <ReactQuill
        theme={"snow"}
        css={css`
          ${Object.entries(fonts).map(
            ([key, f]) => css`
              .ql-font-${key} {
                font-family: "${f}";
              }
            `
          )}
          .ql-editor {
            font-size: ${options.size}px;
            font-family: ${fonts[options.font]};
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
            container: "#toolbar"
          }
        }}
      />
    </main>
  );
};

const Fonts = ({ font, size, update = null }) => {
  return (
    <>
      <select
        onChange={update("font", font)}
        className="ql-font"
        css={css`
          ${Object.entries(fonts).map(
            ([key, f]) => css`
              span[data-label="${f}"]::before {
                font-family: "${f}";
              }
            `
          )}
        `}>
        {Object.entries(fonts).map(([key, f]) => (
          <option
            selected={key == font}
            value={key}>
            {f}
          </option>
        ))}
      </select>
      <select
        className="ql-size"
        onChange={update("size", size)}>
        {sizes.map((s) => (
          <option
            value={s}
            selected={s == `${size}px`}>
            {s}
          </option>
        ))}
      </select>
    </>
  );
};

const Toolbar = ({ font, size, update = null }) => {
  const { colors, palette, classes } = useTheme();
  const { red, orange, yellow, green, cyan, blue, purple } = colors;
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
        > button,
        > span.ql-picker {
          border: 1px solid ${colors.accent} !important;
        }
        .ql-picker {
          color: unset;
          color: ${colors.accent};
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
      `}>
      <button className="ql-bold"></button>
      <button className="ql-italic"></button>
      <select className="ql-color">
        <option value={red}></option>
        <option value={orange}></option>
        <option value={yellow}></option>
        <option value={green}></option>
        <option value={cyan}></option>
        <option value={blue}></option>
        <option value={purple}></option>
        <option selected></option>
      </select>
      <Fonts
        font={font}
        size={size}
        update={update}
      />
    </div>
  );
};

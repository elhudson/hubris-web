import { css, useTheme } from "@emotion/react";
import { fonts, sizes } from "./css";

import _ from "lodash";
import { useText } from "./styles";

export default () => {
  const { font, size, update } = useText();
  const { colors, palette, classes } = useTheme();
  const { red, orange, yellow, green, cyan, blue, purple } = colors;
  return (
    <div
      id="toolbar"
      css={css`
        display: ${update == null ? "none" : "flex"};
        gap: 5px;
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
      `}
    >
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
        `}
      >
        {Object.entries(fonts).map(([key, f]) => (
          <option
            selected={key == font}
            value={key}
          >
            {f}
          </option>
        ))}
      </select>
      <select
        className="ql-size"
        onChange={update("size", size)}
      >
        {sizes.map((s) => (
          <option
            value={s}
            selected={s == size}
          >
            {s}
          </option>
        ))}
      </select>
    </div>
  );
};

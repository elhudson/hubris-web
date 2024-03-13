import { textContext, useText } from "./styles";

import { Quill } from "react-quill";
import _ from "lodash";
import { css } from "@emotion/react";

export const fonts = {
  iosevka: "Iosevka Web",
  tangerine: "Tangerine",
  "aref-ruqaa": "Aref Ruqaa",
  roboto: "Roboto",
  "kode-mono": "Kode Mono",
};

export const sizes = _.range(10, 31, 2).map((s) => `${s}px`);

var Font = Quill.import("attributors/class/font");
var Size = Quill.import("attributors/style/size");
Font.whitelist = Object.keys(fonts);
Size.whitelist = sizes;
Quill.register(Font, true);
Quill.register(Size, true);

export default ({ children }) => {
  const { font, size } = useText();
  return (
    <span
      css={css`
        ${Object.entries(fonts).map(
          ([key, f]) => css`
            .ql-font-${key} {
              font-family: "${f}";
            }
          `
        )}
        .ql-editor {
          font-size: ${size}px;
          font-family: ${fonts[font]};
        }
      `}
    >
      {children}
    </span>
  );
};

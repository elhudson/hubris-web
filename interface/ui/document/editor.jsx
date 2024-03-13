import "react-quill/dist/quill.snow.css";

import { Css, Toolbar } from "@interface/doc";
import { css, useTheme } from "@emotion/react";
import { textContext, useText } from "./styles";
import { useEffect, useRef } from "react";

import ReactQuill from "react-quill";
import _ from "lodash";

export default ({
  text,
  onChange,
  options = {
    font: "iosevka",
    size: 14,
    update: null,
  },
}) => {
  const ref = useRef(null);
  const { colors } = useTheme();
  useEffect(() => {
    ref.current?.editor.root.setAttribute("spellcheck", false);
  }, []);
  return (
    <textContext.Provider
      value={{
        ...options,
        size: `${options.size}px`,
        color: colors.text,
      }}
    >
      <Css>
        <main
          css={css`
            .ql-toolbar,
            .ql-container {
              border: 1px solid ${colors.accent};
            }
          `}
        >
          <Toolbar {...options} />
          <ReactQuill
            theme={"snow"}
            css={css`
              max-height: 80vh;
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
      </Css>
    </textContext.Provider>
  );
};

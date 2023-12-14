import { Global, css, useTheme } from "@emotion/react";
import Color from "color";

const Style = () => {
  const { colors } = useTheme();
  return (
    <Global
      styles={css`
        :root {
          background-color: ${colors.background};
          color: ${colors.text};
          font-family: Iosevka Web;
        }
        button {
          background-color: ${Color(colors.accent).fade(0.8).hsl().toString()};
          border: 1px solid ${colors.text};
          font-family: Iosevka Web;
          &:hover {
            cursor: pointer;
            background-color: ${Color(colors.accent)
              .fade(0.6)
              .hsl()
              .toString()};
            text-decoration:underline;
            text-underline-offset:2px;
            font-style: italic;
          }
        }
        input {
          background-color: ${colors.background};
          border: unset;
          border-bottom: 1px solid ${colors.text};
        }
        textarea {
          background-color: ${colors.background};
          border: 1px solid ${colors.text};
        }
        input, textarea {
          font-family: Iosevka Web;
        }
        h1, h2, h3, h4, h5, h6 {
          margin:unset;
        }
        a {
          color: ${colors.accent};
        }
      `}
    />
  );
};

export default Style;

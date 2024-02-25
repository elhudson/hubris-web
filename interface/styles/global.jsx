import { Global, css, useTheme } from "@emotion/react";
import Color from "color";

const Style = () => {
  const { colors, classes } = useTheme();
  return (
    <Global
      styles={css`
        :root,
        #root {
          background-color: ${colors.background};
          color: ${colors.text};
          font-family: Iosevka Web;
          font-size: 14px;
        }

        #root {
          background-color: transparent;
        }
        table {
          width: 100%;
        }
        table,
        th,
        td {
          border: 1px solid ${colors.accent};
          padding: 3px;
          text-align: left;
        }
        th {
          background-color: ${Color(colors.accent).fade(0.8).hsl().toString()};
        }
        button {
          ${classes.elements.button};
        }
        input {
          background-color: transparent;
          color: ${colors.text};
          border: unset;
          border-bottom: 1px solid ${colors.accent};
          font-family: Iosevka Web;
          font-size: 14px;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          margin: unset;
        }
        a {
          ${classes.decorations.interactable};
        }
        label {
          padding-right: 10px;
        }
        h6 {
          font-size: 16px;
        }
        h2 {
          text-align: center;
          text-transform: uppercase;
          width: calc(100%-20px);
          padding-left: 10px;
          padding-right: 10px;
          border: 1px solid ${colors.accent};
          background-color: ${colors.background};
          margin-bottom: 5px;
        }
        h3 {
          text-decoration: underline;
          text-underline-offset: 2px;
        }
      `}
    />
  );
};

export default Style;

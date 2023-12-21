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
        [role="region"] {
          display:none;
        }
        button,
        .button {
          text-align: center;
          background-color: ${Color(colors.accent).fade(0.8).hsl().toString()};
          border: 1px solid ${colors.text};
          font-family: Iosevka Web;
          &:hover {
            cursor: pointer;
            background-color: ${Color(colors.accent)
              .fade(0.6)
              .hsl()
              .toString()};
            text-decoration: underline;
            text-underline-offset: 2px;
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
        input,
        textarea {
          font-family: Iosevka Web;
        }
        .inline {
          display: flex;
          >*:not(:last-child) {
            margin-right: 5px;
          }
          h4 {
            padding-right: 5px;
          }
          [role="radiogroup"] {
            display: flex;
          }

        }
        .number {
          font-size: 20px;
          text-align: center;
          border: 1px solid ${colors.text};
          padding: 3px;
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
          color: ${colors.accent};
        }
        .center {
          margin: 0;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        label {
          padding-right: 10px;
        }
        .separator {
          height: 1px;
          margin-top: 5px;
          margin-bottom: 5px;
          background-color: ${colors.accent};
        }
        [role="tabpanel"] {
          border: 1px solid ${colors.text};
          border-top: none;
          padding: 10px;
          > * {
            margin-bottom: 10px;
          }
        }
        .number {
          font-size: 20px;
          text-align: center;
        }
        .bordered {
          border: 1px solid ${colors.accent};
          padding: 5px;
        }
        .shadow {
          box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
            hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
        }
        .buttons {
          display: flex;
          > * {
            width: 100%;
            border-right: none;
            &[aria-selected="true"] {
              background-color: ${colors.background};
              border-bottom: none;
            }
            &:last-child {
              border-right: 1px solid ${colors.text};
            }
          }
        }
        h6 {
          font-size: 16px;
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

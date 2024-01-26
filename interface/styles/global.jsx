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
          font-size: 14px;
        }
        .pagetitle {
          text-align: center;
        }
        .abilities {
          display: flex;
          flex-wrap: wrap;
          > * {
            margin: 5px;
            width: fit-content;
          }
        }
        .dashed {
          border: 1px dashed ${colors.text};
          background-color: ${Color(colors.text).fade(0.95).toString()};
        }
        .disabled {
          opacity: 0.5;
        }
        .description {
          max-height: 10ch;
          min-height: 10ch;
          overflow: scroll;
          padding: 5px;
          margin: 5px;
        }
        .overlay {
          background-color: rgba(0, 0, 0, 0.5);
          position: fixed;
          inset: 0;
          animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 100;
        }
        .popup {
          z-index: 101;
          border: 1px solid ${colors.text};
          position: fixed;
          background-color: ${colors.background};
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90vw;
          max-width: 450px;
          max-height: 85vh;
          padding: 25px;
          animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
          > button:nth-last-child(2) {
            position: absolute;
            left: 25px;
          }
          > button:last-child {
            position: absolute;
            right: 25px;
          }
        }
        .danger {
          background-color: ${Color(colors.red).fade(0.6).hsl().toString()};
          color: ${Color(colors.red).darken(0.5).hsl().toString()};
          border: 1px solid ${Color(colors.red).darken(0.5).hsl().toString()};
          &:hover {
            background-color: ${Color(colors.red).fade(0.4).hsl().toString()};
          }
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
          font-family: Iosevka Web;
          font-size: 14px;
        }

        .inline {
          display: flex;
          > *:not(:last-child) {
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
        .owned {
          box-shadow: rgba(213,196,161, 0.5) 0px 3px 8px;
        }
        .bordered {
          border: 1px solid ${colors.accent};
          padding: 5px;
        }
        .shadow {
          box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
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

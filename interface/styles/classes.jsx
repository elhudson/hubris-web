import { css } from "@emotion/react";
import Color from "color";

export default ({ colors, palette }) => {
  return {
    decorations: {
      bordered: css`
        border: 1px solid ${colors.accent};
        padding: 5px;
      `,
      dashed: css`
        border: 1px dashed ${colors.text};
        background-color: ${Color(colors.text).fade(0.95).toString()};
      `,
      shadowed: css`
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      `,
      owned: css`
        box-shadow: rgba(213, 196, 161, 0.5) 0px 3px 8px;
      `,
      disabled: css`
        opacity: 50%;
      `,
      interactable: css`
        color: ${colors.text_accent};
        text-decoration: underline;
        text-underline-offset: 2px;
        &:hover {
          font-style: italic;
          cursor: pointer;
        }
      `
    },
    qualities: {
      danger: css`
        background-color: ${Color(colors.red).fade(0.6).hsl().toString()};
        color: ${Color(colors.red).darken(0.5).hsl().toString()};
        border: 1px solid ${Color(colors.red).darken(0.5).hsl().toString()};
        &:hover {
          background-color: ${Color(colors.red).fade(0.4).hsl().toString()};
        }
      `
    },
    elements: {
      subhead: css`
        text-decoration: unset;
        margin-bottom: 5px;
        width: 100%;
        border-bottom: 1px solid ${colors.accent};
      `,
      frame: css`
        border: 1px dashed ${colors.accent};
        max-width: fit-content;
        padding: 5px;
        background-color: ${Color(colors.accent).fade(0.7).toString()};
      `,
      number: css`
        font-size: 20px;
        text-align: center;
        border: 1px solid ${colors.accent};
        padding: 3px;
      `,
      button: css`
        text-align: center;
        background-color: ${Color(colors.accent).fade(0.8).hsl().toString()};
        border: 1px solid ${colors.accent};
        font-family: Iosevka Web;
        color: ${colors.text};
        &:not(:only-of-type(button)) {
          border-right: none;
          &:last-of-type(button) {
            border-right: 1px solid ${colors.accent};
          }
        }
        &:hover {
          cursor: pointer;
          background-color: ${Color(colors.accent).fade(0.6).hsl().toString()};
          text-decoration: underline;
          text-underline-offset: 2px;
          font-style: italic;
        }
      `,
      description: css`
        font-size: 12px;
        max-height: 10ch;
        min-height: 10ch;
        overflow: scroll;
        padding: 5px;
        margin: 5px;
      `,
      thumbnail: css`
        img {
          height: 250px;
          width: 500px;
          object-fit: cover;
          padding: 3px;
        }
        border: 1px solid ${colors.accent};
      `,
      selectbox: css`
        margin-top: 5px;
        border: 1px solid ${colors.accent};
        display: flex;
        label {
          padding: 0px 5px;
          text-transform: uppercase;
          font-weight: bold;
          border-right: 1px solid ${colors.accent};
        }
      `,
      popup: css`
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
      `
    },
    layout: {
      gallery: css`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        grid-gap: 10px;
      `,
      center: css`
        margin: 0;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      `,
      inline: css`
        display: inline-flex;
        gap: 5px;
      `,
      overlay: css`
        background-color: rgba(0, 0, 0, 0.5);
        position: fixed;
        inset: 0;
        animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
        z-index: 100;
      `,
      container: css`
        display: flex;
        flex-wrap: wrap;
        padding-bottom: 10px;
      `
    }
  };
};

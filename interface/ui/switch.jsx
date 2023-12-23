import SVG from "react-inlinesvg";
import * as witch from "@radix-ui/react-switch";
import { useTheme } from "@emotion/react";
import { css } from "@emotion/css";

export default ({ checked, onChange = null, src }) => {
  const { colors } = useTheme();
  return (
    <witch.Root
      onCheckedChange={onChange}
      checked={checked}
      className={css`
        aspect-ratio: 1/1;
        text-align: center;
        border-radius: 100%;
        border: 1px solid ${colors.text};
        position: relative;
        height: 100%;
        width: 100%;
        margin: unset;
        svg {
          all: unset;
          vertical-align:text-top;
        }
        path {
          fill: ${colors.text};
        }
        &[data-state="checked"] {
          background-color: ${colors.text};
          svg path {
            fill: ${colors.background};
          }
        }
        &:hover&[data-state="checked"] {
          background-color: ${colors.accent};
        }
      `}>
      <witch.Thumb asChild>{src}</witch.Thumb>
    </witch.Root>
  );
};

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
        border: 1px solid ${colors.accent};
        position: relative;
        margin: unset;
        padding: unset;
        svg {
          all: unset;
          vertical-align:text-top;
        }
        path {
          fill: ${colors.text};
        }
        &[data-state="checked"] {
          background-color: ${colors.accent};
          
        }
        &:hover&[data-state="checked"] {
          background-color: ${colors.accent};
        }
      `}>
      <witch.Thumb asChild>{src}</witch.Thumb>
    </witch.Root>
  );
};

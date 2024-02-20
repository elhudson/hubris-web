import * as witch from "@radix-ui/react-switch";
import { css, useTheme} from "@emotion/react";

export default ({ checked, onChange = null, src }) => {
  const { colors } = useTheme();
  return (
    <witch.Root
      onCheckedChange={onChange}
      checked={checked}
      css={css`
        text-align: center;
        border: 1px solid ${colors.accent};
        position: relative;
        margin: unset;
        padding: .5px;
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

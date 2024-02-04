import * as Checkbox from "@radix-ui/react-checkbox";
import { css, useTheme } from "@emotion/react";
import { RiCheckboxBlankLine, RiCloseLine } from "react-icons/ri";

export default ({
  checked,
  disabled = false,
  value = null,
  onChange = null
}) => {
  const { colors } = useTheme();
  return (
    <Checkbox.Root
      checked={checked}
      disabled={disabled}
      onCheckedChange={onChange}
      value={value}
      css={css`
        border: unset;
        background-color: rgba(0, 0, 0, 0);
        position: relative;
        padding: unset;
        margin:unset;
        height: 100%;
        svg {
          height: 100%;
          width: 100%;
          color: ${colors.accent};
        }
        span {
          position: absolute;
          right: 0;
        }
      `}>
      <RiCheckboxBlankLine />
      <Checkbox.Indicator>
        <RiCloseLine />
      </Checkbox.Indicator>
    </Checkbox.Root>
  );
};

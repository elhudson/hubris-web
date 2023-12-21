import * as Checkbox from "@radix-ui/react-checkbox";
import { css } from "@emotion/css";
import { FaRegRectangleXmark } from "react-icons/fa6";
import { RiRectangleLine } from "react-icons/ri";

export default ({ checked, disabled=false, value = null, onChange = null }) => (
  <Checkbox.Root
    checked={checked}
    disabled={disabled}
    onCheckedChange={onChange}
    value={value}
    className={css`
      border: unset;
      background-color: rgba(0, 0, 0, 0);
    `}>
    {!checked && <RiRectangleLine />}
    <Checkbox.Indicator>
      <FaRegRectangleXmark />
    </Checkbox.Indicator>
  </Checkbox.Root>
);

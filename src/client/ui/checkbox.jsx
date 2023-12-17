import * as Checkbox from "@radix-ui/react-checkbox";
import { css } from "@emotion/css";
import {FaRegRectangleXmark} from "react-icons/fa6";
import { RiRectangleLine } from "react-icons/ri";
export default ({ label, checked }) => (
  <Checkbox.Root
    checked={checked}
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

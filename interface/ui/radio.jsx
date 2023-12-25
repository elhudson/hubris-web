import * as radio from "@radix-ui/react-radio-group";
import _ from "lodash";
import { css } from "@emotion/css";
import { IoIosRadioButtonOff, IoIosRadioButtonOn } from "react-icons/io";
import SVG from "react-inlinesvg";
import { useTheme } from "@emotion/react";
import Tooltip from "./tooltip";
import Switch from "./switch"

export default (props) => {
  const {
    data,
    current,
    valuePath,
    labelPath,
    getIcon = null,
    onChange,
    children,
    inline
  } = props;
  return (
    <radio.Root
      className={css`
        display: ${inline ? "flex" : "block"};
        button {
          &:hover {
            background-color: unset;
          }
        }
        [role="radio"] {
          margin:2px;
        }
      `}
      value={_.get(current, valuePath)}
      onValueChange={onChange}>
      {data.map((d) =>
        getIcon == null ? (
          <RadioItem asChild
            {...props}
            item={d}
          />
        ) : (
          <RadioItem asChild
            {...props}
            item={d}
          />
        )
      )}
    </radio.Root>
  );
};

export const RadioItem = ({
  item,
  data,
  current,
  valuePath,
  labelPath,
  children,
  getIcon = null
}) => {
  const { colors } = useTheme();
  return (
    <div
      className={css`
        display: flex;
        button[role="radio"] {
          height:fit-content;
        }
        >button {
          padding:unset;
        }
        svg.toggle {
          height: 14px;
          width: 14px;
          padding: 2px;
          text-align: center;
          border-radius: 100%;
          border: 1px solid ${colors.text};
          &.active {
            background: ${colors.text};
            path {
              fill: ${colors.background};
            }
          }
        }
      `}>
      <radio.Item
        value={_.get(item, valuePath)}
        className={css`
          background-color: rgba(0, 0, 0, 0);
          border: unset;
        `}>
        {_.get(item, valuePath) != _.get(current, valuePath) &&
          (getIcon ? (
            <Tooltip preview={<Switch checked={false} src={getIcon(item)} />}>
              {_.get(item, labelPath)}
            </Tooltip>
          ) : (
            <IoIosRadioButtonOff />
          ))}
        <radio.Indicator>
          {getIcon ? (
            <Tooltip preview={<Switch checked={true} src={getIcon(item)} />}>
              {_.get(item, labelPath)}
            </Tooltip>
          ) : (
            <IoIosRadioButtonOn />
          )}
        </radio.Indicator>
      </radio.Item>
      {children ? (
        <div>
          {
            children[
              _.findIndex(
                data,
                (a) => _.get(a, valuePath) == _.get(item, valuePath)
              )
            ]
          }
        </div>
      ) : (
        getIcon == null && <div>{_.get(item, labelPath)}</div>
      )}
    </div>
  );
};

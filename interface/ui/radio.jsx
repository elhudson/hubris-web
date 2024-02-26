import * as radio from "@radix-ui/react-radio-group";
import _ from "lodash";
import { css, useTheme } from "@emotion/react";
import { IoIosRadioButtonOff, IoIosRadioButtonOn } from "react-icons/io";
import SVG from "react-inlinesvg";
import Tooltip from "./tooltip";
import Switch from "./switch";

export default (props) => {
  const {
    data,
    current,
    valuePath,
    labelPath,
    getIcon = null,
    onChange,
    children,
    inline = true
  } = props;
  const { colors, palette } = useTheme();
  return (
    <radio.Root
      css={css`
        display: ${inline ? "inline-flex" : "block"};
        gap: 2px;
        button {
          &:hover {
            background-color: ${palette.accent2};
          }
        }
      `}
      value={_.get(current, valuePath)}
      onValueChange={onChange}
      {...props}>
      {data.map((d) => (
        <RadioItem
          asChild
          {...props}
          item={d}
        />
      ))}
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
      css={css`
        display: flex;
        button[role="radio"] {
          height: fit-content;
          svg {
            text-align: center;
          }
          &[aria-checked="true"] {
            button {
              background-color: ${colors.text_accent};
              svg {
                color: ${colors.background};
                path {
                  fill: ${colors.background};
                }
              }
            }
          }
        }
        > button {
          padding: unset;
        }
      `}>
      <radio.Item
        value={_.get(item, valuePath)}
        css={css`
          background-color: rgba(0, 0, 0, 0);
          border: unset;
        `}>
        {_.get(item, valuePath) != _.get(current, valuePath) &&
          (getIcon ? (
            <Tooltip
              preview={
                <Switch
                  checked={false}
                  src={getIcon(item)}
                />
              }>
              {_.get(item, labelPath)}
            </Tooltip>
          ) : (
            <IoIosRadioButtonOff />
          ))}
        <radio.Indicator>
          {getIcon ? (
            <Tooltip
              preview={
                <Switch
                  checked={true}
                  src={getIcon(item)}
                />
              }>
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

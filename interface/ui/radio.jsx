import * as radio from "@radix-ui/react-radio-group";
import _ from "lodash";
import { css } from "@emotion/css";
import { IoIosRadioButtonOff, IoIosRadioButtonOn } from "react-icons/io";
import Indicator from "./indicator";

const Active = ({ icon }) => {
  return (
    <Indicator
      Component={icon}
      style={{ height: 15, width: 15, color: "#fff" }}
    />
  );
};

const Inactive = ({ icon }) => {
  return (
    <Indicator
      Component={icon}
      style={{ height: 15, width: 15, color: "#fff" }}
    />
  );
};

const findIcon = (icons, data, d) => {
  const index = _.indexOf(data, d);
  return icons[index];
};

export default (props) => {
  const {
    data,
    current,
    valuePath,
    labelPath,
    onChange,
    children,
    inline,
    icons = null
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
      `}
      value={_.get(current, valuePath)}
      onValueChange={onChange}>
      {data.map((d) =>
        icons==null ? (
          <RadioItem
            {...props}
            item={d}
            hasIcon={false}
          />
        ) : (
          <RadioItem
            {...props}
            item={d}
            hasIcon={true}
          />
        )
      )}
    </radio.Root>
  );
};

export const RadioItem = ({
  item,
  data,
  icons = null,
  current,
  valuePath,
  labelPath,
  hasIcon,
  children
}) => {
  return (
    <div
      className={css`
        display: flex;
      `}>
      <radio.Item
        value={_.get(item, valuePath)}
        className={css`
          background-color: rgba(0, 0, 0, 0);
          border: unset;
        `}>
        {_.get(item, valuePath) != _.get(current, valuePath) && 
           <IoIosRadioButtonOff />}
        <radio.Indicator>
          <IoIosRadioButtonOn />
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
        <div>{_.get(item, labelPath)}</div>
      )}
    </div>
  );
};

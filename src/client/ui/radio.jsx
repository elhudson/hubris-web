import * as radio from "@radix-ui/react-radio-group";
import _ from "lodash";
import { css } from "@emotion/css";
import { IoIosRadioButtonOff, IoIosRadioButtonOn } from "react-icons/io";

export const Radio = ({
  data,
  current,
  valuePath,
  labelPath,
  onChange = null,
  children = null,
  inline = false
}) => {
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
      {data.map((d) => (
        <div className={css`
          display: flex;
        `}>
          <radio.Item value={_.get(d, valuePath)} className={css`
            background-color: rgba(0,0,0,0.0);
            border:unset;
          `}>
            {_.get(d, valuePath) != _.get(current, valuePath) && (
              <IoIosRadioButtonOff />
            )}
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
                    (a) => _.get(a, valuePath) == _.get(d, valuePath)
                  )
                ]
              }
            </div>
          ) : (
            <div>{_.get(d, labelPath)}</div>
          )}
        </div>
      ))}
    </radio.Root>
  );
};

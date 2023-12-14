import * as radio from "@radix-ui/react-radio-group";
import _ from "lodash";
import { css } from "@emotion/css";

export const Radio = ({
  data,
  current,
  valuePath,
  labelPath,
  onChange = null,
  children = null
}) => {
  return (
    <radio.Root
      className={css`
        button {
          position: absolute;
          float: left;
        }
        >*:not(button) {
          margin-left: 30px;
        }
      `}
      value={_.get(current, valuePath)}
      onValueChange={onChange}>
      {data.map((d) => (
        <>
          <radio.Item value={_.get(d, valuePath)}>
            <radio.Indicator>X</radio.Indicator>
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
        </>
      ))}
    </radio.Root>
  );
};

import Color from "color";
import _ from "lodash";
import { MultiSelect } from "react-multi-select-component";
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";

export default ({
  items,
  labelPath,
  valuePath,
  currents,
  onChange,
  render = null
}) => {
  const { colors } = useTheme();
  const options = items.map((item) => ({
    label: _.get(item, labelPath),
    value: _.get(item, valuePath)
  }));
  const selections = currents.map((current) => ({
    label: _.get(current, labelPath),
    value: _.get(current, valuePath)
  }));
  const msProps = {
    options: options,
    value: selections,
    onChange: onChange,
    hasSelectAll: false
  };
  render != null && (msProps.ItemRenderer = render);
  return (
    <div
      className={css`
        div.dropdown-heading-value {
          font-size: 16px;
        }
        li label.select-item {
          font-size: 14px;
          padding: 2px;
          font-weight: normal;
          input {
            appearance: none;
            outline: 1px solid ${colors.text};
            height: 14px;
            width: 14px;
            &:checked {
              background-color: ${colors.text};
            }
          }
        }
        .rmsc {
          --rmsc-main: ${colors.accent};
          --rmsc-hover: ${Color(colors.accent).fade(0.8).hsl().toString()};
          --rmsc-selected: ${Color(colors.accent).fade(0.7).hsl().toString()};
          --rmsc-border: ${colors.accent};
          --rmsc-gray: ${colors.accent};
          --rmsc-bg: ${colors.background};
          --rmsc-radius: 0px; /* Radius */
          --rmsc-h: 16px; /* Height */
        }
      `}>
      <MultiSelect
        disableSearch
        {...msProps}
      />
    </div>
  );
};

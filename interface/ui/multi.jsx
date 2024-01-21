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
  console.log(render)
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
        .rmsc {
          --rmsc-main: ${colors.accent};
          --rmsc-hover: ${Color(colors.accent).fade(0.8).hsl().toString()};
          --rmsc-selected: ${Color(colors.accent).fade(0.7).hsl().toString()};
          --rmsc-border: ${colors.accent};
          --rmsc-gray: ${colors.accent};
          --rmsc-bg: ${colors.background};
          --rmsc-p: 2px; /* Spacing */
          --rmsc-radius: 4px; /* Radius */
          --rmsc-h: 30px; /* Height */
        }
      `}>
      <MultiSelect
        {...msProps}
      />
    </div>
  );
};

import Color from "color";
import _ from "lodash";
import { css, useTheme } from "@emotion/react";
import Select, { components } from "react-select";

const makeOptions = ({ items, labelPath, valuePath }) => {
  return items.map((item) => ({
    label: _.get(item, labelPath),
    value: _.get(item, valuePath),
  }));
};

export default ({
  items,
  labelPath,
  valuePath,
  currents,
  onChange,
  grouper = null,
  ...props
}) => {
  const { colors, classes } = useTheme();
  var options;
  if (!grouper) {
    options = makeOptions({ items, labelPath, valuePath });
  } else {
    options = Object.entries(grouper(items)).map(([group, opts]) => ({
      label: group,
      options: makeOptions({ items: opts, labelPath, valuePath }),
    }));
  }
  const selections = currents.map((current) => ({
    label: _.get(current, labelPath),
    value: _.get(current, valuePath),
  }));
  const msProps = {
    options: options,
    value: selections,
    onChange: onChange,
    isMulti: true,
  };

  return (
    <Select
      {...msProps}
      {...props}
      unstyled
      classNamePrefix={"react-select"}
      css={css`
        .react-select__placeholder {
          color: ${colors.accent};
        }
        .react-select__value-container {
          gap: 5px;
        }
        .react-select__multi-value {
          ${classes.elements.button};
          padding: 2px;
          padding-left: 4px;
          .react-select__multi-value__remove {
            color: ${colors.accent};
          }
        }
        .react-select__control {
          background-color: ${colors.background};
          border: 1px solid ${colors.accent};
          padding: 5px;
        }
        .react-select__indicators {
          color: ${colors.accent};
        }
        .react-select__menu {
          background-color: ${colors.background};
          margin-top: 5px;
          white-space: nowrap;
          ${classes.decorations.shadowed};
          ${classes.decorations.bordered};
          min-width: fit-content;
        }
        .react-select__option {
          ${classes.elements.list_item};
          width: auto;
        }
        .react-select__group {
          .react-select__group-heading {
            font-weight: bold;
            text-transform: uppercase;
            font-size: 16px;
          }
          > div:nth-child(2) {
            margin-left: 5px;
            padding-left: 5px;
            border-left:  1px solid ${colors.accent};
          }
        }
      `}
    />
  );
};

import ui from "interface";
import _ from "lodash";
import { css } from "@emotion/react";

export const PowerOption = ({
  option,
  options,
  checked,
  disabled,
  onClick,
}) => {
  const all = _.flatten([options.ranges, options.durations, options.effects]);
  const item = _.find(all, (f) => f.id == option.value);
  const tooltip = Array.isArray(item.trees)
    ? item.trees[0].title
    : item.trees.title;
  return (
    <div
      css={css`
        position: relative;
        > button:last-child {
          position: absolute;
          right: 0;
          ::after {
            z-index: 1000;
          }
        }
      `}>
      <ui.Checkbox
        checked={checked}
        disabled={disabled}
        onChange={onClick}
      />
      {option.label}
      <ui.Tooltip
        preview={
          <ui.Switch
            src={
              <ui.Icon
                id={option.value}
                sz={15}
              />
            }
          />
        }>
        {tooltip}
      </ui.Tooltip>
    </div>
  );
};

export const Effects = ({ power, options, add }) => {
  return (
    <div>
      <label>Effect</label>
      <ui.Multi
        items={options.effects}
        labelPath={"title"}
        valuePath={"id"}
        currents={power.effects}
        onChange={add("effects")}
        render={(props) => (
          <PowerOption
            options={options}
            {...props}
          />
        )}
      />
    </div>
  );
};

export const Durations = ({ power, options, add }) => {
    return (
      <div>
        <label>Duration</label>
        <ui.Multi
          items={options.durations}
          labelPath={"title"}
          valuePath={"id"}
          currents={power.durations}
          onChange={add("durations")}
          render={(props) => (
            <PowerOption
              options={options}
              {...props}
            />
          )}
        />
      </div>
    );
  };
  
  export const Ranges = ({ power, options, add }) => {
    return (
      <div>
        <label>Range</label>
        <ui.Multi
          items={options.ranges}
          labelPath={"title"}
          valuePath={"id"}
          currents={power.ranges}
          onChange={add("ranges")}
          render={(props) => (
            <PowerOption
              options={options}
              {...props}
            />
          )}
        />
      </div>
    );
  };
  

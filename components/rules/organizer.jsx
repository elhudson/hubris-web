import { css } from "@emotion/css";
import * as Tabs from "@radix-ui/react-tabs";
import Switch from "@ui/switch";
import Icon from "@ui/icon";
import Tooltip from "@ui/tooltip";
import { useState } from "react";

export default ({ options, render }) => {
  const [current, setCurrent] = useState(options[0].title);
  return (
    <Tabs.Root
      value={current}
      onValueChange={(e) => setCurrent(e)}
      className={css`
        display: flex;
        [role="tablist"] {
          width: fit-content;
          > button {
            all: unset;
            margin: 3px;
            display: block;
          }
        }
        [role="tabpanel"] {
          width: 100%;
          max-height: 80vh;
          overflow: scroll;
          border: unset;
        }
      `}>
      <Tabs.List>
        {options.map((path) => (
          <Tabs.Trigger value={path.title}>
            <Tooltip
              preview={
                <Switch
                  checked={path.title == current}
                  src={
                    <Icon
                      id={path.id}
                      sz={16}
                    />
                  }
                />
              }>
              {path.title}
            </Tooltip>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {options.map((path) => (
        <Tabs.Content value={path.title}>{render(path)}</Tabs.Content>
      ))}
    </Tabs.Root>
  );
};

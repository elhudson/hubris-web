import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";
import * as Context from "@radix-ui/react-context-menu";

export default ({ trigger, items, render = null }) => {
  const { colors } = useTheme();
  return (
    <Context.Root>
      <Context.Trigger>{trigger}</Context.Trigger>
      <Context.Content
        className={"shadow "+css`
          background-color: ${colors.background};
          border: 1px solid ${colors.text};
          padding: 5px;
        `}>
        {items.map((i) => (render ? render(i) : <MenuItem item={i} />))}
      </Context.Content>
    </Context.Root>
  );
};

const MenuItem = ({ item }) => {
  return <Context.Item onSelect={item.action}>{item.label}</Context.Item>;
};
import { useTheme, css} from "@emotion/react";
import * as Context from "@radix-ui/react-context-menu";

export default ({ trigger, items, render = null }) => {
  const { colors, classes } = useTheme();
  return (
    <Context.Root>
      <Context.Trigger>{trigger}</Context.Trigger>
      <Context.Content
        css={css`
          ${classes.decorations.shadowed};
          background-color: ${colors.background};
          border: 1px solid ${colors.accent};
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
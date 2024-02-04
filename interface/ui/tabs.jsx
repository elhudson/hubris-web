import { useTheme, css } from "@emotion/react";
import * as tabs from "@radix-ui/react-tabs";

export default ({ names, children, def }) => {
  const { classes, colors } = useTheme();
  const toVal = (name) => name.toLowerCase().replace(" ", "_");
  return (
    <tabs.Root
      defaultValue={toVal(def)}
      css={css`
        [role="tablist"] {
          display: flex;
          width: 100%;
          button {
            flex-grow: 1;
            margin-top: 10px;
            border-bottom: unset;
            &[aria-selected=true] {
              background-color: ${colors.background};
              
            }
          }
        }
        [role="tabpanel"] {
          border: 1px solid ${colors.accent};
          padding: 10px;
        }
      `}>
      <tabs.List>
        {names.map((n) => (
          <tabs.Trigger value={toVal(n)}>{n}</tabs.Trigger>
        ))}
      </tabs.List>
      {children.map((c) => (
        <tabs.Content value={toVal(names[children.indexOf(c)])}>
          {c}
        </tabs.Content>
      ))}
    </tabs.Root>
  );
};

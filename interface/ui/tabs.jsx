import { useTheme, css } from "@emotion/react";
import * as tabs from "@radix-ui/react-tabs";

export default ({ names, children, def, disabled = [], ...props }) => {
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
            &:not(button:last-child) {
              border-right: unset;
            }
            &[aria-selected="true"] {
              background-color: ${colors.background};
              border-bottom: unset;
            }
            &[disabled] {
              ${classes.decorations.disabled};
            }
          }
        }
        [role="tabpanel"] {
          border: 1px solid ${colors.accent};
          border-top: unset;
          padding: 10px;
          max-height: 80vh;
          overflow: scroll;
        }
      `}
      {...props}>
      <tabs.List>
        {names.map((n) => (
          <tabs.Trigger
            value={toVal(n)}
            disabled={disabled.includes(n)}>
            {n}
          </tabs.Trigger>
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

import * as tabs from "@radix-ui/react-tabs";

import { css, useTheme } from "@emotion/react";

import { Scrollable } from "@interface/ui";
export default ({ names, children, def, disabled = [], ...props }) => {
  const { classes, colors } = useTheme();
  const toVal = (name) => name.toLowerCase().replace(" ", "_");
  return (
    <tabs.Root
      defaultValue={toVal(def)}
      css={css`
        margin-top: 10px;
        max-height: 80vh;
        [role="tablist"] {
          display: flex;
          width: 100%;
          button {
            flex-grow: 1;
            &:not(button:last-of-type(button)) {
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
          @media (max-width: 600px) {
            border-top: 1px solid ${colors.accent};
          }
          padding: 10px;
          height: 100%;
          max-height: 75vh;
        }
      `}
      {...props}>
      <tabs.List>
        <span
          css={css`
            @media (max-width: 600px) {
              display: none;
            }
          `}>
          {names.map((n) => (
            <tabs.Trigger
              value={toVal(n)}
              disabled={disabled.includes(n)}>
              {n}
            </tabs.Trigger>
          ))}
        </span>

        <select
          css={css`
            display: none;
            @media (max-width: 600px) {
              font-family: 'Iosevka Web';
              margin: 5px 0px;
              border-radius: 0px;
              appearance: unset;
              border: 1px solid ${colors.accent};
              display: block;
              width: 100%;
            }
          `}>
          {names.map((n) => (
            <tabs.Trigger
              asChild
              value={toVal(n)}>
              <option value={toVal(n)}>{n}</option>
            </tabs.Trigger>
          ))}
        </select>
      </tabs.List>
      {children.map((c) => (
        <tabs.Content value={toVal(names[children.indexOf(c)])}>
          <Scrollable>{c}</Scrollable>
        </tabs.Content>
      ))}
    </tabs.Root>
  );
};

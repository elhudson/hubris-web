import * as nav from "@radix-ui/react-navigation-menu";

import { Actions, Login } from "@client/user";
import { css, useTheme } from "@emotion/react";
import { sql_danger, sql_safe } from "utilities";

import { FaSwatchbook } from "react-icons/fa";
import { GiBookCover } from "react-icons/gi";
import { IoPersonCircle } from "react-icons/io5";
import { Switcher } from "@interface/styles";
import _ from "lodash";
import { useUser } from "contexts";

const tables = await fetch("/data/tables").then((j) => j.json());

export default () => {
  const { logged_in, username } = useUser();
  const { colors } = useTheme();
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        padding: 0px 10px;
        margin-bottom: 20px;
        background-color: ${colors.background};
        h1 a {
          color: ${colors.text};
        }
        nav {
          flex-grow: 1;
        }
        border-bottom: 1px solid ${colors.accent};
      `}
    >
      <h1>
        <a href="/">HUBRIS</a>
      </h1>
      <Menu
        items={[
          {
            label: "Wiki",
            icon: <GiBookCover />,
            children: tables.map((t) => ({
              label: sql_danger(t),
              action: () => window.location.assign(`/srd/${sql_safe(t)}`),
            })),
          },
          {
            label: logged_in ? username : "Log in",
            icon: <IoPersonCircle />,
            action: logged_in ? null : <Login />,
            children: logged_in ? [...Actions()] : null,
          },
          {
            label: "Appearance",
            icon: <FaSwatchbook />,
            children: Switcher(),
          },
        ]}
      />
    </div>
  );
};

const Item = ({ d, offset = 0 }) => {
  const { classes, colors } = useTheme();
  return (
    <>
      {d.children ? (
        <nav.Item>
          <nav.Trigger>{d.icon ?? d.label}</nav.Trigger>
          <nav.Content
            css={css`
              position: absolute;
              margin-top: 5px;
              right: ${offset}px;
              ul {
                ${classes.elements.listbox};
                li {
                  ${classes.elements.list_item};
                  white-space: nowrap;
                }
              }
            `}
          >
            <nav.Sub
              css={css`
                position: relative !important;
              `}
            >
              <nav.List>
                {d.children.map((c) => (
                  <Item d={c} />
                ))}
              </nav.List>
            </nav.Sub>
          </nav.Content>
        </nav.Item>
      ) : (
        <nav.Item onClick={d.action}>{d?.icon ?? d.label}</nav.Item>
      )}
    </>
  );
};

const Menu = ({ items }) => {
  return (
    <nav.Root
      css={css`
        ul {
          list-style: none;
          padding: unset;
          margin: unset;
        }
      `}
    >
      <nav.List
        css={css`
          gap: 5px;
          display: flex;
          flex-direction: row-reverse;
        `}
      >
        {items.map((d) => (
          <Item
            d={d}
            offset={28 * _.findIndex(items, d)}
          />
        ))}
      </nav.List>
    </nav.Root>
  );
};

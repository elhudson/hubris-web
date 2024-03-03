import * as nav from "@radix-ui/react-navigation-menu";
import { useUser } from "@contexts/user";
import Login from "@pages/user/login";
import { useTheme, css } from "@emotion/react";
import { IoPersonCircle } from "react-icons/io5";
import { GiBookCover } from "react-icons/gi";
import { FaSwatchbook } from "react-icons/fa";
import usr from "@actions/user";
import switcher from "@styles/switcher";
import { sql_danger, sql_safe } from "../utilities";
import _ from "lodash";
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
      `}>
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
              action: () => window.location.assign(`/srd/${sql_safe(t)}`)
            }))
          },
          {
            label: logged_in ? username : "Log in",
            icon: <IoPersonCircle />,
            action: logged_in ? null : <Login />,
            children: logged_in ? [...usr()] : null
          },
          {
            label: "Appearance",
            icon: <FaSwatchbook />,
            children: switcher()
          }
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
            `}>
            <nav.Sub
              css={css`
                position: relative !important;
              `}>
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
      `}>
      <nav.List
        css={css`
          gap: 5px;
          display: flex;
          flex-direction: row-reverse;
        `}>
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

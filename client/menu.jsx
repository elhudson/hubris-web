import * as nav from "@radix-ui/react-navigation-menu";
import { userContext } from "@contexts/user";
import { useContext } from "react";
import Login from "@pages/user/login";
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";
import { Link } from "react-router-dom";
import Tables from "@components/tables";
import usr from "@actions/user";
import Switcher from "@styles/switcher";

const Menu = () => {
  const { colors, classes } = useTheme();
  const user = useContext(userContext);
  return (
    <div
      className={css`
        position: sticky;
        background-color: ${colors.background};
        border: 1px solid ${colors.accent};
        z-index: 1;
        h1 {
          padding-left: 5px;
        }
        margin-bottom: 10px;
      `}>
      <h1>HUBRIS</h1>
      <nav.Root
        className={css`
          position: absolute;
          right: 0;
          top: 0;
          li {
            list-style: none;
            padding: 5px;
            position: relative;
          }
          .nav {
            display: flex;
            justify-content: center;
            margin: 5px;
          }
          .content {
            position: absolute;
            top: 35px;
            right: 100%;
            width: 0%;
            li {
              ${classes.decorations.shadowed};
              width: fit-content;
              white-space: nowrap;
              background-color: ${colors.background};
              margin: 5px;
              margin-left: 0px;
              margin-top: 0px;
              border: 1px solid ${colors.accent};
            }
          }
          ul > li:last-child .content {
            right: -25%;
            display: flex;
            flex-wrap: wrap;
            justify-content: right;
          }
          a,
          button {
            all: unset;
            &:hover {
              background-color: unset;
              font-style: italic;
              text-decoration: underline;
              font-weight: 400;
              text-underline-offset: 2px;
              cursor: pointer;
            }
          }
        `}>
        <nav.List className="nav">
          <nav.Item>
            <nav.Trigger>Appearance</nav.Trigger>
            <nav.Content className="content">
              <li>
                <Switcher />
              </li>
            </nav.Content>
          </nav.Item>
          <nav.Item>
            {user.logged_in ? <a href="/logout">Log Out</a> : <Login />}
          </nav.Item>
          {user.logged_in && (
            <>
              <nav.Item>
                <nav.Link>
                  <Link to={`creations/${user.username}`}>My Stuff</Link>
                </nav.Link>
              </nav.Item>
              <nav.Item>
                <nav.Trigger>Create</nav.Trigger>
                <nav.Content className="content">
                  {usr().map((u) => (
                    <li>
                      <a onClick={u.action}>{u.label}</a>
                    </li>
                  ))}
                </nav.Content>
              </nav.Item>
            </>
          )}
          <nav.Item>
            <nav.Trigger>
              <a href="/">Wiki</a>
            </nav.Trigger>
            <nav.Content className="content">
              <Tables />
            </nav.Content>
          </nav.Item>
        </nav.List>
      </nav.Root>
    </div>
  );
};

export default Menu;

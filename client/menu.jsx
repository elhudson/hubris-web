import * as nav from "@radix-ui/react-navigation-menu";
import { userContext } from "@contexts/user";
import { useContext } from "react";
import Login from "@pages/user/login";
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";
import { Link } from "react-router-dom";
import { useAsync } from "react-async-hook";
import Tables from "@components/tables";
import usr from "@actions/user";

const Menu = () => {
  const { colors } = useTheme();
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
          display: flex;
          li {
            list-style-type: none;
            margin: 5px;
            padding: 3px;
            height: fit-content;
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
              <nav.Content>
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
          <nav.Content>
            <Tables />
          </nav.Content>
        </nav.Item>
        <nav.Viewport
          className={css`
            position: absolute;
            top: 50px;
            right: 0;
            background-color: ${colors.background};
            border: 1px solid ${colors.accent};
          `}
        />
      </nav.Root>
    </div>
  );
};

export default Menu;

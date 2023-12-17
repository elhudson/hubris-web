import * as nav from "@radix-ui/react-navigation-menu";
import { userContext } from "@contexts/user";
import { useContext } from "react";
import Login from "@pages/login";
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";
import { useLocation, Link } from "react-router-dom";

const Menu = () => {
  const { colors } = useTheme();
  const user = useContext(userContext);
  return (
    <div className={css`
      position: sticky;
      background-color: ${colors.background};
      border: 1px solid ${colors.accent};
      z-index: 1;
      h1 {
        padding-left: 5px;
      }
      margin-bottom:10px;
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
          }
        `}>
        <nav.Item className="button">
          {user.logged_in ? <a href="/logout">Log Out</a> : <Login />}
        </nav.Item>
        {user.logged_in && (
          <nav.Item className="button">
            <nav.Link className="button">
              <Link
                to={`characters/${user.username}`}>
                My Characters
              </Link>
            </nav.Link>
          </nav.Item>
        )}
        <nav.Item className="button">
          <Link
            to={`/`}>
            Wiki
          </Link>
        </nav.Item>
      </nav.Root>
    </div>
  );
};

export default Menu;

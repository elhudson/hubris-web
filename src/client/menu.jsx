import * as nav from "@radix-ui/react-navigation-menu";
import { sql_safe } from "utilities";
import { userContext } from "@contexts/user";
import { useContext } from "react";
import Login from "@pages/login";

const Menu = () => {
  const user = useContext(userContext);
  return (
    <nav.Root>
      <nav.Item>
        {user.logged_in ? <a href="/logout">Log Out</a> : <Login/>}
      </nav.Item>
      {user.logged_in && (
        <nav.Item>
          <nav.Link href={`/${user.username}/characters`}>My Characters</nav.Link>
        </nav.Item>
      )}
    </nav.Root>
  );
};

export default Menu;

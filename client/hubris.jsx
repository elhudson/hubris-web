import { RouterProvider } from "react-router-dom";
import { userContext } from "@contexts/user";
import { useAsync } from "react-async-hook";

import Colors from "@styles/colorschemes";
import router from "@src/routes";

export default () => {
  const user = useAsync(
    async () => await fetch("/login").then((res) => res.json())
  );
  return (
    <Colors>
        {user.result && (
          <userContext.Provider value={user.result}>
            <RouterProvider router={router} />
          </userContext.Provider>
        )}
    </Colors>
  );
};

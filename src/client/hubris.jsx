import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { IconContext } from "react-icons";
import { userContext } from "@contexts/user";
import { useAsync } from "react-async-hook";

import Style from "@styles/global";
import theme from "@styles/theme";
import router from "@src/routes";

export default () => {
  const user = useAsync(
    async () => await fetch("/login").then((res) => res.json())
  );
  return (
    <ThemeProvider theme={theme}>
      <IconContext.Provider
        value={{
          color: theme.colors.text,
          size: 15
        }}>
        <Style />
        {user.result && (
          <userContext.Provider value={user.result}>
            <RouterProvider router={router} />
          </userContext.Provider>
        )}
      </IconContext.Provider>
    </ThemeProvider>
  );
};

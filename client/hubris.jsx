import { Colorschemes } from "@interface/styles";
import { RouterProvider } from "react-router-dom";
import router from "@src/routes";
import { useAsync } from "react-async-hook";
import { userContext } from "contexts";

export default () => {
  const user = useAsync(
    async () => await fetch("/login").then((res) => res.json())
  ).result;
  return (
    <Colorschemes>
      {user && (
        <userContext.Provider value={user}>
          <RouterProvider router={router} />
        </userContext.Provider>
      )}
    </Colorschemes>
  );
};

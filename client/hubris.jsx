import { Colorschemes } from "@interface/styles";
import Directory from "@src/client/routes";
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
          <Directory />
        </userContext.Provider>
      )}
    </Colorschemes>
  );
};

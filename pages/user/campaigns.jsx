import { useUser } from "@contexts/user";
import { useAsync } from "react-async-hook";
import { campaignContext } from "@contexts/campaign";
import Profile from "@campaigns/profile";

export default () => {
  const user = useUser();
  const campaigns = useAsync(
    async () =>
      await fetch(`/data/campaigns?user=${user.username}`).then((h) => h.json())
  ).result;
  return (
    <>
      {campaigns &&
        campaigns.map((c) => (
          <campaignContext.Provider value={{ campaign: c }}>
            <Profile />
          </campaignContext.Provider>
        ))}
    </>
  );
};

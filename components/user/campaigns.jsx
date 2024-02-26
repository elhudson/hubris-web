import { useUser } from "@contexts/user";
import Loading from "@ui/loading";
import { campaignContext } from "@contexts/campaign";
import Profile from "@campaigns/profile";
import _ from "lodash";
export default () => {
  const user = useUser();
  const campaigns = async () =>
    await fetch(`/data/campaigns?user=${user.username}`)
      .then((h) => h.json())
      .then((a) => (_.isNull(a) ? a : [a].flat()));
  return (
    <Loading
      getter={campaigns}
      render={(campaigns) =>
        campaigns.map((c) => (
          <campaignContext.Provider value={{ campaign: c }}>
            <Profile />
          </campaignContext.Provider>
        ))
      }
    />
  );
};

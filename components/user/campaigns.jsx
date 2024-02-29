import Loading from "@ui/loading";
import { campaignContext } from "@contexts/campaign";
import Profile from "@campaigns/profile";
import { Sections } from "@ui/layouts";
import _ from "lodash";

export default () => {
  const campaigns = async () =>
    await fetch(`/data/campaigns`).then((h) => h.json());
  return (
    <Loading
      getter={campaigns}
      render={({ dm, player }) => (
        <Sections>
          <section>
            <h3>DM</h3>
            {dm.map((c) => (
              <campaignContext.Provider value={{ campaign: c }}>
                <Profile />
              </campaignContext.Provider>
            ))}
          </section>
          <section>
            <h3>Player</h3>
            {player.map((c) => (
              <campaignContext.Provider value={{ campaign: c }}>
                <Profile />
              </campaignContext.Provider>
            ))}
          </section>
        </Sections>
      )}
    />
  );
};

import { Layouts, Loading } from "@interface/ui";

import { Profile } from "@client/campaign";
import _ from "lodash";
import { campaignContext } from "contexts";

export default () => {
  const campaigns = async () =>
    await fetch(`/data/campaigns`).then((h) => h.json());
  return (
    <Loading
      getter={campaigns}
      render={({ dm, player }) => (
        <Layouts.Sections>
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
        </Layouts.Sections>
      )}
    />
  );
};

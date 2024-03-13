import { Layouts } from "@interface/ui";
import { Profile } from "@client/campaign";
import _ from "lodash";
import { campaignContext } from "contexts";
import { useLoaderData } from "react-router-dom";

export default () => {
  const { campaigns } = useLoaderData();
  return (
    <Layouts.Sections>
      <section>
        <h3>DM</h3>
        {campaigns.dm.map((c) => (
          <campaignContext.Provider value={{ campaign: c }}>
            <Profile />
          </campaignContext.Provider>
        ))}
      </section>
      <section>
        <h3>Player</h3>
        {campaigns.player.map((c) => (
          <campaignContext.Provider value={{ campaign: c }}>
            <Profile />
          </campaignContext.Provider>
        ))}
      </section>
    </Layouts.Sections>
  );
};

import { Campaigns, Characters } from "@client/user";

import { Tabs } from "@interface/ui";
import { useParams } from "react-router-dom";
import { useUser } from "contexts";

export default () => {
  const { user } = useParams();
  const current = useUser();
  return (
    <div>
      {!current.logged_in || current?.username != user ? (
        <div>You're not logged in.</div>
      ) : (
        <Tabs
          names={["Characters", "Campaigns"]}
          def="Characters"
        >
          <Characters />
          <Campaigns />
        </Tabs>
      )}
    </div>
  );
};

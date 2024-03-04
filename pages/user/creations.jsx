import Characters from "@components/user/characters";
import Campaigns from "@components/user/campaigns";
import { useParams } from "react-router-dom";
import { useUser } from "@contexts/user";
import Tabs from "@ui/tabs";

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
          def="Characters">
            <Characters />
            <Campaigns />
        </Tabs>
      )}
    </div>
  );
};

import actions from "@actions/campaign.jsx";
import Context from "@ui/context";
import { useUser } from "@contexts/user";
import { useCampaign } from "@contexts/campaign";

export default ({ children }) => {
  const user = useUser();
  const { campaign } = useCampaign();
  const acts = actions();
  return (
    <>
      {campaign.dm.id == user.user_id || user.username == "ehudson19" ? (
        <>
          <Context
            trigger={children}
            items={acts}
          />
          {acts.map((i) => i.render)}
        </>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

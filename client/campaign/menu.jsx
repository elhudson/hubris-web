import { useUser, useCampaign } from "context";
import { Actions } from "@client/campaign"
import { Context } from "@interface/ui";

export default ({ children }) => {
  const user = useUser();
  const { campaign } = useCampaign();
  const acts = Actions();
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

import { useUser } from "@contexts/user";
import { useImmer } from "use-immer";
import { campaignContext } from "@contexts/campaign";
import Edit from "@components/campaigns/edit";

export default () => {
  const user = useUser();
  const [campaign, update] = useImmer({
    name: "Untitled Campaign",
    description: "A long time ago, in a galaxy far, far away...",
    settings: [],
    creator: user,
    dm: user
  });
  return (
    <>
      <campaignContext.Provider value={{ campaign, update }}>
        <Edit />
      </campaignContext.Provider>
      <button
        onClick={async () => {
          const r = await fetch(`/data/campaigns/create`, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(campaign)
          })
          window.location.assign(r.url)
        }}>
        Create
      </button>
    </>
  );
};

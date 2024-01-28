import { useUser } from "@contexts/user";
import { useImmer } from "use-immer";
import { useAsync } from "react-async-hook";
import ui from "interface";
import _ from "lodash";

export default () => {
  const user = useUser();
  const settings = useAsync(
    async () => await fetch(`/data/rules?table=settings`).then((j) => j.json())
  ).result;
  const [campaign, editCampaign] = useImmer({
    name: "Untitled Campaign",
    description: "A long time ago, in a galaxy far, far away...",
    settings: [],
    creator: user,
    dm: user
  });
  return (
    <>
      {settings && (
        <div>
          <Field label="Title">
            <input
              type="text"
              value={campaign.name}
              onChange={(e) => {
                editCampaign((draft) => {
                  draft.name = e.currentTarget.value;
                });
              }}
            />
          </Field>
          <Field label="Description">
            <ui.Notepad
              text={campaign.description}
              onChange={(e) => {
                editCampaign((draft) => {
                  draft.description = e;
                });
              }}
            />
          </Field>
          <Field label="Settings">
            <ui.Multi
              items={settings}
              labelPath="title"
              valuePath="id"
              currents={campaign.settings}
              onChange={(e) => {
                editCampaign((draft) => {
                  draft.settings = e.map((a) =>
                    _.find(settings, (s) => s.id == a.value)
                  );
                });
              }}
            />
          </Field>
          <button
            onClick={()=> fetch("/data/campaigns/create", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(campaign)
              })
            }>
            Create Campaign
          </button>
        </div>
      )}
    </>
  );
};

const Field = ({ label, children }) => {
  return (
    <h2>
      <label>{label}</label>
      {children}
    </h2>
  );
};

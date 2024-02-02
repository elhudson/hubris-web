import { useCampaign } from "@contexts/campaign";
import { useUser } from "@contexts/user";
import { forwardRef, useRef } from "react";
import { useAsync } from "react-async-hook";
import Alert from "@ui/alert";
import Notepad from "@ui/notepad";
import Select from "@ui/select";
import _ from "lodash";
import query from "@database/queries/campaign";

export default () => {
  const ownershipRef = useRef(null);
  const editorRef = useRef(null);
  return [
    {
      label: "Change DM",
      action: () => ownershipRef.current.click(),
      render: <ChangeDM ref={ownershipRef} />
    },
    {
      label: "Edit Campaign",
      render: <EditCampaign ref={editorRef} />,
      action: () => editorRef.current.click()
    }
  ];
};

const ChangeDM = forwardRef(function Func(props, ref) {
  const { campaign, update } = useCampaign();
  const possibleUsers = useAsync(
    async () =>
      await fetch(`/data/query?table=users&method=findMany`, {
        method: "POST"
      }).then((r) => r.json())
  ).result;
  return (
    <Alert
      button={
        <button
          ref={ref}
          style={{ display: "none" }}
        />
      }
      confirm={async () => {
        await fetch(`/data/campaign?id=${campaign.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            dm: {
              connect: {
                id: campaign.dm.id
              }
            }
          })
        });
      }}>
      {possibleUsers && (
        <div>
          <h3>Choose a new DM for {campaign.name}</h3>
          <Select
            options={possibleUsers}
            current={campaign.dm}
            valuePath="id"
            displayPath="username"
            onChange={(e) => {
              update((draft) => {
                draft.dm = _.find(possibleUsers, (d) => d.id == e);
              });
            }}
          />
        </div>
      )}
    </Alert>
  );
});

const EditCampaign = forwardRef(function Func(props, ref) {
  const { campaign, update } = useCampaign();
  return (
    <Alert
      confirm={async () =>
        await fetch(`/data/campaign?id=${campaign.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(query(campaign))
        })
      }
      button={
        <button
          style={{ display: "none" }}
          ref={ref}
        />
      }>
      <div>
        <label>Title</label>
        <input
          type="text"
          value={campaign.name}
          onChange={(e) =>
            update((draft) => {
              draft.name = e.currentTarget.value;
            })
          }
        />
      </div>
      <div>
        <label>Description</label>
        <Notepad
          text={campaign.description}
          onChange={(e) =>
            update((draft) => {
              draft.description = e;
            })
          }
        />
      </div>
    </Alert>
  );
});

const EditCover=forwardRef(function Func(props, ref) {
  
})

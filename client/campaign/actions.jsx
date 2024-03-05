import { forwardRef, useRef } from "react";
import { useAsync } from "react-async-hook";
import _ from "lodash";
import { useTheme, css} from "@emotion/react";
import { Edit } from "@client/campaign";
import { useCampaign, useUser } from "context";
import { Alert, Select } from "@interface/ui";

export default () => {
  const ownershipRef = useRef(null);
  const editorRef = useRef(null);
  const deleterRef = useRef(null);
  const menu = [
    {
      label: "Change DM",
      action: () => ownershipRef.current.click(),
      render: <ChangeDM ref={ownershipRef} />,
    },
    {
      label: "Edit Campaign",
      render: <EditCampaign ref={editorRef} />,
      action: () => editorRef.current.click(),
    },
    {
      label: "Delete Campaign",
      render: <Delete ref={deleterRef} />,
      action: () => deleterRef.current.click(),
    },
  ];
  return menu;
};

const ChangeDM = forwardRef(function Func(props, ref) {
  const { campaign, update } = useCampaign();
  const possibleUsers = useAsync(
    async () =>
      await fetch(`/data/query?table=users&method=findMany`, {
        method: "POST",
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
        await fetch(
          `/data/campaign/transfer?id=${campaign.id}&dm=${campaign.dm.id}`
        );
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
  const { colors, palette } = useTheme();

  return (
    <Alert
      confirm={async () =>
        await fetch(`/data/campaign?id=${campaign.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(query(campaign)),
        })
      }
      button={
        <button
          style={{ display: "none" }}
          ref={ref}
        />
      }>
      <Edit />
    </Alert>
  );
});

export const Delete = forwardRef(function Func(props = null, ref) {
  const { campaign } = useCampaign();
  const { username } = useUser();
  const handleDelete = async () => {
    await fetch(`/data/campaign/delete?id=${campaign.id}`);
    window.location.assign(`/${username}/creations`);
  };
  return (
    <div
      css={css`
        > button:first-child {
          display: none;
        }
      `}>
      <Alert
        confirm={handleDelete}
        button={
          <button
            ref={ref}
            style={{ display: "none" }}
          />
        }>
        <div>
          <h4>Are you sure?</h4>
          <p>Once you delete a campaign, you can't recover it.</p>
        </div>
      </Alert>
    </div>
  );
});

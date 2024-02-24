import { useCampaign } from "@contexts/campaign";
import { useUser } from "@contexts/user";
import { forwardRef, useRef } from "react";
import { useAsync } from "react-async-hook";
import Alert from "@ui/alert";
import Notepad from "@ui/notepad";
import Select from "@ui/select";
import Multi from "@ui/multi";
import Upload from "@ui/upload";
import _ from "lodash";
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";
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
  const { colors, palette } = useTheme();
  const settings = useAsync(
    async () =>
      await fetch(`/data/rules?table=settings`).then((res) => res.json())
  ).result;
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
      <span
        className={css`
          .quill {
            border: 1px solid ${colors.accent};
            background-color: ${palette.accent1};
          }
          label {
            font-weight: bold;
          }
          .pic {
            display: unset;
          }
        `}>
        <EditCover />
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
        <div>
          <label>Settings</label>
          <Multi
            items={settings}
            currents={campaign.settings}
            valuePath="id"
            labelPath="title"
            onChange={(e) => {
              update((draft) => {
                draft.settings = e.map((v) =>
                  _.find(settings, (c) => c.id == v.value)
                );
              });
            }}
          />
        </div>
      </span>
    </Alert>
  );
});

const EditCover = () => {
  const { campaign } = useCampaign();
  const url = `/campaigns/${campaign.id}.png`;
  const endpoint = `/data/campaign/cover?id=${campaign.id}`;
  return (
    <Upload
      path={url}
      endpoint={endpoint}
      sz={300}
    />
  );
};

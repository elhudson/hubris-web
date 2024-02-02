import { useParams } from "react-router-dom";
import _ from "lodash";
import { useUser } from "@contexts/user";
import Select from "@ui/select";
import { useAsync } from "react-async-hook";
import { css } from "@emotion/css";
import { useImmer } from "use-immer";
import Notif from "@ui/notif";
import Doc from "@ui/doc";

export default ({}) => {
  const { id, session } = useParams();
  const user = useUser();
  const characters = useAsync(
    async () =>
      await fetch(`/data/characters?user=${user.username}`)
        .then((res) => res.json())
        .then((f) => f.filter((char) => char.campaignId == id))
  ).result;
  const [summary, update] = useImmer({
    author: characters ? characters[0] : null,
    text: "",
    session: session
  });
  useAsync(
    async () =>
      await fetch(`/data/logbook?campaign=${id}&session=${session}`).then(
        (res) => res.json()
      ).then(j=> update(j))
  );
  return (
    <div
      className={css`
        position: relative;
        > button {
          position: absolute;
          top: 0;
          right: 0;
        }
        .metadata > div {
          display: flex;
          > h3 {
            margin-right: 10px;
          }
        }
      `}>
      {characters && (
        <div className="metadata">
          <div>
            <h3>Author</h3>
            <Select
              current={summary.author}
              options={characters}
              valuePath="id"
              displayPath="biography.name"
              onChange={(e) => {
                update((draft) => {
                  draft.author = _.find(characters, (c) => c.id == e);
                });
              }}
            />
          </div>
          <div>
            <h3>Session #</h3>
            <input
              type="number"
              value={summary.session}
              onChange={(e) => {
                update((draft) => {
                  draft.session = e.target.valueAsNumber;
                });
              }}
            />
          </div>
        </div>
      )}
      <Doc
        text={summary.text}
        onChange={(e) => {
          update((draft) => {
            draft.text = e;
          });
        }}
      />
      <Notif
        func={async () => {
          return await fetch(`/data/campaigns/logbook?id=${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify([summary])
          }).then((f) => f.text());
        }}
        btn="Save Summary"
      />
    </div>
  );
};

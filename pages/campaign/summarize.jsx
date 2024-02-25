import { useParams } from "react-router-dom";
import _ from "lodash";
import { useUser } from "@contexts/user";
import Select from "@ui/select";
import { useAsync } from "react-async-hook";
import { css, useTheme } from "@emotion/react";
import { useImmer } from "use-immer";
import Notif from "@ui/notif";
import Metadata from "@ui/metadata";
import Doc from "@ui/doc";

export default () => {
  const { id, session } = useParams();
  const { colors } = useTheme();
  const user = useUser();
  const characters = useAsync(
    async () =>
      await fetch(`/data/characters?user=${user.username}`)
        .then(async (res) => [await res.json()])
        .then((f) => f.filter((char) => char.campaignId == id))
  ).result;
  console.log(characters);
  const [summary, update] = useImmer({
    author: characters ? characters[0] : null,
    text: "",
    session: session
  });
  useAsync(
    async () =>
      await fetch(`/data/logbook?campaign=${id}&session=${session}`)
        .then((res) => res.json())
        .then((j) => j != null && update(j))
  );
  return (
    <div
      css={css`
        position: relative;
        background-color: ${colors.background};
        border: 1px solid ${colors.accent};
        padding: 10px;
        > * {
          margin-bottom: 5px;
        }
        .quill {
          height: 70vh;
          .ql-container {
            height: 65vh;
          }
        }
        > button {
          position: absolute;
          top: 10px;
          right: 10px;
        }
      `}>
      <Metadata
        pairs={[
          [
            "Author",
            <>
              {characters && (
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
              )}
            </>
          ],
          [
            "Session",
            <input
              type="number"
              value={summary.session}
              onChange={(e) => {
                update((draft) => {
                  draft.session = e.target.valueAsNumber;
                });
              }}
            />
          ]
        ]}
      />
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

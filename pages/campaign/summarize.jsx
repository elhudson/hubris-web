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
import Loading from "@ui/loading";
import Counter from "@ui/counter";
import NumberBox from "@ui/numberBox";
import { useState } from "react";

export default () => {
  const { id, session } = useParams();
  const { username } = useUser();
  const data = async () => {
    const characters = await fetch(`/data/characters?user=${username}`)
      .then((res) => res.json())
      .then((f) => f.filter((char) => char.Campaign?.id == id));
    const summary = await fetch(
      `/data/logbook?campaign=${id}&session=${session}`
    ).then((j) => j.json());
    return { characters: characters, summary: summary };
  };
  return (
    <Loading
      getter={data}
      render={({ characters, summary }) => (
        <Summary
          s={summary}
          characters={characters}
        />
      )}
    />
  );
};

const Summary = ({ s, characters }) => {
  const { id, session } = useParams();
  const [editable, setEditable] = useState(false);
  const { colors, classes } = useTheme();
  const [summary, update] = useImmer(
    s ?? {
      author: characters ? characters[0] : null,
      text: "",
      session: useParams()?.session,
      font: null,
      size: 14
    }
  );
  const setFormat = (prop, val) => {
    update((draft) => {
      _.set(draft, prop, val);
    });
  };
  return (
    <main
      css={css`
        position: relative;
        .quill {
          max-height: 70vh;
          .ql-container {
            height: 65vh;
          }
        }
        background-color: ${colors.background};
        border: 1px solid ${colors.accent};
        padding: 10px;
        span {
          width: fit-content;
        }
        section {
          > button {
            position: absolute;
            top: 10px;
            right: 10px;
          }
          > *:first-child {
            margin-bottom: 10px;
          }
        }
      `}>
      <section>
        <Metadata
          pairs={[
            [
              "Author",
              <Select
                current={summary.author}
                options={characters}
                valuePath="id"
                displayPath="biography.name"
                onChange={
                  editable
                    ? (e) => {
                        update((draft) => {
                          draft.author = _.find(characters, (c) => c.id == e);
                        });
                      }
                    : null
                }
              />
            ],
            [
              "Session",
              <Counter
                valuePath="session"
                item={summary}
                inc={
                  editable
                    ? () => {
                        update((draft) => {
                          draft.session += 1;
                        });
                      }
                    : null
                }
                dec={
                  editable
                    ? () => {
                        update((draft) => {
                          draft.session -= 1;
                        });
                      }
                    : null
                }
              />
            ]
          ]}
        />
        <Doc
          text={summary.text}
          options={{
            font: summary.font,
            size: summary.size,
            update: setFormat
          }}
          onChange={
            editable
              ? (e) => {
                  update((draft) => {
                    draft.text = e;
                  });
                }
              : null
          }
        />
        <button onClick={() => setEditable(!editable)}>
          {editable ? "Stop Editing" : "Edit"}
        </button>
      </section>
      <Notif
        css={classes.elements.post}
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
    </main>
  );
};

import { useParams } from "react-router-dom";
import _ from "lodash";
import Notepad from "@ui/notepad";
import { useUser } from "@contexts/user";
import Select from "@ui/select";
import { useAsync } from "react-async-hook";
import { css } from "@emotion/css";
import { useImmer } from "use-immer";

import ReactQuill from "react-quill";
import { useEffect, useRef } from "react";
import "react-quill/dist/quill.snow.css";
import { useTheme } from "@emotion/react";

export default ({}) => {
  const { id } = useParams();
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
    session: 0
  });
  return (
    <div
      className={css`
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
      <div>
        <Doc
          text={summary.text}
          onChange={(e) => {
            update((draft) => {
              draft.text = e;
            });
          }}
        />
      </div>
    </div>
  );
};

const Doc = ({ text, onChange }) => {
  const ref = useRef(null);
  const { colors, palette } = useTheme();
  useEffect(() => {
    ref.current?.editor.root.setAttribute("spellcheck", false);
  }, []);
  return (
    <ReactQuill
      theme={"snow"}
      className={css`
      height: 80vh;
        .ql-toolbar,
        .ql-container {
          border: 1px solid ${colors.accent};
        }
        .ql-formats button {
          border: 1px solid ${colors.accent};
          &:hover {
            background-color: ${palette.accent1};
          }
          &.ql-active {
            background-color: ${colors.accent};
            .ql-stroke {
              stroke: ${colors.background};
            }
            .ql-fill {
              fill: ${colors.background};
            }
          }
        }
        p {
          max-width: 99%;
        }
      `}
      ref={ref}
      value={text}
      onChange={onChange}
      readOnly={onChange == null}
      modules={{
        toolbar: ["bold", "italic", "underline", "strike"]
      }}
    />
  );
};

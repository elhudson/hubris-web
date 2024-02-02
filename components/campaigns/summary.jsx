import Notepad from "@ui/notepad";
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";
import { DateTime } from "luxon";
import { GiQuill } from "react-icons/gi";

export default ({
  author,
  timestamp,
  campaign,
  text,
  session
}) => {
  const { colors, palette } = useTheme();
  return (
    <div
      className={css`
        div.metadata {
          display: grid;
          grid-template-columns: max-content auto;
          label {
            font-weight: bold;
          }
        }
        div.quill {
          background-color: ${palette.accent1};
          border: 1px dashed ${colors.accent};
        }
        >h3 {
          display:inline;
          margin-right:5px;
        }
        >button {
          all: unset;
        }
      `}>
      <h3>Session {session}</h3>
      <button>
        <a href={`/campaign/${campaign.id}/summaries/${session}`}>
          <GiQuill />
        </a>
      </button>
      <div className="metadata">
        <label>Author</label>
        <span>{author.biography.name}</span>
        <label>Last Edited</label>
        <span>
          {new DateTime(timestamp).toLocaleString(DateTime.DATETIME_FULL)}
        </span>
      </div>
      <Notepad text={text} />
    </div>
  );
};

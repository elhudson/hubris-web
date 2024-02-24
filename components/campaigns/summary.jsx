import Notepad from "@ui/notepad";
import { useTheme, css } from "@emotion/react";
import { DateTime } from "luxon";
import { GiQuill } from "react-icons/gi";
import Metadata from "@ui/metadata";
import Description from "@components/description";

export default ({ author, timestamp, campaign, text, session }) => {
  const { colors, palette, classes } = useTheme();
  return (
    <article
      css={css`
        position: relative;
        > button {
          position: absolute;
          top: 5px;
          right: 5px;
        }
      `}>
      <h3>Session {session}</h3>
      <button>
        <a href={`/campaign/${campaign.id}/summaries/${session}`}>
          <GiQuill />
        </a>
      </button>
      <div css={[classes.elements.description, classes.decorations.dashed]}>
        <Description text={text} />
      </div>
    </article>
  );
};

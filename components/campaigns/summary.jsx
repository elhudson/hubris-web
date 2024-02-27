import { useTheme, css } from "@emotion/react";
import { GiQuill } from "react-icons/gi";
import Description from "@components/description";

export default ({ author, timestamp, campaign, text, session }) => {
  const { colors, palette, classes } = useTheme();
  return (
    <section
      css={css`
        position: relative;
        > button {
          all: unset;
          position: absolute;
          top: 0;
          right: 0;
        }
      `}>
      <a href={`/campaign/${campaign.id}/summaries/${session}`}>
        <h3>Session {session}</h3>
      </a>
      <div css={[classes.elements.description, classes.decorations.dashed]}>
        <Description text={text} />
      </div>
    </section>
  );
};

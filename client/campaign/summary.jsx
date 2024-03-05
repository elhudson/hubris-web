import { css, useTheme } from "@emotion/react";

import { Description } from "@interface/components";
import { compile } from "html-to-text";

const options = {
  limits: {
    maxBaseElements: 1,
    maxChildNodes: 1,
  },
};

export default ({ author, timestamp, campaign, text, session }) => {
  const { colors, palette, classes } = useTheme();
  const converter = compile({
    limits: {
      ...options.limits,
      ellipsis: `<a href="/campaign/${campaign.id}/summaries/${session}">[read more...]</a>`,
    },
  });
  const plain = converter(text);
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
      `}
    >
      <a href={`/campaign/${campaign.id}/summaries/${session}`}>
        <h3>Session {session}</h3>
      </a>
      <div
        css={[
          classes.elements.description,
          classes.decorations.dashed,
          css`
            font-family: "Iosevka Web" !important;
            font-size: 12px !important;
          `,
        ]}
      >
        <Description text={plain} />
      </div>
    </section>
  );
};

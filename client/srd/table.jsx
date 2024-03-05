import { css, useTheme } from "@emotion/react";

import { Rules } from "@client/srd";
import { sql_danger } from "utilities";
import { useParams } from "react-router-dom";

export default () => {
  const { colors } = useTheme();
  const { table } = useParams();
  return (
    <>
      <h2>{sql_danger(table)}</h2>
      <main
        css={css`
          border: 1px solid ${colors.accent};
          padding: 10px;

          &::scrollbar-track-color {
            color: ${colors.accent};
          }
        `}
      >
        {Rules[table]}
      </main>
    </>
  );
};

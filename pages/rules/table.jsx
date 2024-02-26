import { css, useTheme } from "@emotion/react";
import { useParams } from "react-router-dom";
import { sql_danger } from "utilities";
import rules from "@pages/rules/tables";

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
        `}>
        {rules[table]}
      </main>
    </>
  );
};

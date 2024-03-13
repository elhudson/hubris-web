import { css, useTheme } from "@emotion/react";

import { Tables } from "@client/srd";
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
        {table == "injuries" && <Tables.Injuries />}
        {table == "settings" && <Tables.Settings />}
        {table == "skills" && <Tables.Skills />}
        {table == "tags" && <Tables.Tags />}
        {table == "attributes" && <Tables.Attributes />}
        {table == "class_features" && <Tables.ClassFeatures />}
        {table=="backgrounds" && <Tables.Backgrounds/>}
        {table == "tag_features" && <Tables.TagFeatures />}
        {table == "effects" && <Tables.Effects />}
        {table == "ranges" && <Tables.Ranges />}
        {table == "durations" && <Tables.Durations />}
      </main>
    </>
  );
};

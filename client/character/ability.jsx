import { css, useTheme } from "@emotion/react";

import { Metadata } from "@client/character";
import { Rule } from "@interface/components";
import _ from "lodash";
import { ruleContext } from "contexts";

const Ability = ({ data, table }) => {
  const { colors } = useTheme();
  return (
    <div
      css={css`
        border: 1px solid ${colors.accent};
        header {
          border-bottom: 1px solid ${colors.accent};
          padding: 2px 3px;
          text-align: center;
          white-space: nowrap;
          a {
            text-decoration: none;
            font-weight: bold;
          }
        }
      `}>
      <ruleContext.Provider
        value={{
          table: table,
          location: "character_sheet",
          icon:
            table == "background_features"
              ? data.backgroundsId
              : table == "class_features"
              ? data.class_paths.id
              : null
        }}>
        <Rule data={data} />
      </ruleContext.Provider>
    </div>
  );
};

export const Effect = ({ data, withHeader = false }) => {
  return (
    <Ability
      data={data}
      withHeader={withHeader}
      table="effects">
      <Metadata effect={data} />
    </Ability>
  );
};

export default Ability;

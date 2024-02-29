import Icon from "@ui/icon";
import _ from "lodash";
import Metadata from "./metadata";
import Color from "color";
import { useTheme, css } from "@emotion/react";
import Rule from "@components/rule";
import { ruleContext } from "@contexts/rule";

const Ability = ({ data, table, children = null }) => {
  const { colors, classes } = useTheme();
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
              ? data.class_PathsId
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

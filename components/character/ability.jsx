import Icon from "@ui/icon";
import _ from "lodash";
import Metadata from "./metadata";
import { css } from "@emotion/css";
import Color from "color";
import { useTheme } from "@emotion/react";
import Option from "@components/options/option";

const Ability = ({ data, table, children = null, withHeader = true }) => {
  const { colors } = useTheme();
  return (
    <div
      className={css`
        max-width: 25vw;
        min-width: 100px;
        border: 1px solid ${colors.accent};
        > div:first-child {
          button[role="checkbox"] {
            display: none;
          }
        }
      `}>
      <Option
        data={data}
        table={table}
        withHeader={withHeader}
      />
      {children}
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

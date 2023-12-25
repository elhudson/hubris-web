import Icon from "@ui/icon";
import _ from "lodash";
import Metadata from "./metadata";
import { css } from "@emotion/css";
import Color from "color";
import { useTheme } from "@emotion/react";

const Ability = ({ data, table, children = null }) => {
  const { colors } = useTheme();
  return (
    <div
      className={css`
        border:1px dashed ${colors.text};
        padding:2px;
        background-color: ${colors.bg1};
      `}>
      <h4>
        <Icon
          id={data.id}
          sz={20}
        />
        {data.title}
      </h4>
      <div className="description dashed">{data.description}</div>
      {children}
    </div>
  );
};

export const Effect = ({ data }) => {
  return (
    <Ability
      data={data}
      table="effects">
      <Metadata effect={data} />
    </Ability>
  );
};

export default Ability;

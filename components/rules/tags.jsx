import { useParams } from "react-router-dom";
import { useAsync } from "react-async-hook";
import { sql_danger, prop_sorter } from "utilities";
import _ from "lodash";
import Icon from "@ui/icon";
import Tooltip from "@ui/tooltip";
import { GiPathDistance } from "react-icons/gi";
import { useTheme } from "@emotion/react";
import { css } from "@emotion/css";
import { Link } from "react-router-dom";

export default () => {
  const { table } = useParams();
  const entries = useAsync(
    async () =>
      await fetch(`/data/rules?table=tags`).then((result) => result.json())
  );
  return (
    <>
      <h1>{sql_danger(table)}</h1>
      <div
        className={css`
          display: flex;
          flex-wrap: wrap;
        `}>
        {entries.result && entries.result.map((i) => <Tag data={i} />)}
      </div>
    </>
  );
};

export const Tag = ({ data }) => {
  const { table } = useParams();
  const { colors } = useTheme();
  return (
    <div
      className={css`
        border: 1px solid ${colors.accent};
        width: fit-content;
      `}>
      <Tooltip
        preview={
          <Link to={`/srd/${table}/${data.id}`}>
            <Icon
              id={data.id}
              sz={100}
            />
          </Link>
        }>
        {data.title}
      </Tooltip>
    </div>
  );
};

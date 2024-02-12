import { useParams } from "react-router-dom";
import { useAsync } from "react-async-hook";
import { sql_danger, prop_sorter } from "utilities";
import _ from "lodash";
import Icon from "@ui/icon";
import Tooltip from "@ui/tooltip";
import { GiPathDistance } from "react-icons/gi";
import { useTheme, css } from "@emotion/react";
import { Link } from "react-router-dom";

export default ({ items, render = null, icon = "id", props = null }) => {
  const { colors } = useTheme();
  return (
    <ul
      css={css`
        margin: unset;
        padding: unset;
        section {
          display: block;
          padding-left: 20px;
          margin-left: 10px;
          border-left: 1px solid ${colors.accent};
          font-size: 12px !important;
          label {
            font-weight: bold;
            text-decoration: unset;
          }
        }
        li {
          > *:not(section, ul) {
            display: inline-flex;
          }
          &::marker {
            content: "";
          }
        }
      `}>
      {items.map((i) =>
        render ? (
          render(i)
        ) : (
          <li>
            <Icon
              id={_.get(i, icon)}
              sz={18}
            />
            <h3>
              <Link to={i.id}>{i.title}</Link>
            </h3>
            <section>{props && props(i)}</section>
          </li>
        )
      )}
    </ul>
  );
};

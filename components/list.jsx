import _ from "lodash";
import Icon from "@ui/icon";
import { useTheme, css } from "@emotion/react";
import { Link } from "react-router-dom";

export default ({
  items,
  render = null,
  icon = "id",
  props = null,
  checkbox = null,
}) => {
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
            {checkbox && checkbox(i)}
            <section>{props && props(i)}</section>
          </li>
        )
      )}
    </ul>
  );
};

import { css, useTheme } from "@emotion/react";
import { Link } from "@interface/components";
import { Icon } from "@interface/ui";
import _ from "lodash";
import { useAsync } from "react-async-hook";
import { ruleContext, useRule } from "contexts";
export default ({
  items,
  render = null,
  icon = "id",
  props = null,
  checkbox = null
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
          <li
            css={css`
              position: relative;
              button[role="checkbox"] {
                position: absolute;
                right: 0;
                top: 0;
                height: fit-content;
              }
            `}>
            <Icon
              id={_.get(i, icon)}
              sz={18}
            />
            <Item {...i} />
            {checkbox && checkbox(i)}
            <section>{props && props(i)}</section>
          </li>
        )
      )}
    </ul>
  );
};

const Item = ({ title, id }) => {
  const { table } = useRule();
  return (
    <Link
      feature={{ id, title }}
      table={table}
    />
  );
};

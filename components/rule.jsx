import Link from "@components/link";
import Icon from "@ui/icon";
import Tag from "@components/tag";
import { useTheme, css } from "@emotion/react";
import Description from "@components/description";
import { useRule } from "@contexts/rule";
import _ from "lodash";
import { useAsync } from "react-async-hook";
import Option from "@components/options/option";
import Metadata from "@ui/metadata";
import { useRef } from "react";

export default ({ data, children = null }) => {
  const self = useRef();
  var { location, table, icon } = useRule();
  const { colors } = useTheme();
  if (table == null) {
    table = useAsync(
      async () => await fetch(`/data/table?id=${data.id}`).then((r) => r.text())
    ).result;
  }
  const { classes } = useTheme();
  return (
    <div
      ref={self}
      css={css`
        position: relative;
        header {
          padding: 0px 5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        a {
          &:hover {
            text-decoration: underline;
            font-style: italic;
            text-underline-offset: 2px;
            cursor: pointer;
          }
        }
      `}>
      <header>
        <Icon
          id={_.get(data, icon)}
          sz={15}
        />
        <Link
          table={table}
          feature={data}
        />
        {(location == "levelup" || location == "create") && (
          <span
            css={css`
              position: absolute;
              right: 0;
              top: 0;
            `}>
            <Option
              data={data}
              ref={self}
            />
          </span>
        )}
      </header>
      {children && <section>{children}</section>}
      <section>
        <div css={[classes.decorations.dashed, classes.elements.description]}>
          {data.description && <Description text={data.description} />}
        </div>
      </section>
      <section
        css={css`
          > div {
            margin: 0px 5px;
            padding: 0px 5px;
            &:last-child {
              float: right;
            }
          }
        `}>
        <div
          css={css`
            display: inline-flex;
            gap: 5px;
            border: 1px solid ${colors.accent};
            svg {
              padding-right: unset;
              vertical-align: top;
            }
          `}>
          {Array.isArray(data.children) &&
          <Indicators
            table={table}
            data={data}
          />
          }
        </div>
        <div
          css={css`
            > span:not(:last-child):not(:empty):after {
              content: " / ";
            }
          `}>
          <span className="power">{data?.power}</span>
          <span className="xp">{data?.xp}</span>
        </div>
      </section>
    </div>
  );
};

const Indicators = ({ table, data }) => {
  return (
    <>
      {table == "effects" ? (
        data?.tags?.map((t) => <Tag {...t} />)
      ) : table == "class_features" ? (
        <Tag {...data?.class_paths} />
      ) : table == "tag_features" ? (
        <Tag {...data?.tags} />
      ) : table == "ranges" || table == "durations" ? (
        data?.trees?.map((t) => <Tag {...t} />)
      ) : null}
    </>
  );
};

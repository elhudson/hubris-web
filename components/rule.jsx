import Link from "@components/link";
import Icon from "@ui/icon";
import { useTheme, css } from "@emotion/react";
import Description from "@components/description";
import { useRule } from "@contexts/rule";
import _ from "lodash"

export default ({ data }) => {
  const { location, table, iconPath } = useRule();
  const { classes } = useTheme();
  return (
    <div
      css={css`
      header {
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
          id={_.get(data, iconPath)}
          sz={15}
        />
        <Link
          table={table}
          feature={data}
        />
      </header>
      <section>
        <div css={[classes.decorations.dashed, classes.elements.description]}>
          {data.description && <Description text={data.description} />}
        </div>
      </section>
    </div>
  );
};

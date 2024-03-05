import { Ability } from "@client/character";
import { Icon } from "@interface/ui";
import _ from "lodash";
import { css } from "@emotion/react";

export default ({ features, table, by }) => {
  const paths = _.groupBy(features, (f) => _.get(f, by).title);
  return (
    <table
      css={css`
        th {
          text-align: center;
          padding: 0px 5px;
          svg {
            padding-right: unset;
          }
        }
        td {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
         >* {
          width: 150px;
          flex-grow: 1;
          flex-shrink: 0;
         }
        }
      `}>
      {Object.entries(paths).map(([path, abilities]) => (
        <tr>
          <th>
            <Icon id={_.get(abilities[0], by).id} sz={30} />
            <h4>{path}</h4>
          </th>
          <td>
            {abilities.map((c) => (
              <Ability
                data={c}
                table={table}
              />
            ))}
          </td>
        </tr>
      ))}
    </table>
  );
};


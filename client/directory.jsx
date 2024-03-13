import { Link, useLoaderData } from "react-router-dom";
import { css, useTheme } from "@emotion/react";
import { sql_danger, sql_safe } from "utilities";

import { FaDiceD20 } from "react-icons/fa6";

const Wiki = () => {
  const { colors } = useTheme();
  const tables = useLoaderData();
  return (
    <div
      css={css`
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        section {
          flex-grow: 1;
        }
        ul {
          margin-left: unset;
          padding-left: 5px;
          border-left: 1px solid ${colors.accent};
          li {
            font-size: 16px;
            a {
              margin-left: 10px;
            }
            &::marker {
              content: "";
            }
          }
        }
      `}
    >
      <section>
        <h2>Rules</h2>
        <ul>
          {tables.map((title) => (
            <li>
              <FaDiceD20 />
              <Link to={`/srd/${sql_safe(title)}`}>{sql_danger(title)}</Link>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Resources</h2>
        <ul>
          <li>
            <FaDiceD20 />
            <Link to={"/srd/powers"}>Powers</Link>
          </li>
          <li>
            <FaDiceD20 />
            <Link to={"/srd/settings"}>Settings</Link>
          </li>
        </ul>
      </section>
      <section>
        <h2>Tools</h2>
        <ul>
          <li>
            <FaDiceD20 />
            <Link to="/srd/calculator">Power Calculator</Link>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Wiki;

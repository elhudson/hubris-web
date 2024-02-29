import { useAsync } from "react-async-hook";
import { sql_danger, sql_safe } from "utilities";
import { Link } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { css } from "@emotion/react";
import { FaD, FaDiceD20 } from "react-icons/fa6";

const Wiki = () => {
  const { colors, classes } = useTheme();
  const tables = async () => await fetch("/data/tables").then((j) => j.json());
  const getTables = useAsync(tables);
  return (
    <div
      css={css`
        display: flex;
        gap: 10px;
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
      `}>
      <section>
        <h2>Rules</h2>
        <ul>
          {getTables.result &&
            getTables.result.map((title) => (
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
            <Link to={"/db/powers"}>Powers</Link>
          </li>
          <li>
            <FaDiceD20 />
            <Link to={"/db/settings"}>Settings</Link>
          </li>
        </ul>
      </section>
      <section>
        <h2>Tools</h2>
        <ul>
          <li>
            <FaDiceD20 />
            <Link to="/tools/calculator">Power Calculator</Link>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Wiki;

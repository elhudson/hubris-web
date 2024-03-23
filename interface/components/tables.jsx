import { sql_danger, sql_safe } from "utils";

import { Loading } from "@interface/ui";

export default () => {
  const tables = async () => await fetch("/data/tables").then((j) => j.json());
  return (
    <Loading
      getter={tables}
      render={(tables) => (
        <ul>
          {tables.map((t) => (
            <li>
              <a href={`/srd/${sql_safe(t)}`}>{sql_danger(t)}</a>
            </li>
          ))}
        </ul>
      )}
    />
  );
};

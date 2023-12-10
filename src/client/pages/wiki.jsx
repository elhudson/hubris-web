import { useAsync } from "react-async-hook";
import { sql_safe } from "utilities";

const Wiki = () => {
  const tables = async () => await fetch("/data/tables").then((j) => j.json());
  const getTables = useAsync(tables);
  return (
    <>
      <h1>Wiki</h1>
      <div>
        {getTables.result && (
          <ul>
            {getTables.result.map((t) => (
              <li>
                <a href={`/srd/${sql_safe(t)}`}>{t}</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Wiki;

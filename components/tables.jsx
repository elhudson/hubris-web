import { useAsync } from "react-async-hook";
import { sql_safe } from "utilities";

export default () => {
  const tables = useAsync(
    async () => await fetch("/data/tables").then((j) => j.json())
  ).result;
  return (
    <>
      {tables &&
        tables.map((t) => (
          <li>
            <a href={`/srd/${sql_safe(t)}`}>{t}</a>
          </li>
        ))}
    </>
  );
};

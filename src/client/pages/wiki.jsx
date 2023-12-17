import { useAsync } from "react-async-hook";
import { sql_safe } from "utilities";
import Grid from "@ui/grid";

const Wiki = () => {
  const tables = async () => await fetch("/data/tables").then((j) => j.json());
  const getTables = useAsync(tables);
  return (
    <>
      {getTables.result && (
        <Grid>
          {getTables.result.map((title) => (
            <a
              className="center"
              href={`/srd/${sql_safe(title)}`}>
              {title}
            </a>
          ))}
        </Grid>
      )}
    </>
  );
};

export default Wiki;

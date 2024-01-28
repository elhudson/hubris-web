import { useAsync } from "react-async-hook";
import { sql_safe } from "utilities";
import Grid from "@ui/grid";

const Wiki = () => {
  const tables = async () => await fetch("/data/tables").then((j) => j.json());
  const getTables = useAsync(tables);
  return (
    <>
      <div>
        <h3>Rules</h3>
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
      </div>
      <div>
        <h3>Resources</h3>
        <Grid>
          {[<a
            className="center"
            href="/db/powers">
            Powers
          </a>]}
        </Grid>
      </div>
    </>
  );
};

export default Wiki;

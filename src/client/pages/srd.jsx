import { useParams } from "react-router-dom";
import { useAsync } from "react-async-hook";
import { sql_danger, prop_sorter } from "utilities";
import _ from "lodash";

export const Srd = () => {
  const { table } = useParams();
  const entries = useAsync(
    async () =>
      await fetch(`/data/rules?table=${table}`).then((result) => result.json())
  );
  return (
    <>
      <h1>{sql_danger(table)}</h1>
      <div>
        {entries.result && entries.result.map((i) => <Rule data={i} />)}
      </div>
    </>
  );
};

export const Rule = ({ data }) => {
  const props = prop_sorter(data);
  return (
    <div>
      <h3>{data.title}</h3>
      <div>
        {props.basic.map((s) => (
          <div>
            <b>{s}:</b> {data[s]}
          </div>
        ))}
      </div>
      <p>{data.description}</p>
    </div>
  );
};

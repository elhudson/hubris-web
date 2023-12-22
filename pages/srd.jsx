import { useParams } from "react-router-dom";
import { useAsync } from "react-async-hook";
import { sql_danger, prop_sorter } from "utilities";
import _ from "lodash";
import Icon from "@ui/icon";
import { GiPathDistance } from "react-icons/gi";

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
  const { table } = useParams();
  return (
    <div>
      <h3>
        <Icon
          id={data.id}
          sz={20}
        />
        <a href={`/srd/${table}/${data.id}`}>{data.title}</a>
      </h3>
    </div>
  );
};

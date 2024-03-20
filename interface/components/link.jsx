import { Link } from "react-router-dom";
import { sql_safe } from "utilities";
export default ({ feature, table }) => {
  return (
    <Link to={`/srd/${sql_safe(table ?? "")}/${feature?.id}`}>
      {feature?.title}
    </Link>
  );
};

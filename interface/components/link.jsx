import { Link } from "react-router-dom";

export default ({ feature, table }) => {
  return <Link reloadDocument to={`/srd/${table}/${feature?.id}`}>{feature?.title}</Link>;
};

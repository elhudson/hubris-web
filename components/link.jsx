import { Link } from "react-router-dom";

export default ({ feature, table }) => {
  return <Link to={`/srd/${table}/${feature.id}`}>{feature.title}</Link>;
};

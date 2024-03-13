import { Organizer, Tree } from "@interface/components";

import { groupBy } from "utilities";
import { useLoaderData } from "react-router-dom";

export default () => {
  const features = groupBy(useLoaderData(), e=> e.trees, "effects")
  return (
    <Organizer
      options={features}
      render={(path) => <Tree items={path["effects"]} />}
    />
  );
};

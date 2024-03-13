import { Organizer, Tree } from "@interface/components";

import { groupBy } from "utilities";
import { useLoaderData } from "react-router-dom";

export default () => {
  const features = groupBy(useLoaderData(), (g) => g.trees[0], "ranges");
  return (
    <Organizer
      options={features}
      render={(path) => <Tree items={path["ranges"]} />}
    />
  );
};

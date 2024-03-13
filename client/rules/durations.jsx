import { Organizer, Tree } from "@interface/components";

import { groupBy } from "utilities";
import { useLoaderData } from "react-router-dom";

export default () => {
  const features = groupBy(useLoaderData(), f=> f.trees[0], "durations")
  return (
    <Organizer
      options={features}
      render={(path) => <Tree items={path["durations"]} />}
    />
  );
};

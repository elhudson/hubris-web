import { Organizer, Tree } from "@interface/components";

import { groupBy } from "utilities";
import { useLoaderData } from "react-router-dom";

export default () => {
  const features = groupBy(useLoaderData(), f=> f.classes, "class_features")
  return (
    <Organizer
      options={features}
      render={(path) => <Tree items={path["class_features"]} />}
    />
  );
};

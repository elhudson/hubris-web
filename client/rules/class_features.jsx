import { Organizer, Tree } from "@interface/components";

import { groupBy } from "utilities";
import { useLoaderData } from "react-router-dom";
import { useRule, useOptions } from "contexts";
export default () => {
  const data = useRule().location == "wiki" ? useLoaderData(): useOptions().data;
  const features = groupBy(data, (d) => d.classes, "class_features");
  return (
    <Organizer
      options={features}
      render={(path) => <Tree items={path["class_features"]} />}
    />
  );
};

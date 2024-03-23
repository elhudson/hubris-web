import { Organizer, Tree } from "@interface/components";
import { useOptions, useRule } from "contexts";

import { groupBy } from "utils";
import { useLoaderData } from "react-router-dom";

export default () => {
  const data =
    useRule().location == "wiki" ? useLoaderData() : useOptions().data;
  const features = groupBy(data, (f) => f.tags, "tag_features");
  return (
    <Organizer
      options={features}
      render={(path) => <Tree items={path["tag_features"]} />}
    />
  );
};

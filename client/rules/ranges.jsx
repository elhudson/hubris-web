import { Organizer, Tree } from "@interface/components";
import { useRule, useOptions } from "contexts";
import { groupBy } from "utilities";
import { useLoaderData } from "react-router-dom";

export default () => {
  const data = useRule().location == "wiki" ? useLoaderData() : useOptions().data;
  const features = groupBy(data, (e) => e.trees[0], "ranges");
  return (
    <Organizer
      options={features}
      render={(path) => <Tree items={path["ranges"]} />}
    />
  );
};

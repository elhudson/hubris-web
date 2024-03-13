import { List, Metadata } from "@interface/components";

import { useLoaderData } from "react-router-dom";

export default ({ checkbox = null }) => {
  const features = useLoaderData();
  return (
    <List
      items={features}
      checkbox={checkbox}
      props={(f) => (
        <Metadata
          feature={f}
          props={[
            "attributes",
            "tags",
            "class_paths",
            "weaponry",
            "armory",
            "hit_dice",
          ]}
        />
      )}
    />
  );
};

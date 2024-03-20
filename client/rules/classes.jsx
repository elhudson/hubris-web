import { List, Metadata } from "@interface/components";
import { useRule, useOptions } from "contexts";
import { useLoaderData } from "react-router-dom";

export default ({ checkbox = null }) => {
  const features =
    useRule().location != "wiki" ? useOptions().data : useLoaderData();
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
            "hit_dice"
          ]}
        />
      )}
    />
  );
};

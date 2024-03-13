import { List, Metadata } from "@interface/components";

import { useLoaderData } from "react-router-dom";

export default ({ checkbox = null }) => {
  const features = useLoaderData();
  return (
    <List
      checkbox={checkbox}
      items={features}
      props={(f) => (
        <Metadata
          feature={f}
          props={["backgrounds", "attributes"]}
        />
      )}
    />
  );
};

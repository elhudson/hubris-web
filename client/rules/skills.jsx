import { List, Metadata } from "@interface/components";
import { useRule, useOptions } from "contexts";
import { useLoaderData } from "react-router-dom";

export default ({ checkbox = null }) => {
  const data = useRule().location == "wiki" ? useLoaderData() : useOptions().data;
  return (
    <List
      checkbox={checkbox}
      items={data}
      props={(f) => (
        <Metadata
          feature={f}
          props={["backgrounds", "attributes"]}
        />
      )}
    />
  );
};

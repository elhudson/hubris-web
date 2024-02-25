import { useAsync } from "react-async-hook";
import _ from "lodash";
import List from "@components/list";
import Metadata from "@components/metadata";
import { useOptions } from "@contexts/options";

export default ({ checkbox = null }) => {
  const context = useOptions();
  const features =
    context?.options ??
    useAsync(
      async () =>
        await fetch(`/data/rules?table=skills&relations=true`)
          .then((result) => result.json())
          .then((f) => _.sortBy(f, "title"))
    ).result;
  return (
    <>
      {features && (
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
      )}
    </>
  );
};

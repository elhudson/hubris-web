import _ from "lodash";
import List from "@components/list";
import Metadata from "@components/metadata";
import { useOptions } from "@contexts/options";
import Loading from "@ui/loading";

export default ({ checkbox = null }) => {
  const context = useOptions();
  const features = async () =>
    context?.options ??
    (await fetch(`/data/rules?table=skills&relations=true`)
      .then((result) => result.json())
      .then((f) => _.sortBy(f, "title")));
  return (
    <Loading
      getter={features}
      render={(features) => (
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
    />
  );
};

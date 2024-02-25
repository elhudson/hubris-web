import { useAsync } from "react-async-hook";
import _ from "lodash";
import Metadata from "@components/metadata";
import List from "@components/list";

export default () => {
  const entries = useAsync(
    async () =>
      await fetch(`/data/rules?table=tags&relations=true`)
        .then((result) => result.json())
        .then((f) => _.sortBy(f, "title"))
  );
  return (
    <>
      {entries.result && (
        <List
          items={entries.result}
          props={(entry) => (
            <Metadata
              feature={entry}
              props={["classes"]}
            />
          )}
        />
      )}
    </>
  );
};

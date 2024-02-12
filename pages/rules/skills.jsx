import { useAsync } from "react-async-hook";
import _ from "lodash";
import Icon from "@ui/icon";
import List from "@components/list";
import { Link } from "react-router-dom";
import Metadata from "@components/metadata";
import { useTheme, css } from "@emotion/react";

export default () => {
  const { colors } = useTheme();
  const entries = useAsync(
    async () =>
      await fetch(`/data/rules?table=skills&relations=true`)
        .then((result) => result.json())
        .then((f) => _.sortBy(f, "title"))
  );
  return (
    <>
      {entries.result && (
        <List
          items={entries.result}
          props={(f) => (
            <Metadata
              feature={f}
              props={["backgrounds", "abilities"]}
            />
          )}
        />
      )}
    </>
  );
};

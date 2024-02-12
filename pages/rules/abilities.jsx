import { useAsync } from "react-async-hook";
import _ from "lodash";
import List from "@components/list";
import { css, useTheme } from "@emotion/react";
import Icon from "@ui/icon";
import { Link } from "react-router-dom";
import Metadata from "@components/metadata";

export default () => {
  const { colors } = useTheme();
  const entries = useAsync(
    async () =>
      await fetch(`/data/rules?table=abilities&relations=true`)
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
              props={["skills", "classes", "backgrounds"]}
            />
          )}
        />
      )}
    </>
  );
};

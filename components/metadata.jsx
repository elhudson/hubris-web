import { prop_sorter, sql_danger } from "utilities";
import Link from "@components/link";
import Metadata from "@ui/metadata";
import { useAsync } from "react-async-hook";
import { css } from "@emotion/react";

export default ({ feature, props = null }) => {
  const keys = props ?? Object.keys(feature);
  const types = {
    multi: [],
    single: [],
    basic: []
  };
  keys.forEach((key) => {
    const type = getPropType(feature, key);
    types[type].push(key);
  });
  return (
    <Metadata
      pairs={[
        ...types.basic.map((s) => [sql_danger(s), <span>{feature[s] ? feature[s] : "None"}</span>]),
        ...types.single.map((s) => [
          sql_danger(s),
          <Link
            feature={feature[s]}
            table={s}
          />
        ]),
        ...types.multi.map((s) => [
          sql_danger(s),
          <span css={css`
            a:not(:last-child)::after {
              text-decoration: none;
              content: ", "
            }
          `}>
            {feature[s].length > 0
              ? feature[s].map((f) => (
                  <Link
                    feature={f}
                    table={s}
                  />
                ))
              : "None"}
          </span>
        ])
      ]}
    />
  );
};

const getPropType = (feature, prop) => {
  if (Array.isArray(feature[prop])) {
    return "multi";
  } else if (typeof (feature[prop]) == "object") {
    return "single";
  } else {
    return "basic";
  }
};

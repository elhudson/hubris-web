import { prop_sorter } from "utilities";
import { css } from "@emotion/css";

export default ({ feature, render }) => {
  const props = prop_sorter(feature);
  const excl = ["code", "damage_types", "class_paths", "background_features", "conditions"];
  return (
    <div
      className={"references "+css`
        display: grid;
        grid-template-columns: minmax(min-content, max-content) auto;
        grid-column-gap: 10px;
      `}>
      {props.basic
        .filter((f) => !excl.includes(f))
        .map((p) => render({ label: p, value: feature[p] }))}
      {props.links.single
        .filter((f) => !excl.includes(f))
        .map((p) => render({ label: p, value: feature[p] }))}
      {props.links.multi
        .filter((f) => !excl.includes(f))
        .map((p) => render({ label: p, value: feature[p] }))}
    </div>
  );
};

import ui from "interface";
import _ from "lodash";
import { css } from "@emotion/react";
import { useFilters } from "@components/catalog/powers/filters";

const treeable = (power, meta) => {
  if (power.effects.length == 0) {
    return true;
  } else {
    return (
      _.intersectionBy(
        meta.trees.map((t) => t.id),
        power.effects.map((e) => e.trees.id)
      ).length > 0
    );
  }
};

const filterItems = ({ tags, tiers, trees }, items) => {
  return items
    .filter((i) => (tiers.length == 0 ? i : tiers.includes(i.tier)))
    .filter((i) =>
      tags.length == 0 || !_.has(i, "tags")
        ? i
        : _.intersectionBy(i?.tags, tags, "id").length > 0
    )
    .filter((i) => {
      if (trees.length == 0) {
        return true;
      } else {
        if (Array.isArray(i.trees)) {
          return _.intersectionBy(trees, i.trees, "id").length > 0;
        } else {
          return trees.map((t) => t.id).includes(i.trees.id);
        }
      }
    });
};

const makeGroups = (items) =>
  _.groupBy(_.sortBy(items, "xp"), (item) =>
    Array.isArray(item.trees)
      ? item.trees.length > 1
        ? item.trees.map((t) => t.title).join(" & ")
        : item.trees[0].title
      : item.trees.title
  );

export const Effects = ({ power, options, add }) => {
  const { filters } = useFilters();
  return (
    <ui.Multi
      placeholder="Effects"
      items={filterItems(filters, options.effects)}
      labelPath={"title"}
      valuePath={"id"}
      grouper={makeGroups}
      currents={power.effects}
      onChange={add("effects")}
      isClearable={false}
    />
  );
};

export const Durations = ({ power, options, add }) => {
  const { filters } = useFilters();
  return (
    <ui.Multi
      placeholder="Durations"
      items={filterItems(
        filters,
        options.durations.filter((f) => treeable(power, f))
      )}
      labelPath={"title"}
      valuePath={"id"}
      grouper={makeGroups}
      isClearable={false}
      currents={power.durations}
      onChange={add("durations")}
    />
  );
};

export const Ranges = ({ power, options, add }) => {
  const { filters } = useFilters();
  return (
    <ui.Multi
      placeholder="Ranges"
      grouper={makeGroups}
      items={filterItems(
        filters,
        options.ranges.filter((f) => treeable(power, f))
      )}
      labelPath={"title"}
      valuePath={"id"}
      isClearable={false}
      currents={power.ranges}
      onChange={add("ranges")}
    />
  );
};

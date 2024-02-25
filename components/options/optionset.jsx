import { useCharacter } from "@contexts/character";
import { affordable, satisfies_prereqs, has_tree } from "utilities";
import { useOptions, useLimiter, handlerContext } from "@contexts/options";
import _ from "lodash";
import { current } from "immer";
import { useRule } from "@contexts/rule";

const classHandler = ({ feat, draft, e }) => {
  const die = feat.hit_dice;
  if (e) {
    if (_.isUndefined(draft.HD)) {
      draft.HD = [];
    }
    if (draft.HD.map((d) => d.die.id).includes(die.id)) {
      _.find(draft.HD, (d) => d.die.id == die.id).max += 1;
    } else {
      draft.HD.push({
        id: Math.floor(Math.random() * 1000000),
        max: 0,
        used: 0,
        die: die
      });
    }
  } else {
    const old_hd = _.find(draft.HD, (d) => d.die.id);
    if (old_hd.max == 0) {
      _.remove(draft.HD, (d) => d.die.id == old_hd.die.id);
    } else {
      old_hd.max -= 1;
    }
  }
};

const backgroundHandler = ({ feat, draft, e }) => {
  if (e) {
    draft[feat.attributes.code] += 1;
  } else {
    draft[feat.attributes.code] -= 1;
  }
};

const effectHandler = ({ feat, draft, e }) => {
  if (e) {
    _.isUndefined(draft.ranges) && (draft.ranges = []);
    _.isUndefined(draft.durations) && (draft.durations = []);
    if (draft.ranges.map((f) => f.id).includes(feat.range.id) == false) {
      draft.ranges.push(feat.range);
    }
    if (draft.durations.map((f) => f.id).includes(feat.duration.id) == false) {
      draft.durations.push(feat.duration);
    }
  } else {
    if (!has_tree(feat.trees, current(draft))) {
      _.remove(draft.ranges, feat.range);
      _.remove(draft.durations, feat.duration);
    }
  }
};

const makeHandler = ({ update, searchable, table, limiter = null }) => {
  return (e, id) => {
    update((draft) => {
      const feat = _.find(searchable, (f) => f.id == id);
      if (_.isUndefined(current(draft)[table])) {
        draft[table] = [];
      }
      if (e) {
        if (limiter) {
          if (!limiter({ draft: draft, feature: feat })) {
            return;
          }
        }
        if (affordable(feat, draft, table)) {
          if (satisfies_prereqs(feat, table, draft)) {
            draft[table].push(feat);
            table == "effects" &&
              effectHandler({ feat: feat, draft: draft, e: e });
            table == "classes" &&
              classHandler({ feat: feat, draft: draft, e: e });
            table == "backgrounds" && backgroundHandler({ feat, draft, e });
          }
        }
      } else {
        if (!required({ feat: feat, draft: draft })) {
          _.remove(draft[table], (f) => f.id == id);
          table == "effects" &&
            effectHandler({ feat: feat, draft: draft, e: e });
          table == "classes" &&
            classHandler({ feat: feat, draft: draft, e: e });
        }
      }
    });
  };
};

const required = ({ feat, draft }) => {
  if (
    draft?.effects?.map((e) => e.range?.id).includes(feat.id) ||
    draft?.effects?.map((e) => e.duration?.id).includes(feat.id)
  ) {
    return true;
  } else if (
    _.concat(
      draft?.class_features ?? [],
      draft?.tag_features ?? [],
      draft?.effects ?? [],
      draft?.ranges ?? [],
      draft?.durations ?? []
    )
      .map((d) => d?.requires?.map((j) => j.id))
      .flat(10)
      .includes(feat.id)
  ) {
    return true;
  } else {
    return false;
  }
};

export default ({ component }) => {
  const { update } = useCharacter();
  const { searchable } = useOptions();
  const { table } = useRule();
  const { limiter } = useLimiter();
  const iconPaths = {
    class_features: "class_PathsId"
  };
  const handler = makeHandler({
    update: update,
    searchable: searchable,
    table: table,
    limiter: limiter
  });
  const HandlerProvider = ({ children }) => (
    <handlerContext.Provider value={{ handler: handler, table: table }}>
      {children}
    </handlerContext.Provider>
  );
  return <HandlerProvider>{component}</HandlerProvider>;
};

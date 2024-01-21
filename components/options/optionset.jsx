import { useCharacter } from "@contexts/character";
import { owned, affordable, satisfies_prereqs, has_tree } from "utilities";
import Tree from "@components/tree";
import { useOptions, useLimiter, handlerContext } from "@contexts/options";
import _ from "lodash";
import { current } from "immer";
import { css } from "@emotion/css";
import * as Tabs from "@radix-ui/react-tabs";
import List from "../list";
import Switch from "@ui/switch";
import Icon from "@ui/icon";
import Tooltip from "@ui/tooltip";
import { useState } from "react";
import Organizer from "../rules/organizer";

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

const effectHandler = ({ feat, draft, e }) => {
  if (e) {
    _.isUndefined(draft.ranges) && (draft.ranges = []);
    _.isUndefined(draft.durations) && (draft.durations = []);
    draft.ranges.push(
      ...feat.meta.ranges.filter((f) => !owned(f, "ranges", draft))
    );
    draft.durations.push(
      ...feat.meta.durations.filter((f) => !owned(f, "durations", draft))
    );
  } else {
    if (!has_tree(feat.trees, draft)) {
      _.remove(draft.ranges, (f) =>
        f.trees.map((t) => t.id).includes(feat.trees.id)
      );
      _.remove(draft.durations, (f) =>
        f.trees.map((t) => t.id).includes(feat.trees.id)
      );
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
        if (affordable(feat, draft)) {
          if (satisfies_prereqs(feat, table, draft)) {
            draft[table].push(feat);
            table == "classes" &&
              classHandler({ feat: feat, draft: draft, e: e });
            table == "effects" &&
              effectHandler({ feat: feat, draft: draft, e: e });
          }
          draft.xp_spent += feat.xp;
        }
      } else {
        table == "effects" && effectHandler({ feat: feat, draft: draft, e: e });
        table == "classes" && classHandler({ feat: feat, draft: draft, e: e });
        _.remove(draft[table], (f) => f.id == id);
        draft.xp_spent -= feat.xp;
      }
    });
  };
};

export default () => {
  const { update } = useCharacter();
  const { searchable, options, table } = useOptions();
  const { limiter } = useLimiter();
  const handler = makeHandler({
    update: update,
    searchable: searchable,
    table: table,
    limiter: limiter
  });
  const notTrees = ["classes", "backgrounds", "skills"];
  const HandlerProvider = ({ children }) => (
    <handlerContext.Provider value={{ handler: handler, table: table }}>
      {children}
    </handlerContext.Provider>
  );
  return (
    <HandlerProvider>
      {notTrees.includes(table) ? (
        <List items={options} />
      ) : (
        <Organizer
          options={options}
          render={(path) => <Tree items={path[table]} />}
        />
      )}
    </HandlerProvider>
  );
};

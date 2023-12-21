import { useCharacter } from "@contexts/character";
import { owned, affordable, satisfies_prereqs, has_tree } from "utilities";
import Option from "./option";
import { useOptions, useLimiter } from "@contexts/options";
import _ from "lodash";
import { current } from "immer";

const classHandler = ({ feat, draft, e }) => {
  const die = feat.hit_dice;
  if (e) {
    if (draft.HD.map((d) => d.die.id).includes(die.id)) {
      _.find(draft.HD, (d) => d.die.id == die.id).max += 1;
    } else {
      draft.HD.push({
        id: Math.floor(Math.random() * 1000000),
        max: 1,
        used: 0,
        die: die
      });
    }
  } else {
    const old_hd = _.find(draft.HD, (d) => d.die.id);
    if (old_hd.max == 1) {
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
          if (!limiter(draft)) {
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
  const { character, update } = useCharacter();
  const { searchable, options, table } = useOptions();
  const { limiter } = useLimiter();
  const handler = makeHandler({
    update: update,
    searchable: searchable,
    table: table,
    limiter: limiter
  });
  if (searchable == options) {
    return (
      <OptionList
        table={table}
        items={options}
        handler={handler}
        character={character}
      />
    );
  } else {
    return (
      <div>
        {options.map((path) => (
          <div>
            <h4>{path.title}</h4>
            <OptionList
              table={table}
              items={path[table]}
              handler={handler}
              character={character}
            />
          </div>
        ))}
      </div>
    );
  }
};

const OptionList = ({ items, handler, table, character }) => {
  return (
    <div>
      {items.map((c) => (
        <Option
          data={c}
          avail={affordable(c, character)}
          owned={owned(c, table, character)}
          buy={(e) => handler(e, c.id)}
        />
      ))}
    </div>
  );
};

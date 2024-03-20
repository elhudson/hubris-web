import { affordable, satisfies_prereqs } from "utilities";
import { handlerContext, useCharacter, useOptions, useRule } from "contexts";

import _ from "lodash";

const makeHandler = ({ update, searchable, table, limiter, adder }) => {
  return (e, id) => {
    update((draft) => {
      const feat = _.find(searchable, (f) => f.id == id);
      if (_.isUndefined(_.get(draft, table))) {
        draft[table] = [];
      }
      if (e) {
        if (limiter({ draft, feature: feat })) {
          if (affordable(feat, draft, table)) {
            if (satisfies_prereqs(feat, table, draft)) {
              draft[table].push(feat);
              adder({ feat, draft, e });
            }
          }
        }
      } else {
        if (!required({ feat, draft })) {
          _.remove(draft[table], (f) => f.id == id);
          adder({ feat, draft, e });
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
  const { table } = useRule();
  const { data, adder, limiter } = useOptions();
  const handler = makeHandler({
    update: update,
    searchable: data,
    table: table,
    adder:
      adder ??
      function ({ feat, draft, e }) {
        return draft;
      },
    limiter:
      limiter ??
      function ({ draft: draft }) {
        return true;
      }
  });
  return (
    <handlerContext.Provider value={{ handler: handler, table: table }}>
      {component}
    </handlerContext.Provider>
  );
};

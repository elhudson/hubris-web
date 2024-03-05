import { Icon, Loading, Metadata, Multi, Pop, Switch } from "@interface/ui";
import { PiNumberOne, PiNumberThree, PiNumberTwo } from "react-icons/pi";
import { createContext, useContext } from "react";

import { FaFilter } from "react-icons/fa";
import _ from "lodash";
import { css } from "@emotion/react";
import { useImmer } from "use-immer";

const defaults = {
  trees: [],
  tags: [],
  tiers: [],
};

const filterContext = createContext({
  update: null,
  filters: defaults,
});

export const useFilters = () => useContext(filterContext);

export default ({ collapsible = false, children }) => {
  return <Filters collapsible={collapsible}>{children}</Filters>;
};

const Filters = ({ children, collapsible = false }) => {
  const [filters, update] = useImmer(defaults);
  return (
    <div
      css={css`
        position: relative;
        > button[aria-haspopup="dialog"] {
          position: absolute;
          z-index: 2;
          top: 0;
          right: 0;
        }
      `}>
      <filterContext.Provider value={{ filters, update }}>
        {collapsible ? (
          <Pop trigger={<FaFilter />}>
            <Controls />
          </Pop>
        ) : (
          <Controls />
        )}
        {children}
      </filterContext.Provider>
    </div>
  );
};

const Controls = () => {
  return (
    <Metadata
      css={css`
        margin: 5px;
      `}
      pairs={[
        ["Tiers", <Tiers />],
        ["Tags", <Tags />],
        ["Trees", <Trees />],
      ]}
    />
  );
};

export const Trees = () => {
  const {
    filters,
    filters: { trees },
    update,
  } = useFilters();
  const opts = async () =>
    await fetch("/data/rules?table=trees")
      .then((r) => r.json())
      .then((a) => {
        a.forEach((f) => {
          f.value = f.id;
          f.icon = (
            <Icon
              id={f.id}
              sz={20}
            />
          );
        });
        return a;
      });

  return (
    <Loading
      getter={opts}
      render={(opts) => (
        <MultiRadio
          options={opts}
          currents={trees.map((t) => t.id)}
          onChange={(opt, e) =>
            update((draft) => {
              e
                ? draft.trees.push(opt)
                : _.remove(draft.trees, (t) => t.id == opt.value);
            })
          }
        />
      )}
    />
  );
};

export const Tiers = () => {
  const {
    filters,
    filters: { tiers },
    update,
  } = useFilters();
  const opts = [
    { value: 1, icon: <PiNumberOne /> },
    { value: 2, icon: <PiNumberTwo /> },
    { value: 3, icon: <PiNumberThree /> },
  ];
  return (
    <MultiRadio
      options={opts}
      currents={tiers}
      onChange={(opt, e) =>
        update((draft) => {
          e
            ? draft.tiers.push(opt.value)
            : _.remove(draft.tiers, (t) => t == opt.value);
        })
      }
    />
  );
};

const MultiRadio = ({ options, currents, onChange }) => {
  return (
    <span role="radiogroup">
      {options.map((o) => (
        <Switch
          checked={currents.includes(o.value)}
          src={o.icon}
          onChange={(e) => onChange(o, e)}
        />
      ))}
    </span>
  );
};

export const Tags = () => {
  const opts = async () =>
    await fetch(`/data/rules?table=tags`)
      .then((res) => res.json())
      .then((s) => _.sortBy(s, "title"));
  const {
    filters,
    filters: { tags },
    update,
  } = useFilters();
  return (
    <Loading
      getter={opts}
      render={(opts) => (
        <Multi
          items={opts}
          currents={opts.filter((f) => tags.map((t) => t.id).includes(f.id))}
          labelPath="title"
          valuePath="id"
          onChange={(e) => {
            update((draft) => {
              draft.tags = e.map((o) => _.find(opts, (a) => a.id == o.value));
            });
          }}
        />
      )}
    />
  );
};

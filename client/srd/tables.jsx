import * as Rules from "@client/rules";

import { List, Metadata } from "@interface/components";

import { Loading } from "@interface/ui";
import _ from "lodash";
import { ruleContext } from "contexts";
import { useTheme } from "@emotion/react";

const Category = ({ component, table }) => {
  return (
    <ruleContext.Provider
      value={{
        location: "wiki",
        table: table,
      }}
    >
      {component}
    </ruleContext.Provider>
  );
};

const ClassFeatures = () => (
  <Category
    component={<Rules.ClassFeatures />}
    table={"class_features"}
  />
);
const TagFeatures = () => (
  <Category
    component={<Rules.TagFeatures />}
    table={"tag_features"}
  />
);
const Effects = () => (
  <Category
    component={<Rules.Effects />}
    table={"effects"}
  />
);
const Ranges = () => (
  <Category
    component={<Rules.Ranges />}
    table={"ranges"}
  />
);
const Durations = () => (
  <Category
    component={<Rules.Durations />}
    table={"durations"}
  />
);

const Injuries = () => {
  const features = async () =>
    await fetch(
      `/data/rules?table=injuries&query=${JSON.stringify({
        include: {
          conditions: true,
        },
      })}`
    ).then((t) => t.json());
  return (
    <Loading
      render={(features) => (
        <List
          items={features}
          render={(f) => <Rule data={f} />}
        />
      )}
      getter={features}
    />
  );
};

const Settings = () => {
  const settings = async () =>
    await fetch(
      `/data/rules?table=settings&query=${JSON.stringify({
        include: {
          backgrounds: true,
        },
      })}`
    ).then((t) => t.json());
  return (
    <Loading
      getter={settings}
      render={(settings) => <List items={settings} />}
    />
  );
};

const Skills = () => {
  const { colors } = useTheme();
  const entries = async () =>
    await fetch(`/data/rules?table=skills&relations=true`)
      .then((result) => result.json())
      .then((f) => _.sortBy(f, "title"));
  return (
    <Loading
      getter={entries}
      render={(data) => (
        <List
          items={data}
          props={(f) => (
            <Metadata
              feature={f}
              props={["backgrounds", "abilities"]}
            />
          )}
        />
      )}
    />
  );
};

const Tags = () => {
  const entries = async () =>
    await fetch(`/data/rules?table=tags&relations=true`)
      .then((result) => result.json())
      .then((f) => _.sortBy(f, "title"));
  return (
    <Loading
      getter={entries}
      render={(data) => (
        <List
          items={data}
          props={(entry) => (
            <Metadata
              feature={entry}
              props={["classes"]}
            />
          )}
        />
      )}
    />
  );
};

const Attributes = () => {
  const entries = async () =>
    await fetch(`/data/rules?table=attributes&relations=true`)
      .then((result) => result.json())
      .then((f) => _.sortBy(f, "title"));
  return (
    <Loading
      getter={entries}
      render={(entries) => (
        <List
          items={entries}
          props={(f) => (
            <Metadata
              feature={f}
              props={["skills", "classes", "backgrounds"]}
            />
          )}
        />
      )}
    />
  );
};

export default {
  ClassFeatures,
  TagFeatures,
  Skills,
  Ranges,
  Durations,
  Effects,
  Injuries,
  Attributes,
  Tags,
  Settings,
};

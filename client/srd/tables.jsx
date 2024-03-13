import * as Rules from "@client/rules";

import { List, Metadata, Rule } from "@interface/components";

import _ from "lodash";
import { ruleContext } from "contexts";
import { useLoaderData } from "react-router-dom";

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
const Backgrounds = () => (
  <Category
    component={<Rules.Backgrounds />}
    table={"backgrounds"}
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
  const features = useLoaderData();
  return (
    <List
      items={features}
      render={(f) => <Rule data={f} />}
    />
  );
};

const Settings = () => {
  const settings = useLoaderData();
  return <List items={settings} />;
};

const Skills = () => {
  const entries = useLoaderData();
  return (
    <List
      items={entries}
      props={(f) => (
        <Metadata
          feature={f}
          props={["backgrounds", "abilities"]}
        />
      )}
    />
  );
};

const Tags = () => {
  const data = useLoaderData();
  return (
    <List
      items={data}
      props={(entry) => (
        <Metadata
          feature={entry}
          props={["classes"]}
        />
      )}
    />
  );
};

const Attributes = () => {
  const entries = useLoaderData();
  return (
    <List
      items={entries}
      props={(f) => (
        <Metadata
          feature={f}
          props={["skills", "classes", "backgrounds"]}
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
  Backgrounds,
};

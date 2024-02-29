import _ from "lodash";
import List from "@components/list";
import { useTheme } from "@emotion/react";
import Loading from "@ui/loading";
import Metadata from "@components/metadata";
import { ruleContext } from "@contexts/rule";
import Categories from "categories";

const Category = ({ component, table }) => {
  return (
    <ruleContext.Provider
      value={{
        location: "wiki",
        table: table
      }}>
      {component}
    </ruleContext.Provider>
  );
};

const Injuries = () => {
  const features = async () =>
    await fetch(
      `/data/rules?table=injuries&query=${JSON.stringify({
        include: {
          conditions: true
        }
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
          backgrounds: true
        }
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
  class_features: (
    <Category
      table={"class_features"}
      component={<Categories.Class_Features />}
    />
  ),
  tag_features: (
    <Category
      table={"tag_features"}
      component={<Categories.Tag_Features />}
    />
  ),
  classes: (
    <Category
      table={"classes"}
      component={<Categories.Classes />}
    />
  ),
  effects: (
    <Category
      table={"effects"}
      component={<Categories.Effects />}
    />
  ),
  ranges: (
    <Category
      table={"ranges"}
      component={<Categories.Ranges />}
    />
  ),
  durations: (
    <Category
      table={"durations"}
      component={<Categories.Durations />}
    />
  ),
  backgrounds: (
    <Category
      table={"backgrounds"}
      component={<Categories.Backgrounds />}
    />
  ),
  attributes: <Attributes/>,
  skills: <Skills/>,
  tags: <Tags/>,
  injuries: <Injuries/>,
  settings: <Settings/>
};

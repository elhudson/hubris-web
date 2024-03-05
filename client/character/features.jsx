import { Layouts, Tabs } from "@interface/ui";
import { css, useTheme } from "@emotion/react";

import Ability from "./ability";
import { Table } from "@interface/components";
import _ from "lodash";
import { useCharacter } from "contexts";

const Features = () => {
  const { character } = useCharacter();
  const { classes } = useTheme();
  return (
    <Layouts.Sections>
      <section>
        <h3>Background</h3>
        <div css={classes.layout.gallery}>
          {character.backgrounds
            .filter((f) => f.background_features != null)
            .map((c) => (
              <Ability
                table={"background_features"}
                data={c.background_features}
              />
            ))}
        </div>
      </section>
      <section>
        <h3>Class</h3>
        <Sorter
          primary={"classes"}
          secondary={"class_paths"}
          features={character.class_features}
          table={"class_features"}
        />
      </section>
      <section>
        <h3>Tags</h3>
        <Table
          features={character.tag_features}
          by="tags"
          table={"tag_features"}
        />
      </section>
    </Layouts.Sections>
  );
};

const Sorter = ({ primary, secondary, features, table }) => {
  const byX = _.groupBy(features, (f) => _.get(f, primary).title);
  return (
    <>
      {Object.entries(byX).length > 1 ? (
        <Tabs
          names={[...Object.keys(byX)]}
          def={Object.keys(byX).at(0)}>
          {Object.values(byX).map((fs) => (
            <Table
              features={fs}
              by={secondary}
              table={table}
            />
          ))}
        </Tabs>
      ) : (
        <Table
          features={features}
          by={secondary}
          table={table}
        />
      )}
    </>
  );
};

export default Features;

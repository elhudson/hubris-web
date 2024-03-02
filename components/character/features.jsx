import { useCharacter } from "@contexts/character";
import Ability from "./ability";
import { css, useTheme } from "@emotion/react";
import { Sections } from "@ui/layouts";
import Tabs from "@ui/tabs";
import _ from "lodash";
import Icon from "@ui/icon"

const Features = () => {
  const { character } = useCharacter();
  const { classes } = useTheme();
  const byClass = _.groupBy(character.class_features, (c) => c.classes.title);
  return (
    <Sections>
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
        {Object.entries(byClass).length > 1 ? (
          <Tabs
            names={[...Object.keys(byClass)]}
            def={Object.keys(byClass).at(0)}>
            {Object.values(byClass).map((fs) => (
              <ClassFeatures features={fs} />
            ))}
          </Tabs>
        ) : (
          <ClassFeatures features={character.class_features} />
        )}
      </section>
    </Sections>
  );
};

const ClassFeatures = ({ features }) => {
  const paths = _.groupBy(features, (f) => f.class_paths.title);
  return (
    <table
      css={css`
        th {
          text-align: center;
          padding: 0px 5px;
          svg {
            padding-right: unset;
          }
        }
        td {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
         >* {
          width: 150px;
          flex-grow: 1;
          flex-shrink: 0;
         }
        }
      `}>
      {Object.entries(paths).map(([path, abilities]) => (
        <tr>
          <th>
            <Icon id={abilities[0].class_paths.id} sz={30} />
            <h4>{path}</h4>
          </th>
          <td>
            {abilities.map((c) => (
              <Ability
                data={c}
                table="class_features"
              />
            ))}
          </td>
        </tr>
      ))}
    </table>
  );
};

export default Features;

import { useCharacter } from "@contexts/character";
import { css, useTheme } from "@emotion/react";
import Tabs from "@ui/tabs";
import _ from "lodash";
import Metadata from "@components/metadata";
import List from "@components/list";
import { Row } from "@ui/layouts";

const sorter = (data) => {
  return _.groupBy(
    _.sortBy(data, "tier", "power"),
    (r) => r.trees?.title ?? r.trees?.at(0)?.title
  );
};

const Tab = ({ items, props, icon = "trees[0].id" }) => {
  const { colors } = useTheme();
  return (
    <Row>
      {Object.entries(items).map((c) => (
        <div
          css={css`
            border: 1px solid ${colors.accent};
            h4 {
              font-size: 16px;
              text-transform: uppercase;
              text-align: center;
              border-bottom: 1px solid ${colors.accent};
            }
            ul {
                padding: 10px;
            }
          `}>
          <h4>{c[0]}</h4>
          <List
            items={c[1]}
            icon={icon}
            props={(item) => (
              <Metadata
                feature={item}
                props={props}
              />
            )}
          />
        </div>
      ))}
    </Row>
  );
};

export default () => {
  const { character, update } = useCharacter();
  const ranges = sorter(character.ranges);
  const durations = sorter(character.durations);
  const effects = sorter(character.effects);
  return (
    <Tabs
      css={css``}
      names={["Effects", "Ranges", "Durations"]}
      def="Effects">
      <Tab
        items={effects}
        props={["tags", "power", "tier"]}
        icon={"trees.id"}
      />
      <Tab
        items={ranges}
        props={["power", "area", "range", "tier"]}
      />
      <Tab
        items={durations}
        props={["power", "tier", "duration"]}
      />
    </Tabs>
  );
};

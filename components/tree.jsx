import Option from "@components/options/option";
import _ from "lodash";
import { css } from "@emotion/css";
import Tree from "react-d3-tree";
import { useTheme } from "@emotion/react";

function makeHierarchy(root, items) {
  const complete = _.has(root, "required_for")
    ? root.required_for.map((i) => _.find(items, (v) => v.id == i.id))
    : [];
  _.remove(complete, (f) => _.isUndefined(f));
  if (complete.length > 0) {
    complete.forEach((item) => {
      item.children = makeHierarchy(item, items);
    });
  }
  return complete;
}

export default ({ items }) => {
  const least = Object.keys(_.groupBy(items, "xp"))[0];
  const entries = _.cloneDeep(items);
  const roots = entries.filter((f) => f.xp == least);
  roots.forEach((root) => {
    root.children = makeHierarchy(root, entries);
  });
  return (
    <div>
      <FeatureTree
        root={{
          name: "root",
          id: "root",
          children: roots
        }}
      />
    </div>
  );
};

function getTreeWidth(roots) {
  const minWidth = roots.length;
  if (minWidth == 0) {
    return 1;
  } else {
    return _.sum(roots.map((r) => getTreeWidth(r.children)));
  }
}

function getTreeDepth(root) {
  if (root.children.length == 0) {
    return 1;
  } else {
    for (var c of root.children) {
      return 1 + getTreeDepth(c);
    }
  }
}

const FeatureTree = ({ root }) => {
  const { colors } = useTheme();
  const width = getTreeWidth(root.children);
  const depth = getTreeDepth(root);
  console.log(depth);
  return (
    <Tree
      orientation="horizontal"
      data={root}
      depthFactor={250}
      zoomable={false}
      draggable={false}
      translate={{
        x: -250,
        y: 90 * (width - 1)
      }}
      svgClassName={css`
        height: ${185 * width}px;
        width: ${250 * depth}px;
      `}
      rootNodeClassName={css`
        display: none;
      `}
      separation={{
        siblings: 1.25,
        nonSiblings: 1.25
      }}
      pathFunc={(link, orientation) => {
        const { source, target } = link;
        return `M${source.y + 200},${source.x + 50}L${target.y},${
          target.x + 50
        }`;
      }}
      pathClassFunc={() => css`
        stroke: ${colors.accent} !important;
        stroke-width: 1px;
        stroke-dasharray: 1 2;
      `}
      renderCustomNodeElement={(node) => <FeatureNode node={node} />}
    />
  );
};

const FeatureNode = ({ node }) => {
  const { colors } = useTheme();
  return (
    <foreignObject
      height={120}
      width={200}>
      <div
        className={css`
          border: 1px solid ${colors.text};
          width: 99%;
          div {
            font-size: 12px;
          }
        `}>
        <Option data={node.nodeDatum} />
      </div>
    </foreignObject>
  );
};

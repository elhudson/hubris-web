import { css, useTheme } from "@emotion/react";
import {
  useEffect,
  useRef,
} from "react";

import { Rule } from "@interface/components";
import Tree from "react-d3-tree";
import _ from "lodash";
import { css as classNameCss } from "@emotion/css";

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
  const least = Object.entries(_.groupBy(items, "xp"))[0][0];
  const self = useRef(null);
  const { colors } = useTheme();
  const nodeDimensions = {
    x: 250,
    y: 150
  };
  useEffect(() => {
    const { top } = self.current.getBoundingClientRect();
    const { innerHeight } = window;
    const exclude = innerHeight - top;
    self.current.setAttribute("style", `height:${exclude - 100}px; margin:-10px;`);
    const container=self.current.querySelector('svg')
  });
  const roots = items
    .filter((i) => i.xp == least)
    .map((root) => ({ ...root, children: makeHierarchy(root, _.cloneDeep(items)) }));
  return (
    <div ref={self}>
      <Tree
        enableLegacyTransitions={false}
        orientation="vertical"
        translate={{
          x: 0,
          y: -150
        }}
        pathClassFunc={() => classNameCss`
            stroke: ${colors.accent} !important;`}
        pathFunc={({ source, target }) => {
          return source.parent
            ? `
          M ${source.x + nodeDimensions.x * 0.5},${source.y + nodeDimensions.y}
          L ${target.x + nodeDimensions.x * 0.5},${target.y}
          z
          `
            : null;
        }}
        nodeSize={nodeDimensions}
        data={{
          children: roots
        }}
        hasInteractiveNodes={false}
        depthFactor={200}
        rootNodeClassName={classNameCss`
          display: none;
        `}
        renderCustomNodeElement={(node) => {
          return (
            <foreignObject
              width={nodeDimensions.x}
              height={nodeDimensions.y}>
              <div
                css={css`
                  height: 100%;
                  border: 1px solid ${colors.accent};
                  box-sizing: border-box;
                `}>
                <Rule data={node.nodeDatum} />
              </div>
            </foreignObject>
          );
        }}
      />
    </div>
  );
};

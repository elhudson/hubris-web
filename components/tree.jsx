import Rule from "@components/rule";
import _ from "lodash";
import { useTheme, css } from "@emotion/react";
import {
  useEffect,
  useLayoutEffect,
  forwardRef,
  useRef,
  useState
} from "react";

import Tree from "react-d3-tree";

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
  const nodeDimensions={
    x: 200,
    y: 150
  }
  useEffect(() => {
    const { top, bottom } = self.current.getBoundingClientRect();
    const { innerHeight, innerWidth } = window;
    const exclude = innerHeight - top;
    self.current.setAttribute("style", `height:${exclude - 20}px`);
  });
  const roots = items
    .filter((i) => i.xp == least)
    .map((root) => makeHierarchy(root, items)?.[0]);
  return (
    <div ref={self}>
      <Tree
        orientation="vertical"
        pathFunc={({ source, target }) => {
          console.log(source, target)
          return `
          M ${source.x+nodeDimensions.x/2},${source.y-nodeDimensions.y}
          L ${target.x+nodeDimensions.x/2},${target.y-nodeDimensions.y}
          z
          `;
        }}
        nodeSize={nodeDimensions}
        data={roots[0]}
        renderCustomNodeElement={(node) => {
          return (
            <foreignObject
              height={nodeDimensions.x}
              width={nodeDimensions.y}>
              <div
                css={css`
                  padding: 5px;
                  
                  border: 1px solid ${colors.accent};
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

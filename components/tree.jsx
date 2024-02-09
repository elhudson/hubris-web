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
        data={roots[0]}
        renderCustomNodeElement={(node) => {
          console.log(node)
          
        }}
      />
    </div>
  );
};

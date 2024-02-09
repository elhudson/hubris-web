import Tabs from "@ui/tabs";
import { css } from "@emotion/react";
export default ({ options, render }) => {
  const names = options.map((path) => path.title);
  return (
    <Tabs
      names={names}
      def={names[0]}>
      {options.map((o) => render(o))}
    </Tabs>
  );
};

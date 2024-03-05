import { Organizer, Tree } from "@interface/components";

import { Loading } from "@interface/ui";
import { useOptions } from "contexts";

export default () => {
  const context = useOptions();
  const features = async () =>
    context?.options ??
    (await fetch(
      `/data/rules?table=trees&query=${JSON.stringify({
        select: {
          title: true,
          id: true,
          ranges: {
            include: {
              requires: true,
              required_for: true,
              trees: true
            }
          }
        }
      })}`
    ).then((t) => t.json()));
  return (
    <Loading
      getter={features}
      render={(features) => (
        <Organizer
          options={features}
          render={(path) => <Tree items={path["ranges"]} />}
        />
      )}
    />
  );
};

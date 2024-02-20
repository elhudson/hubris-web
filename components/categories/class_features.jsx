import { useAsync } from "react-async-hook";
import { useOptions } from "@contexts/options";
import Organizer from "@components/organizer";
import Tree from "@components/tree";

export default () => {
  const context = useOptions();
  const features =
    context?.options ??
    useAsync(
      async () =>
        await fetch(
          `/data/rules?table=classes&query=${JSON.stringify({
            select: {
              title: true,
              id: true,
              class_features: {
                include: {
                  class_paths: true,
                  requires: true,
                  required_for: true
                }
              }
            }
          })}`
        ).then((t) => t.json())
    ).result;
  return (
    <>
      {features && (
        <Organizer
          options={features}
          render={(path) => <Tree items={path["class_features"]} />}
        />
      )}
    </>
  );
};

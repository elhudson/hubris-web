import { Organizer, Tree } from "@interface/components";
import { Loading } from "@interface/ui";
import { useOptions } from "contexts";

export default () => {
  const context = useOptions();
  const features = async () =>
    context?.options ??
    (await fetch(
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
    ).then((t) => t.json()));

  return (
    <Loading
      getter={features}
      render={(features) => (
        <Organizer
          options={features}
          render={(path) => <Tree items={path["class_features"]} />}
        />
      )}
    />
  );
};

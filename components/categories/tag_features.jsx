import Organizer from "@components/organizer";
import Tree from "@components/tree";
import { useOptions } from "@contexts/options";
import Loading from "@ui/loading";
export default () => {
  const context = useOptions();
  const features = async () =>
    context?.options ??
    (await fetch(
      `/data/rules?table=tags&query=${JSON.stringify({
        where: {
          tag_features: {
            some: {}
          }
        },
        select: {
          title: true,
          id: true,
          tag_features: {
            include: {
              tags: true,
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
          render={(path) => <Tree items={path["tag_features"]} />}
        />
      )}
    />
  );
};

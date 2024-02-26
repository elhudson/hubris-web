import Organizer from "@components/organizer";
import Tree from "@components/tree";
import { useOptions } from "@contexts/options";
import Loading from "@ui/loading";

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

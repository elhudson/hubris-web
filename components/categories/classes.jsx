import Loading from "@ui/loading";
import List from "@components/list";
import Metadata from "@components/metadata";
import { useOptions } from "@contexts/options";

export default ({ checkbox = null }) => {
  const context = useOptions();
  const features = async () =>
    context?.options ??
    (await fetch(
      `/data/rules?table=classes&query=${JSON.stringify({
        include: {
          class_paths: true,
          tags: true,
          attributes: true,
          hit_dice: true
        }
      })}`
    ).then((t) => t.json()));
  return (
    <Loading
      getter={features}
      render={(features) => (
        <List
          items={features}
          checkbox={checkbox}
          props={(f) => (
            <Metadata
              feature={f}
              props={[
                "attributes",
                "tags",
                "class_paths",
                "weaponry",
                "armory",
                "hit_dice"
              ]}
            />
          )}
        />
      )}
    />
  );
};

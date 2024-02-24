import { useAsync } from "react-async-hook";
import Organizer from "@components/organizer";
import Tree from "@components/tree";
import { useOptions } from "@contexts/options";

export default () => {
  const context = useOptions();
  const features = context?.options ?? useAsync(
    async () =>
      await fetch(
        `/data/rules?table=tags&query=${JSON.stringify({
          where: {
            tag_features: {
              some: {},
            },
          },
          select: {
            title: true,
            id: true,
            tag_features: {
              include: {
                requires: true,
                required_for: true,
              },
            },
          },
        })}`
      ).then((t) => t.json())
  ).result;
  return (
    <>
      {features && (
        <Organizer
          options={features}
          render={(path) => <Tree items={path["tag_features"]} />}
        />
      )}
    </>
  );
};

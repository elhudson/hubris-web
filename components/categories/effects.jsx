import { useAsync } from "react-async-hook";
import Organizer from "@components/organizer";
import Tree from "@components/tree";
import { useOptions } from "@contexts/options";

export default () => {
  const context = useOptions();
  const features =
    context?.options ??
    useAsync(
      async () =>
        await fetch(
          `/data/rules?table=trees&query=${JSON.stringify({
            select: {
              title: true,
              id: true,
              effects: {
                include: {
                  tags: true,
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
          render={(path) => <Tree items={path["effects"]} />}
        />
      )}
    </>
  );
};
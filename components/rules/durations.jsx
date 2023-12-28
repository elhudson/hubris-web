import { useAsync } from "react-async-hook";
import Organizer from "./organizer";
import Tree from "@components/tree";

export default () => {
  const features = useAsync(
    async () =>
      await fetch(
        `/data/rules?table=trees&query=${JSON.stringify({
          select: {
            title: true,
            id: true,
            durations: {
              include: {
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
          render={(path) => <Tree items={path["durations"]} />}
        />
      )}
    </>
  );
};

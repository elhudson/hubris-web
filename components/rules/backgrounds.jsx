import { useAsync } from "react-async-hook";
import Organizer from "./organizer";
import List from "@components/list";
import Feature from "@components/feature";

export default () => {
  const features = useAsync(
    async () =>
      await fetch(
        `/data/rules?table=settings&query=${JSON.stringify({
          select: {
            title: true,
            id: true,
            backgrounds: {
              include: {
                background_features: true,
                skills: true,
                abilities: true
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
          render={(path) => (
            <List
              items={path["backgrounds"]}
              render={(feat) => (
                <Feature
                  feature={feat.id}
                  table={"backgrounds"}
                />
              )}
            />
          )}
        />
      )}
    </>
  );
};

import { useAsync } from "react-async-hook";
import Organizer from "@components/organizer";
import Gallery from "@components/gallery";
import Card from "@components/card";
import { useOptions } from "@contexts/options";

export default () => {
  const context = useOptions();
  const features = context?.options ?? useAsync(
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
                attributes: true,
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
          render={(path) => (
            <Gallery
              items={path["backgrounds"]}
              render={(feat) => (
                <Card
                  feature={feat}
                  props={["attributes", "skills"]}
                />
              )}
            />
          )}
        />
      )}
    </>
  );
};

import { useAsync } from "react-async-hook";
import Organizer from "@components/organizer";
import { ruleContext } from "@contexts/rule";
import List from "@components/gallery";
import Card from "@components/card";

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
                attributes: true
              }
            }
          }
        })}`
      ).then((t) => t.json())
  ).result;
  return (
    <>
      {features && (
        <ruleContext.Provider
          value={{
            table: "backgrounds",
            icon: "id"
          }}>
          <Organizer
            options={features}
            render={(path) => (
              <List
                items={path["backgrounds"]}
                render={(feat) => (
                    <Card feature={feat} props={['attributes', 'skills']} />
                )}
              />
            )}
          />
        </ruleContext.Provider>
      )}
    </>
  );
};

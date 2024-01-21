import { useAsync } from "react-async-hook";
import Organizer from "./organizer";
import Card from '../card'
import List from "../list"

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
                <Card feature={feat} table="backgrounds" customDesc={(feature) => feature.background_features.description}/>
              )}
            />
          )}
        />
      )}
    </>
  );
};

import { Card, Gallery, Organizer } from "@interface/components";

import { Loading } from "@interface/ui";
import { useOptions } from "contexts";

export default () => {
  const context = useOptions();
  const features = async () =>
    context?.options ??
    (await fetch(
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
    ).then((t) => t.json()));
  return (
    <Loading
      getter={features}
      render={(features) => (
        <Organizer
          options={features}
          render={(path) => (
            <Gallery
              items={path["backgrounds"]}
              render={(feat) => (
                <Card
                  feature={feat}
                  props={["attributes", "skills", "background_features"]}
                />
              )}
            />
          )}
        />
      )}
    />
  );
};

import { Card, Gallery, Organizer } from "@interface/components";

import { groupBy } from "utilities";
import { useLoaderData } from "react-router-dom";

export default () => {
  const features = groupBy(
    useLoaderData(),
    (f) => f.settings,
    "backgrounds"
  );
  return (
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
  );
};

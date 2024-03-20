import { Card, Gallery, Organizer } from "@interface/components";
import { useRule, useOptions } from "contexts";
import { groupBy } from "utilities";
import { useLoaderData } from "react-router-dom";

export default () => {
  const data = useRule().location == "wiki" ? useLoaderData() : useOptions().data;
  const features = groupBy(data, (e) => e.settings, "backgrounds");
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

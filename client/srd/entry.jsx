import { Description, Metadata } from "@interface/components";
import { css, useTheme } from "@emotion/react";

import { useLoaderData } from "react-router-dom";

export default () => {
  const { colors } = useTheme();
  const data = useLoaderData();
  return (
    <main
      css={css`
        section:not(:last-of-type) {
          border: 1px solid ${colors.accent};
          padding: 5px;
          margin: 5px 0px;
          label {
            font-weight: bold;
          }
        }
      `}
    >
      <h2>{data.title}</h2>
      <section>
        <Metadata
          feature={data}
          props={Object.keys(data).filter((p) =>
            [
              "title",
              "xp",
              "power",
              "trees",
              "range",
              "durations",
              "classes",
              "hit_dice",
              "class_paths",
              "background_features",
              "skills",
              "tags",
              "attributes",
              "backgrounds",
              "weaponry",
              "armory",
            ].includes(p)
          )}
        />
      </section>
      <section>
        <Description text={data.description} />
      </section>
    </main>
  );
};

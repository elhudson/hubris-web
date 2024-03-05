import { Description, Metadata } from "@interface/components";
import { css, useTheme } from "@emotion/react";

import { Loading } from "@interface/ui";
import { useParams } from "react-router-dom";

export default () => {
  const { colors, classes } = useTheme();
  const { feature, table } = useParams();
  const data = async () =>
    await fetch(
      `/data/rules?table=${table}&query=${JSON.stringify({
        where: {
          id: feature,
        },
      })}&relations=true`
    )
      .then((j) => j.json())
      .then((d) => d[0]);
  return (
    <Loading
      getter={data}
      render={(data) => (
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
      )}
    />
  );
};

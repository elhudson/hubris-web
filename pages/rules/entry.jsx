import { useAsync } from "react-async-hook";
import { useParams } from "react-router-dom";
import { useTheme, css } from "@emotion/react";
import Metadata from "@components/metadata";
import Description from "@components/description";

export default () => {
  const { colors, classes } = useTheme();
  const { feature, table } = useParams();
  const data = useAsync(
    async () =>
      await fetch(
        `/data/rules?table=${table}&query=${JSON.stringify({
          where: {
            id: feature
          }
        })}&relations=true`
      )
        .then((j) => j.json())
        .then((d) => d[0])
  ).result;
  return (
    <>
      {data && (
        <main
          css={css`
            section {
              border: 1px solid ${colors.accent};
              padding: 5px;
              margin: 5px 0px;
              label {
                font-weight: bold;
              }
              &:last-of-type > * {
                ${classes.decorations.dashed};
              }
            }
          `}>
          <h2>{data.title}</h2>
          <section>
            <Metadata feature={data} />
          </section>
          <section>
            <Description text={data.description} />
          </section>
        </main>
      )}
    </>
  );
};

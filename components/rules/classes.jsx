import { useAsync } from "react-async-hook";
import Organizer from "./organizer";
import List from "@components/list";
import { useTheme } from "@emotion/react";
import Card from "@components/card"
import { css } from "@emotion/css";
export default () => {
  const { colors } = useTheme();
  const features = useAsync(
    async () =>
      await fetch(
        `/data/rules?table=classes&query=${JSON.stringify({
          include: {
            tags: true,
            abilities: true,
            skills: true
          }
        })}`
      ).then((t) => t.json())
  ).result;
  return (
    <div className={css`
      display: grid;
      grid-template-columns:repeat(3, 33%);
      grid-gap: 10px;
    `}>
      {features && features.map(f=> <Card feature={f} table="classes" />)}
    </div>
  );
};

import { useAsync } from "react-async-hook";
import Organizer from "./organizer";
import List from "@components/list";
import Feature from "@components/feature";
import * as Collapsible from "@radix-ui/react-collapsible";
import { useTheme } from "@emotion/react";
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
    <div>
      {features &&
        features.map((f) => (
          <Collapsible.Root
            className={css`
              width: 100%;
              border: 1px solid ${colors.accent};
              margin:5px;
              >button {
                all:unset;
                padding:5px;
                font-size:16px;
              }
            `}>
            <Collapsible.Trigger>{f.title}</Collapsible.Trigger>
            <Collapsible.Content className={css`
                display: grid;
                grid-template-columns: repeat(2, auto);
            `}>
              <div className={css`
                display: grid;
                grid-template-columns: minmax(min-content, max-content) auto;
              `}>
                <label>Skills:</label>
                <div>{f.skills.map(s=> s.title).join(", ")}</div>
                <label>Tags:</label>
                <div>{f.tags.map(s=> s.title).join(", ")}</div>
                <label>Ability:</label>
                <div>{f.abilities.map(s=> s.title)}</div>
              </div>
              <div className="description dashed">{f.description}</div>
            </Collapsible.Content>
          </Collapsible.Root>
        ))}
    </div>
  );
};

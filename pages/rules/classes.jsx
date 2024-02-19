import { useAsync } from "react-async-hook";
import Organizer from "@components/organizer";
import List from "@components/list";
import { useTheme, css } from "@emotion/react";
import Metadata from "@components/metadata";

export default () => {
  const { colors } = useTheme();
  const features = useAsync(
    async () =>
      await fetch(
        `/data/rules?table=classes&query=${JSON.stringify({
          include: {
            class_paths: true,
            tags: true,
            attributes: true,
            skills: true,
            hit_dice: true
          }
        })}`
      ).then((t) => t.json())
  ).result;
  return (
    <>
      {features && (
        <List
          items={features}
          props={(f) => (
            <Metadata
              feature={f}
              props={["abilities", "tags", "class_paths", "weaponry", "armory", "hit_dice"]}
            />
          )}
        />
      )}
    </>
  );
};

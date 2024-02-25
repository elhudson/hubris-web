import { useAsync } from "react-async-hook";
import Organizer from "@components/organizer";
import List from "@components/list";
import { useTheme, css } from "@emotion/react";
import Metadata from "@components/metadata";
import { useOptions } from "@contexts/options";


export default ({ checkbox = null }) => {
  const { colors } = useTheme();
  const context=useOptions()
  const features = context?.options ?? useAsync(
    async () =>
      await fetch(
        `/data/rules?table=classes&query=${JSON.stringify({
          include: {
            class_paths: true,
            tags: true,
            attributes: true,
            hit_dice: true,
          },
        })}`
      ).then((t) => t.json())
  ).result;
  return (
    <>
      {features && (
        <List
          items={features}
          checkbox={checkbox}
          props={(f) => (
            <Metadata
              feature={f}
              props={[
                "abilities",
                "tags",
                "class_paths",
                "weaponry",
                "armory",
                "hit_dice",
              ]}
            />
          )}
        />
      )}
    </>
  );
};

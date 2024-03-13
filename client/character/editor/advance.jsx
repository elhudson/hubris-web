import {
  ClassFeatures,
  Classes,
  Durations,
  Effects,
  Hd,
  Ranges,
  Skills,
  TagFeatures
} from "@client/options";
import { Save, Xp } from "@client/character";

import { Tabs } from "@interface/ui";
import _ from "lodash";
import { characterContext } from "contexts";
import { useImmer } from "use-immer";
import { useLoaderData } from "react-router-dom";

export default () => {
  const [character, update] = useImmer(useLoaderData());
  const tabs = [
    {
      title: "Class Features",
      contents: <ClassFeatures />,
    },
    {
      title: "Tag Features",
      contents: <TagFeatures />,
    },
    { title: "Effects", contents: <Effects /> },
    { title: "Ranges", contents: <Ranges /> },
    { title: "Durations", contents: <Durations /> },
    { title: "Skills", contents: <Skills /> },
    { title: "Hit Dice", contents: <Hd /> },
    { title: "Classes", contents: <Classes /> },
  ];
  return (
    <>
      {character && (
        <characterContext.Provider
          value={{
            character: character,
            update: update,
          }}
        >
          <Xp />
          <Tabs
            names={tabs.map((t) => t.title)}
            def={tabs[0].title}
          >
            {tabs.map((t) => t.contents)}
          </Tabs>
          <Save />
        </characterContext.Provider>
      )}
    </>
  );
};

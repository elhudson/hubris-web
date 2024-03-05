import {
  ClassFeatures,
  Classes,
  Durations,
  Effects,
  Hd,
  Ranges,
  Skills,
  TagFeatures,
} from "@client/options";
import { Loading, Tabs } from "@interface/ui";
import { Save, Xp } from "@client/character";

import _ from "lodash";
import { characterContext } from "contexts";
import { useImmer } from "use-immer";
import { useParams } from "react-router-dom";

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

export default () => {
  const { id } = useParams();
  const ch = async () =>
    await fetch(`/data/character?id=${id}`).then((j) => j.json());
  return (
    <Loading
      getter={ch}
      render={(ch) => <Advance ch={ch} />}
    />
  );
};

const Advance = ({ ch }) => {
  const [character, update] = useImmer(ch);
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

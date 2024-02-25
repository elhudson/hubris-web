import { characterContext, useCharacter } from "@contexts/character";
import Profile from "@components/character/profile";
import Tabs from "@ui/tabs";
import { useImmer } from "use-immer";
import { useParams } from "react-router-dom";
import { useAsync } from "react-async-hook";
import _ from "lodash";
import Options from "@options";
import Save from "@components/character/save";
import * as collapse from "@radix-ui/react-collapsible";
import { IoIosPerson } from "react-icons/io";
import Switch from "@ui/switch";
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";
import { calc_xp } from "utilities";
import XP from "@components/character/xp";

const tabs = [
  {
    title: "Class Features",
    contents: <Options.class_features />,
  },
  {
    title: "Tag Features",
    contents: <Options.tag_features />,
  },
  { title: "Effects", contents: <Options.effects /> },
  { title: "Ranges", contents: <Options.ranges /> },
  { title: "Durations", contents: <Options.durations /> },
  { title: "Skills", contents: <Options.skills /> },
  { title: "Hit Dice", contents: <Options.hd /> },
  { title: "Classes", contents: <Options.classes /> },
];

const Advance = () => {
  const { id } = useParams();
  const [character, update] = useImmer(null);
  const { colors } = useTheme();
  useAsync(
    async () =>
      await fetch(`/data/character?id=${id}`)
        .then((j) => j.json())
        .then((ch) => update(ch))
  );
  return (
    <>
      {character && (
        <characterContext.Provider
          value={{
            character: character,
            update: update,
          }}>
          <XP />
          <Tabs
            names={tabs.map((t) => t.title)}
            def={tabs[0].title}>
            {tabs.map((t) => t.contents)}
          </Tabs>
          <Save />
        </characterContext.Provider>
      )}
    </>
  );
};

export default Advance;

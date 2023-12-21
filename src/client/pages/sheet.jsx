import { useAsync } from "react-async-hook";
import { useParams } from "react-router-dom";
import { characterContext } from "@contexts/character";
import { useImmer } from "use-immer";
import Tabs from "@ui/tabs";
import Character from "@components/character";

const components = [
  { title: "Skills & Abilities", content: <Character.skills /> },
  { title: "Health", content: <Character.health /> },
  {
    title: "Progression",
    content: (
      <div>
        <Character.proficiency />
        <Character.xp />
        <Character.tier />
      </div>
    )
  },
  {
    title: "Combat",
    content: (
      <div>
        <Character.ac />
        <Character.initiative />
        <Character.attacks />
      </div>
    )
  },
  { title: "Inventory", content: <Character.inventory /> },
  { title: "Bio", content: <Character.bio /> },
  { title: "Features", content: <Character.features /> },
  { title: "Powers", content: <Character.powers /> }
];

const Sheet = () => {
  const { id } = useParams();
  const [character, update] = useImmer(null);
  useAsync(
    async () =>
      await fetch(`/data/character?id=${id}`)
        .then((j) => j.json())
        .then((ch) => update(ch))
  );
  return (
    <>
      {character != null && (
        <characterContext.Provider
          value={{
            character: character,
            update: update
          }}>
          <Character.profile />
          <Tabs
            names={components.map((c) => c.title)}
            def={components[0].title}>
            {components.map((c) => c.content)}
          </Tabs>
        </characterContext.Provider>
      )}
    </>
  );
};

export default Sheet;

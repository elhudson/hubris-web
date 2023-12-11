import { useAsync } from "react-async-hook";
import { useParams } from "react-router-dom";
import Bio, { Alignment } from "@sheet/bio";
import Skills from "@sheet/skills";
import Health from "@sheet/health";
import Powers from "@sheet/powers";
import Features from "@sheet/features";
import Inventory from "@sheet/inventory";
import { characterContext } from "@contexts/character";
import * as tabs from "@radix-ui/react-tabs";
import { useImmer } from "use-immer";

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
      <h1>Character Sheet</h1>
      {character != null && (
        <characterContext.Provider
          value={{
            character: character,
            update: update
          }}>
          <div>
            <div>
              <b>Name:</b> {character.biography.name}
            </div>
            <div>
              <b>Class:</b> {character.classes.map((c) => c.title).join(" & ")}
            </div>
            <div>
              <b>Backgrounds:</b>{" "}
              {character.backgrounds.map((c) => c.title).join(" & ")}
            </div>
            <div>
              <b>Alignment:</b> <Alignment />
            </div>
            <div></div>
          </div>
          <tabs.Root defaultValue="skills">
            <tabs.List>
              <tabs.Trigger value="skills">Skills & Abilities</tabs.Trigger>
              <tabs.Trigger value="health">Health</tabs.Trigger>
              <tabs.Trigger value="combat">Combat</tabs.Trigger>
              <tabs.Trigger value="features">Features</tabs.Trigger>
              <tabs.Trigger value="powers">Powers</tabs.Trigger>
              <tabs.Trigger value="inventory">Inventory</tabs.Trigger>
              <tabs.Trigger value="bio">Biography</tabs.Trigger>
            </tabs.List>
            <tabs.Content value="bio">
              <Bio />
            </tabs.Content>
            <tabs.Content value="skills">
              <Skills />
            </tabs.Content>
            <tabs.Content value="health">
              <Health />
            </tabs.Content>
            <tabs.Content value="powers">
              <Powers />
            </tabs.Content>
            <tabs.Content value="features">
              <Features />
            </tabs.Content>
            <tabs.Content value="inventory">
              <Inventory />
            </tabs.Content>
          </tabs.Root>
        </characterContext.Provider>
      )}
    </>
  );
};

export default Sheet;

import { useAsync } from "react-async-hook";
import { useParams } from "react-router-dom";
import Bio, { Alignment } from "@sheet/bio";
import Skills from "@sheet/skills";
import Health from "@sheet/health";
import Powers from "@sheet/powers";
import Features from "@sheet/features";
import Combat from "@sheet/combat";
import Inventory from "@sheet/inventory";
import Progress from "@sheet/progress";
import Notification from "@ui/notif";
import { characterContext, useCharacter } from "@contexts/character";
import * as tabs from "@radix-ui/react-tabs";
import { useImmer } from "use-immer";
import Icon from "@ui/icon";
import { useTheme } from "@emotion/react";

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
          <CharacterHeader character={character} />
          <tabs.Root defaultValue="skills">
            <tabs.List className="buttons">
              <tabs.Trigger value="skills">Skills & Abilities</tabs.Trigger>
              <tabs.Trigger value="health">Health</tabs.Trigger>
              <tabs.Trigger value="combat">Combat</tabs.Trigger>
              <tabs.Trigger value="features">Features</tabs.Trigger>
              <tabs.Trigger value="powers">Powers</tabs.Trigger>
              <tabs.Trigger value="progress">Progress</tabs.Trigger>
              <tabs.Trigger value="inventory">Inventory</tabs.Trigger>
              <tabs.Trigger value="bio">Biography</tabs.Trigger>
            </tabs.List>
            <tabs.Content value="bio">
              <Bio />
            </tabs.Content>
            <tabs.Content value="skills">
              <Skills />
            </tabs.Content>
            <tabs.Content value="combat">
              <Combat />
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
            <tabs.Content value="progress">
              <Progress />
            </tabs.Content>
          </tabs.Root>
          <SaveCharacter />
        </characterContext.Provider>
      )}
    </>
  );
};

const CharacterHeader = () => {
  const { character } = useCharacter();
  const { colors } = useTheme();
  return (
    <div className="bordered" style={{marginBottom: 10}}>
      <div>
        <b>Name</b> {character.biography.name}
      </div>
      <div>
        <b>Class</b>{" "}
        {character.classes.map((c) => (
          <a href={`/srd/classes/${c.id}`}>
            <Icon
              sz={15}
              id={c.id}
            />
            <label>{c.title}</label>
          </a>
        ))}
      </div>
      <div>
        <b>Backgrounds</b>{" "}
        {character.backgrounds.map((c) => (
          <a href={`/srd/backgrounds/${c.id}`}>
            <Icon
              sz={15}
              id={c.id}
            />
            <label>{c.title}</label>
          </a>
        ))}
      </div>
      <div>
        <b>Alignment</b> <Alignment />
      </div>
    </div>
  );
};

const SaveCharacter = () => {
  const { character } = useCharacter();
  const save = async () =>
    await fetch(`/data/character/?method=update&id=${character.id}`, {
      method: "POST",
      body: JSON.stringify(character),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
  return (
    <Notification
      func={save}
      msg={"Save"}
    />
  );
};

export default Sheet;

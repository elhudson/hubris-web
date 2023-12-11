import { useContext, useState } from "react";
import * as select from "@radix-ui/react-select";
import _ from "lodash";
import { useCharacter } from "@contexts/character";

const Bio = () => {
  const { character } = useCharacter();
  return (
    <>
      <h3>Bio</h3>
      <div>
        <b>Name:</b> {character.biography.name}
      </div>
      <div>
        <b>Gender:</b> {character.biography.gender}
      </div>
      <div>
        <b>Alignment:</b> <Alignment />
      </div>
      <div>
        <b>Backstory:</b> {character.biography.backstory}
      </div>
      <div>
        <b>Appearance:</b> {character.biography.appearance}
      </div>
    </>
  );
};

export const Alignment = () => {
  const { character, update } = useCharacter();
  const handleAlign = (e) => {
    update((draft)=>{
        draft.biography.alignment=e
    })
  };
  const data = [
    {
      code: "lg",
      text: "Lawful Good"
    },
    {
      code: "ng",
      text: "Neutral Good"
    },
    {
      code: "cg",
      text: "Chaotic Good"
    },
    {
      code: "ln",
      text: "Lawful Neutral"
    },
    {
      code: "tn",
      text: "True Neutral"
    },
    {
      code: "cn",
      text: "Chaotic Neutral"
    },
    {
      code: "le",
      text: "Lawful Evil"
    },
    {
      code: "ne",
      text: "Neutral Evil"
    },
    {
      code: "ce",
      text: "Chaotic Evil"
    }
  ];
  return (
    <select.Root onValueChange={(e) => handleAlign(e)}>
      <select.Trigger>
        {_.find(data, (f) => f.code == character.biography.alignment).text}
      </select.Trigger>
      <select.Portal>
        <select.Content>
          {data.map((d) => (
            <select.Item value={d.code}>{d.text}</select.Item>
          ))}
        </select.Content>
      </select.Portal>
    </select.Root>
  );
};

export default Bio;

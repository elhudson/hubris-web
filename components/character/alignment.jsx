import _ from "lodash";
import { useCharacter } from "@contexts/character";
import Select from "@ui/select";

export default () => {
  const { character, update } = useCharacter();
  const handleAlign = (e) => {
    update((draft) => {
      draft.biography.alignment = e;
    });
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
    <Select
      current={_.find(data, (f) => f.code == character.biography.alignment)}
      onChange={(e) => handleAlign(e)}
      displayPath={"text"}
      valuePath={"code"}
      options={data}
    />
  );
};

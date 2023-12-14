import _ from "lodash";
import { useCharacter } from "@contexts/character";
import { Select } from "../../ui/select";
const Bio = () => {
  const { character, update } = useCharacter();
  const handleChange = (e, path) => {
    update((draft) => {
      _.set(draft, path, e.target.value);
    });
  };
  return (
    <>
      <h3>Bio</h3>
      <div>
        <b>Name:</b>{" "}
        <input
          type="text"
          value={character.biography.name}
          onChange={(e) => handleChange(e, "biography.name")}
        />
      </div>
      <div>
        <b>Gender:</b>
        <input
          type="text"
          value={character.biography.gender}
          onChange={(e) => handleChange(e, "biography.gender")}
        />
      </div>
      <div>
        <b>Alignment:</b> <Alignment />
      </div>
      <div>
        <b>Backstory:</b>{" "}
        <textarea onChange={(e) => handleChange(e, "biography.backstory")}>
          {character.biography.backstory}
        </textarea>
      </div>
      <div>
        <b>Appearance:</b>
        <textarea onChange={(e) => handleChange(e, "biography.appearance")}>
          {character.biography.appearance}
        </textarea>
      </div>
    </>
  );
};

export const Alignment = () => {
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

export default Bio;


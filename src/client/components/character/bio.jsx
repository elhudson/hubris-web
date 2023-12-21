import _ from "lodash";
import { useCharacter } from "@contexts/character";
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";
import Notepad from "@ui/notepad";
import Alignment from "./alignment";

const Bio = () => {
  const { colors } = useTheme();
  const { character, update } = useCharacter();
  const handleChange = (e, path) => {
    update((draft) => {
      _.set(draft, path, e.target.value);
    });
  };
  const handleEdit = (text, path) => {
    update((draft) => {
      _.set(draft, path, text);
    });
  };
  return (
    <div
      className={css`
        display: grid;
        width: 100%;
        grid-template-columns: repeat(4, 25%);
        grid-column-gap: 10px;
        grid-template-rows: auto;
        .ql-editor {
          margin-top: 3px;
          padding-top: unset;
          border-left: 1.5px solid ${colors.accent};
          p {
            font-family: "Iosevka Web";
          }
        }
        input[type="text"] {
          width: 100%;
        }
        grid-template-areas:
          "name appearance backstory backstory"
          "gender appearance backstory backstory"
          "alignment appearance backstory backstory";
        label {
          display: block;
          text-decoration: underline;
          text-underline-offset: 2px;
          font-style: italic;
        }
      `}>
      <div style={{ gridArea: "name" }}>
        <label>Name</label>
        <input
          type="text"
          value={character.biography.name}
          onChange={(e) => handleChange(e, "biography.name")}
        />
      </div>
      <div style={{ gridArea: "gender" }}>
        <label>Gender</label>
        <input
          type="text"
          value={character.biography.gender}
          onChange={(e) => handleChange(e, "biography.gender")}
        />
      </div>
      <div style={{ gridArea: "alignment" }}>
        <label>Alignment</label>
        <Alignment />
      </div>
      <div
        className="text"
        style={{ gridArea: "backstory" }}>
        <label>Backstory</label>
        <Notepad
          text={character.biography.backstory}
          onChange={(e) => handleEdit(e, "biography.backstory")}
        />
      </div>
      <div
        className="text"
        style={{ gridArea: "appearance" }}>
        <label>Appearance</label>
        <Notepad
          text={character.biography.appearance}
          onChange={(e) => handleEdit(e, "biography.appearance")}
        />
      </div>
    </div>
  );
};

export default Bio;

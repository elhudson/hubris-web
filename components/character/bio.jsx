import _ from "lodash";
import { useCharacter } from "@contexts/character";
import { useTheme, css } from "@emotion/react";
import Notepad from "@ui/notepad";
import Alignment from "./alignment";
import Metadata from "@ui/metadata";

const Bio = () => {
  const { colors, classes } = useTheme();
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
      css={css`
        .quill {
          ${(classes.elements.description, classes.decorations.dashed)};
        }

        input[type="text"] {
          width: 100%;
        }
        section {
          display: flex;
          gap: 10px;
          >div {
            width: 100%;
            >label {
              margin-bottom: 5px;
            }
          }
        }
        grid-template-areas:
          "name appearance backstory backstory"
          "gender appearance backstory backstory"
          "alignment appearance backstory backstory";
        label {
          display: block;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
      `}>
      <Metadata
        pairs={[
          [
            "Name",
            <input
              type="text"
              value={character.biography.name}
              onChange={(e) => handleChange(e, "biography.name")}
            />
          ],
          [
            "Gender",
            <input
              type="text"
              value={character.biography.gender}
              onChange={(e) => handleChange(e, "biography.gender")}
            />
          ],
          ["Alignment", <Alignment />]
        ]}
      />
      <section>
        <div>
          <label>Backstory</label>
          <Notepad
            text={character.biography.backstory}
            onChange={(e) => handleEdit(e, "biography.backstory")}
          />
        </div>
        <div>
          <label>Appearance</label>
          <Notepad
            text={character.biography.appearance}
            onChange={(e) => handleEdit(e, "biography.appearance")}
          />
        </div>
      </section>
    </div>
  );
};

export default Bio;

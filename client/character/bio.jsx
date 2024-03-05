import { Alignment } from "@client/character";

import { css, useTheme } from "@emotion/react";

import { Metadata, Notepad } from "@interface/ui";

import _ from "lodash";

import { useCharacter } from "contexts";

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
    <Metadata
      css={css`
        .quill {
          ${classes.decorations.dashed};
          ${classes.elements.description}
        }
      `}
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
        ["Alignment", <Alignment />],
        [
          "Backstory",
          <Notepad
            text={character.biography.backstory}
            onChange={(e) => handleEdit(e, "biography.backstory")}
          />
        ],
        [
          "Appearance",
          <Notepad
            text={character.biography.appearance}
            onChange={(e) => handleEdit(e, "biography.appearance")}
          />
        ]
      ]}
    />
  );
};

export default Bio;

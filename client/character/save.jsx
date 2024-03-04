import Notification from "@ui/notif";
import { useCharacter } from "@contexts/character";
import { useTheme } from "@emotion/react";

export default () => {
  const { classes } = useTheme();
  const { character } = useCharacter();
  const save = async () =>
    await fetch(`/data/character/?method=update&id=${character.id}`, {
      method: "POST",
      body: JSON.stringify(character),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then((s) => s.text());
  return (
    <Notification
      func={save}
      btn="Save"
      css={classes.elements.post}
    />
  );
};

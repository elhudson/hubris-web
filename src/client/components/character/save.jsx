import Notification from "@ui/notif";
import { useCharacter } from "@contexts/character";

export default () => {
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
      btn={"Save"}
    />
  );
};
import { useCharacter } from "@contexts/character";
import Notification from "@ui/notif";
import { Link } from "react-router-dom";

export default () => {
  const { character } = useCharacter();
  const handleDelete = async () =>
    await fetch(`/data/character/delete?id=${character.id}`, {
      method: "POST"
    }).then((t) => t.text());
  return (
    <div className="buttons">
      <Notification
        btn="Delete"
        func={handleDelete}
      />
      <button>
        <a href={`/character/${character.id}/advance`}>Spend XP</a>
      </button>
    </div>
  );
};

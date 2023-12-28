import { useCharacter } from "@contexts/character";
import { useUser } from "@contexts/user";
import Alert from "@ui/alert";
import { FaTrashAlt } from "react-icons/fa";
import { FaLevelUpAlt } from "react-icons/fa";
import { redirect } from "react-router-dom";
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";
import Switch from "@ui/switch"

export default () => {
  const { character } = useCharacter();
  const { colors } = useTheme();
  const { username } = useUser();
  const handleDelete = async () => {
    await fetch(`/data/character/delete?id=${character.id}`, {
      method: "POST"
    });
    redirect(`/characters/${username}`);
  };
  return (
    <div
      className={css`
        >button {
          all:unset;
        }
      `}>
      <Alert
        confirm={handleDelete}
        button={<Switch src={<FaTrashAlt />} />}>
        <div>
          <h4>Are you sure?</h4>
          <p>Once you delete a character, you can't recover them.</p>
        </div>
      </Alert>
      <button>
        <a href={`/character/${character.id}/advance`}>
        <Switch src={<FaLevelUpAlt />} />
        </a>
      </button>
    </div>
  );
};

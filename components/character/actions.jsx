import { useCharacter } from "@contexts/character";
import { useUser } from "@contexts/user";
import Alert from "@ui/alert";
import { FaTrashAlt } from "react-icons/fa";
import { FaLevelUpAlt } from "react-icons/fa";
import { redirect } from "react-router-dom";
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";
import Context from "@ui/context";
import { useRef } from "react";

export default ({ children }) => {
  const { character } = useCharacter();
  const { colors } = useTheme();
  const { username } = useUser();
  const handleDelete = async () => {
    await fetch(`/data/character/delete?id=${character.id}`, {
      method: "POST"
    });
    redirect(`/characters/${username}`);
  };
  const deleteRef = useRef(null);
  return (
    <div className={css`
      >button:first-child {
        display: none;
      }
    `}>
      <Alert
        confirm={handleDelete}
        button={
          <button
            ref={deleteRef}
            style={{ display: "none" }}
          />
        }>
        <div>
          <h4>Are you sure?</h4>
          <p>Once you delete a character, you can't recover them.</p>
        </div>
      </Alert>
      <Context
        trigger={children}
        items={[
          {
            label: "Delete",
            action: () => deleteRef.current.click()
          },
          {
            label: "Level Up",
            action: () => window.location.assign(`/character/${character.id}/advance`)
          }
        ]}
      />
    </div>
  );
};

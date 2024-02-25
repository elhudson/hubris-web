import { css } from "@emotion/css";
import { useState } from "react";
import { GiQuill } from "react-icons/gi";
export default ({ value, onChange }) => {
  const [editable, setEditable] = useState(false);

  return (
    <h2
      className={
        "pagetitle " +
        css`
          input, button {
            all: unset;
          }
        `
      }>
      <input
        value={value}
        type="text"
        readOnly={!editable}
        onChange={onChange}
      />
      <button onClick={() => setEditable(!editable)}>
        <GiQuill />
      </button>
    </h2>
  );
};

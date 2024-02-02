import character from "@actions/character";
import Context from "@ui/context";
import { css } from "@emotion/css";
import Tooltip from "@ui/tooltip";

export default ({ children }) => {
  const acts = character();
  return (
    <>
      <Context
        trigger={children}
        items={acts}
      />
      {acts.map((i) => i.render)}
    </>
  );
};

export const Buttons = ({}) => {
  return (
    <div
      className={"actions "+css`
        > button {
          border-radius: 100%;
          margin: 3px;
        }
      `}>
      {character().map((i) => (
        <Tooltip preview={<button onClick={i.action}>{i.icon}</button>}>
          {i.label}
        </Tooltip>
      ))}
      {acts.map((i) => i.render)}
    </div>
  );
};

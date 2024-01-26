import actions from "@actions";
import Context from "@ui/context";
import { css } from "@emotion/css";
import Tooltip from "@ui/tooltip";

export default ({ children }) => {
  const acts = actions.character();
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
  const acts = actions.character();
  return (
    <div
      className={"actions "+css`
        > button {
          border-radius: 100%;
          margin: 3px;
        }
      `}>
      {acts.map((i) => (
        <Tooltip preview={<button onClick={i.action}>{i.icon}</button>}>
          {i.label}
        </Tooltip>
      ))}
      {acts.map((i) => i.render)}
    </div>
  );
};

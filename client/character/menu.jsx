import character from "@actions/character";
import Context from "@ui/context";
import { css } from "@emotion/react";
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

export const Buttons = () => {
  const acts = character();
  return (
    <div
      css={css`
        display: flex;
        gap: 5px;
        > span {
          display: none;
        }
      `}>
      {acts.map((i) => (
        <Tooltip preview={<button onClick={i.action}>{i.icon}</button>}>
          {i.label}
        </Tooltip>
      ))}
      <span>{acts.map((i) => i.render)}</span>
    </div>
  );
};

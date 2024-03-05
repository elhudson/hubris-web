import { Context, Tooltip } from "@interface/ui";

import { Actions } from "@client/character";
import { css } from "@emotion/react";

export default ({ children }) => {
  const acts = Actions();
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
  const acts = Actions()
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

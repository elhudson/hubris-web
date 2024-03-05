import { Rule } from "@interface/components";
import { css } from "@emotion/react";

export default ({ items, render = null }) => {
  return (
    <div
      css={css`
        margin: auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        grid-gap: 10px;
      `}>
      {items.map((i) => (
        <>
          {render ? render(i) : <Rule data={i} />}
        </>
      ))}
    </div>
  );
};

import Option from "@components/options/option";
import { css } from "@emotion/css";

export default ({ items, render = null }) => {
  return (
    <div className={css`
      display:grid;
      grid-template-columns:repeat(4,25%);
      grid-gap:10px;
    `}>
      {items.map((i) => (
        <>{render ? render(i) : <Option data={i} />}</>
      ))}
    </div>
  );
};

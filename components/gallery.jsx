import Option from "@components/options/option";
import { css, useTheme } from "@emotion/react";

export default ({ items, render = null }) => {
  const { colors } = useTheme();
  return (
    <div
      css={css`
        margin: auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        grid-gap: 10px;
      `}>
      {items.map((i) => (
        <>{render ? render(i) : <Option data={i} />}</>
      ))}
    </div>
  );
};

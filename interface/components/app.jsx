import { Menu } from "@interface/components";
import { Scrollable } from "@interface/ui";
import { css } from "@emotion/react";
export default ({ children }) => {
  return (
    <>
      <Menu />
      <main
        css={css`
          height: 95vh;
          width: 80%;
          margin: auto;
        `}
      >
        <Scrollable>{children}</Scrollable>
      </main>
    </>
  );
};

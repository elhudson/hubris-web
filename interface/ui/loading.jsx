import { useAsync } from "react-async-hook";
import { ScaleLoader } from "react-spinners";
import { css, useTheme } from "@emotion/react";

export default ({ getter, render }) => {
  const { colors } = useTheme();
  const data = useAsync(getter);
  return (
    <>
      {data.loading &&
        <ScaleLoader
          color={colors.accent}
          css={css`
            width: fit-content;
            display: block;
            margin: 50px auto;
          `}
        />
      }
      {data.result && render(data.result)}
    </>
  );
};

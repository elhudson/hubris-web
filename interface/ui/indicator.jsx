import { useTheme } from "@emotion/react";

export default ({ Component, sz = 16, style = null }) => {
  const { colors } = useTheme();
  const fallback = {
    height: sz,
    width: sz,
    padding: 2,
    color: colors.background
  };
  return <Component style={style ? style : fallback} />;
};

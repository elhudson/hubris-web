import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";
import SVG from "react-inlinesvg";

export default ({ id, sz, style=null }) => {
  const { colors } = useTheme();
  const icon = `/data/icons?id=${id}`
  return (
    <SVG
      src={icon}
      width={sz}
      style={style}
      className={css`
        padding-right: 10px;
        path {
          fill: ${colors.accent};
        }
      `}
    />
  );
};

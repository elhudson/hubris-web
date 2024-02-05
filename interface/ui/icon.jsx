import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";
import SVG from "react-inlinesvg";

export default ({ id, sz, style=null }) => {
  const { colors } = useTheme();
  const icon = `/icons/${id}.svg`
  return (
    <SVG
      src={icon}
      width={sz}
      height={sz}
      style={style}
      preProcessor={(code) => code.replace(/fill=".*?"/g, 'fill="currentColor"')}
      className={css`
        padding-right: 10px;
        path, g {
          fill: ${colors.accent};
          stroke: ${colors.accent};
        }
      `}
    />
  );
};

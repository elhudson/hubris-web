import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";
import { useParams } from "react-router-dom";

export default ({ type }) => {
  const { colors } = useTheme();
  const { id } = useParams();
  return (
    <div
      className={css`
        z-index: -2;
        position: absolute;
        top: 0;
        right: 0;
        img {
          object-fit: cover;
          opacity: 0.7;
          height: 100vh;
          width: 100vw;
        }
      `}>
      <img src={`/${type}/${id}.png`} />
    </div>
  );
};

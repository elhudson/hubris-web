import { css } from "@emotion/css";



export const Row = ({ children }) => {
  return <div
    className={css`
      display: flex;
      width: 100%;
      gap: 5px;
      > * {
        width: 100%;
      }
    `}>
    {children}
  </div>;
};

export default {
}
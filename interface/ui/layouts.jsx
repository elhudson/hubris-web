import { css } from "@emotion/css";



export const Row = ({ children }) => {
  return <div
    className={css`
      display: flex;
      width: 100%;
      > * {
        width: 100%;
        margin-right: 5px;
      }
    `}>
    {children}
  </div>;
};

export default {
}
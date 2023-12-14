import _ from "lodash";
import { css } from "@emotion/css";
export default ({ item, valuePath, labelPath, inc, dec, max = null }) => {
  return (
    <div
      className={css`
        display: flex;
        width: fit-content;
      `}>
      <label>{_.get(labelPath)}</label>
      <div>
        <div>
          {_.get(item, valuePath)} / {max}
        </div>
        <div>
          <button onClick={inc}>+</button>
          <button onClick={dec}>-</button>
        </div>
      </div>
    </div>
  );
};

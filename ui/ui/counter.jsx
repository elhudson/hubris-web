import _ from "lodash";
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";
import Toggles from "./toggles"

export default ({ item, valuePath, inc, dec, max = null, prefill = null }) => {
  const { colors } = useTheme();
  var contents = _.get(item, valuePath);
  if (_.isUndefined(contents)) {
    contents = prefill;
  }
  return (
    <div
      className={css`
        border: 1px solid ${colors.text};
        font-size: 20px;
        text-align: center;
      `}>
      <div>
      {contents}
      {max != null && <> / {max}</>}
      </div>
      <Toggles
        inc={inc}
        dec={dec}
      />
    </div>
  );
};

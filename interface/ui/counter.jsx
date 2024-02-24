import _ from "lodash";
import { useTheme, css } from "@emotion/react";
import Toggles from "./toggles";

export default ({ item, valuePath, inc, dec, max = null, prefill = null }) => {
  const { colors } = useTheme();
  var contents = _.get(item, valuePath);
  if (_.isUndefined(contents)) {
    contents = prefill;
  }
  return (
    <div
      css={css`
        display: flex;
        > div:first-child {
          width: 100%;
          margin-left: 30px;
        }
        border: 1px solid ${colors.accent};
        font-size: 20px;
        text-align: center;
        position: relative;
        height: 30px;
      `}>
      <div>
        {contents}
        {max != null && <> / {max}</>}
      </div>
      <div
        css={css`
          position: relative;
          border-left: 1px solid ${colors.accent};
          width: 30px;
          float:right;
          > div {
            bottom:0;
            height:unset;
            width:unset;
          }
          > * > button {
            display:block;
            border: unset !important;
            border-left: 1px solid ${colors.accent};
            &:first-child {
              border-bottom: 1px solid ${colors.accent} !important;
            }
            position: relative !important;
            height: 15px;
            width: 100% !important;
          }
        `}>
        <Toggles
          inc={inc}
          dec={dec}
        />
      </div>
    </div>
  );
};
